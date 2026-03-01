'use client'

import { getFlagUrl } from '@/lib/flags'
import type { Match } from '@/types/match'

// ─────────────────────────────────────────────────────────────────
// BRACKET STRUCTURE — 2026 World Cup knockout phase
//
// Left half → SF 101:
//   R32: [74,77, 73,75, 83,84, 81,82] → R16: [89,90,93,94] → QF: [97,98]
// Right half → SF 102:
//   R32: [76,78, 79,80, 86,88, 85,87] → R16: [91,92,95,96] → QF: [99,100]
// Center: Final 104 + 3rd place 103
// ─────────────────────────────────────────────────────────────────

const UNIT     = 80    // px per R32 slot
const TOTAL_H  = 8 * UNIT  // 640px per half-bracket
const CARD_H   = 58    // px (match card height)
const CONN_W   = 20    // px (width of connector lines between rounds)

// Card widths per round
const CARD_W = { r32: 136, r16: 160, qf: 160, sf: 168, final: 172 } as const
type Round = keyof typeof CARD_W

// Center Y-positions for each round's matches (left half, top to bottom)
const POSITIONS: Record<Round | 'final', number[]> = {
  r32:   [40, 120, 200, 280, 360, 440, 520, 600],
  r16:   [80, 240, 400, 560],
  qf:    [160, 480],
  sf:    [320],
  final: [320],
}

// ── Match card ────────────────────────────────────────────────────

function TeamRow({
  name, code, score, isWinner, isLoser, compact,
}: {
  name: string | null
  code?: string | null
  score?: number | null
  isWinner: boolean
  isLoser: boolean
  compact?: boolean
}) {
  const flagUrl = getFlagUrl(code, compact ? 20 : 24)
  return (
    <div className={`flex items-center gap-1.5 px-2 py-[5px] ${isLoser ? 'opacity-40' : ''}`}>
      {flagUrl
        ? <img src={flagUrl} alt="" className={`object-cover rounded-sm flex-shrink-0 ${compact ? 'w-5 h-[14px]' : 'w-[22px] h-4'}`} />
        : <div className={`rounded-sm bg-gray-700 flex-shrink-0 ${compact ? 'w-5 h-[14px]' : 'w-[22px] h-4'}`} />
      }
      <span className={`flex-1 min-w-0 truncate ${isWinner ? 'text-white font-semibold' : 'text-gray-400'} ${compact ? 'text-[10px]' : 'text-xs'}`}>
        {name || 'Por definir'}
      </span>
      {score != null && (
        <span className={`font-bold ml-1 tabular-nums ${isWinner ? 'text-white' : 'text-gray-400'} ${compact ? 'text-[10px]' : 'text-xs'}`}>
          {score}
        </span>
      )}
    </div>
  )
}

function BracketMatch({ match, compact, highlight }: {
  match?: Match
  compact?: boolean
  highlight?: boolean
}) {
  const finished = match?.status === 'finished'
  const homeWins = finished && (match!.home_score ?? 0) > (match!.away_score ?? 0)
  const awayWins = finished && (match!.away_score ?? 0) > (match!.home_score ?? 0)

  const border = highlight
    ? 'border-yellow-500/70 shadow-yellow-900/30'
    : finished
    ? 'border-gray-700'
    : match?.home_team
    ? 'border-purple-500/30'
    : 'border-gray-800'

  return (
    <div className={`bg-gray-900 border ${border} rounded-lg overflow-hidden shadow-md`}>
      <TeamRow
        name={match?.home_team ?? null}
        code={match?.home_team_code}
        score={match?.home_score}
        isWinner={homeWins}
        isLoser={awayWins}
        compact={compact}
      />
      <div className="border-t border-gray-800/80" />
      <TeamRow
        name={match?.away_team ?? null}
        code={match?.away_team_code}
        score={match?.away_score}
        isWinner={awayWins}
        isLoser={homeWins}
        compact={compact}
      />
    </div>
  )
}

// ── Round label ───────────────────────────────────────────────────

function RoundLabel({ label, width }: { label: string; width: number }) {
  return (
    <div
      className="flex-shrink-0 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3"
      style={{ width }}
    >
      {label}
    </div>
  )
}

// ── Bracket column ────────────────────────────────────────────────
// direction='right' → card on left, connector on right (left half)
// direction='left'  → card on right, connector on left (right half)

