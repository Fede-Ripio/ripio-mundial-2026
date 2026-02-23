-- Backup Supabase - Ripio Mundial 2026
-- Date: $(date)

-- =============================================
-- SCHEMA COMPLETO
-- =============================================

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  display_name text,
  created_at timestamptz DEFAULT now()
);

-- Matches
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_number int UNIQUE NOT NULL,
  stage text NOT NULL,
  group_code text,
  home_team text NOT NULL,
  away_team text NOT NULL,
  home_team_code text,
  away_team_code text,
  kickoff_at timestamptz,
  venue text,
  city text,
  status text DEFAULT 'scheduled',
  home_score int,
  away_score int,
  home_team_ref jsonb,
  away_team_ref jsonb,
  is_resolved boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  home_goals int NOT NULL,
  away_goals int NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, match_id)
);

-- Leagues
CREATE TABLE IF NOT EXISTS leagues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_public boolean DEFAULT false,
  owner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  invite_code text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- League Members
CREATE TABLE IF NOT EXISTS league_members (
  league_id uuid REFERENCES leagues(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (league_id, user_id)
);

