'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function MatchCard({ match, prediction, isLoggedIn }: any) {
  const router = useRouter()
  const [homeGoals, setHomeGoals] = useState(prediction?.home_goals?.toString() || '')
  const [awayGoals, setAwayGoals] = useState(prediction?.away_goals?.toString() || '')
  // Evita que el auto-save se dispare al montar el componente con valores iniciales
  const hasMounted = useRef(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const isClosed = match.kickoff_at && new Date(match.kickoff_at) < new Date()
  const isFinished = match.status === 'finished'
  
  // Mostrar equipos reales si están resueltos, sino placeholder con referencia
  const displayHomeTeam = match.is_resolved ? match.home_team : getPlaceholderText(match.home_team_ref, match.home_team)
  const displayAwayTeam = match.is_resolved ? match.away_team : getPlaceholderText(match.away_team_ref, match.away_team)
  const homeTeamCode = match.home_team_code
  const awayTeamCode = match.away_team_code

  function getPlaceholderText(ref: any, fallback: string) {
    if (!ref) return fallback
    
    try {
      const parsed = typeof ref === 'string' ? JSON.parse(ref) : ref
      
      if (parsed.type === 'group_position') {
        const pos = parsed.position === 1 ? '1º' : '2º'
        return `${pos} Grupo ${parsed.group}`
      }
      
      if (parsed.type === 'match_winner') {
        return `Ganador #${parsed.match_number}`
      }
      
      return fallback
    } catch {
      return fallback
    }
  }

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
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

  const calculatePoints = () => {
    if (!prediction || match.home_score === null || match.away_score === null) return null

    const predHome = prediction.home_goals
    const predAway = prediction.away_goals
    const realHome = match.home_score
    const realAway = match.away_score

    if (predHome === realHome && predAway === realAway) {
      return { points: 3, type: 'exact' }
    }

    const predOutcome = predHome > predAway ? 'home' : predHome < predAway ? 'away' : 'draw'
    const realOutcome = realHome > realAway ? 'home' : realHome < realAway ? 'away' : 'draw'

    if (predOutcome === realOutcome) {
      return { points: 1, type: 'outcome' }
    }

    return { points: 0, type: 'miss' }
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

  const getFlag = (code: string | null) => {
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
    
    // No permitir pronosticar si los equipos no están definidos
    const teamsNotDefined = !!(match.home_team_ref || match.away_team_ref) && !match.is_resolved
    
    const isDisabled = disabled || teamsNotDefined
    
    return (
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        
        <div className={`flex items-center justify-center w-16 h-16 sm:w-12 sm:h-12 bg-gray-800 rounded-lg transition-all ${
          hasValue ? 'border-2 border-purple-500' : 'border-2 border-gray-600'
        }`}>
          <span className="text-white font-bold text-2xl sm:text-xl">
            {value || '?'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num.toString())}
              disabled={isDisabled}
              className={`w-12 h-12 sm:w-9 sm:h-9 rounded-lg font-semibold text-base sm:text-sm transition-all ${
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
            disabled={isDisabled}
            className="w-12 h-12 sm:w-9 sm:h-9 bg-gray-800/50 border border-gray-700 rounded-lg text-center font-bold text-base sm:text-sm disabled:opacity-30 disabled:cursor-not-allowed text-gray-300"
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

  const pointsResult = isFinished && isLoggedIn ? calculatePoints() : null

  // Indicador si los equipos no están definidos
  const teamsNotDefined = !!(match.home_team_ref || match.away_team_ref) && !match.is_resolved

  return (
    <div className="border border-purple-500/30 rounded-xl p-3 sm:p-4 hover:border-purple-500/60 transition-colors bg-gray-900/30 w-full sm:max-w-3xl">
      
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="font-semibold">#{match.match_number}</span>
          {match.group_code && <span>Grupo {match.group_code}</span>}
          {match.stage !== 'group' && (
            <span className="text-purple-400 font-semibold">
              {match.stage === 'ro32' ? '🔥 R32' : 
               match.stage === 'ro16' ? '⚡ Octavos' :
               match.stage === 'quarterfinal' ? '💥 Cuartos' :
               match.stage === 'semifinal' ? '🌟 Semifinal' :
               match.stage === 'final' ? '👑 FINAL' :
               match.stage === 'third_place' ? '🥉 3º Puesto' : match.stage}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 truncate max-w-[200px]">
          {shortenVenue(match.venue || 'Estadio TBD')}
        </div>
      </div>

      {teamsNotDefined && !isFinished && (
        <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3 mb-3 text-center">
          <p className="text-yellow-400 text-sm font-medium">
            ⏳ Equipos por definirse
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Los pronósticos se habilitarán cuando se conozcan los clasificados
          </p>
        </div>
      )}

      {isFinished && match.home_score !== null && isLoggedIn && (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 w-32 sm:w-40 flex-shrink-0 pt-2">
              {homeTeamCode ? (
                <img src={getFlag(homeTeamCode)} alt={displayHomeTeam} className="w-6 h-4 object-cover rounded" />
              ) : <span>🏴</span>}
              <span className="font-bold text-sm truncate">{truncateTeamName(displayHomeTeam, 12)}</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="text-gray-500">Tu:</span>
                <span className="font-bold text-lg">{prediction?.home_goals ?? '-'}</span>
                <span className="text-gray-600">→</span>
                <span className="text-gray-500">Real:</span>
                <span className={`font-bold text-2xl ${
                  prediction?.home_goals === match.home_score ? 'text-green-400' : 'text-red-400'
                }`}>
                  {match.home_score}
                </span>
                <span className="ml-1">
                  {prediction?.home_goals === match.home_score ? '✅' : '❌'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 w-32 sm:w-40 flex-shrink-0 pt-2">
              {awayTeamCode ? (
                <img src={getFlag(awayTeamCode)} alt={displayAwayTeam} className="w-6 h-4 object-cover rounded" />
              ) : <span>🏴</span>}
              <span className="font-bold text-sm truncate">{truncateTeamName(displayAwayTeam, 12)}</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="text-gray-500">Tu:</span>
                <span className="font-bold text-lg">{prediction?.away_goals ?? '-'}</span>
                <span className="text-gray-600">→</span>
                <span className="text-gray-500">Real:</span>
                <span className={`font-bold text-2xl ${
                  prediction?.away_goals === match.away_score ? 'text-green-400' : 'text-red-400'
                }`}>
                  {match.away_score}
                </span>
                <span className="ml-1">
                  {prediction?.away_goals === match.away_score ? '✅' : '❌'}
                </span>
              </div>
            </div>
          </div>

          {pointsResult && (
            <div className={`mt-3 rounded-lg p-3 text-center font-bold text-sm ${
              pointsResult.type === 'exact' 
                ? 'bg-green-900/30 border border-green-500/50 text-green-400'
                : pointsResult.type === 'outcome'
                ? 'bg-blue-900/30 border border-blue-500/50 text-blue-400'
                : 'bg-gray-800/50 border border-gray-600 text-gray-400'
            }`}>
              {pointsResult.type === 'exact' && <>🎉 +{pointsResult.points} puntos (¡Resultado exacto!)</>}
              {pointsResult.type === 'outcome' && <>✅ +{pointsResult.points} punto (Acertaste el ganador)</>}
              {pointsResult.type === 'miss' && <>❌ {pointsResult.points} puntos</>}
            </div>
          )}

          {!prediction && (
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3 text-center text-yellow-400 text-sm">
              ⚠️ No pronosticaste este partido
            </div>
          )}
        </div>
      )}

      {isFinished && match.home_score !== null && !isLoggedIn && (
        <div className="flex items-center justify-center gap-6 py-4">
          <div className="text-center">
            <div className="flex items-center gap-2 mb-2 justify-center">
              {homeTeamCode ? (
                <img src={getFlag(homeTeamCode)} alt={displayHomeTeam} className="w-6 h-4" />
              ) : <span>🏴</span>}
              <span className="font-bold">{truncateTeamName(displayHomeTeam, 15)}</span>
            </div>
            <div className="text-4xl font-bold text-green-400">{match.home_score}</div>
          </div>

          <div className="text-2xl text-gray-500">-</div>

          <div className="text-center">
            <div className="flex items-center gap-2 mb-2 justify-center">
              {awayTeamCode ? (
                <img src={getFlag(awayTeamCode)} alt={displayAwayTeam} className="w-6 h-4" />
              ) : <span>🏴</span>}
              <span className="font-bold">{truncateTeamName(displayAwayTeam, 15)}</span>
            </div>
            <div className="text-4xl font-bold text-green-400">{match.away_score}</div>
          </div>
        </div>
      )}

      {!isFinished && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2 sm:w-44 flex-shrink-0">
              {homeTeamCode ? (
                <img src={getFlag(homeTeamCode)} alt={displayHomeTeam} className="w-6 h-4 object-cover rounded" />
              ) : <span>🏴</span>}
              <span className="font-bold text-sm sm:text-base truncate">{truncateTeamName(displayHomeTeam, 20)}</span>
            </div>

            <GoalButtons value={homeGoals} onChange={setHomeGoals} disabled={!isLoggedIn || isClosed} teamName={displayHomeTeam} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2 sm:w-44 flex-shrink-0">
              {awayTeamCode ? (
                <img src={getFlag(awayTeamCode)} alt={displayAwayTeam} className="w-6 h-4 object-cover rounded" />
              ) : <span>🏴</span>}
              <span className="font-bold text-sm sm:text-base truncate">{truncateTeamName(displayAwayTeam, 20)}</span>
            </div>

            <GoalButtons value={awayGoals} onChange={setAwayGoals} disabled={!isLoggedIn || isClosed} teamName={displayAwayTeam} />
          </div>
        </div>
      )}

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
