import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import LeaderboardTable from '@/components/LeaderboardTable'
import type { LeaderboardRow } from '@/lib/scoring'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Ripio Cup · Mundial 2026',
  robots: 'noindex, nofollow',
}

export default async function RipioCupPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Solo accesible para empleados @ripio.com
  if (!user || !user.email?.endsWith('@ripio.com')) {
    redirect('/')
  }

  const { data: rows } = await supabase.rpc('get_ripio_cup_leaderboard')

  const leaderboard = ((rows ?? []) as LeaderboardRow[]).map((row, index) => ({
    id: row.user_id,
    display_name: row.display_name,
    avatar_url: row.avatar_url,
    points: row.points,
    exactHits: row.exact_hits,
    correctOutcomes: row.correct_outcomes,
    position: index + 1,
  }))

  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12 px-4 sm:px-6">

      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Ripio Mundial 2026</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Ripio Cup 2026</h1>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Competencia interna
          </span>
          <span className="text-gray-500 text-sm">
            Equipo Ripio · {leaderboard.length} {leaderboard.length === 1 ? 'participante' : 'participantes'}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">

        {leaderboard.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-lg mb-2">Todavía no hay participantes</p>
            <p className="text-sm">Compartí este link con el equipo para que se registren con su mail @ripio.com</p>
          </div>
        ) : (
          <>
            <LeaderboardTable
              entries={leaderboard}
              currentUserId={user.id}
              totalCount={leaderboard.length}
            />

            {/* Info sistema de puntos */}
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

          </>
        )}

      </div>
    </div>
  )
}
