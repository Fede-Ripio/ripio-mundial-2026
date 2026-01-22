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

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_number', { ascending: true })

  // Stats separados sin conflicto de tipos
  const profilesQuery = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })

  const predictionsQuery = await supabase
    .from('predictions')
    .select('id', { count: 'exact', head: true })

  const statsCount = profilesQuery.count || 0
  const predStatsCount = predictionsQuery.count || 0

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">⚙️ Panel de Administración</h1>
          <p className="text-gray-400">Admin: {user.email}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600/20 border border-blue-500 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400">{statsCount}</div>
            <div className="text-sm text-gray-400">Usuarios</div>
          </div>
          <div className="bg-green-600/20 border border-green-500 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">{matches?.length || 0}</div>
            <div className="text-sm text-gray-400">Partidos</div>
          </div>
          <div className="bg-yellow-600/20 border border-yellow-500 rounded-xl p-6">
            <div className="text-3xl font-bold text-yellow-400">{predStatsCount}</div>
            <div className="text-sm text-gray-400">Pronósticos</div>
          </div>
          <div className="bg-purple-600/20 border border-purple-500 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400">
              {matches?.filter(m => m.status === 'finished').length || 0}
            </div>
            <div className="text-sm text-gray-400">Finalizados</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/10 border-2 border-blue-600/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                🔄 Sincronización con API-Football
              </h2>
              <p className="text-sm text-gray-400">
                Actualiza automáticamente los resultados desde la API oficial
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ⚠️ Nota: Mundial 2026 aún no tiene datos. Mostrando Mundial 2022 para testing.
              </p>
            </div>
            <SyncButton />
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">📝 Gestión Manual de Partidos</h2>
          
          <div className="space-y-3">
            {matches?.slice(0, 50).map(match => (
              <AdminMatchForm key={match.id} match={match} />
            ))}
          </div>

          {matches && matches.length > 50 && (
            <p className="text-center text-gray-500 mt-6">
              Mostrando 50 de {matches.length} partidos
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
