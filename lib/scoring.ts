// Tipo de retorno de la función SQL get_leaderboard()
export interface LeaderboardRow {
  user_id: string
  display_name: string | null
  avatar_url: string | null
  points: number
  exact_hits: number
  correct_outcomes: number
  created_at: string
}

export interface ScoringInput {
  home_goals: number
  away_goals: number
  home_score: number
  away_score: number
}

export interface ScoringResult {
  points: number
  type: 'exact' | 'outcome' | 'miss'
}

export function calculatePredictionScore(pred: ScoringInput): ScoringResult {
  if (pred.home_goals === pred.home_score && pred.away_goals === pred.away_score) {
    return { points: 3, type: 'exact' }
  }

  const predOutcome = pred.home_goals > pred.away_goals ? 'home' : pred.home_goals < pred.away_goals ? 'away' : 'draw'
  const matchOutcome = pred.home_score > pred.away_score ? 'home' : pred.home_score < pred.away_score ? 'away' : 'draw'

  if (predOutcome === matchOutcome) {
    return { points: 1, type: 'outcome' }
  }

  return { points: 0, type: 'miss' }
}

export interface UserScore {
  points: number
  exactHits: number
  correctOutcomes: number
}

/**
 * Calcula el puntaje de un usuario a partir de sus pronósticos.
 * Solo cuenta partidos con status 'finished' y scores definidos.
 */
export function calculateUserScore(predictions: any[]): UserScore {
  let points = 0
  let exactHits = 0
  let correctOutcomes = 0

  for (const pred of predictions) {
    const match = pred.matches
    if (
      match?.status === 'finished' &&
      match.home_score !== null &&
      match.away_score !== null
    ) {
      const result = calculatePredictionScore({
        home_goals: pred.home_goals,
        away_goals: pred.away_goals,
        home_score: match.home_score,
        away_score: match.away_score,
      })

      points += result.points
      if (result.type === 'exact') exactHits += 1
      if (result.type === 'outcome') correctOutcomes += 1
    }
  }

  return { points, exactHits, correctOutcomes }
}

/**
 * Comparador para ordenar usuarios en el ranking.
 * Orden: puntos desc → exactos desc → aciertos desc → fecha de registro asc
 */
export function compareLeaderboard(
  a: UserScore & { created_at: string },
  b: UserScore & { created_at: string }
): number {
  if (b.points !== a.points) return b.points - a.points
  if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits
  if (b.correctOutcomes !== a.correctOutcomes) return b.correctOutcomes - a.correctOutcomes
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
}
