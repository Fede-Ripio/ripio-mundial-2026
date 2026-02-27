-- Backfill display_name para usuarios que no lo tienen
-- Usa el prefijo del email (antes del @) como nombre temporal
-- Los usuarios podrán cambiarlo desde su perfil en /me

UPDATE profiles p
SET display_name = split_part(u.email, '@', 1)
FROM auth.users u
WHERE p.id = u.id
  AND (p.display_name IS NULL OR p.display_name = '');
