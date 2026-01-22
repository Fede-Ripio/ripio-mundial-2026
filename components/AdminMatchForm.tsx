'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminMatchForm({ match }: { match: any }) {
  const router = useRouter()
  const [homeScore, setHomeScore] = useState(match.home_score?.toString() || '')
  const [awayScore, setAwayScore] = useState(match.away_score?.toString() || '')
  const [status, setStatus] = useState(match.status)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('matches')
        .update({
          home_score: homeScore ? parseInt(homeScore) : null,
          away_score: awayScore ? parseInt(awayScore) : null,
          status
        })
        .eq('id', match.id)

      if (error) throw error

      router.refresh()
      setExpanded(false)
    } catch (error) {
      alert('Error: ' + (error as any).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-500">
            #{match.match_number} - {match.stage}
            {match.group_code && ` - Grupo ${match.group_code}`}
          </div>
          <div className="font-semibold">
            {match.home_team} vs {match.away_team}
          </div>
          <div className="text-xs text-gray-500">{match.city}</div>
        </div>
        
        <div className="flex items-center gap-3">
          {match.status === 'finished' && match.home_score !== null && (
            <div className="text-xl font-bold">
              {match.home_score} - {match.away_score}
            </div>
          )}
          <span className={`text-xs px-2 py-1 rounded ${
            match.status === 'finished' ? 'bg-green-600/20 text-green-400' :
            match.status === 'live' ? 'bg-red-600/20 text-red-400' :
            'bg-gray-600/20 text-gray-400'
          }`}>
            {match.status === 'finished' ? 'Finalizado' : 
             match.status === 'live' ? 'En vivo' : 'Programado'}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
          >
            {expanded ? 'Cerrar' : 'Editar'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400 w-24">Resultado:</label>
            <input
              type="number"
              min="0"
              max="20"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              placeholder="0"
              className="w-20 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-center focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              min="0"
              max="20"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              placeholder="0"
              className="w-20 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-center focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400 w-24">Estado:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="scheduled">Programado</option>
              <option value="live">En vivo</option>
              <option value="finished">Finalizado</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            {saving ? 'Guardando...' : '💾 Guardar Cambios'}
          </button>
        </div>
      )}
    </div>
  )
}
