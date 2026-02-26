'use client'

import { useState } from 'react'

interface Pred {
  user_id: string
  displayName: string
  home_goals: number
  away_goals: number
  score: { points: number; type: 'exact' | 'outcome' | 'miss' } | null
}

interface MatchEntry {
  match: {
    id: string
    match_number: number
    home_team: string
    away_team: string
    home_score: number
    away_score: number
    stage: string
    group_code?: string
  }
  preds: Pred[]
}

interface Props {
  matchEntries: MatchEntry[]
  currentUserId: string
}

export default function LeaguePredictionsPanel({ matchEntries, currentUserId }: Props) {
  const [open, setOpen] = useState(false)
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

  if (matchEntries.length === 0) return null

  return (
    <div className="mt-8 border border-purple-500/30 rounded-2xl overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-gray-900/50 px-6 py-4 flex items-center justify-between hover:bg-gray-900/80 transition-colors"
      >
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <span>🔍</span>
          <span>Pronósticos por partido</span>
          <span className="text-sm font-normal text-gray-400">({matchEntries.length} finalizados)</span>
        </h2>
        <span className="text-gray-400 text-lg">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="divide-y divide-gray-800">
          {matchEntries.map(({ match, preds }) => {
            const isExpanded = expandedMatch === match.id
            const myPred = preds.find(p => p.user_id === currentUserId)

            return (
              <div key={match.id}>
                <button
                  onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                  className="w-full px-4 sm:px-6 py-3 flex items-center justify-between hover:bg-gray-900/40 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-gray-500 flex-shrink-0">#{match.match_number}</span>
                    <span className="text-sm font-semibold truncate">
                      {match.home_team} <span className="text-green-400">{match.home_score}</span>
                      {' - '}
                      <span className="text-green-400">{match.away_score}</span> {match.away_team}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    {myPred && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        myPred.score?.type === 'exact'   ? 'bg-green-900/40 text-green-400' :
                        myPred.score?.type === 'outcome' ? 'bg-yellow-900/40 text-yellow-400' :
                                                           'bg-gray-800 text-gray-500'
                      }`}>
                        {myPred.score?.type === 'exact'   ? '🎉 +3' :
                         myPred.score?.type === 'outcome' ? '✅ +1' : '❌ 0'}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{preds.length} pred.</span>
                    <span className="text-gray-600">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-3 space-y-1.5">
                    {preds
                      .sort((a, b) => (b.score?.points ?? 0) - (a.score?.points ?? 0))
                      .map((p, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                            p.user_id === currentUserId
                              ? 'bg-purple-900/30 border border-purple-500/30'
                              : 'bg-gray-800/40'
                          }`}
                        >
                          <span className="text-gray-300 truncate max-w-[140px]">
                            {p.user_id === currentUserId
                              ? <strong>{p.displayName} (vos)</strong>
                              : p.displayName}
                          </span>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-mono font-bold text-white">
                              {p.home_goals} - {p.away_goals}
                            </span>
                            <span className={`font-bold w-12 text-right ${
                              p.score?.type === 'exact'   ? 'text-green-400' :
                              p.score?.type === 'outcome' ? 'text-yellow-400' :
                                                            'text-gray-500'
                            }`}>
                              {p.score?.type === 'exact'   ? '🎉 +3' :
                               p.score?.type === 'outcome' ? '✅ +1' : '❌  0'}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
