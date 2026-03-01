-- Fix: la tabla profiles solo tenía políticas SELECT, sin UPDATE.
-- Esto causaba que avatar_url y display_name no se pudieran actualizar
-- desde el cliente (el update silenciosamente afectaba 0 rows).

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
