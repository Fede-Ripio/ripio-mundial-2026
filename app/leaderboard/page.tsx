import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const supabase = await createServerSupabaseClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, display_name, created_at')

  const { data: predictions } = await supabase
    .from('predictions')
    .select('*, matches(*)')

  const { data: leagueMembers } = await supabase
    .from('league_members')
    .select('user_id, league_id')
    .eq('league_id', '00000000-0000-0000-0000-000000000001')

  const leaderboard = (profiles || []).map(profile => {
    const userPredictions = predictions?.filter(p => p.user_id === profile.id) || []
    
    let points = 0
    let exactHits = 0
    let correctOutcomes = 0

    userPredictions.forEach(pred => {
      const match = pred.matches
      if (match?.status === 'finished' && match.home_score !== null && match.away_score !== null) {
        if (pred.home_goals === match.home_score && pred.away_goals === match.away_score) {
          points += 3
          exactHits += 1
        } else {
          const predOutcome = pred.home_goals > pred.away_goals ? 'home' : pred.home_goals < pred.away_goals ? 'away' : 'draw'
          const matchOutcome = match.home_score > match.away_score ? 'home' : match.home_score < match.away_score ? 'away' : 'draw'
          
          if (predOutcome === matchOutcome) {
            points += 1
            correctOutcomes += 1
          }
        }
      }
    })

    return {
      ...profile,
      points,
      exactHits,
      correctOutcomes,
      totalPredictions: userPredictions.length,
      inGeneralLeague: leagueMembers?.some(m => m.user_id === profile.id) || false
    }
  })
  .filter(u => u.inGeneralLeague)
  .sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits
    if (b.correctOutcomes !== a.correctOutcomes) return b.correctOutcomes - a.correctOutcomes
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3, 100)

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🏆 Clasificación General</h1>
          <p className="text-gray-400">Liga: Ripio Mundial • {leaderboard.length} participantes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border-2 border-yellow-500/50 rounded-2xl p-6 text-center">
            <div className="text-5xl mb-2">🥇</div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">1MM wARS</div>
            <div className="text-sm text-gray-400">Primer Puesto</div>
            {top3[0] && (
              <div className="mt-3 pt-3 border-t border-yellow-500/30">
                <div className="font-semibold text-yellow-200">{top3[0].display_name || top3[0].email}</div>
                <div className="text-2xl font-bold text-yellow-400">{top3[0].points} pts</div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/5 border-2 border-gray-400/50 rounded-2xl p-6 text-center">
            <div className="text-5xl mb-2">🥈</div>
            <div className="text-3xl font-bold text-gray-300 mb-1">500K wARS</div>
            <div className="text-sm text-gray-400">Segundo Puesto</div>
            {top3[1] && (
              <div className="mt-3 pt-3 border-t border-gray-400/30">
                <div className="font-semibold text-gray-200">{top3[1].display_name || top3[1].email}</div>
                <div className="text-2xl font-bold text-gray-300">{top3[1].points} pts</div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-orange-700/5 border-2 border-orange-600/50 rounded-2xl p-6 text-center">
            <div className="text-5xl mb-2">🥉</div>
            <div className="text-3xl font-bold text-orange-400 mb-1">250K wARS</div>
            <div className="text-sm text-gray-400">Tercer Puesto</div>
            {top3[2] && (
              <div className="mt-3 pt-3 border-t border-orange-600/30">
                <div className="font-semibold text-orange-200">{top3[2].display_name || top3[2].email}</div>
                <div className="text-2xl font-bold text-orange-400">{top3[2].points} pts</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr className="text-left text-sm text-gray-400">
                  <th className="px-4 py-3 w-16">Pos</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3 text-center">Puntos</th>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">Exactos</th>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">Aciertos</th>
                  <th className="px-4 py-3 text-center hidden md:table-cell">Pronósticos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {rest.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-400">
                      {index + 4}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{user.display_name || user.email.split('@')[0]}</div>
                      <div className="text-xs text-gray-500 hidden sm:block">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-lg font-bold text-blue-400">{user.points}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell text-green-400">
                      {user.exactHits}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell text-yellow-400">
                      {user.correctOutcomes}
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell text-gray-400">
                      {user.totalPredictions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-lg">Todavía no hay participantes</p>
            <Link href="/register" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
              Sé el primero en registrarte
            </Link>
          </div>
        )}

        <div className="mt-6 bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 text-sm text-gray-300">
          <strong className="text-blue-400">ℹ️ Cómo se calculan los puntos:</strong>
          <ul className="mt-2 space-y-1 ml-4 list-disc">
            <li>Resultado exacto: <strong className="text-green-400">+3 puntos</strong></li>
            <li>Acertar ganador o empate: <strong className="text-yellow-400">+1 punto</strong></li>
            <li>Desempate: más exactos → más aciertos → primero en registrarse</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
