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

  return (
    <div className="min-h-screen bg-black text-white py-4 sm:py-6 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Partidos</h1>

        {!user && (
          <div className="mb-4 flex items-center justify-between gap-3 text-sm">
            <span className="text-gray-500">Mundial 2026 · Pronósticos</span>
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
              Registrate para jugar →
            </Link>
          </div>
        )}

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
