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
    <div className="min-h-screen bg-black text-white py-8 sm:py-12 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            ⚽ Partidos del Mundial 2026
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-400">
            <span className="flex items-center gap-2">
              <span>📊</span>
              <span>{all.length} partidos</span>
            </span>
            {user && (
              <span className="flex items-center gap-2">
                <span>✅</span>
                <span>{predictions.length} pronósticos</span>
              </span>
            )}
          </div>
          {!user ? (
            <div className="border border-purple-500/30 rounded-xl p-4 sm:p-6 mt-4 sm:mt-6">
              <p className="text-sm sm:text-base text-gray-400">
                <Link href="/register" className="text-purple-400 font-semibold hover:text-purple-300 underline">
                  Registrate gratis
                </Link>
                {' '}para hacer tus pronósticos
              </p>
            </div>
          ) : null}
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
