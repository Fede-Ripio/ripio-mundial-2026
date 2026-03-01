import { createServerSupabaseClient } from '@/lib/supabase-server'
import MatchesList from '@/components/MatchesList'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MatchesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_number', { ascending: true })

  let predictions: any[] = []
  if (user) {
    const { data: userPredictions } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', user.id)
    predictions = userPredictions || []
  }

  const all = matches || []

  const nextMatch = all
    .filter(m => m.status !== 'finished' && m.kickoff_at)
    .sort((a, b) => new Date(a.kickoff_at).getTime() - new Date(b.kickoff_at).getTime())
    [0]

  const predictedIds = new Set(predictions.map(p => p.match_id))
  const pendingCount = all.filter(m => {
    const closed = m.kickoff_at && new Date(m.kickoff_at) < new Date()
    return !closed && m.status !== 'finished' && !predictedIds.has(m.id)
  }).length

  return (
    <div className="min-h-screen bg-black text-white py-6 sm:py-10">
      <div className="px-4 sm:px-6 max-w-2xl mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Ripio Mundial 2026</p>
        <div className="flex items-end justify-between gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold shrink-0">Pronósticos</h1>
          {!user && (
            <Link href="/registro" className="text-purple-400 hover:text-purple-300 font-semibold text-sm mb-1 text-right leading-tight">
              Registrate<br className="sm:hidden" /> para jugar →
            </Link>
          )}
        </div>
        {user ? (
          <p className="text-gray-400 mt-2">
            {predictions.length} pronósticos realizados · {pendingCount} por completar
          </p>
        ) : (
          <p className="text-gray-400 mt-2">
            Mundial 2026 · {all.length} partidos
          </p>
        )}
      </div>

      {all.length === 0 ? (
        <div className="px-4 sm:px-6 border border-purple-500/30 rounded-xl p-8 sm:p-12 text-center">
          <p className="text-gray-400 text-lg sm:text-xl">
            ⚠️ No hay partidos cargados
          </p>
        </div>
      ) : (
        <MatchesList
          matches={all}
          predictions={predictions}
          isLoggedIn={!!user}
          nextMatch={nextMatch}
        />
      )}
    </div>
  )
}
