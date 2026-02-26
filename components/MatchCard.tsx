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

// Vertical ScoreControl: big input on top, − + buttons below
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
    <div className={`flex flex-col items-center gap-2 ${isDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
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
        inputMode="numeric"
        className={`w-14 h-14 text-center font-bold text-2xl rounded-xl border-2 bg-gray-900 outline-none transition-colors
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          ${value !== '' ? 'border-purple-500 text-white' : 'border-gray-700 text-gray-500'}
          focus:border-purple-400 focus:text-white
          disabled:cursor-not-allowed`}
      />
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={decrement}
          disabled={isDisabled || numVal === null || numVal <= 0}
          className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-lg font-bold hover:bg-gray-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center select-none"
          aria-label="Menos"
        >
          −
        </button>
        <button
          type="button"
          onClick={increment}
          disabled={isDisabled || (numVal !== null && numVal >= 20)}
          className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-lg font-bold hover:bg-gray-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center select-none"
          aria-label="Más"
        >
          +
        </button>
      </div>
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
  // Partidos de grupos: siempre habilitados (equipos son fijos desde el sorteo)
  // Partidos de eliminación directa: bloqueados hasta que is_resolved = true
  const isKnockout = match.stage !== 'group'
  const teamsNotDefined = isKnockout && !match.is_resolved

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

  const getFlagUrl = (code: string | null | undefined) => {
    if (!code) return null
    return `https://flagcdn.com/160x120/${code.toLowerCase()}.png`
  }

  const stageLabels: Record<string, string> = {
    ro32: 'R32',
    ro16: 'Octavos',
    quarterfinal: 'Cuartos',
    semifinal: 'Semifinal',
    final: 'Final',
    third_place: '3er Puesto',
  }

  const headerStage = match.stage !== 'group' ? stageLabels[match.stage] : null

  // Team column: flag + name stacked
  const TeamCol = ({ name, code, align }: { name: string; code?: string | null; align: 'left' | 'right' }) => {
    const flagUrl = getFlagUrl(code)
    return (
      <div className={`flex flex-col items-center gap-1.5 w-20 flex-shrink-0 ${align === 'right' ? 'text-right' : 'text-left'}`}>
        {flagUrl ? (
          <img
            src={flagUrl}
            alt={name}
            className="w-16 h-12 object-cover rounded-lg shadow-md"
          />
        ) : (
          <div className="w-16 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl">
            🏴
          </div>
        )}
        <span className="text-xs font-semibold text-center leading-tight line-clamp-2">{name}</span>
      </div>
    )
  }

  return (
    <div className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-900/40 w-full sm:max-w-xl hover:border-gray-700 transition-colors">

      {/* HEADER: match number, stage (if knockout), date */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900/70 border-b border-gray-800 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-400">#{match.match_number}</span>
          {headerStage && <span className="text-purple-400 font-semibold">{headerStage}</span>}
        </div>
        <div>
          {match.kickoff_at
            ? <span>{formatKickoff(match.kickoff_at)}</span>
            : <span>Fecha TBD</span>}
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 py-4">

        {/* Teams not defined */}
        {teamsNotDefined && !isFinished && (
          <p className="text-yellow-500/70 text-xs text-center mb-3 font-medium">
            Equipos por definirse — pronósticos se habilitarán al clasificar
          </p>
        )}

        {/* FINISHED: result + user prediction */}
        {isFinished && match.home_score !== null && (
          <div className="space-y-3">
            {/* Result row */}
            <div className="flex items-center justify-between gap-2">
              <TeamCol name={displayHomeTeam} code={match.home_team_code} align="left" />

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-4xl font-bold">{match.home_score}</span>
                <span className="text-gray-700 text-lg">—</span>
                <span className="text-4xl font-bold">{match.away_score}</span>
              </div>

              <TeamCol name={displayAwayTeam} code={match.away_team_code} align="right" />
            </div>

            {/* User prediction */}
            {isLoggedIn && (
              prediction ? (
                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-800">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <span>Tu pronóstico:</span>
                    <span className={`font-mono font-bold ${prediction.home_goals === match.home_score ? 'text-green-400' : 'text-gray-400'}`}>
                      {prediction.home_goals}
                    </span>
                    <span className="text-gray-700">—</span>
                    <span className={`font-mono font-bold ${prediction.away_goals === match.away_score ? 'text-green-400' : 'text-gray-400'}`}>
                      {prediction.away_goals}
                    </span>
                  </div>
                  {pointsResult && (
                    <span className={`text-xs font-bold ${
                      pointsResult.type === 'exact' ? 'text-green-400' :
                      pointsResult.type === 'outcome' ? 'text-yellow-400' : 'text-gray-600'
                    }`}>
                      {pointsResult.type === 'exact' && '+3 pts · exacto'}
                      {pointsResult.type === 'outcome' && '+1 pt · ganador'}
                      {pointsResult.type === 'miss' && '0 pts'}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-600 text-center pt-2 border-t border-gray-800">
                  Sin pronóstico registrado
                </p>
              )
            )}
          </div>
        )}

        {/* NOT FINISHED: prediction controls */}
        {!isFinished && (
          <div className="flex items-center justify-between gap-2">
            <TeamCol name={displayHomeTeam} code={match.home_team_code} align="left" />

            <div className="flex items-center gap-2 flex-shrink-0">
              <ScoreControl
                value={homeGoals}
                onChange={setHomeGoals}
                disabled={!isLoggedIn || !!isClosed}
                teamsNotDefined={teamsNotDefined}
              />
              <span className="text-gray-700 text-sm font-bold px-0.5">vs</span>
              <ScoreControl
                value={awayGoals}
                onChange={setAwayGoals}
                disabled={!isLoggedIn || !!isClosed}
                teamsNotDefined={teamsNotDefined}
              />
            </div>

            <TeamCol name={displayAwayTeam} code={match.away_team_code} align="right" />
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
                      isMe ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-gray-800/40'
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
