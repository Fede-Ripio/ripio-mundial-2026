import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { calculateUserScore, compareLeaderboard } from '@/lib/scoring'

export const dynamic = 'force-dynamic'

const GENERAL_LEAGUE_ID = '00000000-0000-0000-0000-000000000001'

export default async function MePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: predictions } = await supabase
    .from('predictions')
    .select('*, matches(*)')
    .eq('user_id', user.id)

  const { count: totalMatches } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })

  // Scoring con lib centralizado
  const { points, exactHits, correctOutcomes } = calculateUserScore(predictions || [])
  const completionRate = totalMatches ? Math.round((predictions?.length || 0) / totalMatches * 100) : 0

  // Calcular posición en la liga general
  let generalPosition: number | null = null
  let generalTotal = 0

  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, created_at')

  const { data: allPredictions } = await supabase
    .from('predictions')
    .select('*, matches(*)')

  const { data: leagueMembers } = await supabase
    .from('league_members')
    .select('user_id')
    .eq('league_id', GENERAL_LEAGUE_ID)

  const memberIds = new Set(leagueMembers?.map(m => m.user_id) || [])

  const leaderboard = (allProfiles || [])
    .filter(p => memberIds.has(p.id))
    .map(p => {
      const userPreds = allPredictions?.filter(pred => pred.user_id === p.id) || []
      return { id: p.id, created_at: p.created_at, ...calculateUserScore(userPreds) }
    })
    .sort(compareLeaderboard)

  generalTotal = leaderboard.length
  const idx = leaderboard.findIndex(p => p.id === user.id)
  if (idx !== -1) generalPosition = idx + 1

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'Anónimo'

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-12">👤 Mi Perfil</h1>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="border border-purple-500/30 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-1">{points}</div>
            <div className="text-xs text-gray-400">Puntos</div>
          </div>
          <div className="border border-purple-500/30 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold text-green-400 mb-1">{exactHits}</div>
            <div className="text-xs text-gray-400">Exactos</div>
          </div>
          <div className="border border-purple-500/30 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-1">{correctOutcomes}</div>
            <div className="text-xs text-gray-400">Aciertos</div>
          </div>
          <div className="border border-purple-500/30 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-1">{predictions?.length || 0}</div>
            <div className="text-xs text-gray-400">Pronósticos</div>
          </div>
          <div className="border border-purple-500/30 rounded-2xl p-5 text-center col-span-2 md:col-span-1">
            {generalPosition ? (
              <>
                <div className="text-4xl font-bold text-orange-400 mb-1">#{generalPosition}</div>
                <div className="text-xs text-gray-400">de {generalTotal}</div>
              </>
            ) : (
              <>
                <div className="text-4xl font-bold text-gray-600 mb-1">—</div>
                <div className="text-xs text-gray-400">Sin posición</div>
              </>
            )}
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div className="border border-purple-500/30 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Información</h2>
          <div className="space-y-1">

            <div className="flex justify-between py-3 border-b border-purple-500/20">
              <span className="text-gray-500">Nombre:</span>
              <span className="font-semibold">{displayName}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-purple-500/20">
              <span className="text-gray-500">Email:</span>
              <span className="font-semibold">{user.email}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-500">Miembro desde:</span>
              <span className="font-semibold">
                {new Date(profile?.created_at || '').toLocaleDateString('es-AR')}
              </span>
            </div>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/matches"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold px-6 py-4 rounded-xl transition-colors"
          >
            Ver mis pronósticos
          </Link>
          <Link
            href="/leaderboard"
            className="flex-1 border border-purple-500/50 hover:bg-purple-900/20 text-white text-center font-semibold px-6 py-4 rounded-xl transition-colors"
          >
            Ver clasificación
          </Link>
        </div>

      </div>
    </div>
  )
}
