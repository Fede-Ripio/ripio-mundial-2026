-- ==========================================
-- MIGRATION: Avatar de usuario
-- ==========================================
--
-- 1. Agrega columna avatar_url a profiles
-- 2. Crea bucket 'avatars' en Supabase Storage (lectura pública)
-- 3. Agrega RLS policies para que cada usuario suba solo su propio avatar
-- 4. Actualiza get_leaderboard() para devolver avatar_url
--
-- ==========================================

-- 1. Columna en profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Bucket de Storage (idempotente)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS Storage: lectura pública
DO $$
BEGIN
  CREATE POLICY "Avatares públicos"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RLS Storage: solo el propio usuario puede subir su avatar
DO $$
BEGIN
  CREATE POLICY "Usuario sube su avatar"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars' AND name = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RLS Storage: solo el propio usuario puede actualizar su avatar
DO $$
BEGIN
  CREATE POLICY "Usuario actualiza su avatar"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'avatars' AND name = auth.uid()::text)
    WITH CHECK (bucket_id = 'avatars' AND name = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 4. Actualizar get_leaderboard() para incluir avatar_url
CREATE OR REPLACE FUNCTION get_leaderboard(p_league_id uuid)
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

  GROUP BY p.id, p.display_name, p.avatar_url, p.created_at

  ORDER BY
    points          DESC,
    exact_hits      DESC,
    correct_outcomes DESC,
    p.created_at    ASC
$$;
