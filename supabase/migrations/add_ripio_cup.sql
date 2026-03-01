-- ==========================================
-- MIGRATION: Ripio Cup — ranking interno
-- ==========================================
--
-- Crea la función get_ripio_cup_leaderboard() que devuelve el ranking
-- filtrado solo para usuarios con email @ripio.com.
--
-- No requiere liga ni league_members: todos los empleados Ripio
-- que se registren participan automáticamente.
--
-- Misma lógica de puntos que get_leaderboard():
--   3 pts → marcador exacto
--   1 pt  → ganador correcto o empate correcto
--   0 pts → fallo
--
-- Orden: puntos DESC → exactos DESC → aciertos DESC → registro ASC
-- ==========================================

CREATE OR REPLACE FUNCTION get_ripio_cup_leaderboard()
RETURNS TABLE(
  user_id          uuid,
  display_name     text,
  avatar_url       text,
  points           int,
  exact_hits       int,
  correct_outcomes int,
  created_at       timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    p.id AS user_id,
    p.display_name,
    p.avatar_url,

    -- Puntos: 3 por exacto, 1 por resultado correcto
    COALESCE(SUM(
      CASE
        WHEN m.status = 'finished'
          AND m.home_score IS NOT NULL
          AND m.away_score IS NOT NULL
          AND pr.home_goals = m.home_score
          AND pr.away_goals = m.away_score
        THEN 3

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
  -- Filtrar solo usuarios con email @ripio.com
  JOIN auth.users u ON u.id = p.id AND u.email LIKE '%@ripio.com'
  LEFT JOIN predictions pr ON pr.user_id = p.id
  LEFT JOIN matches m ON m.id = pr.match_id

  GROUP BY p.id, p.display_name, p.avatar_url, p.created_at

  ORDER BY
    points           DESC,
    exact_hits       DESC,
    correct_outcomes DESC,
    p.created_at     ASC
$$;
