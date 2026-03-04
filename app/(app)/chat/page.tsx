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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto">

        <div className="sticky top-0 md:static z-10 bg-black/95 backdrop-blur-sm border-b border-gray-800 px-4 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
            Ripio Mundial 2026
          </p>
          <h1 className="text-2xl font-bold">Chat</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Mensajes de todos los participantes · en tiempo real
          </p>
        </div>

        <ChatClient
          initialMessages={(messages ?? []) as ChatMessage[]}
          currentUserId={user?.id ?? null}
          currentUserEmail={user?.email ?? null}
        />

      </div>
    </div>
  )
}
