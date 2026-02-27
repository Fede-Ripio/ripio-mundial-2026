-- ==========================================
-- CORRECCIÓN: Pairings del bracket según la DB original
-- Ejecutar INMEDIATAMENTE después de add_knockout_bracket.sql
-- ==========================================

-- ── OCTAVOS DE FINAL (#89-96) ────────────────────────────
-- Corrige los pairings que fueron sobreescritos incorrectamente

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 74}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 77}'::jsonb,
  is_resolved = false
WHERE match_number = 89;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 73}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 75}'::jsonb,
  is_resolved = false
WHERE match_number = 90;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 76}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 78}'::jsonb,
  is_resolved = false
WHERE match_number = 91;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 79}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 80}'::jsonb,
  is_resolved = false
WHERE match_number = 92;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 83}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 84}'::jsonb,
  is_resolved = false
WHERE match_number = 93;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 81}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 82}'::jsonb,
  is_resolved = false
WHERE match_number = 94;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 86}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 88}'::jsonb,
  is_resolved = false
WHERE match_number = 95;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 85}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 87}'::jsonb,
  is_resolved = false
WHERE match_number = 96;


-- ── CUARTOS DE FINAL (#97-100) ───────────────────────────

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 89}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 90}'::jsonb,
  is_resolved = false
WHERE match_number = 97;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 93}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 94}'::jsonb,
  is_resolved = false
WHERE match_number = 98;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 91}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 92}'::jsonb,
  is_resolved = false
WHERE match_number = 99;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 95}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 96}'::jsonb,
  is_resolved = false
WHERE match_number = 100;


-- ── SEMIFINALES (#101-102) ───────────────────────────────

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 97}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 98}'::jsonb,
  is_resolved = false
WHERE match_number = 101;

UPDATE matches SET
  home_team_ref = '{"type": "match_winner", "match_number": 99}'::jsonb,
  away_team_ref = '{"type": "match_winner", "match_number": 100}'::jsonb,
  is_resolved = false
WHERE match_number = 102;


-- ── VERIFICACIÓN FINAL ───────────────────────────────────
SELECT
  match_number,
  stage,
  home_team_ref->>'match_number' as home_ref_match,
  away_team_ref->>'match_number' as away_ref_match,
  is_resolved
FROM matches
WHERE stage IN ('ro16', 'quarterfinal', 'semifinal', 'third_place', 'final')
ORDER BY match_number;
