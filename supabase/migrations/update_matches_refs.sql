-- ==========================================
-- ACTUALIZAR MATCHES CON REFERENCIAS A CLASIFICADOS
-- ==========================================

-- RONDA DE 32 (16 partidos: #73-88)
-- Cruces: 1A vs 2B, 1B vs 2A, 1C vs 2D, etc.

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "A", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "B", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 73;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "C", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "D", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 74;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "E", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "F", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 75;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "G", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "H", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 76;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "I", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "J", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 77;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "K", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "L", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 78;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "B", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "A", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 79;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "D", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "C", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 80;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "F", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "E", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 81;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "H", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "G", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 82;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "J", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "I", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 83;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "L", "position": 1}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "K", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 84;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "A", "position": 2}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "C", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 85;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "E", "position": 2}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "G", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 86;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "I", "position": 2}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "K", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 87;

UPDATE matches SET 
  home_team_ref = '{"type": "group_position", "group": "B", "position": 2}'::jsonb,
  away_team_ref = '{"type": "group_position", "group": "D", "position": 2}'::jsonb,
  is_resolved = false
WHERE match_number = 88;

-- OCTAVOS DE FINAL (16 partidos: #89-104)
-- Aquí los cruces dependen de ganadores de Ronda 32
-- Para simplificar MVP: dejamos que admin pueda editarlos manualmente
-- O los cargamos como referencias a "winner of match X"

-- Por ahora, solo actualizamos los que tienen lógica definida públicamente
-- (Los demás quedarán con home_team/away_team como texto hasta que se resuelvan)

-- Verificar cuántos se actualizaron
SELECT COUNT(*) as updated_matches 
FROM matches 
WHERE home_team_ref IS NOT NULL OR away_team_ref IS NOT NULL;

-- Ver ejemplo de cómo quedaron
SELECT match_number, stage, home_team, away_team, home_team_ref, away_team_ref, is_resolved
FROM matches 
WHERE match_number BETWEEN 73 AND 88
ORDER BY match_number
LIMIT 5;
