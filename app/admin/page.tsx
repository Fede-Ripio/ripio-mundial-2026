import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminMatchForm from '@/components/AdminMatchForm'
import SyncButton from '@/components/SyncButton'
import RecalculateButton from '@/components/RecalculateButton'

export const dynamic = 'force-dynamic'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/')
  }

  // TODOS los partidos sin limit
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_number', { ascending: true })

  const { data: stats } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })

  const { data: predStats } = await supabase
    .from('predictions')
    .select('id', { count: 'exact', head: true })

  const statsCount = stats?.length || 0
  const predCount = predStats?.length || 0

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">⚙️ Panel de Administración</h1>
          <p className="text-gray-400">Admin: {user.email}</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="border border-blue-500/30 bg-blue-900/10 rounded-2xl p-6">
            <div className="text-4xl font-bold text-blue-400 mb-2">{statsCount}</div>
            <div className="text-sm text-gray-400">Usuarios</div>
          </div>
          <div className="border border-green-500/30 bg-green-900/10 rounded-2xl p-6">
            <div className="text-4xl font-bold text-green-400 mb-2">{matches?.length || 0}</div>
            <div className="text-sm text-gray-400">Partidos</div>
          </div>
          <div className="border border-yellow-500/30 bg-yellow-900/10 rounded-2xl p-6">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{predCount}</div>
            <div className="text-sm text-gray-400">Pronósticos</div>
          </div>
          <div className="border border-purple-500/30 bg-purple-900/10 rounded-2xl p-6">
            <div className="text-4xl font-bold text-purple-400 mb-2">
              {matches?.filter(m => m.status === 'finished').length || 0}
            </div>
            <div className="text-sm text-gray-400">Finalizados</div>
          </div>
        </div>

        {/* Sync + Recalcular */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          
          {/* Sync API */}
          <div className="border-2 border-purple-500/50 bg-purple-900/10 rounded-2xl p-8">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-purple-400">
                  🔄 Sincronización API-Football
                </h2>
                <p className="text-sm text-gray-400">
                  Actualiza automáticamente los resultados desde la API oficial
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Sincroniza resultados desde TheSportsDB (Mundial 2026).
                </p>
              </div>
              <SyncButton />
            </div>
          </div>

          {/* Recalcular */}
          <div className="border-2 border-green-500/50 bg-green-900/10 rounded-2xl p-8">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-green-400">
                  ♻️ Recalcular Clasificación
                </h2>
                <p className="text-sm text-gray-400">
                  Resuelve clasificados desde tabla de posiciones
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Actualiza partidos de eliminación directa con equipos clasificados
                </p>
              </div>
              <RecalculateButton />
            </div>
          </div>

        </div>

        {/* Gestión manual - TODOS LOS PARTIDOS */}
        <div className="border border-purple-500/30 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-400">
              📝 Gestión Manual de Partidos
            </h2>
            <div className="text-sm text-gray-400">
              Mostrando <strong className="text-white">{matches?.length || 0}</strong> partidos
            </div>
          </div>
          
          <div className="space-y-4">
            {matches?.map(match => (
              <AdminMatchForm key={match.id} match={match} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
