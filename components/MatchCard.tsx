'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Match, Prediction } from '@/types/match'

export default function MatchCard({ 
  match, 
  prediction, 
  isLoggedIn 
}: { 
  match: Match
  prediction?: Prediction
  isLoggedIn: boolean
}) {
  const router = useRouter()
  const [homeGoals, setHomeGoals] = useState(prediction?.home_goals?.toString() || '')
  const [awayGoals, setAwayGoals] = useState(prediction?.away_goals?.toString() || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showPrediction, setShowPrediction] = useState(false)

  const isClosed = match.kickoff_at ? new Date(match.kickoff_at) < new Date() : false
  const isFinished = match.status === 'finished'

  const handleSave = async () => {
    if (!isLoggedIn) {
      router.push('/register')
      return
    }

    if (homeGoals === '' || awayGoals === '') {
      setMessage('⚠️ Completá ambos marcadores')
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('predictions')
        .upsert({
          user_id: user.id,
          match_id: match.id,
          home_goals: parseInt(homeGoals),
          away_goals: parseInt(awayGoals),
        })

      if (error) throw error

      setMessage('✅ Guardado')
      setTimeout(() => {
        setMessage(null)
        setShowPrediction(false)
      }, 2000)
      router.refresh()
    } catch (error: any) {
      setMessage('❌ ' + (error.message || 'Error'))
    } finally {
      setSaving(false)
    }
  }

  const getFlagEmoji = (code?: string | null) => {
    if (!code) return '⚽'
    const codePoints = code.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  return (
    <div className="bg-gray-900/40 border border-gray-700/50 rounded-lg p-3 hover:border-blue-500/30 transition-all">
      
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <span>#{match.match_number}</span>
          {match.notes && (
            <span className="bg-yellow-600/20 text-yellow-300 px-2 py-0.5 rounded">
              {match.notes.substring(0, 20)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isFinished && (
            <span className="bg-green-600/20 text-green-400 px-2 py-0.5 rounded text-xs font-semibold">FT</span>
          )}
          {isClosed && !isFinished && (
            <span className="bg-red-600/20 text-red-400 px-2 py-0.5 rounded text-xs">Cerrado</span>
          )}
          {prediction && !showPrediction && (
            <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-xs">
              {prediction.home_goals}-{prediction.away_goals}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{getFlagEmoji(match.home_team_code)}</span>
          <span className="font-semibold truncate">{match.home_team}</span>
          {isFinished && match.home_score !== null && (
            <span className="text-xl font-bold ml-auto">{match.home_score}</span>
          )}
        </div>

        <span className="text-gray-600 font-bold flex-shrink-0">vs</span>

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          {isFinished && match.away_score !== null && (
            <span className="text-xl font-bold mr-auto">{match.away_score}</span>
          )}
          <span className="font-semibold truncate">{match.away_team}</span>
          <span className="text-2xl flex-shrink-0">{getFlagEmoji(match.away_team_code)}</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
        <span>{match.city}</span>
        {match.kickoff_at && (
          <span>
            {new Date(match.kickoff_at).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>

      {isLoggedIn && !isFinished && (
        <>
          {!showPrediction ? (
            <button
              onClick={() => setShowPrediction(true)}
              className="w-full mt-2 text-sm text-blue-400 hover:text-blue-300 py-1"
            >
              {prediction ? '✏️ Editar pronóstico' : '➕ Pronosticar'}
            </button>
          ) : (
            <div className="mt-2 pt-2 border-t border-gray-700/50">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={homeGoals}
                  onChange={(e) => setHomeGoals(e.target.value)}
                  disabled={isClosed || saving}
                  className="w-14 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-center text-sm disabled:opacity-50 focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
                <span className="text-gray-600">-</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={awayGoals}
                  onChange={(e) => setAwayGoals(e.target.value)}
                  disabled={isClosed || saving}
                  className="w-14 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-center text-sm disabled:opacity-50 focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
                <button
                  onClick={handleSave}
                  disabled={isClosed || saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                >
                  {saving ? '...' : isClosed ? 'Cerrado' : '💾 Guardar'}
                </button>
                <button
                  onClick={() => setShowPrediction(false)}
                  className="text-gray-500 hover:text-gray-300 px-2"
                >
                  ✕
                </button>
              </div>
              {message && (
                <div className="text-xs mt-1 text-center text-gray-400">{message}</div>
              )}
            </div>
          )}
        </>
      )}

      {!isLoggedIn && !isFinished && (
        <button
          onClick={() => router.push('/register')}
          className="w-full mt-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-1 rounded text-sm transition-colors"
        >
          Registrate para pronosticar
        </button>
      )}
    </div>
  )
}
