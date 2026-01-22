'use client'

import { useState } from 'react'
import MatchCard from './MatchCard'

type Match = {
  id: string
  home_team: string
  away_team: string
  home_team_code: string | null
  away_team_code: string | null
  kickoff_at: string | null
  venue: string | null
  city: string | null
  stage: string
  status: string
  home_score: number | null
  away_score: number | null
}

type Prediction = {
  match_id: string
  home_goals: number
  away_goals: number
}

export default function MatchesList({ 
  matches, 
  userPredictions,
  isLoggedIn 
}: { 
  matches: Match[]
  userPredictions: Prediction[]
  isLoggedIn: boolean
}) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'finished'>('upcoming')

  const predictionsMap = new Map(
    userPredictions.map(p => [p.match_id, p])
  )

  const now = new Date()
  
  const filteredMatches = matches.filter(match => {
    const kickoff = match.kickoff_at ? new Date(match.kickoff_at) : null
    
    if (filter === 'upcoming') {
      return !kickoff || kickoff > now
    }
    if (filter === 'finished') {
      return match.status === 'finished'
    }
    return true
  })

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            filter === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Próximos
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('finished')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            filter === 'finished'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Finalizados
        </button>
      </div>

      {/* Matches */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No hay partidos para mostrar
          </div>
        ) : (
          filteredMatches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={predictionsMap.get(match.id)}
              isLoggedIn={isLoggedIn}
            />
          ))
        )}
      </div>
    </div>
  )
}
