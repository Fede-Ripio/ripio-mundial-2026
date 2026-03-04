'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Trash2, Send, Loader2 } from 'lucide-react'
import type { ChatMessage } from '@/app/(app)/chat/page'
import { containsBadWords } from '@/lib/bad-words'

const MAX_CHARS = 500
const ADMIN_EMAIL = 'federico.cortina@ripio.com'

// ─── helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() ?? '')
    .filter(Boolean)
    .slice(0, 2)
    .join('')
}

function Avatar({ url, name, size = 'sm' }: { url?: string | null; name: string | null; size?: 'sm' | 'md' }) {
  const sz = size === 'md' ? 'w-9 h-9 text-sm' : 'w-8 h-8 text-xs'
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name ?? 'avatar'}
        className={`${sz} rounded-full object-cover flex-shrink-0 border border-purple-500/30`}
      />
    )
  }
  return (
    <div className={`${sz} rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center flex-shrink-0`}>
      <span className="font-bold text-purple-300 leading-none select-none">{getInitials(name)}</span>
    </div>
  )
}

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
  return new Date(dateStr).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

// ─── component ────────────────────────────────────────────────────────────────

interface Props {
  initialMessages: ChatMessage[]
  currentUserId: string | null
  currentUserEmail: string | null
}

export default function ChatClient({ initialMessages, currentUserId, currentUserEmail }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isAdmin = currentUserEmail === ADMIN_EMAIL

  // ── Scroll al último mensaje ──────────────────────────────────────────────
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior })
  }, [])

  // Scroll instantáneo al cargar la página (solo si hay mensajes)
  useEffect(() => {
    if (initialMessages.length > 0) {
      scrollToBottom('instant')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll suave cuando llega un mensaje nuevo
  useEffect(() => {
    if (messages.length > initialMessages.length) {
      scrollToBottom('smooth')
    }
  }, [messages.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const raw = payload.new as { id: string; user_id: string; content: string; created_at: string }

          // Evitar duplicar mensajes propios (ya agregados optimistamente)
          setMessages(prev => {
            if (prev.some(m => m.id === raw.id)) return prev

            // Fetchear perfil del nuevo usuario para mostrar nombre/avatar
            supabase
              .from('messages_with_profiles')
              .select('id, user_id, content, created_at, display_name, avatar_url')
              .eq('id', raw.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setMessages(p => {
                    if (p.some(m => m.id === data.id)) return p
                    return [...p, data as ChatMessage]
                  })
                }
              })
            return prev
          })
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) => {
          const old = payload.old as { id: string }
          setMessages(prev => prev.filter(m => m.id !== old.id))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // ── Enviar mensaje ────────────────────────────────────────────────────────
  async function handleSend() {
    const content = input.trim()
    if (!content || sending) return
    if (!currentUserId) {
      setError('Necesitás iniciar sesión para enviar mensajes')
      return
    }

    // Validación client-side previa (feedback inmediato)
    if (containsBadWords(content)) {
      setError('Tu mensaje contiene palabras no permitidas.')
      return
    }

    setSending(true)
    setError(null)

    // Optimistic update
    const tempId = `temp-${Date.now()}`
    const optimistic: ChatMessage = {
      id: tempId,
      user_id: currentUserId,
      content,
      created_at: new Date().toISOString(),
      display_name: null, // se actualiza desde realtime
      avatar_url: null,
    }
    setMessages(prev => [...prev, optimistic])
    setInput('')
    setTimeout(() => scrollToBottom('smooth'), 50)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Revertir optimistic update
        setMessages(prev => prev.filter(m => m.id !== tempId))
        setError(data.error ?? 'Error al enviar el mensaje')
      }
      // Si ok: el mensaje real llega por realtime y reemplaza el optimista
      // Limpiamos el optimista luego de 3 segundos por si el realtime no llega
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== tempId))
      }, 3000)
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setSending(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Borrar mensaje (solo admin) ────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!isAdmin || deletingId) return
    setDeletingId(id)
    try {
      await fetch('/api/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } finally {
      setDeletingId(null)
    }
  }

  const charsLeft = MAX_CHARS - input.length
  const isOverLimit = charsLeft < 0

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] md:h-[calc(100vh-10rem)] rounded-2xl border border-purple-500/10">

      {/* ── Lista de mensajes ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-800/40 [&::-webkit-scrollbar-thumb]:rounded-full">

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="text-4xl mb-4">⚽</div>
            <p className="text-gray-500 text-sm">Aún no hay mensajes.</p>
            <p className="text-gray-600 text-xs mt-1">¡Sé el primero en escribir algo!</p>
          </div>
        )}

        {messages.map((msg) => {
          const isOwn = msg.user_id === currentUserId
          const isTemp = msg.id.startsWith('temp-')

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 group ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {!isOwn && (
                <div className="flex-shrink-0 mt-1">
                  <Avatar url={msg.avatar_url} name={msg.display_name} />
                </div>
              )}

              {/* Bubble */}
              <div className={`flex flex-col gap-1 max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
                {/* Nombre + tiempo */}
                {!isOwn && (
                  <span className="text-xs text-gray-500 px-1">
                    {msg.display_name ?? 'Anónimo'}
                  </span>
                )}

                <div className="relative">
                  {/* Botón borrar (solo admin, en hover) */}
                  {isAdmin && !isTemp && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={deletingId === msg.id}
                      className={`absolute -top-2 ${isOwn ? '-left-7' : '-right-7'} opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-gray-800 hover:bg-red-900/60 text-gray-500 hover:text-red-400`}
                      title="Borrar mensaje"
                    >
                      {deletingId === msg.id
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <Trash2 className="w-3 h-3" />
                      }
                    </button>
                  )}

                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                      isOwn
                        ? 'bg-purple-600 text-white rounded-tr-sm'
                        : 'bg-gray-800 text-gray-100 rounded-tl-sm'
                    } ${isTemp ? 'opacity-60' : ''}`}
                  >
                    {msg.content}
                  </div>
                </div>

                {/* Timestamp */}
                <span className="text-xs text-gray-600 px-1">
                  {isTemp ? 'Enviando…' : relativeTime(msg.created_at)}
                </span>
              </div>
            </div>
          )
        })}

        {/* Anchor para scroll automático */}
        <div ref={bottomRef} />
      </div>

      {/* ── Input área ─────────────────────────────────────────────────── */}
      <div className="border-t border-purple-500/10 px-4 py-3 bg-black/60 backdrop-blur-sm rounded-b-2xl">

        {/* Error */}
        {error && (
          <div className="mb-2 text-xs text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); setError(null) }}
              onKeyDown={handleKeyDown}
              placeholder={currentUserId ? 'Escribí tu mensaje… (Ctrl+Enter para enviar)' : 'Iniciá sesión para chatear'}
              disabled={!currentUserId || sending}
              rows={1}
              maxLength={MAX_CHARS + 20} // un poco más para mostrar el error de límite
              className="w-full bg-gray-900 border border-purple-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 resize-none disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            {/* Contador de caracteres */}
            {input.length > 400 && (
              <span className={`absolute bottom-2 right-3 text-xs ${isOverLimit ? 'text-red-400' : 'text-gray-500'}`}>
                {charsLeft}
              </span>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim() || !currentUserId || sending || isOverLimit}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-gray-800 disabled:text-gray-600 text-white transition-colors"
            title="Enviar (Ctrl+Enter)"
          >
            {sending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </button>
        </div>

        <p className="text-xs text-gray-700 mt-2 text-center">
          Sé respetuoso con todos los participantes
        </p>
      </div>

    </div>
  )
}
