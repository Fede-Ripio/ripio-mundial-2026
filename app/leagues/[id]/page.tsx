import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function LeagueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Obtener liga
  const { data: league } = await supabase
    .from('leagues')
    .select('*')
    .eq('id', id)
    .single()

  if (!league) notFound()

  // Verificar que el usuario sea miembro
  const { data: membership } = await supabase
    .from('league_members')
    .select('*')
    .eq('league_id', id)
    .eq('user_id', user.id)
    .single()

  if (!membership && !league.is_public) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🔒 Liga Privada</h1>
          <p className="text-gray-400 mb-6">No tenés acceso a esta liga</p>
          <Link href="/leagues" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
            Volver a Mis Ligas
          </Link>
        </div>
      </div>
    )
  }

  // Obtener TODOS los miembros con sus profiles
  const { data: membersData } = await supabase
    .from('league_members')
    .select(`
      user_id,
      role,
      profiles!inner (
        id,
        email,
        display_name,
        created_at
      )
    `)
    .eq('league_id', id)

  // Obtener TODAS las predicciones de TODOS los usuarios de la liga
  const { data: allPredictions } = await supabase
    .from('predictions')
    .select('*, matches(*)')

  // Calcular puntos por cada miembro
  const leaderboard = (membersData || []).map(member => {
    const profile = member.profiles
    const userPredictions = allPredictions?.filter(p => p.user_id === profile.id) || []
    
    let points = 0
    let exactHits = 0
    let correctOutcomes = 0

    userPredictions.forEach(pred => {
      const match = pred.matches
      if (match?.status === 'finished' && match.home_score !== null && match.away_score !== null) {
        // Exacto: +3
        if (pred.home_goals === match.home_score && pred.away_goals === match.away_score) {
          points += 3
          exactHits += 1
        } else {
          // Acierto de ganador/empate: +1
          const predOutcome = pred.home_goals > pred.away_goals ? 'home' : 
                             pred.home_goals < pred.away_goals ? 'away' : 'draw'
          const matchOutcome = match.home_score > match.away_score ? 'home' : 
                              match.home_score < match.away_score ? 'away' : 'draw'
          
          if (predOutcome === matchOutcome) {
            points += 1
            correctOutcomes += 1
          }
        }
      }
    })

    return {
      id: profile.id,
      email: profile.email,
      display_name: profile.display_name,
      created_at: profile.created_at,
      points,
      exactHits,
      correctOutcomes,
      totalPredictions: userPredictions.length
    }
  }).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits
    if (b.correctOutcomes !== a.correctOutcomes) return b.correctOutcomes - a.correctOutcomes
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/leagues" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Volver a Mis Ligas
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{league.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{leaderboard.length} participantes</span>
            {!league.is_public && (
              <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded font-mono">
                Código: {league.invite_code}
              </span>
            )}
          </div>
        </div>

        {/* Podio */}
        {leaderboard.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {leaderboard.slice(0, 3).map((user, index) => (
              <div
                key={user.id}
                className={`rounded-xl p-6 text-center ${
                  index === 0 ? 'bg-yellow-600/20 border-2 border-yellow-500' :
                  index === 1 ? 'bg-gray-400/20 border-2 border-gray-400' :
                  'bg-orange-600/20 border-2 border-orange-600'
                }`}
              >
                <div className="text-4xl mb-2">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
                <div className="font-semibold">{user.display_name || user.email.split('@')[0]}</div>
                <div className="text-2xl font-bold mt-2">{user.points} pts</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr className="text-left text-sm text-gray-400">
                <th className="px-4 py-3">Pos</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3 text-center">Puntos</th>
                <th className="px-4 py-3 text-center hidden sm:table-cell">Exactos</th>
                <th className="px-4 py-3 text-center hidden sm:table-cell">Aciertos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {leaderboard.map((userItem, index) => (
                <tr
                  key={userItem.id}
                  className={`hover:bg-gray-700/30 ${userItem.id === user.id ? 'bg-blue-900/20' : ''}`}
                >
                  <td className="px-4 py-3 font-semibold">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">
                      {userItem.display_name || userItem.email.split('@')[0]}
                      {userItem.id === user.id && <span className="text-blue-400 ml-2">(Tú)</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-lg font-bold text-blue-400">{userItem.points}</span>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell text-green-400">
                    {userItem.exactHits}
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell text-yellow-400">
                    {userItem.correctOutcomes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
            <p className="text-gray-400">Todavía no hay participantes en esta liga</p>
          </div>
        )}

      </div>
    </div>
  )
}
