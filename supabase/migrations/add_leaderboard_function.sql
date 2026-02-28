-- ==========================================
-- MIGRATION: Función get_leaderboard
-- ==========================================
--
-- Calcula el ranking de una liga directamente en la DB.
-- Antes: la app traía todos los perfiles + todas las predicciones
--        (~32K rows con 500 usuarios × 64 partidos) y calculaba en JS.
-- Ahora: la DB calcula y devuelve solo N rows con los scores ya sumados.
--
-- Lógica de puntos (igual que lib/scoring.ts):
--   - 3 pts: marcador exacto (home_goals == home_score AND away_goals == away_score)
--   - 1 pt:  ganador correcto o empate correcto (pero marcador incorrecto)
--   - 0 pts: fallo
--
-- Orden: puntos DESC → exactos DESC → aciertos DESC → registro ASC
-- ==========================================

CREATE OR REPLACE FUNCTION get_leaderboard(p_league_id uuid)
RETURNS TABLE(
  user_id        uuid,
  display_name   text,
  points         int,
  exact_hits     int,
  correct_outcomes int,
  created_at     timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    p.id AS user_id,
    p.display_name,

    -- Puntos: 3 por exacto, 1 por resultado correcto
    COALESCE(SUM(
      CASE
        -- Exacto: ambos goles coinciden
        WHEN m.status = 'finished'
          AND m.home_score IS NOT NULL
          AND m.away_score IS NOT NULL
          AND pr.home_goals = m.home_score
          AND pr.away_goals = m.away_score
        THEN 3

        -- Resultado correcto (pero no exacto): mismo ganador o empate
        WHEN m.status = 'finished'
          AND m.home_score IS NOT NULL
          AND m.away_score IS NOT NULL
          AND NOT (pr.home_goals = m.home_score AND pr.away_goals = m.away_score)
          AND (
            CASE
              WHEN pr.home_goals > pr.away_goals THEN 1
              WHEN pr.home_goals < pr.away_goals THEN -1
              ELSE 0
            END
          ) = (
            CASE
              WHEN m.home_score > m.away_score THEN 1
              WHEN m.home_score < m.away_score THEN -1
              ELSE 0
            END
          )
        THEN 1

        ELSE 0
      END
    ), 0)::int AS points,

    -- Exactos
    COUNT(
      CASE
        WHEN m.status = 'finished'
          AND m.home_score IS NOT NULL
          AND m.away_score IS NOT NULL
          AND pr.home_goals = m.home_score
          AND pr.away_goals = m.away_score
        THEN 1
      END
    )::int AS exact_hits,

    -- Aciertos (resultado correcto, no exacto)
    COUNT(
      CASE
        WHEN m.status = 'finished'
          AND m.home_score IS NOT NULL
          AND m.away_score IS NOT NULL
          AND NOT (pr.home_goals = m.home_score AND pr.away_goals = m.away_score)
          AND (
            CASE
              WHEN pr.home_goals > pr.away_goals THEN 1
              WHEN pr.home_goals < pr.away_goals THEN -1
              ELSE 0
            END
          ) = (
            CASE
              WHEN m.home_score > m.away_score THEN 1
              WHEN m.home_score < m.away_score THEN -1
              ELSE 0
            END
          )
        THEN 1
      END
    )::int AS correct_outcomes,

    p.created_at

  FROM profiles p
  JOIN league_members lm ON lm.user_id = p.id AND lm.league_id = p_league_id
  LEFT JOIN predictions pr ON pr.user_id = p.id
  LEFT JOIN matches m ON m.id = pr.match_id

  GROUP BY p.id, p.display_name, p.created_at

  ORDER BY
    points          DESC,
    exact_hits      DESC,
    correct_outcomes DESC,
    p.created_at    ASC
$$;
