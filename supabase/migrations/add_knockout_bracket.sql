-- ==========================================
-- MIGRATION: Bracket completo + resolve de knockouts
-- ==========================================
--
-- Este script hace 4 cosas:
--   1. Extiende resolve_qualified_teams() para manejar match_winner y match_loser
--   2. Extiende el trigger para disparar en TODAS las fases (no solo grupos)
--   3. Carga los home_team_ref/away_team_ref para Octavos, Cuartos, Semis, 3º Puesto y Final
--   4. Actualiza force_recalculate_classification() para cubrir todo el bracket
--
-- IMPORTANTE: Verificar match numbers con:
--   SELECT match_number, stage, home_team, away_team FROM matches
--   WHERE stage != 'group' ORDER BY match_number;
-- ==========================================


-- ==========================================
-- 1. FUNCIÓN EXTENDIDA: resolve_qualified_teams()
--    Soporta: group_position | match_winner | match_loser
-- ==========================================

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
  source_match RECORD;
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

    -- ── EQUIPO LOCAL ──────────────────────────────────────
    IF match_record.home_team_ref IS NOT NULL THEN

      -- Posición en grupo (ej: 1º Grupo A)
      IF match_record.home_team_ref->>'type' = 'group_position' THEN
        SELECT team, team_code INTO resolved_home, resolved_home_code
        FROM group_standings
        WHERE group_code = match_record.home_team_ref->>'group'
          AND position = (match_record.home_team_ref->>'position')::int;

      -- Ganador de un partido de eliminación directa
      ELSIF match_record.home_team_ref->>'type' = 'match_winner' THEN
        SELECT * INTO source_match
        FROM matches
        WHERE match_number = (match_record.home_team_ref->>'match_number')::int
          AND status = 'finished'
          AND home_score IS NOT NULL
          AND away_score IS NOT NULL
          AND home_score != away_score;  -- si hay empate en 90', aún no está definido el ganador

        IF FOUND THEN
          IF source_match.home_score > source_match.away_score THEN
            resolved_home := source_match.home_team;
            resolved_home_code := source_match.home_team_code;
          ELSE
            resolved_home := source_match.away_team;
            resolved_home_code := source_match.away_team_code;
          END IF;
        END IF;

      -- Perdedor de una semifinal (para 3er puesto)
      ELSIF match_record.home_team_ref->>'type' = 'match_loser' THEN
        SELECT * INTO source_match
        FROM matches
        WHERE match_number = (match_record.home_team_ref->>'match_number')::int
          AND status = 'finished'
          AND home_score IS NOT NULL
          AND away_score IS NOT NULL
          AND home_score != away_score;

        IF FOUND THEN
          IF source_match.home_score < source_match.away_score THEN
            resolved_home := source_match.home_team;
            resolved_home_code := source_match.home_team_code;
          ELSE
            resolved_home := source_match.away_team;
            resolved_home_code := source_match.away_team_code;
          END IF;
        END IF;

      END IF;
    END IF;

    -- ── EQUIPO VISITANTE (misma lógica) ───────────────────
    IF match_record.away_team_ref IS NOT NULL THEN

      IF match_record.away_team_ref->>'type' = 'group_position' THEN
        SELECT team, team_code INTO resolved_away, resolved_away_code
        FROM group_standings
        WHERE group_code = match_record.away_team_ref->>'group'
          AND position = (match_record.away_team_ref->>'position')::int;

      ELSIF match_record.away_team_ref->>'type' = 'match_winner' THEN
        SELECT * INTO source_match
        FROM matches
        WHERE match_number = (match_record.away_team_ref->>'match_number')::int
          AND status = 'finished'
          AND home_score IS NOT NULL
          AND away_score IS NOT NULL
          AND home_score != away_score;

        IF FOUND THEN
          IF source_match.home_score > source_match.away_score THEN
            resolved_away := source_match.home_team;
            resolved_away_code := source_match.home_team_code;
          ELSE
            resolved_away := source_match.away_team;
            resolved_away_code := source_match.away_team_code;
          END IF;
        END IF;

      ELSIF match_record.away_team_ref->>'type' = 'match_loser' THEN
        SELECT * INTO source_match
        FROM matches
        WHERE match_number = (match_record.away_team_ref->>'match_number')::int
          AND status = 'finished'
          AND home_score IS NOT NULL
          AND away_score IS NOT NULL
          AND home_score != away_score;

        IF FOUND THEN
          IF source_match.home_score < source_match.away_score THEN
            resolved_away := source_match.home_team;
            resolved_away_code := source_match.home_team_code;
          ELSE
            resolved_away := source_match.away_team;
            resolved_away_code := source_match.away_team_code;
          END IF;
        END IF;

      END IF;
    END IF;

    -- Actualizar solo si ambos equipos fueron resueltos
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


