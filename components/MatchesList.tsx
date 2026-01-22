'use client'

import MatchCard from './MatchCard'
import { Match, Prediction } from '@/types/match'

export default function MatchesList({ 
  matches, 
  userPredictions,
  isLoggedIn 
}: { 
  matches: Match[]
  userPredictions: Prediction[]
  isLoggedIn: boolean 
}) {
  const predictionsMap = new Map(userPredictions.map(p => [p.match_id, p]))
  
  const groupMatches = matches.filter(m => m.stage === 'group')
  const ro32Matches = matches.filter(m => m.stage === 'ro32')
  const ro16Matches = matches.filter(m => m.stage === 'ro16')
  const qfMatches = matches.filter(m => m.stage === 'qf')
  const sfMatches = matches.filter(m => m.stage === 'sf')
  const finalMatches = matches.filter(m => m.stage === 'final' || m.stage === 'third_place')

  return (
    <div className="space-y-6">
      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(group => {
        const groupGames = groupMatches.filter(m => m.group_code === group)
        if (groupGames.length === 0) return null
        
        return (
          <section key={group} className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-bold mb-3 text-blue-400">Grupo {group}</h3>
            <div className="space-y-2">
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

      {ro32Matches.length > 0 && (
        <section className="bg-purple-900/10 border border-purple-700/50 rounded-xl p-4">
          <h2 className="text-xl font-bold mb-3">🔥 Ronda de 32</h2>
          <div className="space-y-2">
            {ro32Matches.slice(0, 8).map(match => (
              <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}

      {ro16Matches.length > 0 && (
        <section className="bg-orange-900/10 border border-orange-700/50 rounded-xl p-4">
          <h2 className="text-xl font-bold mb-3">⚡ Octavos de Final</h2>
          <div className="space-y-2">
            {ro16Matches.map(match => (
              <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}

      {qfMatches.length > 0 && (
        <section className="bg-red-900/10 border border-red-700/50 rounded-xl p-4">
          <h2 className="text-xl font-bold mb-3">💥 Cuartos de Final</h2>
          <div className="space-y-2">
            {qfMatches.map(match => (
              <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}

      {sfMatches.length > 0 && (
        <section className="bg-pink-900/10 border border-pink-700/50 rounded-xl p-4">
          <h2 className="text-xl font-bold mb-3">🌟 Semifinales</h2>
          <div className="space-y-2">
            {sfMatches.map(match => (
              <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}

      {finalMatches.length > 0 && (
        <section className="bg-gradient-to-r from-yellow-900/30 to-yellow-700/20 border-2 border-yellow-500/70 rounded-xl p-4">
          <h2 className="text-2xl font-bold mb-3">👑 FINAL</h2>
          <div className="space-y-2">
            {finalMatches.sort((a, b) => b.match_number - a.match_number).map(match => (
              <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
