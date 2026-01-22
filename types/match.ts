export interface Match {
  id: string
  match_number: number
  stage: string
  group_code?: string
  home_team: string
  away_team: string
  home_team_code?: string
  away_team_code?: string
  kickoff_at?: string
  venue: string
  city: string
  status: string
  home_score?: number
  away_score?: number
  notes?: string
}

export interface Prediction {
  match_id: string
  home_goals: number
  away_goals: number
}
