-- Tabla de mensajes del chat general
-- Aplicar en: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS messages (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     text        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  created_at  timestamptz DEFAULT now()
);

-- Índice para paginación cronológica eficiente
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at ASC);

-- ── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer (incluso no autenticados, para futuro leaderboard público)
CREATE POLICY "Todos pueden leer mensajes"
  ON messages FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden insertar sus propios mensajes
CREATE POLICY "Autenticados pueden escribir"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Solo el admin puede borrar mensajes (nadie puede borrar los suyos)
CREATE POLICY "Solo admin puede borrar mensajes"
  ON messages FOR DELETE
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'federico.cortina@ripio.com'
  );

-- ── VISTA con join de profiles ─────────────────────────────────────────────
-- Permite leer mensajes con nombre/avatar sin RPC adicional
CREATE OR REPLACE VIEW messages_with_profiles AS
SELECT
  m.id,
  m.user_id,
  m.content,
  m.created_at,
  p.display_name,
  p.avatar_url
FROM messages m
LEFT JOIN profiles p ON p.id = m.user_id;

-- ── REALTIME ───────────────────────────────────────────────────────────────
-- Habilitar realtime para esta tabla (INSERT y DELETE)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
