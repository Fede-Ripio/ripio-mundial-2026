import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ShareLeagueCompact from '@/components/ShareLeagueCompact'
import { calculateUserScore, compareLeaderboard } from '@/lib/scoring'

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
    const score = calculateUserScore(userPredictions)
    return { ...member, ...score }
  }).sort(compareLeaderboard)

  return (
    <div className="min-h-screen bg-black text-white py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        <Link href="/leagues" className="text-sm text-gray-400 hover:text-gray-300 mb-6 inline-block">
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
            <span className="text-gray-400">{members?.length || 0} miembros</span>
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
                  {leaderboard.map((member, index) => (
                    <tr 
                      key={member.user_id} 
                      className={`border-t border-purple-500/20 ${
                        member.user_id === user.id ? 'bg-purple-900/20' : 'hover:bg-gray-900/30'
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-lg sm:text-xl font-bold">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && <span className="text-gray-500">{index + 1}</span>}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-semibold text-sm sm:text-base">
                          {member.profiles?.display_name || member.profiles?.email?.split('@')[0] || 'Usuario'}
                        </div>
                        {member.user_id === user.id && (
                          <div className="text-xs text-purple-400">Vos</div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <span className="text-xl sm:text-2xl font-bold text-purple-400">{member.points}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center text-green-400 font-semibold hidden sm:table-cell">
                        {member.exactHits}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center text-yellow-400 font-semibold hidden sm:table-cell">
                        {member.correctOutcomes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

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