function BracketColumn({
  round,
  matchNums,
  matchMap,
  direction,
}: {
  round: Round
  matchNums: number[]
  matchMap: Map<number, Match>
  direction: 'right' | 'left'
}) {
  const positions = POSITIONS[round]
  const cardW = CARD_W[round]
  const compact = round === 'r32'
  const colW = cardW + CONN_W

  // Adjacent pairs that feed into the next round
  const pairs: Array<{ y1: number; y2: number; yMid: number }> = []
  for (let i = 0; i < matchNums.length - 1; i += 2) {
    const y1 = positions[i]
    const y2 = positions[i + 1]
    pairs.push({ y1, y2, yMid: (y1 + y2) / 2 })
  }

  const cardLeft  = direction === 'right' ? 0       : CONN_W
  const connLeft  = direction === 'right' ? cardW   : 0
  const connRight = direction === 'right' ? CONN_W  : cardW

  return (
    <div className="relative flex-shrink-0" style={{ width: colW, height: TOTAL_H }}>
      {/* Match cards */}
      {matchNums.map((num, i) => {
        const match = matchMap.get(num)
        return (
          <div
            key={num}
            className="absolute"
            style={{ top: positions[i] - CARD_H / 2, left: cardLeft, width: cardW }}
          >
            <BracketMatch match={match} compact={compact} />
          </div>
        )
      })}

      {/* Connector lines (bracket shape between pairs → next round) */}
      {pairs.map(({ y1, y2, yMid }, idx) => (
        <div key={idx}>
          {/* Vertical bracket line */}
          <div
            className="absolute bg-gray-700"
            style={{ left: connLeft, top: y1, width: 1, height: y2 - y1 }}
          />
          {/* Horizontal midpoint line → next column */}
          <div
            className="absolute bg-gray-700"
            style={{
              left: direction === 'right' ? connLeft : 0,
              top: yMid,
              width: CONN_W,
              height: 1,
            }}
          />
        </div>
      ))}
    </div>
  )
}

// ── Center column: Final + 3rd place ─────────────────────────────

function CenterColumn({
  finalMatch,
  thirdPlaceMatch,
}: {
  finalMatch?: Match
  thirdPlaceMatch?: Match
}) {
  const finalY  = POSITIONS.final[0]  // 320px
  const thirdY  = finalY + CARD_H + 24
  const centerW = CARD_W.final + 32   // a bit wider for padding
  const colH    = thirdY + CARD_H + 12

  return (
    <div className="flex-shrink-0 flex flex-col items-center" style={{ width: centerW }}>
      {/* Final */}
      <div className="relative" style={{ height: finalY + CARD_H / 2, width: '100%' }}>
        <div className="absolute" style={{ top: finalY - CARD_H / 2, left: 16, right: 16 }}>
          <div className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest text-center mb-1">
            Final
          </div>
          <BracketMatch match={finalMatch} highlight />
        </div>
      </div>

      {/* 3rd place */}
      <div className="mt-4 px-4 w-full">
        <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest text-center mb-1">
          3er Puesto
        </div>
        <BracketMatch match={thirdPlaceMatch} />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────

const ROUND_LABELS: Partial<Record<string, string>> = {
  r32: 'R32', r16: 'Octavos', qf: 'Cuartos', sf: 'Semis',
}

export default function BracketView({ matches }: { matches: Match[] }) {
  const matchMap = new Map(matches.map(m => [m.match_number, m]))

  // ── Left half ─────────────────────────────────────────────────
  const leftCols: Array<{ round: Round; nums: number[]; label: string }> = [
    { round: 'r32', nums: [74, 77, 73, 75, 83, 84, 81, 82], label: 'R32' },
    { round: 'r16', nums: [89, 90, 93, 94],                  label: 'Octavos' },
    { round: 'qf',  nums: [97, 98],                           label: 'Cuartos' },
    { round: 'sf',  nums: [101],                              label: 'Semis' },
  ]

  // ── Right half ────────────────────────────────────────────────
  const rightCols: Array<{ round: Round; nums: number[]; label: string }> = [
    { round: 'sf',  nums: [102],                              label: 'Semis' },
    { round: 'qf',  nums: [99, 100],                          label: 'Cuartos' },
    { round: 'r16', nums: [91, 92, 95, 96],                   label: 'Octavos' },
    { round: 'r32', nums: [76, 78, 79, 80, 86, 88, 85, 87],  label: 'R32' },
  ]

  const centerW = CARD_W.final + 32

  return (
    <div className="overflow-x-auto pb-6">
      {/* Round labels row */}
      <div className="flex items-end mb-0 pl-4">
        {leftCols.map(col => (
          <RoundLabel
            key={`lbl-left-${col.round}`}
            label={col.label}
            width={CARD_W[col.round] + CONN_W}
          />
        ))}
        <RoundLabel label="Final" width={centerW} />
        {rightCols.map(col => (
          <RoundLabel
            key={`lbl-right-${col.round}`}
            label={col.label}
            width={CARD_W[col.round] + CONN_W}
          />
        ))}
      </div>

      {/* Bracket tree */}
      <div className="flex items-start pl-4" style={{ minWidth: 'max-content' }}>
        {/* Left half — connectors go right */}
        {leftCols.map(col => (
          <BracketColumn
            key={`left-${col.round}`}
            round={col.round}
            matchNums={col.nums}
            matchMap={matchMap}
            direction="right"
          />
        ))}

        {/* Center: Final + 3rd place */}
        <CenterColumn
          finalMatch={matchMap.get(104)}
          thirdPlaceMatch={matchMap.get(103)}
        />

        {/* Right half — connectors go left */}
        {rightCols.map(col => (
          <BracketColumn
            key={`right-${col.round}`}
            round={col.round}
            matchNums={col.nums}
            matchMap={matchMap}
            direction="left"
          />
        ))}
      </div>
    </div>
  )
}
