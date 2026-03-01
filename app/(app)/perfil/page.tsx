import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EditDisplayName from '@/components/EditDisplayName'
import AvatarUpload from '@/components/AvatarUpload'
import { GENERAL_LEAGUE_ID } from '@/lib/constants'
import type { LeaderboardRow } from '@/lib/scoring'

export const dynamic = 'force-dynamic'

export default async function MePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/ingresa')

  const [
    { data: profile },
    { data: leaderboard },
    { count: predictionsCount },
    { count: totalMatches },
    { count: finishedMatches },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.rpc('get_leaderboard', { p_league_id: GENERAL_LEAGUE_ID }),
    supabase.from('predictions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }).eq('status', 'finished'),
  ])

  const typedLeaderboard = ((leaderboard ?? []) as LeaderboardRow[])
  const myStats = typedLeaderboard.find(r => r.user_id === user.id)
  const points = myStats?.points ?? 0
  const exactHits = myStats?.exact_hits ?? 0
  const correctOutcomes = myStats?.correct_outcomes ?? 0

  const generalTotal = typedLeaderboard.length
  const idx = typedLeaderboard.findIndex(r => r.user_id === user.id)
  const generalPosition = idx !== -1 ? idx + 1 : null

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'Anónimo'

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Avatar + nombre */}
        <div className="flex flex-col items-center mb-10">
          <AvatarUpload
            userId={user.id}
            displayName={displayName}
            currentAvatarUrl={profile?.avatar_url ?? null}
          />
          <h1 className="text-3xl sm:text-4xl font-bold mt-4">{displayName}</h1>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="border border-purple-500/30 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-1">{points}</div>
            <div className="text-xs text-gray-400">Puntos</div>
            {finishedMatches ? <div className="text-xs text-gray-600 mt-0.5">de {finishedMatches} jugados</div> : null}
          </div>
          <div className="border border-purple-500/30 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold text-green-400 mb-1">{exactHits}</div>
            <div className="text-xs text-gray-400">Exactos</div>
            {finishedMatches ? <div className="text-xs text-gray-600 mt-0.5">de {finishedMatches} jugados</div> : null}
          </div>
          <div className="border border-purple-500/30 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-1">{correctOutcomes}</div>
            <div className="text-xs text-gray-400">Aciertos</div>
            {finishedMatches ? <div className="text-xs text-gray-600 mt-0.5">de {finishedMatches} jugados</div> : null}
          </div>
          <div className="border border-purple-500/30 rounded-2xl p-5 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-1">{predictionsCount ?? 0}</div>
            <div className="text-xs text-gray-400">Pronósticos</div>
            {totalMatches ? <div className="text-xs text-gray-600 mt-0.5">de {totalMatches} partidos</div> : null}
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

            <EditDisplayName currentName={displayName} />

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
            href="/pronosticos"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold px-6 py-4 rounded-xl transition-colors"
          >
            Ver mis pronósticos
          </Link>
          <Link
            href="/ranking"
            className="flex-1 border border-purple-500/50 hover:bg-purple-900/20 text-white text-center font-semibold px-6 py-4 rounded-xl transition-colors"
          >
            Ver clasificación
          </Link>
        </div>

      </div>
    </div>
  )
}
