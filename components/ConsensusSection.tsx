'use client'

import { useState } from 'react'
import type { MatchConsensus, CuriosityStats } from '@/lib/stats'

type StageFilter = 'all' | 'group' | 'ro32' | 'ro16' | 'quarterfinal' | 'semifinal' | 'final'

const STAGE_FILTERS: { key: StageFilter; label: string }[] = [
  { key: 'all',          label: 'Todos'    },
  { key: 'group',        label: 'Grupos'   },
  { key: 'ro32',         label: 'R32'      },
  { key: 'ro16',         label: 'Octavos'  },
  { key: 'quarterfinal', label: 'Cuartos'  },
  { key: 'semifinal',    label: 'Semis'    },
  { key: 'final',        label: 'Final'    },
]

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'short', timeZone: 'America/Argentina/Buenos_Aires',
  })
}

interface Props {
  consensus: MatchConsensus[]
  curiosities: CuriosityStats
}

export default function ConsensusSection({ consensus, curiosities }: Props) {
  const [stageFilter, setStageFilter] = useState<StageFilter>('all')

  const filtered = consensus.filter(m =>
    stageFilter === 'all' ? true :
    stageFilter === 'final' ? (m.stage === 'final' || m.stage === 'third_place') :
    m.stage === stageFilter
  )

  const hasAnyPredictions = consensus.some(m => m.totalPredictions > 0)

  return (
    <div className="space-y-6">

      {/* Summary bar */}
      {hasAnyPredictions && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {curiosities.totalPredictions.toLocaleString('es-AR')}
            </div>
            <div className="text-xs text-gray-500 mt-1">pronósticos totales</div>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {curiosities.totalUniquePredictors.toLocaleString('es-AR')}
            </div>
            <div className="text-xs text-gray-500 mt-1">participantes únicos</div>
          </div>
        </div>
      )}

      {/* Stage filter */}
      <div className="flex gap-1.5 flex-wrap">
        {STAGE_FILTERS.map(f => {
          const count = f.key === 'all'
            ? consensus.length
            : f.key === 'final'
              ? consensus.filter(m => m.stage === 'final' || m.stage === 'third_place').length
              : consensus.filter(m => m.stage === f.key).length
          if (count === 0 && f.key !== 'all') return null
          return (
            <button
              key={f.key}
              onClick={() => setStageFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                stageFilter === f.key
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                  : 'bg-gray-900/40 text-gray-500 border border-gray-800 hover:text-gray-300'
              }`}
            >
              {f.label}
              {f.key === 'all' ? '' : ` (${count})`}
            </button>
          )
        })}
      </div>

      {/* Match cards */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-600 py-12">No hay partidos en esta fase todavía</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => (
            <ConsensusCard key={m.matchId} match={m} />
          ))}
        </div>
      )}
    </div>
  )
}

function ConsensusCard({ match: m }: { match: MatchConsensus }) {
  const isEmpty = m.totalPredictions === 0
  const homePct = m.homeWinPct
  const drawPct = m.drawPct
  const awayPct = m.awayWinPct

  // Determine winner from consensus
  const winner = homePct > drawPct && homePct > awayPct ? 'home' :
                 awayPct > drawPct && awayPct > homePct ? 'away' : 'draw'

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-600">
          #{m.matchNumber}
          {m.kickoffAt && ` · ${formatDate(m.kickoffAt)}`}
        </span>
        {m.status === 'finished' && m.homeScore !== null && (
          <span className="text-xs text-green-400/80 bg-green-900/20 px-2 py-0.5 rounded-full">
            {m.homeScore} – {m.awayScore}
          </span>
        )}
        {m.totalPredictions > 0 && (
          <span className="text-xs text-gray-600">
            {m.totalPredictions} pronóstico{m.totalPredictions !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-semibold ${winner === 'home' && !isEmpty ? 'text-white' : 'text-gray-300'}`}>
          {m.homeTeam}
        </span>
        <span className="text-xs text-gray-600 mx-2">vs</span>
        <span className={`text-sm font-semibold text-right ${winner === 'away' && !isEmpty ? 'text-white' : 'text-gray-300'}`}>
          {m.awayTeam}
        </span>
      </div>

      {/* Consensus bar */}
      {isEmpty ? (
        <div className="h-6 bg-gray-800/60 rounded-full flex items-center justify-center">
          <span className="text-[10px] text-gray-600">Nadie pronosticó este partido todavía</span>
        </div>
      ) : (
        <>
          <div className="flex h-6 rounded-full overflow-hidden text-[10px] font-bold">
            {homePct > 0 && (
              <div
                className="flex items-center justify-center bg-gradient-to-r from-purple-700 to-purple-500 transition-all duration-700"
                style={{ width: `${homePct}%` }}
              >
                {homePct >= 15 && `${homePct}%`}
              </div>
            )}
            {drawPct > 0 && (
              <div
                className="flex items-center justify-center bg-gray-700 transition-all duration-700"
                style={{ width: `${drawPct}%` }}
              >
                {drawPct >= 12 && `${drawPct}%`}
              </div>
            )}
            {awayPct > 0 && (
              <div
                className="flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-500 transition-all duration-700"
                style={{ width: `${awayPct}%` }}
              >
                {awayPct >= 15 && `${awayPct}%`}
              </div>
            )}
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-1.5 text-[10px] text-gray-500">
            <span className={winner === 'home' ? 'text-purple-400 font-semibold' : ''}>{homePct}% local</span>
            <span className={winner === 'draw' ? 'text-gray-300 font-semibold' : ''}>{drawPct}% empate</span>
            <span className={winner === 'away' ? 'text-gray-300 font-semibold' : ''}>{awayPct}% visitante</span>
          </div>

          {/* Most predicted score */}
          {m.mostPredictedScore && (
            <div className="mt-2 text-[11px] text-gray-500">
              Marcador más elegido:{' '}
              <span className="text-gray-300 font-mono font-bold">
                {m.mostPredictedScore.homeGoals}–{m.mostPredictedScore.awayGoals}
              </span>
              {' '}· {m.mostPredictedScore.count} persona{m.mostPredictedScore.count !== 1 ? 's' : ''}
            </div>
          )}
        </>
      )}
    </div>
  )
}
