'use client'

import { useState } from 'react'
import type { MatchConsensus, CuriosityStats } from '@/lib/stats'
import type { CryptoFact } from '@/lib/crypto-facts'
import type { TournamentSummary, CommonScore } from '@/lib/wc-history'
import ConsensusSection from './ConsensusSection'
import WCHistorySection from './WCHistorySection'
import CryptoFactsSection from './CryptoFactsSection'

type TabKey = 'consenso' | 'historia' | 'cripto'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'consenso', label: 'Pronósticos' },
  { key: 'historia', label: 'Historia'    },
  { key: 'cripto',   label: 'Cripto'      },
]

interface Props {
  consensus: MatchConsensus[]
  curiosities: CuriosityStats
  cryptoFacts: CryptoFact[]
  btcPrice: number | null
  wcSummaries: TournamentSummary[]
  wcTopScores: CommonScore[]
  wcStats: {
    totalMatches: number
    totalGoals: number
    avgGoals: number
    uniqueTeams: number
    tournaments: number
    mostGoalsMatch: { home: string; away: string; year: number; homeGoals: number; awayGoals: number }
    biggestMargin: { home: string; away: string; year: number; homeGoals: number; awayGoals: number }
  }
}

export default function EstadisticasTabs({
  consensus,
  curiosities,
  cryptoFacts,
  btcPrice,
  wcSummaries,
  wcTopScores,
  wcStats,
}: Props) {
  const [active, setActive] = useState<TabKey>('consenso')

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-1 bg-gray-900/60 border border-gray-800 rounded-xl p-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active === tab.key
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {active === 'consenso' && (
        <ConsensusSection consensus={consensus} curiosities={curiosities} />
      )}
      {active === 'historia' && (
        <WCHistorySection
          summaries={wcSummaries}
          topScores={wcTopScores}
          stats={wcStats}
        />
      )}
      {active === 'cripto' && (
        <CryptoFactsSection facts={cryptoFacts} btcPrice={btcPrice} />
      )}
    </div>
  )
}
