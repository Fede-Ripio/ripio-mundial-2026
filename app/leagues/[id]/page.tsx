import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function LeagueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: league } = await supabase
    .from('leagues')
    .select('*')
    .eq('id', id)
    .single()

  if (!league) notFound()

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

  const { data: membersData } = await supabase
    .from('league_members')
    .select('user_id, role')
    .eq('league_id', id)

  const { data: allPredictions } = await supabase
    .from('predictions')
    .select('*, matches(*)')

  const userIds = membersData?.map(m => m.user_id) || []
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, display_name')
    .in('id', userIds)

  const leaderboard = (profiles || []).map(profile => {
    const userPredictions = allPredictions?.filter(p => p.user_id === profile.id) || []
    
    let points = 0
    let exactHits = 0
    let correctOutcomes = 0

    userPredictions.forEach(pred => {
      const match = pred.matches
      if (match?.status === 'finished' && match.home_score !== null) {
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
      id: profile.id,
      email: profile.email,
      display_name: profile.display_name,
      points,
      exactHits,
      correctOutcomes,
      totalPredictions: userPredictions.length
    }
  }).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits
    return b.correctOutcomes - a.correctOutcomes
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

        {leaderboard.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {leaderboard.slice(0, 3).map((playerUser, index) => (
              <div
                key={playerUser.id}
                className={`rounded-xl p-6 text-center ${
                  index === 0 ? 'bg-yellow-600/20 border-2 border-yellow-500' :
                  index === 1 ? 'bg-gray-400/20 border-2 border-gray-400' :
                  'bg-orange-600/20 border-2 border-orange-600'
                }`}
              >
                <div className="text-4xl mb-2">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
                <div className="font-semibold">{playerUser.display_name || playerUser.email.split('@')[0]}</div>
                <div className="text-2xl font-bold mt-2">{playerUser.points} pts</div>
              </div>
            ))}
          </div>
        )}

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
              {leaderboard.map((playerUser, index) => (
                <tr
                  key={playerUser.id}
                  className={`hover:bg-gray-700/30 ${playerUser.id === user?.id ? 'bg-blue-900/20' : ''}`}
                >
                  <td className="px-4 py-3 font-semibold">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{playerUser.display_name || playerUser.email.split('@')[0]}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-lg font-bold text-blue-400">{playerUser.points}</span>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell text-green-400">
                    {playerUser.exactHits}
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell text-yellow-400">
                    {playerUser.correctOutcomes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
