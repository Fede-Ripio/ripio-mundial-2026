CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage TEXT NOT NULL,
  group_code TEXT,
  match_number INTEGER,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_team_code TEXT,
  away_team_code TEXT,
  kickoff_at TIMESTAMPTZ,
  venue TEXT,
  city TEXT,
  status TEXT DEFAULT 'scheduled',
  home_score INTEGER,
  away_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  home_goals INTEGER NOT NULL CHECK (home_goals >= 0),
  away_goals INTEGER NOT NULL CHECK (away_goals >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

CREATE TABLE IF NOT EXISTS public.leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.league_members (
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (league_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_predictions_user ON public.predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match ON public.predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_matches_kickoff ON public.matches(kickoff_at);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.auto_join_general_league()
RETURNS TRIGGER AS $$
DECLARE
  general_league_id UUID;
BEGIN
  SELECT id INTO general_league_id FROM public.leagues WHERE name = 'Ripio Mundial' LIMIT 1;
  IF general_league_id IS NOT NULL THEN
    INSERT INTO public.league_members (league_id, user_id, role)
    VALUES (general_league_id, NEW.id, 'member')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.auto_join_general_league();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Own predictions" ON public.predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert predictions" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update predictions" ON public.predictions FOR UPDATE USING (
  auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.matches WHERE matches.id = predictions.match_id 
    AND (matches.kickoff_at IS NULL OR matches.kickoff_at > NOW())
  )
);

INSERT INTO public.leagues (id, name, is_public, invite_code)
VALUES ('00000000-0000-0000-0000-000000000001', 'Ripio Mundial', true, 'RIPIO2026')
ON CONFLICT DO NOTHING;

INSERT INTO public.matches (stage, group_code, match_number, home_team, away_team, home_team_code, away_team_code, kickoff_at, venue, city) VALUES
('group', 'A', 1, 'México', 'TBD', 'MX', NULL, '2026-06-11 18:00:00-06', 'Estadio Azteca', 'Ciudad de México'),
('group', 'B', 2, 'Estados Unidos', 'TBD', 'US', NULL, '2026-06-12 18:00:00-07', 'SoFi Stadium', 'Los Angeles'),
('group', 'C', 3, 'Argentina', 'TBD', 'AR', NULL, '2026-06-13 15:00:00-04', 'MetLife Stadium', 'New York'),
('group', 'D', 4, 'Brasil', 'TBD', 'BR', NULL, '2026-06-14 18:00:00-04', 'Hard Rock Stadium', 'Miami'),
('group', 'E', 5, 'España', 'TBD', 'ES', NULL, '2026-06-15 15:00:00-07', 'Levi''s Stadium', 'San Francisco'),
('group', 'F', 6, 'Francia', 'TBD', 'FR', NULL, '2026-06-16 18:00:00-05', 'AT&T Stadium', 'Dallas'),
('group', 'G', 7, 'Inglaterra', 'TBD', 'GB', NULL, '2026-06-17 15:00:00-04', 'Gillette Stadium', 'Boston'),
('group', 'H', 8, 'Alemania', 'TBD', 'DE', NULL, '2026-06-18 18:00:00-04', 'Mercedes-Benz Stadium', 'Atlanta'),
('ro16', NULL, 49, 'TBD', 'TBD', NULL, NULL, '2026-07-04 15:00:00-07', 'SoFi Stadium', 'Los Angeles'),
('ro16', NULL, 50, 'TBD', 'TBD', NULL, NULL, '2026-07-05 18:00:00-04', 'Hard Rock Stadium', 'Miami'),
('qf', NULL, 57, 'TBD', 'TBD', NULL, NULL, '2026-07-09 15:00:00-07', 'SoFi Stadium', 'Los Angeles'),
('qf', NULL, 58, 'TBD', 'TBD', NULL, NULL, '2026-07-10 18:00:00-04', 'Gillette Stadium', 'Boston'),
('sf', NULL, 65, 'TBD', 'TBD', NULL, NULL, '2026-07-14 18:00:00-05', 'AT&T Stadium', 'Dallas'),
('sf', NULL, 66, 'TBD', 'TBD', NULL, NULL, '2026-07-15 18:00:00-04', 'Mercedes-Benz Stadium', 'Atlanta'),
('final', NULL, 71, 'TBD', 'TBD', NULL, NULL, '2026-07-18 15:00:00-04', 'Hard Rock Stadium', 'Miami'),
('final', NULL, 72, 'TBD', 'TBD', NULL, NULL, '2026-07-19 15:00:00-04', 'MetLife Stadium', 'New York')
ON CONFLICT DO NOTHING;