-- ==========================================
-- 2. TRIGGER: dispara para TODAS las fases
-- ==========================================

CREATE OR REPLACE FUNCTION trigger_resolve_on_match_finish()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Cualquier partido que pase a 'finished' dispara la resolución del bracket
  IF NEW.status = 'finished' AND (OLD.status IS NULL OR OLD.status != 'finished') THEN
    PERFORM resolve_qualified_teams();
  END IF;
  RETURN NEW;
END;
$$;

-- Reemplazar el trigger viejo (solo grupos) por el nuevo (todas las fases)
DROP TRIGGER IF EXISTS on_group_match_finished ON matches;
DROP TRIGGER IF EXISTS on_match_finished ON matches;

CREATE TRIGGER on_match_finished
AFTER UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION trigger_resolve_on_match_finish();


-- ==========================================
-- 3. REFS DEL BRACKET COMPLETO
--    Ajustar match_number si la DB usa otros números.
--    Verificar con:
--    SELECT match_number, stage, home_team, away_team
--    FROM matches WHERE stage != 'group' ORDER BY match_number;
-- ==========================================

-- ── OCTAVOS DE FINAL (R16) ────────────────────────────────
-- Ganadores de R32: partidos emparejados por el bracket oficial 2026

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 73}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 79}'::jsonb,
  is_resolved = false
WHERE match_number = 89;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 74}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 80}'::jsonb,
  is_resolved = false
WHERE match_number = 90;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 75}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 81}'::jsonb,
  is_resolved = false
WHERE match_number = 91;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 76}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 82}'::jsonb,
  is_resolved = false
WHERE match_number = 92;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 77}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 83}'::jsonb,
  is_resolved = false
WHERE match_number = 93;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 78}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 84}'::jsonb,
  is_resolved = false
WHERE match_number = 94;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 85}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 86}'::jsonb,
  is_resolved = false
WHERE match_number = 95;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 87}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 88}'::jsonb,
  is_resolved = false
WHERE match_number = 96;


-- ── CUARTOS DE FINAL ──────────────────────────────────────
-- Ganadores de Octavos

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 89}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 91}'::jsonb,
  is_resolved = false
WHERE match_number = 97;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 90}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 92}'::jsonb,
  is_resolved = false
WHERE match_number = 98;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 93}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 95}'::jsonb,
  is_resolved = false
WHERE match_number = 99;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 94}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 96}'::jsonb,
  is_resolved = false
WHERE match_number = 100;


-- ── SEMIFINALES ───────────────────────────────────────────
-- Ganadores de Cuartos

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 97}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 99}'::jsonb,
  is_resolved = false
WHERE match_number = 101;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 98}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 100}'::jsonb,
  is_resolved = false
WHERE match_number = 102;


-- ── 3ER PUESTO ────────────────────────────────────────────
-- Perdedores de Semis

UPDATE matches SET
  home_team_ref = '{"type": "match_loser", "match_number": 101}'::jsonb,
  away_team_ref = '{"type": "match_loser", "match_number": 102}'::jsonb,
  is_resolved = false
WHERE match_number = 103;


-- ── FINAL ─────────────────────────────────────────────────
-- Ganadores de Semis

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 101}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 102}'::jsonb,
  is_resolved = false
WHERE match_number = 104;


-- ==========================================
-- 4. ADMIN: force_recalculate_classification() actualizado
--    Resetea y recalcula TODO el bracket
-- ==========================================

CREATE OR REPLACE FUNCTION force_recalculate_classification()
RETURNS TABLE(message TEXT, resolved_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_resolved INT;
BEGIN
  -- Reset de todos los partidos no finalizados con refs
  UPDATE matches
  SET is_resolved = false
  WHERE status != 'finished'
    AND (home_team_ref IS NOT NULL OR away_team_ref IS NOT NULL);

  -- Recalcular
  PERFORM resolve_qualified_teams();

  SELECT COUNT(*) INTO count_resolved
  FROM matches
  WHERE is_resolved = true;

  RETURN QUERY SELECT
    'Bracket recalculado correctamente'::TEXT,
    count_resolved;
END;
$$;


-- ==========================================
-- VERIFICACIÓN FINAL
-- ==========================================
SELECT
  match_number,
  stage,
  home_team,
  away_team,
  home_team_ref->>'type' as home_ref_type,
  away_team_ref->>'type' as away_ref_type,
  is_resolved
FROM matches
WHERE stage != 'group'
ORDER BY match_number;
