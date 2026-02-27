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
    <div className="min-h-screen bg-black text-white py-4 sm:py-8 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6 max-w-xl mx-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Ripio Mundial 2026</p>
          <div className="flex items-end justify-between gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold">Partidos</h1>
            {!user && (
              <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold text-sm mb-1">
                Registrate para jugar →
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
