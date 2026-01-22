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
  
  // Encontrar el próximo partido (no finalizado, más cercano a hoy)
  const now = new Date()
  const nextMatch = all
    .filter(m => m.status !== 'finished' && m.kickoff_at)
    .sort((a, b) => new Date(a.kickoff_at).getTime() - new Date(b.kickoff_at).getTime())
    [0]

  // Separar partidos por fase
  const groupMatches = all.filter(m => m.stage === 'group')
  const ro32Matches = all.filter(m => m.stage === 'ro32')
  const ro16Matches = all.filter(m => m.stage === 'ro16')
  const qfMatches = all.filter(m => m.stage === 'qf')
  const sfMatches = all.filter(m => m.stage === 'sf')
  const finalMatches = all.filter(m => m.stage === 'final' || m.stage === 'third_place')

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header compacto */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">⚽ Mundial 2026 - Fixture Completo</h1>
          {!user ? (
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3 text-sm">
              <Link href="/register" className="font-semibold text-blue-400 underline">
                Registrate gratis
              </Link>
              {' '}para hacer tus pronósticos y competir por 1.75M wARS en premios
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              👤 {user.email} • {predictions.length}/{all.length} pronósticos
            </p>
          )}
        </div>

        {all.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-lg">⚠️ No hay partidos cargados</p>
            <p className="text-gray-500 text-sm mt-2">Verificá la base de datos en Supabase</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Próximo Partido (destacado) */}
            {nextMatch && (
              <section className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 border-2 border-yellow-600/50 rounded-xl p-4">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  ⏰ Próximo Partido
                </h2>
                <MatchCard
                  match={nextMatch}
                  prediction={predictions.find(p => p.match_id === nextMatch.id)}
                  isLoggedIn={!!user}
                />
              </section>
            )}

            {/* Fase de Grupos por grupo */}
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(group => {
              const groupGames = groupMatches.filter(m => m.group_code === group)
              if (groupGames.length === 0) return null
              
              return (
                <section key={group} className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                  <h3 className="text-lg font-bold mb-3 text-blue-400">
                    Grupo {group}
                  </h3>
                  <div className="space-y-2">
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

            {/* Ronda de 32 */}
            {ro32Matches.length > 0 && (
              <section className="bg-purple-900/10 border border-purple-700/50 rounded-xl p-4">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  🔥 Ronda de 32
                </h2>
                <div className="space-y-2">
                  {ro32Matches.slice(0, 8).map(match => (
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

            {/* Octavos */}
            {ro16Matches.length > 0 && (
              <section className="bg-orange-900/10 border border-orange-700/50 rounded-xl p-4">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  ⚡ Octavos de Final
                </h2>
                <div className="space-y-2">
                  {ro16Matches.map(match => (
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

            {/* Cuartos */}
            {qfMatches.length > 0 && (
              <section className="bg-red-900/10 border border-red-700/50 rounded-xl p-4">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  💥 Cuartos de Final
                </h2>
                <div className="space-y-2">
                  {qfMatches.map(match => (
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

            {/* Semifinales */}
            {sfMatches.length > 0 && (
              <section className="bg-pink-900/10 border border-pink-700/50 rounded-xl p-4">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  🌟 Semifinales
                </h2>
                <div className="space-y-2">
                  {sfMatches.map(match => (
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

            {/* Final */}
            {finalMatches.length > 0 && (
              <section className="bg-gradient-to-r from-yellow-900/30 to-yellow-700/20 border-2 border-yellow-500/70 rounded-xl p-4">
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  👑 FINAL
                </h2>
                <div className="space-y-2">
                  {finalMatches
                    .sort((a, b) => b.match_number - a.match_number)
                    .map(match => (
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

          </div>
        )}
      </div>
    </div>
  )
}
