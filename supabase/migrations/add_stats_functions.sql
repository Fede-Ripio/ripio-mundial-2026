-- Función 1: consenso de pronósticos por partido
-- Retorna una fila por cada combinación (match, score predicho).
-- Si un partido no tiene pronósticos, retorna una fila con home_goals/away_goals NULL y prediction_count 0.
CREATE OR REPLACE FUNCTION get_match_consensus()
RETURNS TABLE(
  match_id          uuid,
  match_number      int,
  stage             text,
  home_team         text,
  away_team         text,
  home_team_code    text,
  kickoff_at        timestamptz,
  status            text,
  home_score        int,
  away_score        int,
  home_goals        int,
  away_goals        int,
  prediction_count  int
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    m.id,
    m.match_number,
    m.stage,
    m.home_team,
    m.away_team,
    m.home_team_code,
    m.kickoff_at,
    m.status,
    m.home_score,
    m.away_score,
    p.home_goals,
    p.away_goals,
    COUNT(p.id)::int AS prediction_count
  FROM matches m
  LEFT JOIN predictions p ON p.match_id = m.id
  GROUP BY
    m.id, m.match_number, m.stage, m.home_team, m.away_team,
    m.home_team_code, m.kickoff_at, m.status, m.home_score, m.away_score,
    p.home_goals, p.away_goals
  ORDER BY m.match_number ASC, COUNT(p.id) DESC;
$$;

-- Función 2: estadísticas globales de pronósticos
-- Retorna una sola fila con el total de pronósticos y usuarios únicos.
CREATE OR REPLACE FUNCTION get_prediction_curiosities()
RETURNS TABLE(
  total_predictions       bigint,
  total_unique_predictors bigint
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT COUNT(*), COUNT(DISTINCT user_id)
  FROM predictions;
$$;
