-- Backup manual - ejecutar en Supabase SQL Editor
-- Fecha: $(date)

-- Matches
COPY (SELECT * FROM matches ORDER BY match_number) TO STDOUT WITH CSV HEADER;

-- Predictions
COPY (SELECT * FROM predictions ORDER BY created_at) TO STDOUT WITH CSV HEADER;

-- Profiles
COPY (SELECT * FROM profiles ORDER BY created_at) TO STDOUT WITH CSV HEADER;

-- Leagues
COPY (SELECT * FROM leagues ORDER BY created_at) TO STDOUT WITH CSV HEADER;

-- League Members
COPY (SELECT * FROM league_members ORDER BY created_at) TO STDOUT WITH CSV HEADER;
