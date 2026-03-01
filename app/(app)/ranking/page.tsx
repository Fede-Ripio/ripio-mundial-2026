import { createServerSupabaseClient } from '@/lib/supabase-server'
import { GENERAL_LEAGUE_ID } from '@/lib/constants'
import LeaderboardTable from '@/components/LeaderboardTable'
import type { LeaderboardRow } from '@/lib/scoring'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { data: { user } },
    { data: rows },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc('get_leaderboard', { p_league_id: GENERAL_LEAGUE_ID }),
  ])

  const leaderboard = ((rows ?? []) as LeaderboardRow[]).map((row, index) => ({
    id: row.user_id,
    display_name: row.display_name,
    avatar_url: row.avatar_url,
    points: row.points,
    exactHits: row.exact_hits,
    correctOutcomes: row.correct_outcomes,
    position: index + 1,
  }))

  const top3 = leaderboard.slice(0, 3)
  const restWithPosition = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Ripio Mundial 2026</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Ranking General</h1>
          <p className="text-gray-400">
            Liga Ripio · {leaderboard.length} participantes
          </p>
          {!user && (
            <p className="text-sm text-purple-400 mt-2">
              ¿Todavía no jugás?{' '}
              <a href="/registro" className="font-semibold hover:text-purple-300 underline">
                Registrarse gratis →
              </a>
            </p>
          )}
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
        <LeaderboardTable
          entries={restWithPosition}
          currentUserId={user?.id ?? null}
          totalCount={leaderboard.length}
        />

        {/* Info */}
        <div className="border border-gray-800 rounded-xl p-6 mt-8 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Sistema de puntos</p>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-green-400 w-8 text-center flex-shrink-0">3</span>
            <span className="text-sm text-gray-300">Resultado exacto (marcador correcto)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-yellow-400 w-8 text-center flex-shrink-0">1</span>
            <span className="text-sm text-gray-300">Acertaste el ganador o el empate</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-gray-600 w-8 text-center flex-shrink-0">—</span>
            <span className="text-sm text-gray-500">Desempate: más exactos · más aciertos · registro más antiguo</span>
          </div>
        </div>

      </div>
    </div>
  )
}
