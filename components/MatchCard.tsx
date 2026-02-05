'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MatchCard({ match, prediction, isLoggedIn }: any) {
  const router = useRouter()
  const [homeGoals, setHomeGoals] = useState(prediction?.home_goals?.toString() || '')
  const [awayGoals, setAwayGoals] = useState(prediction?.away_goals?.toString() || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const isClosed = match.kickoff_at && new Date(match.kickoff_at) < new Date()
  const isFinished = match.status === 'finished'

  useEffect(() => {
    if (!isLoggedIn || isClosed || !homeGoals || !awayGoals) return
    const timer = setTimeout(() => { handleSave() }, 500)
    return () => clearTimeout(timer)
  }, [homeGoals, awayGoals, isLoggedIn, isClosed])

  const handleSave = async () => {
    if (!isLoggedIn || homeGoals === '' || awayGoals === '') return
    setSaving(true)
    setMessage('Guardando...')
    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          match_id: match.id,
          home_goals: parseInt(homeGoals),
          away_goals: parseInt(awayGoals)
        })
      })
      if (!res.ok) throw new Error('Error')
      setMessage('✅ Guardado')
      setTimeout(() => setMessage(''), 2000)
      router.refresh()
    } catch (err) {
      setMessage('❌ Error')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha TBD'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFlag = (code: string) => {
    if (!code) return '🏴'
    return `https://flagcdn.com/24x18/${code.toLowerCase()}.png`
  }

  const shortenVenue = (venue: string) => {
    if (!venue || venue === 'Estadio TBD') return 'Estadio TBD'
    return venue.replace('Estadio', 'Est.').substring(0, 30)
  }

  const truncateTeamName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name
    return name.substring(0, maxLength) + '...'
  }

  const GoalButtons = ({ value, onChange, disabled, teamName }: { 
    value: string, 
    onChange: (val: string) => void, 
    disabled: boolean,
    teamName: string
  }) => {
    const hasValue = value !== '' && value !== '?'
    
    return (
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        
        {/* CUADRITO RESULTADO - BORDE VIOLETA SI SELECCIONADO */}
        <div className={`flex items-center justify-center w-14 h-14 sm:w-12 sm:h-12 bg-gray-800 rounded-lg transition-all ${
          hasValue ? 'border-2 border-purple-500' : 'border-2 border-gray-600'
        }`}>
          <span className="text-white font-bold text-2xl sm:text-xl">
            {value || '?'}
          </span>
        </div>

        {/* BOTONES - MÁS SEPARADOS EN DESKTOP */}
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num.toString())}
              disabled={disabled}
              className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
                value === num.toString()
                  ? 'bg-purple-600 text-white scale-105'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 border border-gray-700'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              {num}
            </button>
          ))}

          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-9 h-9 bg-gray-800/50 border border-gray-700 rounded-lg text-center font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed text-gray-300"
            aria-label={`Más goles para ${teamName}`}
          >
            <option value="">+</option>
            {Array.from({ length: 47 }, (_, i) => i + 4).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-purple-500/30 rounded-xl p-3 sm:p-4 hover:border-purple-500/60 transition-colors bg-gray-900/30 w-full sm:max-w-3xl">
      
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="font-semibold">#{match.match_number}</span>
          {match.group_code && <span>Grupo {match.group_code}</span>}
          {match.stage !== 'group' && (
            <span className="text-purple-400 font-semibold">
              {match.stage === 'ro32' && 'R32'}
              {match.stage === 'ro16' && 'R16'}
              {match.stage === 'quarterfinal' && 'Cuartos'}
              {match.stage === 'semifinal' && 'Semifinal'}
              {match.stage === 'third_place' && '3er Puesto'}
              {match.stage === 'final' && 'FINAL'}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 truncate max-w-[200px]">
          {shortenVenue(match.venue || 'Estadio TBD')}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 sm:w-44 flex-shrink-0">
            {match.home_team_code ? (
              <img 
                src={getFlag(match.home_team_code)} 
                alt={match.home_team}
                className="w-6 h-4 object-cover rounded flex-shrink-0"
              />
            ) : (
              <span className="text-lg flex-shrink-0">🏴</span>
            )}
            <span className="font-bold text-sm sm:text-base truncate" title={match.home_team}>
              {truncateTeamName(match.home_team, 20)}
            </span>
          </div>

          {isFinished && match.home_score !== null ? (
            <div className="flex items-center justify-center bg-green-900/20 px-6 py-3 rounded-lg">
              <span className="text-3xl font-bold text-green-400">{match.home_score}</span>
            </div>
          ) : (
            <GoalButtons
              value={homeGoals}
              onChange={setHomeGoals}
              disabled={!isLoggedIn || isClosed}
              teamName={match.home_team}
            />
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 sm:w-44 flex-shrink-0">
            {match.away_team_code ? (
              <img 
                src={getFlag(match.away_team_code)} 
                alt={match.away_team}
                className="w-6 h-4 object-cover rounded flex-shrink-0"
              />
            ) : (
              <span className="text-lg flex-shrink-0">🏴</span>
            )}
            <span className="font-bold text-sm sm:text-base truncate" title={match.away_team}>
              {truncateTeamName(match.away_team, 20)}
            </span>
          </div>

          {isFinished && match.away_score !== null ? (
            <div className="flex items-center justify-center bg-green-900/20 px-6 py-3 rounded-lg">
              <span className="text-3xl font-bold text-green-400">{match.away_score}</span>
            </div>
          ) : (
            <GoalButtons
              value={awayGoals}
              onChange={setAwayGoals}
              disabled={!isLoggedIn || isClosed}
              teamName={match.away_team}
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400 flex items-center gap-2">
          <span>⏰</span>
          <span>{match.kickoff_at ? formatDate(match.kickoff_at) : 'Fecha TBD'}</span>
        </div>

        <div className="flex items-center gap-2">
          {!isFinished && message && (
            <span className={`text-xs font-medium ${
              message === 'Guardando...' ? 'text-gray-400' :
              message === '✅ Guardado' ? 'text-green-400' :
              'text-red-400'
            }`}>
              {message}
            </span>
          )}

          {!isFinished && !isLoggedIn && !message && (
            <button
              onClick={() => router.push('/login')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              Login →
            </button>
          )}

          {!isFinished && isClosed && isLoggedIn && !message && (
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              🔒 Cerrado
            </span>
          )}
        </div>
      </div>

      {match.notes && (
        <div className="mt-2 text-xs text-gray-500 italic bg-gray-800/30 rounded px-2 py-1">
          ℹ️ {match.notes}
        </div>
      )}
    </div>
  )
}
