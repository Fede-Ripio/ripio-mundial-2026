// Funciones puras para calcular estadísticas de consenso de pronósticos

export interface MatchConsensusRow {
  match_id: string
  match_number: number
  stage: string
  home_team: string
  away_team: string
  home_team_code: string
  kickoff_at: string | null
  status: string
  home_score: number | null
  away_score: number | null
  home_goals: number | null
  away_goals: number | null
  prediction_count: number
}

export interface ScorePrediction {
  homeGoals: number
  awayGoals: number
  count: number
}

export interface MatchConsensus {
  matchId: string
  matchNumber: number
  stage: string
  homeTeam: string
  awayTeam: string
  homeTeamCode: string
  kickoffAt: string | null
  status: string
  homeScore: number | null
  awayScore: number | null
  totalPredictions: number
  homeWinPct: number
  drawPct: number
  awayWinPct: number
  mostPredictedScore: ScorePrediction | null
  topScores: ScorePrediction[]
}

export interface CuriosityStats {
  totalPredictions: number
  totalUniquePredictors: number
}

/**
 * Groups raw DB rows (one per score prediction) into per-match consensus stats.
 */
export function buildMatchConsensus(rows: MatchConsensusRow[]): MatchConsensus[] {
  // Group by match_id
  const byMatch = new Map<string, MatchConsensusRow[]>()
  for (const row of rows) {
    const existing = byMatch.get(row.match_id) ?? []
    existing.push(row)
    byMatch.set(row.match_id, existing)
  }

  const results: MatchConsensus[] = []

  for (const [matchId, matchRows] of byMatch) {
    const base = matchRows[0]
    let totalPredictions = 0
    let homeWins = 0
    let draws = 0
    let awayWins = 0
    const scoreCounts: ScorePrediction[] = []

    for (const row of matchRows) {
      const h = row.home_goals
      const a = row.away_goals
      const count = row.prediction_count

      // A LEFT JOIN row with no predictions has null home_goals/away_goals
      if (h === null || a === null) continue

      totalPredictions += count

      if (h > a) homeWins += count
      else if (h === a) draws += count
      else awayWins += count

      scoreCounts.push({ homeGoals: h, awayGoals: a, count })
    }

    const sorted = scoreCounts.sort((a, b) => b.count - a.count)

    results.push({
      matchId,
      matchNumber: base.match_number,
      stage: base.stage,
      homeTeam: base.home_team,
      awayTeam: base.away_team,
      homeTeamCode: base.home_team_code,
      kickoffAt: base.kickoff_at,
      status: base.status,
      homeScore: base.home_score,
      awayScore: base.away_score,
      totalPredictions,
      homeWinPct: totalPredictions > 0 ? Math.round((homeWins / totalPredictions) * 100) : 0,
      drawPct: totalPredictions > 0 ? Math.round((draws / totalPredictions) * 100) : 0,
      awayWinPct: totalPredictions > 0 ? Math.round((awayWins / totalPredictions) * 100) : 0,
      mostPredictedScore: sorted[0] ?? null,
      topScores: sorted.slice(0, 5),
    })
  }

  return results.sort((a, b) => a.matchNumber - b.matchNumber)
}

export function buildCuriosities(
  row: { total_predictions: string | number; total_unique_predictors: string | number } | null
): CuriosityStats {
  if (!row) return { totalPredictions: 0, totalUniquePredictors: 0 }
  return {
    totalPredictions: Number(row.total_predictions),
    totalUniquePredictors: Number(row.total_unique_predictors),
  }
}
