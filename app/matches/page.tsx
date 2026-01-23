import { createServerSupabaseClient } from '@/lib/supabase-server'
import MatchCard from '@/components/MatchCard'
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
  const now = new Date()
  const upcoming = all.filter(m => m.kickoff_at && new Date(m.kickoff_at) > now && m.status === 'scheduled')
  const groupMatches = all.filter(m => m.stage === 'group')

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Partidos del Mundial 2026
          </h1>
          {!user ? (
            <div className="border border-purple-500/30 rounded-2xl p-6 mt-6 bg-purple-950/10">
              <p className="text-gray-300">
                <Link href="/register" className="text-purple-400 font-semibold hover:text-purple-300 underline">
                  Registrate gratis
                </Link>
                {' '}para hacer tus pronósticos y competir por los premios
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-lg">
              {user.email} • <span className="text-purple-400 font-semibold">{predictions.length}/{all.length}</span> pronósticos
            </p>
          )}
        </div>

        {all.length === 0 ? (
          <div className="border border-purple-500/30 rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-xl mb-4">⚠️ No hay partidos cargados</p>
            <p className="text-gray-500">Los partidos se cargarán próximamente</p>
          </div>
        ) : (
          <div className="space-y-12">

            {upcoming.length > 0 && (
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-400">
                  ⏰ Próximos Partidos
                </h2>
                <div className="space-y-4">
                  {upcoming.slice(0, 5).map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      prediction={predictions.find(p => p.match_id === match.id)}
                      isLoggedIn={!!user}
                    />
                  ))}
                </div>
              </section>
            )}

            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(group => {
              const groupGames = groupMatches.filter(m => m.group_code === group)
              if (groupGames.length === 0) return null
              
              return (
                <section key={group}>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-300">
                    Grupo {group}
                  </h3>
                  <div className="space-y-4">
                    {groupGames.map(match => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        prediction={predictions.find(p => p.match_id === match.id)}
                        isLoggedIn={!!user}
                      />
                    ))}
                  </div>
                </section>
              )
            })}

          </div>
        )}
      </div>
    </div>
  )
}
