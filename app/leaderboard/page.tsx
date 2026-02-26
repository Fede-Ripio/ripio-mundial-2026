import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { calculateUserScore, compareLeaderboard } from '@/lib/scoring'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const supabase = await createServerSupabaseClient()
  
  // Obtener usuario actual
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, created_at')

  const { data: predictions } = await supabase
    .from('predictions')
    .select('*, matches(*)')

  const { data: leagueMembers } = await supabase
    .from('league_members')
    .select('user_id, league_id')
    .eq('league_id', '00000000-0000-0000-0000-000000000001')

  const leaderboard = (profiles || []).map(profile => {
    const userPredictions = predictions?.filter(p => p.user_id === profile.id) || []
    const score = calculateUserScore(userPredictions)

    return {
      ...profile,
      ...score,
      totalPredictions: userPredictions.length,
      inGeneralLeague: leagueMembers?.some(m => m.user_id === profile.id) || false
    }
  })
  .filter(u => u.inGeneralLeague)
  .sort(compareLeaderboard)

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            🏆 Clasificación General
          </h1>
          <p className="text-gray-400 text-lg">
            Liga: Ripio Mundial • {leaderboard.length} participantes
          </p>
        </div>

        {/* Premios Podio */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          
          {/* 🥇 PRIMER PUESTO */}
          <div className={`rounded-2xl p-8 text-center transition-all ${
            user && top3[0]?.id === user.id
              ? 'border-4 border-purple-500 bg-gradient-to-br from-purple-600/30 to-purple-500/20 shadow-xl shadow-purple-500/20'
              : 'border border-purple-500/40 bg-purple-900/10'
          }`}>
            <div className="text-6xl mb-4">🥇</div>
            <div className="text-3xl font-bold text-purple-400 mb-2">1MM wARS</div>
            <div className="text-sm text-gray-500 mb-4">Primer Puesto</div>
            {top3[0] && (
              <div className="pt-4 border-t border-purple-500/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="font-semibold text-lg">{top3[0].display_name || 'Anónimo'}</div>
                  {user && top3[0].id === user.id && (
                    <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                      VOS
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold text-purple-400 mt-2">{top3[0].points} pts</div>
                {user && top3[0].id === user.id && (
                  <div className="mt-3 text-xs text-purple-300 font-semibold">
                    🎉 ¡Estás primero!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 🥈 SEGUNDO PUESTO */}
          <div className={`rounded-2xl p-8 text-center transition-all ${
            user && top3[1]?.id === user.id
              ? 'border-4 border-purple-500 bg-gradient-to-br from-purple-600/30 to-purple-500/20 shadow-xl shadow-purple-500/20'
              : 'border border-purple-500/30'
          }`}>
            <div className="text-6xl mb-4">🥈</div>
            <div className="text-3xl font-bold text-gray-400 mb-2">500K wARS</div>
            <div className="text-sm text-gray-500 mb-4">Segundo Puesto</div>
            {top3[1] && (
              <div className="pt-4 border-t border-purple-500/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="font-semibold text-lg">{top3[1].display_name || 'Anónimo'}</div>
                  {user && top3[1].id === user.id && (
                    <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                      VOS
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold mt-2">{top3[1].points} pts</div>
                {user && top3[1].id === user.id && (
                  <div className="mt-3 text-xs text-purple-300 font-semibold">
                    🥈 ¡Muy cerca del primero!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 🥉 TERCER PUESTO */}
          <div className={`rounded-2xl p-8 text-center sm:col-span-2 md:col-span-1 transition-all ${
            user && top3[2]?.id === user.id
              ? 'border-4 border-purple-500 bg-gradient-to-br from-purple-600/30 to-purple-500/20 shadow-xl shadow-purple-500/20'
              : 'border border-purple-500/30'
          }`}>
            <div className="text-6xl mb-4">🥉</div>
            <div className="text-3xl font-bold text-orange-400 mb-2">250K wARS</div>
            <div className="text-sm text-gray-500 mb-4">Tercer Puesto</div>
            {top3[2] && (
              <div className="pt-4 border-t border-purple-500/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="font-semibold text-lg">{top3[2].display_name || 'Anónimo'}</div>
                  {user && top3[2].id === user.id && (
                    <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                      VOS
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold mt-2">{top3[2].points} pts</div>
                {user && top3[2].id === user.id && (
                  <div className="mt-3 text-xs text-purple-300 font-semibold">
                    🥉 ¡En el podio!
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Tabla */}
        <div className="border border-purple-500/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-900/20">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-400">Pos</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-400">Usuario</th>
                  <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-gray-400">Puntos</th>
                  <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-gray-400 hidden sm:table-cell">Exactos</th>
                  <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-gray-400 hidden sm:table-cell">Aciertos</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((userEntry, index) => {
                  const isCurrentUser = user && userEntry.id === user.id
                  
                  return (
                    <tr 
                      key={userEntry.id} 
                      className={`border-t border-purple-500/20 transition-colors ${
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-purple-600/30 to-purple-500/20 border-l-4 border-l-purple-500' 
                          : 'hover:bg-gray-900/30'
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-4 font-semibold text-gray-400">
                        {index + 4}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">{userEntry.display_name || 'Anónimo'}</div>
                          {isCurrentUser && (
                            <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                              VOS
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <span className="text-xl font-bold text-purple-400">{userEntry.points}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center text-green-400 font-semibold hidden sm:table-cell">
                        {userEntry.exactHits}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center text-yellow-400 font-semibold hidden sm:table-cell">
                        {userEntry.correctOutcomes}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info */}
        <div className="border border-purple-500/30 rounded-xl p-6 mt-8">
          <strong className="text-purple-400">ℹ️ Cómo se calculan los puntos:</strong>
          <ul className="mt-4 space-y-2 text-gray-400 ml-6 list-disc">
            <li>Resultado exacto: <strong className="text-green-400">+3 puntos</strong></li>
            <li>Acertar ganador o empate: <strong className="text-yellow-400">+1 punto</strong></li>
            <li>Desempate: más exactos → más aciertos → primero en registrarse</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
