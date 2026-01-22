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
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const supabase = createClient()
      
      // Verificar que hay valores válidos
      const homeScoreValue = homeScore !== '' ? parseInt(homeScore) : null
      const awayScoreValue = awayScore !== '' ? parseInt(awayScore) : null

      console.log('Guardando partido:', {
        id: match.id,
        home_score: homeScoreValue,
        away_score: awayScoreValue,
        status
      })

      const { data, error } = await supabase
        .from('matches')
        .update({
          home_score: homeScoreValue,
          away_score: awayScoreValue,
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', match.id)
        .select()

      if (error) {
        console.error('Error de Supabase:', error)
        throw error
      }

      console.log('Guardado exitoso:', data)
      setMessage('✅ Guardado exitosamente')
      
      // Esperar 1 segundo antes de refrescar
      setTimeout(() => {
        router.refresh()
        setExpanded(false)
        setMessage('')
      }, 1000)

    } catch (error: any) {
      console.error('Error completo:', error)
      setMessage('❌ Error: ' + error.message)
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
              placeholder="Goles local"
              className="w-20 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-center focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              min="0"
              max="20"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              placeholder="Goles visit"
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

          {message && (
            <div className={`text-sm p-2 rounded ${
              message.startsWith('✅') ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
            }`}>
              {message}
            </div>
          )}

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
