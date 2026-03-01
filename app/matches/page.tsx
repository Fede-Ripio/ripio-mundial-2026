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
    <div className="min-h-screen bg-black text-white py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 sm:mb-12">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Ripio Mundial 2026</p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">Partidos</h1>
              {user ? (
                <p className="text-gray-400">
                  {predictions.length} pronósticos realizados · {pendingCount} por completar
                </p>
              ) : (
                <p className="text-gray-400">
                  Mundial 2026 · {all.length} partidos
                </p>
              )}
            </div>
            {!user && (
              <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold text-sm mt-1 text-right leading-tight flex-shrink-0">
                Registrate<br className="sm:hidden" /> para jugar →
              </Link>
            )}
          </div>
        </div>

        {all.length === 0 ? (
          <div className="border border-purple-500/30 rounded-xl p-8 sm:p-12 text-center">
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
    </div>
  )
}
