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
        }
        else {
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
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            🏆 Clasificación General
          </h1>
          <p className="text-gray-400 text-lg">
            Liga: <span className="text-purple-400 font-semibold">Ripio Mundial</span> • {leaderboard.length} participantes
          </p>
        </div>

        {/* PODIO */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <div className="border border-purple-500/50 rounded-2xl p-8 text-center bg-gradient-to-br from-purple-950/30 to-transparent">
            <div className="text-6xl mb-4">🥇</div>
            <div className="text-3xl font-bold text-purple-400 mb-2">1MM wARS</div>
            <div className="text-sm text-gray-500 mb-4">Primer Puesto</div>
            {top3[0] && (
              <div className="pt-4 border-t border-purple-500/30">
                <div className="font-bold text-lg">{top3[0].display_name || top3[0].email.split('@')[0]}</div>
                <div className="text-3xl font-bold text-purple-400 mt-2">{top3[0].points} pts</div>
              </div>
            )}
          </div>

          <div className="border border-gray-600 rounded-2xl p-8 text-center bg-gradient-to-br from-gray-800/30 to-transparent sm:col-span-2 md:col-span-1">
            <div className="text-6xl mb-4">🥈</div>
            <div className="text-3xl font-bold text-gray-300 mb-2">500K wARS</div>
            <div className="text-sm text-gray-500 mb-4">Segundo Puesto</div>
            {top3[1] && (
              <div className="pt-4 border-t border-gray-700">
                <div className="font-bold text-lg">{top3[1].display_name || top3[1].email.split('@')[0]}</div>
                <div className="text-3xl font-bold text-gray-300 mt-2">{top3[1].points} pts</div>
              </div>
            )}
          </div>

          <div className="border border-orange-600/50 rounded-2xl p-8 text-center bg-gradient-to-br from-orange-950/20 to-transparent sm:col-span-2 md:col-span-1">
            <div className="text-6xl mb-4">🥉</div>
            <div className="text-3xl font-bold text-orange-400 mb-2">250K wARS</div>
            <div className="text-sm text-gray-500 mb-4">Tercer Puesto</div>
            {top3[2] && (
              <div className="pt-4 border-t border-orange-600/30">
                <div className="font-bold text-lg">{top3[2].display_name || top3[2].email.split('@')[0]}</div>
                <div className="text-3xl font-bold text-orange-400 mt-2">{top3[2].points} pts</div>
              </div>
            )}
          </div>
        </div>

        {/* TABLA */}
        <div className="border border-purple-500/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-950/30">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-400">Pos</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-400">Usuario</th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-gray-400">Puntos</th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-gray-400">Exactos</th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-gray-400">Aciertos</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((user, index) => (
                  <tr key={user.id} className="border-t border-purple-500/20 hover:bg-purple-950/20 transition-colors">
                    <td className="px-4 py-4 font-bold text-gray-400">
                      {index + 4}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold">{user.display_name || user.email.split('@')[0]}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-xl font-bold text-purple-400">{user.points}</span>
                    </td>
                    <td className="px-4 py-4 text-center text-green-400 font-semibold">
                      {user.exactHits}
                    </td>
                    <td className="px-4 py-4 text-center text-yellow-400 font-semibold">
                      {user.correctOutcomes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {leaderboard.length === 0 && (
          <div className="border border-purple-500/30 rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-xl mb-6">Todavía no hay participantes</p>
            <Link href="/register" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full transition-colors">
              Sé el primero en registrarte
            </Link>
          </div>
        )}

        {/* INFO */}
        <div className="border border-purple-500/30 rounded-2xl p-6 mt-8">
          <p className="text-sm text-gray-400 mb-3">
            <strong className="text-purple-400">ℹ️ Cómo se calculan los puntos:</strong>
          </p>
          <ul className="text-sm text-gray-400 space-y-2 ml-6">
            <li>• Resultado exacto: <strong className="text-green-400">+3 puntos</strong></li>
            <li>• Acertar ganador o empate: <strong className="text-yellow-400">+1 punto</strong></li>
            <li>• Desempate: más exactos → más aciertos → primero en registrarse</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
