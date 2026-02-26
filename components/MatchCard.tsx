'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { calculatePredictionScore } from '@/lib/scoring'

interface MatchPrediction {
  user_id: string
  home_goals: number
  away_goals: number
  profiles: { display_name: string | null } | null
}

// ScoreControl is defined outside MatchCard to avoid remount on every render
const ScoreControl = ({
  value,
  onChange,
  disabled,
  teamsNotDefined,
}: {
  value: string
  onChange: (v: string) => void
  disabled: boolean
  teamsNotDefined: boolean
}) => {
  const isDisabled = disabled || teamsNotDefined
  const numVal = value === '' ? null : parseInt(value)

  const decrement = () => {
    if (numVal !== null && numVal > 0) onChange((numVal - 1).toString())
  }

  const increment = () => {
    if (numVal === null) { onChange('0'); return }
    if (numVal < 20) onChange((numVal + 1).toString())
  }

  return (
    <div className={`flex items-center gap-1.5 ${isDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <button
        type="button"
        onClick={decrement}
        disabled={isDisabled || numVal === null || numVal <= 0}
        className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 font-bold text-base hover:bg-gray-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center select-none"
        aria-label="Menos"
      >
        −
      </button>
      <input
        type="number"
        min="0"
        max="20"
        value={value}
        onChange={(e) => {
          const v = e.target.value
          if (v === '' || (parseInt(v) >= 0 && parseInt(v) <= 20)) onChange(v)
        }}
        disabled={isDisabled}
        placeholder="?"
        className={`w-12 h-12 text-center font-bold text-xl rounded-lg border-2 bg-gray-900 outline-none transition-colors
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          ${value !== '' ? 'border-purple-500 text-white' : 'border-gray-600 text-gray-500'}
          focus:border-purple-400 focus:text-white
          disabled:cursor-not-allowed`}
      />
      <button
        type="button"
        onClick={increment}
        disabled={isDisabled || (numVal !== null && numVal >= 20)}
        className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 font-bold text-base hover:bg-gray-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center select-none"
        aria-label="Más"
      >
        +
      </button>
    </div>
  )
}

export default function MatchCard({ match, prediction, isLoggedIn }: any) {
  const router = useRouter()
  const [homeGoals, setHomeGoals] = useState(prediction?.home_goals?.toString() ?? '')
  const [awayGoals, setAwayGoals] = useState(prediction?.away_goals?.toString() ?? '')
  const hasMounted = useRef(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showPredictions, setShowPredictions] = useState(false)
  const [allPredictions, setAllPredictions] = useState<MatchPrediction[]>([])
  const [loadingPredictions, setLoadingPredictions] = useState(false)

  const isClosed = match.kickoff_at && new Date(match.kickoff_at) < new Date()
  const isFinished = match.status === 'finished'
  const teamsNotDefined = !!(match.home_team_ref || match.away_team_ref) && !match.is_resolved

  const displayHomeTeam = match.is_resolved
    ? match.home_team
    : getPlaceholderText(match.home_team_ref, match.home_team)
  const displayAwayTeam = match.is_resolved
    ? match.away_team
    : getPlaceholderText(match.away_team_ref, match.away_team)

  function getPlaceholderText(ref: any, fallback: string) {
    if (!ref) return fallback
    try {
      const parsed = typeof ref === 'string' ? JSON.parse(ref) : ref
      if (parsed.type === 'group_position') {
        const pos = parsed.position === 1 ? '1º' : '2º'
        return `${pos} Grupo ${parsed.group}`
      }
      if (parsed.type === 'match_winner') return `Ganador #${parsed.match_number}`
      return fallback
    } catch { return fallback }
  }

  useEffect(() => {
    if (!hasMounted.current) { hasMounted.current = true; return }
    if (!isLoggedIn || isClosed || homeGoals === '' || awayGoals === '') return
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
          away_goals: parseInt(awayGoals),
        }),
      })
      if (!res.ok) throw new Error('Error')
      setMessage('Guardado')
      setTimeout(() => setMessage(''), 2000)
      router.refresh()
    } catch {
      setMessage('Error al guardar')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const togglePredictions = async () => {
    if (showPredictions) { setShowPredictions(false); return }
    if (allPredictions.length > 0) { setShowPredictions(true); return }
    setLoadingPredictions(true)
    try {
      const res = await fetch(`/api/predictions?match_id=${match.id}`)
      if (res.ok) {
        const data = await res.json()
        setAllPredictions(data.predictions || [])
      }
    } finally {
      setLoadingPredictions(false)
      setShowPredictions(true)
    }
  }

  const pointsResult =
    isFinished && isLoggedIn && prediction && match.home_score !== null
      ? calculatePredictionScore({
          home_goals: prediction.home_goals,
          away_goals: prediction.away_goals,
          home_score: match.home_score,
          away_score: match.away_score,
        })
      : null

  const formatKickoff = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getFlag = (code: string | null | undefined) => {
    if (!code) return null
    return `https://flagcdn.com/24x18/${code.toLowerCase()}.png`
  }

  const stageLabel: Record<string, string> = {
    ro32: 'R32',
    ro16: 'Octavos',
    quarterfinal: 'Cuartos',
    semifinal: 'Semifinal',
    final: 'Final',
    third_place: '3er Puesto',
  }

  const headerStage = match.stage !== 'group' ? stageLabel[match.stage] : null

  return (
    <div className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-900/40 w-full sm:max-w-xl hover:border-gray-700 transition-colors">

      {/* HEADER: match number, stage, date */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900/70 border-b border-gray-800 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-400">#{match.match_number}</span>
          {headerStage && (
            <span className="text-purple-400 font-semibold">{headerStage}</span>
          )}
          {match.group_code && !headerStage && (
            <span>Grupo {match.group_code}</span>
          )}
        </div>
        <div className="text-right">
          {match.kickoff_at
            ? <span>{formatKickoff(match.kickoff_at)}</span>
            : <span>Fecha TBD</span>}
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 py-4">

        {/* Teams not defined yet */}
        {teamsNotDefined && !isFinished && (
          <p className="text-yellow-500/70 text-xs text-center mb-3 font-medium">
            Equipos por definirse — pronósticos se habilitarán al clasificar
          </p>
        )}

        {/* FINISHED: show result + user prediction */}
        {isFinished && match.home_score !== null && (
          <div className="space-y-3">
            {/* Result row */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFlag(match.home_team_code)
                  ? <img src={getFlag(match.home_team_code)!} alt={displayHomeTeam} className="w-6 h-4 rounded flex-shrink-0 object-cover" />
                  : <span>🏴</span>}
                <span className="font-semibold text-sm truncate">{displayHomeTeam}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 px-2">
                <span className="text-3xl font-bold">{match.home_score}</span>
                <span className="text-gray-700 text-lg">—</span>
                <span className="text-3xl font-bold">{match.away_score}</span>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                <span className="font-semibold text-sm truncate text-right">{displayAwayTeam}</span>
                {getFlag(match.away_team_code)
                  ? <img src={getFlag(match.away_team_code)!} alt={displayAwayTeam} className="w-6 h-4 rounded flex-shrink-0 object-cover" />
                  : <span>🏴</span>}
              </div>
            </div>

            {/* User prediction comparison */}
            {isLoggedIn && (
              prediction ? (
                <div className="flex items-center justify-between text-sm pt-1 border-t border-gray-800">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <span>Tu pronóstico:</span>
                    <span className={`font-mono font-bold ${
                      prediction.home_goals === match.home_score ? 'text-green-400' : 'text-gray-400'
                    }`}>{prediction.home_goals}</span>
                    <span className="text-gray-700">—</span>
                    <span className={`font-mono font-bold ${
                      prediction.away_goals === match.away_score ? 'text-green-400' : 'text-gray-400'
                    }`}>{prediction.away_goals}</span>
                  </div>
                  {pointsResult && (
                    <div className={`font-bold text-sm ${
                      pointsResult.type === 'exact' ? 'text-green-400' :
                      pointsResult.type === 'outcome' ? 'text-yellow-400' : 'text-gray-600'
                    }`}>
                      {pointsResult.type === 'exact' && '+3 pts · exacto'}
                      {pointsResult.type === 'outcome' && '+1 pt · ganador'}
                      {pointsResult.type === 'miss' && '0 pts'}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-600 text-center pt-1 border-t border-gray-800">
                  Sin pronóstico registrado
                </p>
              )
            )}
          </div>
        )}

        {/* NOT FINISHED: prediction controls */}
        {!isFinished && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFlag(match.home_team_code)
                  ? <img src={getFlag(match.home_team_code)!} alt={displayHomeTeam} className="w-6 h-4 rounded flex-shrink-0 object-cover" />
                  : <span>🏴</span>}
                <span className="font-semibold text-sm truncate">{displayHomeTeam}</span>
              </div>
              <ScoreControl
                value={homeGoals}
                onChange={setHomeGoals}
                disabled={!isLoggedIn || !!isClosed}
                teamsNotDefined={teamsNotDefined}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFlag(match.away_team_code)
                  ? <img src={getFlag(match.away_team_code)!} alt={displayAwayTeam} className="w-6 h-4 rounded flex-shrink-0 object-cover" />
                  : <span>🏴</span>}
                <span className="font-semibold text-sm truncate">{displayAwayTeam}</span>
              </div>
              <ScoreControl
                value={awayGoals}
                onChange={setAwayGoals}
                disabled={!isLoggedIn || !!isClosed}
                teamsNotDefined={teamsNotDefined}
              />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-800 text-xs">
        <div>
          {isClosed && (
            <button
              onClick={togglePredictions}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              {loadingPredictions
                ? 'Cargando...'
                : showPredictions
                ? 'Ocultar pronósticos'
                : `Ver pronósticos${allPredictions.length > 0 ? ` (${allPredictions.length})` : ''}`}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {message && (
            <span className={`font-medium ${
              message === 'Guardando...' ? 'text-gray-500' :
              message === 'Guardado' ? 'text-green-400' : 'text-red-400'
            }`}>
              {message}
            </span>
          )}
          {!isClosed && !isLoggedIn && !message && (
            <button
              onClick={() => router.push('/login')}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Ingresar
            </button>
          )}
          {isClosed && isLoggedIn && !isFinished && !message && (
            <span className="text-gray-600">🔒 Cerrado</span>
          )}
        </div>
      </div>

      {/* NOTES */}
      {match.notes && (
        <div className="px-4 pb-3 text-xs text-gray-600 italic">{match.notes}</div>
      )}

      {/* PREDICTIONS PANEL */}
      {isClosed && showPredictions && (
        <div className="border-t border-gray-800 px-4 py-3">
          {allPredictions.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-2">Sin pronósticos registrados</p>
          ) : (
            <div className="space-y-1 max-h-52 overflow-y-auto">
              {allPredictions.map((p, i) => {
                const name = p.profiles?.display_name || 'Anónimo'
                const score =
                  isFinished && match.home_score !== null
                    ? calculatePredictionScore({
                        home_goals: p.home_goals,
                        away_goals: p.away_goals,
                        home_score: match.home_score,
                        away_score: match.away_score,
                      })
                    : null
                const isMe =
                  prediction &&
                  p.home_goals === prediction.home_goals &&
                  p.away_goals === prediction.away_goals

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ${
                      isMe
                        ? 'bg-purple-900/30 border border-purple-500/30'
                        : 'bg-gray-800/40'
                    }`}
                  >
                    <span className={`truncate max-w-[140px] ${isMe ? 'text-purple-300 font-semibold' : 'text-gray-400'}`}>
                      {name}{isMe ? ' (vos)' : ''}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-mono font-bold text-white">
                        {p.home_goals} - {p.away_goals}
                      </span>
                      {score && (
                        <span className={`font-bold w-8 text-right ${
                          score.type === 'exact' ? 'text-green-400' :
                          score.type === 'outcome' ? 'text-yellow-400' : 'text-gray-600'
                        }`}>
                          {score.type === 'exact' ? '+3' : score.type === 'outcome' ? '+1' : '0'}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
