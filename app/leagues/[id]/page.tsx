import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ShareLeagueButtons from '@/components/ShareLeagueButtons'

export const dynamic = 'force-dynamic'

export default async function LeagueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: league } = await supabase.from('leagues').select('*').eq('id', id).single()
  if (!league) notFound()

  const { data: membership } = await supabase.from('league_members').select('*').eq('league_id', id).eq('user_id', user.id).single()
  if (!membership && !league.is_public) redirect('/leagues')

  const { data: members } = await supabase.from('league_members').select('*, profiles(*)').eq('league_id', id)
  const { data: predictions } = await supabase.from('predictions').select('*, matches(*)').in('user_id', members?.map(m => m.user_id) || [])

  const leaderboard = (members || []).map(member => {
    const userPredictions = predictions?.filter(p => p.user_id === member.user_id) || []
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

    return { ...member, points, exactHits, correctOutcomes }
  }).sort((a, b) => b.points - a.points || b.exactHits - a.exactHits || b.correctOutcomes - a.correctOutcomes)

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        <Link href="/leagues" className="text-sm text-gray-500 hover:text-gray-400 mb-8 inline-block">
          ← Volver a Mis Ligas
        </Link>

        <div className="border-2 border-purple-500/50 bg-purple-900/10 rounded-2xl p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">{league.name}</h1>
              <div className="flex items-center gap-3 text-sm">
                {league.is_public ? (
                  <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full">🌐 Pública</span>
                ) : (
                  <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full">🔒 Privada</span>
                )}
                <span className="text-gray-400">{members?.length || 0} miembros</span>
              </div>
            </div>
            {membership?.role === 'owner' && (
              <div className="bg-yellow-600/20 text-yellow-400 px-4 py-2 rounded-xl text-sm font-semibold">👑 Admin</div>
            )}
          </div>

          {!league.is_public && (
            <div className="pt-6 border-t border-purple-500/30 space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-2">Código de invitación:</div>
                <code className="bg-gray-900 text-purple-400 font-mono text-2xl px-6 py-4 rounded-xl block text-center">
                  {league.invite_code}
                </code>
              </div>
              
              <ShareLeagueButtons 
                leagueName={league.name}
                inviteCode={league.invite_code}
                leagueId={league.id}
              />
            </div>
          )}
        </div>

        <div className="border border-purple-500/30 rounded-2xl overflow-hidden">
          <div className="bg-purple-900/20 px-6 py-4 border-b border-purple-500/30">
            <h2 className="text-2xl font-bold">📊 Clasificación</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Pos</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Usuario</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Puntos</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Exactos</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Aciertos</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((member, index) => (
                  <tr key={member.user_id} className={`border-t border-purple-500/20 ${member.user_id === user.id ? 'bg-purple-900/20' : 'hover:bg-gray-900/30'}`}>
                    <td className="px-6 py-4">
                      <span className="text-xl font-bold">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && <span className="text-gray-500">{index + 1}</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{member.profiles?.display_name || member.profiles?.email?.split('@')[0] || 'Usuario'}</div>
                      {member.user_id === user.id && <div className="text-xs text-purple-400">Vos</div>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-2xl font-bold text-purple-400">{member.points}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-green-400 font-semibold">{member.exactHits}</td>
                    <td className="px-6 py-4 text-center text-yellow-400 font-semibold">{member.correctOutcomes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
