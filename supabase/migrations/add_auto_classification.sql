-- ==========================================
-- MIGRATION: Sistema de Clasificación Automática
-- ==========================================

-- 1. Agregar columnas de metadata a matches
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS home_team_ref JSONB NULL,
ADD COLUMN IF NOT EXISTS away_team_ref JSONB NULL,
ADD COLUMN IF NOT EXISTS is_resolved BOOLEAN DEFAULT false;

COMMENT ON COLUMN matches.home_team_ref IS 'Referencia al clasificado: {type: "group_position", group: "A", position: 1}';
COMMENT ON COLUMN matches.away_team_ref IS 'Referencia al clasificado: {type: "group_position", group: "B", position: 2}';
COMMENT ON COLUMN matches.is_resolved IS 'True cuando los equipos ya fueron resueltos desde las referencias';

-- 2. Crear vista de tabla de posiciones por grupo
CREATE OR REPLACE VIEW group_standings AS
WITH group_matches AS (
  SELECT 
    m.*,
    CASE 
      WHEN m.status = 'finished' THEN true 
      ELSE false 
    END as is_finished
  FROM matches m
  WHERE m.stage = 'group' AND m.group_code IS NOT NULL
),
team_stats AS (
  -- Stats como local
  SELECT 
    gm.group_code,
    gm.home_team as team,
    gm.home_team_code as team_code,
    COUNT(*) FILTER (WHERE is_finished) as played,
    COUNT(*) FILTER (WHERE is_finished AND home_score > away_score) as won,
    COUNT(*) FILTER (WHERE is_finished AND home_score = away_score) as drawn,
    COUNT(*) FILTER (WHERE is_finished AND home_score < away_score) as lost,
    COALESCE(SUM(home_score) FILTER (WHERE is_finished), 0) as goals_for,
    COALESCE(SUM(away_score) FILTER (WHERE is_finished), 0) as goals_against
  FROM group_matches gm
  GROUP BY gm.group_code, gm.home_team, gm.home_team_code
  
  UNION ALL
  
  -- Stats como visitante
  SELECT 
    gm.group_code,
    gm.away_team as team,
    gm.away_team_code as team_code,
    COUNT(*) FILTER (WHERE is_finished) as played,
    COUNT(*) FILTER (WHERE is_finished AND away_score > home_score) as won,
    COUNT(*) FILTER (WHERE is_finished AND away_score = home_score) as drawn,
    COUNT(*) FILTER (WHERE is_finished AND away_score < home_score) as lost,
    COALESCE(SUM(away_score) FILTER (WHERE is_finished), 0) as goals_for,
    COALESCE(SUM(home_score) FILTER (WHERE is_finished), 0) as goals_against
  FROM group_matches gm
  GROUP BY gm.group_code, gm.away_team, gm.away_team_code
),
aggregated AS (
  SELECT 
    group_code,
    team,
    team_code,
    SUM(played) as played,
    SUM(won) as won,
    SUM(drawn) as drawn,
    SUM(lost) as lost,
    SUM(goals_for) as goals_for,
    SUM(goals_against) as goals_against,
    SUM(goals_for) - SUM(goals_against) as goal_difference,
    (SUM(won) * 3 + SUM(drawn)) as points
  FROM team_stats
  WHERE team IS NOT NULL AND team != 'TBD'
  GROUP BY group_code, team, team_code
)
SELECT 
  group_code,
  team,
  team_code,
  played,
  won,
  drawn,
  lost,
  goals_for,
  goals_against,
  goal_difference,
  points,
  ROW_NUMBER() OVER (
    PARTITION BY group_code 
    ORDER BY 
      points DESC, 
      goal_difference DESC, 
      goals_for DESC,
      team ASC
  ) as position
FROM aggregated
ORDER BY group_code, position;

-- 3. Función para resolver clasificados
CREATE OR REPLACE FUNCTION resolve_qualified_teams()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  match_record RECORD;
  resolved_home TEXT;
  resolved_home_code TEXT;
  resolved_away TEXT;
  resolved_away_code TEXT;
BEGIN
  FOR match_record IN 
    SELECT * FROM matches 
    WHERE is_resolved = false 
      AND (home_team_ref IS NOT NULL OR away_team_ref IS NOT NULL)
      AND status != 'finished'
  LOOP
    resolved_home := NULL;
    resolved_home_code := NULL;
    resolved_away := NULL;
    resolved_away_code := NULL;

    IF match_record.home_team_ref IS NOT NULL THEN
      IF match_record.home_team_ref->>'type' = 'group_position' THEN
        SELECT team, team_code INTO resolved_home, resolved_home_code
        FROM group_standings
        WHERE group_code = match_record.home_team_ref->>'group'
          AND position = (match_record.home_team_ref->>'position')::int;
      END IF;
    END IF;

    IF match_record.away_team_ref IS NOT NULL THEN
      IF match_record.away_team_ref->>'type' = 'group_position' THEN
        SELECT team, team_code INTO resolved_away, resolved_away_code
        FROM group_standings
        WHERE group_code = match_record.away_team_ref->>'group'
          AND position = (match_record.away_team_ref->>'position')::int;
      END IF;
    END IF;

    IF resolved_home IS NOT NULL AND resolved_away IS NOT NULL THEN
      UPDATE matches
      SET 
        home_team = resolved_home,
        home_team_code = resolved_home_code,
        away_team = resolved_away,
        away_team_code = resolved_away_code,
        is_resolved = true,
        updated_at = now()
      WHERE id = match_record.id;
    END IF;
  END LOOP;
END;
$$;

-- 4. Trigger automático
CREATE OR REPLACE FUNCTION trigger_resolve_on_group_finish()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.stage = 'group' AND NEW.status = 'finished' AND (OLD.status IS NULL OR OLD.status != 'finished') THEN
    PERFORM resolve_qualified_teams();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_group_match_finished ON matches;

CREATE TRIGGER on_group_match_finished
AFTER UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION trigger_resolve_on_group_finish();

-- 5. Función admin para forzar recalculo
CREATE OR REPLACE FUNCTION force_recalculate_classification()
RETURNS TABLE(message TEXT, resolved_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_resolved INT;
BEGIN
  UPDATE matches
  SET is_resolved = false
  WHERE status != 'finished' 
    AND (home_team_ref IS NOT NULL OR away_team_ref IS NOT NULL);

  PERFORM resolve_qualified_teams();

  SELECT COUNT(*) INTO count_resolved
  FROM matches
  WHERE is_resolved = true;

  RETURN QUERY SELECT 
    'Classification recalculated successfully'::TEXT,
    count_resolved;
END;
$$;
