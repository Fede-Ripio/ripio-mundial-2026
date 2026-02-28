export interface Match {
  id: string
  match_number: number
  stage: string
  group_code?: string
  home_team: string
  away_team: string
  home_team_code?: string | null
  away_team_code?: string | null
  home_team_ref?: unknown
  away_team_ref?: unknown
  is_resolved?: boolean
  kickoff_at?: string
  venue: string
  city: string
  status: string
  home_score?: number | null
  away_score?: number | null
  notes?: string | null
}

export interface Prediction {
  user_id: string
  match_id: string
  home_goals: number
  away_goals: number
}
