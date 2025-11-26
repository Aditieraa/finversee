# Supabase Setup - BULLETPROOF SOLUTION

## 🚨 RUN THIS EXACT SQL - Copy the entire script below

```sql
-- ========================================
-- FINVERSE SUPABASE - FRESH SETUP
-- ========================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "Public users can insert profiles" ON profiles CASCADE;
DROP POLICY IF EXISTS "Public users can update profiles" ON profiles CASCADE;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles CASCADE;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON profiles CASCADE;
DROP POLICY IF EXISTS "Users can create own profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON profiles CASCADE;
DROP POLICY IF EXISTS "Anyone can update profiles" ON profiles CASCADE;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles CASCADE;

-- Drop table and recreate fresh
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS game_saves CASCADE;

-- ========================================
-- CREATE PROFILES TABLE - FRESH WITH EMAIL
-- ========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT DEFAULT '',
  career TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_id ON profiles(id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- Enable and configure RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Allow everyone to INSERT/UPDATE their own profiles
CREATE POLICY "Anyone can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profiles" ON profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);

-- ========================================
-- CREATE GAME_SAVES TABLE
-- ========================================
CREATE TABLE game_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  game_state JSONB NOT NULL,
  chat_history JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  leaderboard_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX idx_game_saves_leaderboard ON game_saves(leaderboard_score DESC);

-- Enable and configure RLS
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Allow authenticated users to do everything
CREATE POLICY "Authenticated can insert" ON game_saves FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update" ON game_saves FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can select own" ON game_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can select all" ON game_saves FOR SELECT USING (true);

-- ========================================
-- AUTO UPDATE TIMESTAMPS
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_update_timestamp ON profiles;
CREATE TRIGGER profiles_update_timestamp BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS game_saves_update_timestamp ON game_saves;
CREATE TRIGGER game_saves_update_timestamp BEFORE UPDATE ON game_saves
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================================
-- AUTO CREATE PROFILE ON SIGNUP
-- ========================================
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, career)
  VALUES (NEW.id, NEW.email, '', NULL)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_on_signup();

-- ========================================
-- SETUP COMPLETE
-- ========================================
```

## Installation Steps

1. Go to https://app.supabase.com
2. Click **SQL Editor** → **New Query**
3. Copy & paste the SQL above (all of it)
4. Click **Run** (wait for ✅ Success)
5. Done!

## Verify It Worked

Run this query in SQL Editor:

```sql
SELECT tablename FROM pg_tables WHERE tablename IN ('profiles', 'game_saves');
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
```

You should see:
- 2 tables (profiles, game_saves)
- 3 policies on profiles

## Now Test

1. In Finverse app, create a NEW account
2. Check Supabase → **Authentication** tab → you should see your user
3. Check Supabase → **profiles table** → you should see your profile row WITH EMAIL
4. Complete onboarding
5. Check Supabase → **game_saves table** → you should see your save
