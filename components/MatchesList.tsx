'use client'

import MatchCard from './MatchCard'

interface Match {
  id: string
  stage: string
  group_code?: string
  match_number: number
  home_team: string
  away_team: string
  home_team_code?: string
  away_team_code?: string
  kickoff_at?: string
  venue: string
  city: string
  status: string
  home_score?: number
  away_score?: number
  notes?: string
}

interface Prediction {
  match_id: string
  home_goals: number
  away_goals: number
}

interface MatchesListProps {
  matches: Match[]
  predictions: Prediction[]
  isLoggedIn: boolean
  nextMatch?: Match | null
}

export default function MatchesList({ matches, predictions, isLoggedIn, nextMatch }: MatchesListProps) {
  const predictionsMap = new Map(predictions.map(p => [p.match_id, p]))

  const groupMatches = matches.filter(m => m.stage === 'group')
  const ro32Matches = matches.filter(m => m.stage === 'ro32')
  const ro16Matches = matches.filter(m => m.stage === 'ro16')
  const quarterMatches = matches.filter(m => m.stage === 'quarterfinal')
  const semiMatches = matches.filter(m => m.stage === 'semifinal')
  const thirdPlaceMatch = matches.filter(m => m.stage === 'third_place')
  const finalMatch = matches.filter(m => m.stage === 'final')

  return (
    <div className="space-y-12">
      
      {/* PRÓXIMO PARTIDO COMO SECCIÓN */}
      {nextMatch && (
        <section>
          <h2 className="text-3xl font-bold text-purple-400 mb-6">⏰ Próximo Partido</h2>
          <div className="flex flex-col items-center">
            <MatchCard
              match={nextMatch}
              prediction={predictionsMap.get(nextMatch.id)}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </section>
      )}

      {/* FASE DE GRUPOS */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-purple-400">⚽ Fase de Grupos</h2>
        
        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(group => {
          const groupGames = groupMatches.filter(m => m.group_code === group)
          if (groupGames.length === 0) return null
          
          return (
            <section key={group}>
              <h3 className="text-xl font-bold mb-4 text-white">Grupo {group}</h3>
              <div className="flex flex-col items-center space-y-3">
                {groupGames.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    prediction={predictionsMap.get(match.id)}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {ro32Matches.length > 0 && (
        <section className="border-t-2 border-purple-500/30 pt-8">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">🔥 Ronda de 32</h2>
          <div className="flex flex-col items-center space-y-3">
            {ro32Matches.map(match => (
              <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}

      {ro16Matches.length > 0 && (
        <section className="border-t-2 border-orange-500/30 pt-8">
          <h2 className="text-3xl font-bold mb-6 text-orange-400">⚡ Octavos de Final</h2>
          <div className="flex flex-col items-center space-y-3">
            {ro16Matches.map(match => (
              <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}

      {quarterMatches.length > 0 && (
        <section className="border-t-2 border-red-500/30 pt-8">
          <h2 className="text-3xl font-bold mb-6 text-red-400">💥 Cuartos de Final</h2>
          <div className="flex flex-col items-center space-y-3">
            {quarterMatches.map(match => (
              <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}

      {semiMatches.length > 0 && (
        <section className="border-t-2 border-pink-500/30 pt-8">
          <h2 className="text-3xl font-bold mb-6 text-pink-400">🌟 Semifinales</h2>
          <div className="flex flex-col items-center space-y-3">
            {semiMatches.map(match => (
              <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}

      {thirdPlaceMatch.length > 0 && (
        <section className="border-t-2 border-yellow-500/30 pt-8">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">🥉 Tercer Puesto</h2>
          <div className="flex flex-col items-center space-y-3">
            {thirdPlaceMatch.map(match => (
              <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}

      {finalMatch.length > 0 && (
        <section className="border-t-4 border-yellow-500 bg-gradient-to-br from-yellow-900/20 to-yellow-700/10 rounded-2xl p-6 mt-8">
          <h2 className="text-4xl font-bold mb-6 text-yellow-400 flex items-center justify-center gap-3">
            <span>👑</span>
            <span>FINAL DEL MUNDIAL 2026</span>
          </h2>
          <div className="flex flex-col items-center space-y-3">
            {finalMatch.map(match => (
              <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
