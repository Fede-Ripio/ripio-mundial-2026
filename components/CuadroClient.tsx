'use client'

import { useState } from 'react'
import GroupStandingsTable from './GroupStandingsTable'
import BracketView from './BracketView'
import type { Match } from '@/types/match'

interface Standing {
  group_code: string
  team: string
  team_code: string | null
  played: number
  won: number
  drawn: number
  lost: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
  position: number
}

type Tab = 'grupos' | 'eliminacion'

export default function CuadroClient({
  standings,
  knockoutMatches,
}: {
  standings: Standing[]
  knockoutMatches: Match[]
}) {
  const [activeTab, setActiveTab] = useState<Tab>('grupos')

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'grupos',      label: 'Fase de grupos' },
    { key: 'eliminacion', label: 'Eliminación directa' },
  ]

  return (
    <div>
      {/* Tabs */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="flex gap-1 bg-gray-900/60 border border-gray-800 rounded-xl p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'grupos' && (
        <div className="px-4 sm:px-6 max-w-7xl">
          {standings.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              Las posiciones se calcularán una vez que comiencen los partidos.
            </p>
          ) : (
            <GroupStandingsTable standings={standings} />
          )}
        </div>
      )}

      {activeTab === 'eliminacion' && (
        <div>
          {knockoutMatches.length === 0 ? (
            <p className="text-gray-500 text-center py-12 px-6">
              El cuadro de eliminación directa estará disponible al terminar la fase de grupos.
            </p>
          ) : (
            <BracketView matches={knockoutMatches} />
          )}
        </div>
      )}
    </div>
  )
}
