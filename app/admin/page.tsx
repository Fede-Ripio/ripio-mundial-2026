import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminMatchForm from '@/components/AdminMatchForm'
import SyncButton from '@/components/SyncButton'

export const dynamic = 'force-dynamic'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/')
  }

  const { data: matches } = await supabase.from('matches').select('*').order('match_number', { ascending: true })
  const { data: stats } = await supabase.from('profiles').select('id', { count: 'exact', head: true })
  const { data: predStats } = await supabase.from('predictions').select('id', { count: 'exact', head: true })

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">⚙️ Panel de Administración</h1>
          <p className="text-gray-400">Admin: {user.email}</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="border border-blue-500/30 bg-blue-900/10 rounded-2xl p-6">
            <div className="text-4xl font-bold text-blue-400 mb-2">{stats?.count || 0}</div>
            <div className="text-sm text-gray-400">Usuarios</div>
          </div>
          <div className="border border-green-500/30 bg-green-900/10 rounded-2xl p-6">
            <div className="text-4xl font-bold text-green-400 mb-2">{matches?.length || 0}</div>
            <div className="text-sm text-gray-400">Partidos</div>
          </div>
          <div className="border border-yellow-500/30 bg-yellow-900/10 rounded-2xl p-6">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{predStats?.count || 0}</div>
            <div className="text-sm text-gray-400">Pronósticos</div>
          </div>
          <div className="border border-purple-500/30 bg-purple-900/10 rounded-2xl p-6">
            <div className="text-4xl font-bold text-purple-400 mb-2">{matches?.filter(m => m.status === 'finished').length || 0}</div>
            <div className="text-sm text-gray-400">Finalizados</div>
          </div>
        </div>

        <div className="border-2 border-purple-500/50 bg-purple-900/10 rounded-2xl p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-purple-400">🔄 Sincronización con API-Football</h2>
              <p className="text-sm text-gray-400">Actualiza automáticamente los resultados desde la API oficial</p>
            </div>
            <SyncButton />
          </div>
        </div>

        <div className="border border-purple-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">📝 Gestión Manual de Partidos</h2>
          <div className="space-y-4">
            {matches?.slice(0, 50).map(match => (
              <AdminMatchForm key={match.id} match={match} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
