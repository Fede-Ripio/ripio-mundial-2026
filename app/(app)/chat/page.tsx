import { createServerSupabaseClient } from '@/lib/supabase-server'
import ChatClient from '@/components/ChatClient'

export const dynamic = 'force-dynamic'

export interface ChatMessage {
  id: string
  user_id: string
  content: string
  created_at: string
  display_name: string | null
  avatar_url: string | null
}

export default async function ChatPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { data: { user } },
    { data: messages },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('messages_with_profiles')
      .select('id, user_id, content, created_at, display_name, avatar_url')
      .order('created_at', { ascending: true })
      .limit(100),
  ])

  // Perfil del usuario actual (para mostrar en mensajes optimistas)
  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single()
    : { data: null }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header — mismo patrón que Ranking y Datos */}
      <div className="pt-10 sm:pt-12 pb-6 px-4 text-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Ripio Mundial 2026
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-1">Chat</h1>
        <p className="text-sm text-gray-500">
          Mensajes de todos los participantes · en tiempo real
        </p>
      </div>

      {/* Chat area */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-6">
        <ChatClient
          initialMessages={(messages ?? []) as ChatMessage[]}
          currentUserId={user?.id ?? null}
          currentUserEmail={user?.email ?? null}
          currentUserName={profile?.display_name ?? null}
          currentUserAvatar={profile?.avatar_url ?? null}
        />
      </div>

    </div>
  )
}
