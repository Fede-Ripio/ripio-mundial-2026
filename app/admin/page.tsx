import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminMatchForm from '@/components/AdminMatchForm'
import SyncButton from '@/components/SyncButton'
import GroupStandingsTable from '@/components/GroupStandingsTable'
import RecalculateButton from '@/components/RecalculateButton'

export const dynamic = 'force-dynamic'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/')
  }

  const { data: matches } = await supabase.from('matches').select('*').order('match_number', { ascending: true })
  
  const { count: statsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: predCount } = await supabase.from('predictions').select('*', { count: 'exact', head: true })

  // Obtener tabla de posiciones
  const { data: standings } = await supabase.from('group_standings').select('*').order('group_code, position')

  // Contar matches resueltos
  const resolvedCount = matches?.filter(m => m.is_resolved).length || 0

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
            <div className="text-4xl font-bold text-blue-400 mb-2">{statsCount || 0}</div>
            <div className="text-sm text-gray-400">Usuarios</div>
          </div>
          <div className="border border-green-500/30 bg-green-900/10 rounded-2xl p-6">
            <div className="text-4xl font-bold text-green-400 mb-2">{matches?.length || 0}</div>
            <div className="text-sm text-gray-400">Partidos</div>
          </div>
          <div className="border border-yellow-500/30 bg-yellow-900/10 rounded-2xl p-6">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{predCount || 0}</div>
            <div className="text-sm text-gray-400">Pronósticos</div>
          </div>
          <div className="border border-purple-500/30 bg-purple-900/10 rounded-2xl p-6">
            <div className="text-4xl font-bold text-purple-400 mb-2">{resolvedCount}</div>
            <div className="text-sm text-gray-400">Clasificados resueltos</div>
          </div>
        </div>

        {/* Clasificación Automática */}
        <div className="border-2 border-purple-500/50 bg-purple-900/10 rounded-2xl p-6 sm:p-8 mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-purple-400 flex items-center gap-2">
                🏆 Clasificación Automática
              </h2>
              <p className="text-sm text-gray-400 mb-2">
                Sistema automático que resuelve clasificados cuando terminan partidos de grupo.
              </p>
              <p className="text-xs text-gray-500">
                ⚡ Trigger activo: al marcar un partido de grupo como "finished", se recalcula automáticamente.
              </p>
            </div>
            <RecalculateButton />
          </div>

          {standings && standings.length > 0 ? (
            <>
              <div className="mb-4 flex items-center gap-3 text-sm">
                <span className="flex items-center gap-2 text-green-400">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  Clasificados (1º y 2º)
                </span>
                <span className="text-gray-500">
                  {standings.filter(s => s.position <= 2).length} equipos clasificados
                </span>
              </div>
              <GroupStandingsTable standings={standings} />
            </>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-400">No hay datos de tabla de posiciones aún.</p>
              <p className="text-sm text-gray-500 mt-2">Cargá resultados de partidos de grupo para que se generen automáticamente.</p>
            </div>
          )}
        </div>

        {/* Sync API */}
        <div className="border-2 border-blue-500/50 bg-blue-900/10 rounded-2xl p-6 sm:p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-blue-400">
                🔄 Sincronización con API-Football
              </h2>
              <p className="text-sm text-gray-400">
                Actualiza automáticamente los resultados desde la API oficial
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ⚠️ Mundial 2026 aún no tiene datos. Mostrando Mundial 2022 para testing.
              </p>
            </div>
            <SyncButton />
          </div>
        </div>

        {/* Gestión manual */}
        <div className="border border-purple-500/30 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">📝 Gestión Manual de Partidos</h2>
          
          <div className="space-y-4">
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
