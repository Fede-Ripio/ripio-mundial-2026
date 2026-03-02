import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ShareLeagueCompact from '@/components/ShareLeagueCompact'
import LeaguePredictionsPanel from '@/components/LeaguePredictionsPanel'
import { calculatePredictionScore } from '@/lib/scoring'
import type { LeaderboardRow } from '@/lib/scoring'

export const dynamic = 'force-dynamic'

export default async function LeagueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/ingresa')

  const { data: league } = await supabase.from('leagues').select('*').eq('id', id).single()
  if (!league) notFound()

  const { data: membership } = await supabase.from('league_members').select('*').eq('league_id', id).eq('user_id', user.id).single()
  if (!membership && !league.is_public) redirect('/ligas')

  // RPC calcula el ranking directamente en la DB
  const { data: leaderboardRows } = await supabase.rpc('get_leaderboard', { p_league_id: id })
  const leaderboard = (leaderboardRows ?? []) as LeaderboardRow[]

  // Mapa de display names para el panel de pronósticos
  const displayNameMap = new Map(leaderboard.map(r => [r.user_id, r.display_name]))
  const memberIds = leaderboard.map(r => r.user_id)

  // Predicciones de todos los miembros para el panel por partido
  const { data: predictions } = memberIds.length > 0
    ? await supabase.from('predictions').select('*, matches(*)').in('user_id', memberIds)
    : { data: [] }

  // Agrupar pronósticos por partido finalizado para el panel de detalles
  const matchMap = new Map<string, { match: any; preds: any[] }>()
  for (const pred of (predictions || [])) {
    const match = pred.matches
    if (!match || match.status !== 'finished' || match.home_score === null) continue
    if (!matchMap.has(match.id)) matchMap.set(match.id, { match, preds: [] })
    matchMap.get(match.id)!.preds.push({
      user_id: pred.user_id,
      displayName: displayNameMap.get(pred.user_id) || 'Anónimo',
      home_goals: pred.home_goals,
      away_goals: pred.away_goals,
      score: calculatePredictionScore({
        home_goals: pred.home_goals,
        away_goals: pred.away_goals,
        home_score: match.home_score,
        away_score: match.away_score,
      }),
    })
  }
  const finishedMatchEntries = Array.from(matchMap.values())
    .sort((a, b) => a.match.match_number - b.match.match_number)

  return (
    <div className="min-h-screen bg-black text-white py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        <Link href="/ligas" className="text-sm text-gray-400 hover:text-gray-300 mb-6 inline-block">
          ← Volver a Mis Ligas
        </Link>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">{league.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            {league.is_public ? (
              <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-1">
                🌐 Pública
              </span>
            ) : (
              <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full flex items-center gap-1">
                🔒 Privada
              </span>
            )}
            <span className="text-gray-400">{leaderboard.length} miembros</span>
            {membership?.role === 'owner' && (
              <span className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full">
                👑 Admin
              </span>
            )}
          </div>
        </div>

        {/* CLASIFICACIÓN - PROTAGONISTA */}
        <div className="mb-8">
          <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl overflow-hidden">
            <div className="bg-purple-900/20 px-6 py-4 border-b border-purple-500/30">
              <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <span>📊</span>
                <span>Clasificación</span>
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-400">Pos</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-400">Usuario</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold text-gray-400">Puntos</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold text-gray-400 hidden sm:table-cell">Exactos</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold text-gray-400 hidden sm:table-cell">Aciertos</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((row, index) => (
                    <tr
                      key={row.user_id}
                      className={`border-t border-purple-500/20 ${
                        row.user_id === user.id ? 'bg-purple-900/20' : 'hover:bg-gray-900/30'
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-lg sm:text-xl font-bold">
                          {index === 0 && <span className="text-yellow-400">1</span>}
                          {index === 1 && <span className="text-gray-300">2</span>}
                          {index === 2 && <span className="text-amber-600">3</span>}
                          {index > 2 && <span className="text-gray-500">{index + 1}</span>}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* Avatar circular con fallback de iniciales */}
                          {row.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={row.avatar_url}
                              alt={row.display_name ?? 'avatar'}
                              className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-purple-500/30"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-purple-300 select-none leading-none">
                                {(row.display_name || '?').trim().split(/\s+/).map((w: string) => w[0]?.toUpperCase() ?? '').filter(Boolean).slice(0, 2).join('')}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-sm sm:text-base">
                              {row.display_name || 'Anónimo'}
                            </div>
                            {row.user_id === user.id && (
                              <div className="text-xs text-purple-400">Vos</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <span className="text-xl sm:text-2xl font-bold text-purple-400">{row.points}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center text-green-400 font-semibold hidden sm:table-cell">
                        {row.exact_hits}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center text-yellow-400 font-semibold hidden sm:table-cell">
                        {row.correct_outcomes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PRONÓSTICOS POR PARTIDO */}
        <LeaguePredictionsPanel
          matchEntries={finishedMatchEntries}
          currentUserId={user.id}
        />

        {/* INVITAR AMIGOS - COMPACTO */}
        {!league.is_public && (
          <ShareLeagueCompact
            leagueName={league.name}
            inviteCode={league.invite_code}
            leagueId={league.id}
          />
        )}

      </div>
    </div>
  )
}
