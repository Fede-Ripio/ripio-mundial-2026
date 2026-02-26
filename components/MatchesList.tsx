'use client'

import { useState } from 'react'
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

type TabKey = 'group' | 'ro32' | 'ro16' | 'quarterfinal' | 'semifinal' | 'final'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'group',        label: 'Grupos'   },
  { key: 'ro32',         label: 'R32'      },
  { key: 'ro16',         label: 'Octavos'  },
  { key: 'quarterfinal', label: 'Cuartos'  },
  { key: 'semifinal',    label: 'Semis'    },
  { key: 'final',        label: 'Final'    },
]

function defaultTab(nextMatch?: Match | null): TabKey {
  if (!nextMatch) return 'group'
  const stage = nextMatch.stage as TabKey
  if (stage === ('third_place' as any)) return 'final'
  return TABS.find(t => t.key === stage)?.key ?? 'group'
}

export default function MatchesList({ matches, predictions, isLoggedIn, nextMatch }: MatchesListProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab(nextMatch))

  const predictionsMap = new Map(predictions.map(p => [p.match_id, p]))

  const groupMatches    = matches.filter(m => m.stage === 'group')
  const ro32Matches     = matches.filter(m => m.stage === 'ro32')
  const ro16Matches     = matches.filter(m => m.stage === 'ro16')
  const quarterMatches  = matches.filter(m => m.stage === 'quarterfinal')
  const semiMatches     = matches.filter(m => m.stage === 'semifinal')
  const thirdPlaceMatch = matches.filter(m => m.stage === 'third_place')
  const finalMatch      = matches.filter(m => m.stage === 'final')

  const matchesByTab: Record<TabKey, Match[]> = {
    group:        groupMatches,
    ro32:         ro32Matches,
    ro16:         ro16Matches,
    quarterfinal: quarterMatches,
    semifinal:    semiMatches,
    final:        [...thirdPlaceMatch, ...finalMatch],
  }

  const pendingByTab = (tab: TabKey) => {
    if (!isLoggedIn) return 0
    return matchesByTab[tab].filter(m => {
      const closed = m.kickoff_at && new Date(m.kickoff_at) < new Date()
      return !closed && m.status !== 'finished' && !predictionsMap.has(m.id)
    }).length
  }

  return (
    <div className="space-y-6">

      {/* TABS — sticky at top */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm py-3 -mx-3 px-3 sm:-mx-6 sm:px-6 border-b border-gray-800">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
          {TABS.map(tab => {
            const count = matchesByTab[tab.key].length
            if (count === 0) return null
            const pending = pendingByTab(tab.key)
            const isActive = activeTab === tab.key

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-800 text-white border-b-2 border-purple-500'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
                }`}
              >
                <span>{tab.label}</span>
                {pending > 0 && (
                  <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {pending}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* PRÓXIMO PARTIDO — below tabs, always visible */}
      {nextMatch && (
        <section>
          <h2 className="text-base font-semibold text-gray-500 mb-3 uppercase tracking-wide">Próximo partido</h2>
          <div className="flex flex-col items-center">
            <MatchCard
              match={nextMatch}
              prediction={predictionsMap.get(nextMatch.id)}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </section>
      )}

      {/* TAB CONTENT */}
      <div className="space-y-8">

        {/* GRUPOS */}
        {activeTab === 'group' && (
          <div className="space-y-8">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(group => {
              const groupGames = groupMatches.filter(m => m.group_code === group)
              if (groupGames.length === 0) return null
              return (
                <section key={group}>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-7 h-7 bg-purple-600/20 border border-purple-500/40 rounded-lg flex items-center justify-center text-purple-400 text-xs font-bold">
                      {group}
                    </span>
                    Grupo {group}
                  </h3>
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
        )}

        {/* R32 */}
        {activeTab === 'ro32' && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Ronda de 32</h2>
            <div className="flex flex-col items-center space-y-3">
              {ro32Matches.map(match => (
                <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          </section>
        )}

        {/* OCTAVOS */}
        {activeTab === 'ro16' && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Octavos de Final</h2>
            <div className="flex flex-col items-center space-y-3">
              {ro16Matches.map(match => (
                <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          </section>
        )}

        {/* CUARTOS */}
        {activeTab === 'quarterfinal' && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Cuartos de Final</h2>
            <div className="flex flex-col items-center space-y-3">
              {quarterMatches.map(match => (
                <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          </section>
        )}

        {/* SEMIS */}
        {activeTab === 'semifinal' && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Semifinales</h2>
            <div className="flex flex-col items-center space-y-3">
              {semiMatches.map(match => (
                <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          </section>
        )}

        {/* FINAL */}
        {activeTab === 'final' && (
          <div className="space-y-8">
            {thirdPlaceMatch.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Tercer Puesto</h2>
                <div className="flex flex-col items-center space-y-3">
                  {thirdPlaceMatch.map(match => (
                    <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
                  ))}
                </div>
              </section>
            )}
            {finalMatch.length > 0 && (
              <section className="border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-900/10 to-transparent rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-yellow-500/80 mb-4 uppercase tracking-wide text-center">
                  Final del Mundial 2026
                </h2>
                <div className="flex flex-col items-center space-y-3">
                  {finalMatch.map(match => (
                    <MatchCard key={match.id} match={match} prediction={predictionsMap.get(match.id)} isLoggedIn={isLoggedIn} />
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
