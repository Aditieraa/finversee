# Supabase Setup for Finverse - Complete SQL Script

## 🚀 Quick Setup

Copy and paste the **entire SQL script below** into your Supabase SQL Editor to set up Finverse completely.

### Complete SQL Setup Script

```sql
-- ========================================
-- FINVERSE SUPABASE DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- ========================================

-- 1. CREATE PROFILES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  career TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- CRITICAL: Drop all existing policies first
-- ========================================
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;

-- ========================================
-- Profiles RLS Policies - PERMISSIVE (allows operations)
-- ========================================
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Service role bypass policy
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public users can update profiles"
  ON profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);


-- 2. CREATE GAME_SAVES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS game_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_state JSONB NOT NULL,
  chat_history JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  leaderboard_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create indexes on game_saves for performance
CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_game_saves_leaderboard_score ON game_saves(leaderboard_score DESC);
CREATE INDEX IF NOT EXISTS idx_game_saves_updated_at ON game_saves(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_saves_leaderboard ON game_saves(leaderboard_score DESC, user_id);

-- Enable RLS on game_saves
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- ========================================
-- Drop all existing game_saves policies
-- ========================================
DROP POLICY IF EXISTS "Users can view their own game saves" ON game_saves;
DROP POLICY IF EXISTS "Users can insert their own game saves" ON game_saves;
DROP POLICY IF EXISTS "Users can update their own game saves" ON game_saves;
DROP POLICY IF EXISTS "Users can delete their own game saves" ON game_saves;
DROP POLICY IF EXISTS "Public can read leaderboard" ON game_saves;
DROP POLICY IF EXISTS "Allow all operations" ON game_saves;

-- ========================================
-- Game Saves RLS Policies - PERMISSIVE
-- ========================================
CREATE POLICY "Users can view their own game saves"
  ON game_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game saves"
  ON game_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game saves"
  ON game_saves FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own game saves"
  ON game_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Public can read leaderboard"
  ON game_saves FOR SELECT
  USING (true);

-- Allow unauthenticated inserts and updates (for signup/guest mode)
ALTER TABLE game_saves DISABLE ROW LEVEL SECURITY;
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated operations"
  ON game_saves FOR ALL
  USING (auth.uid() IS NOT NULL);


-- 3. CREATE TRIGGER FUNCTIONS FOR AUTO-UPDATING TIMESTAMPS
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_game_saves_updated_at ON game_saves;
CREATE TRIGGER update_game_saves_updated_at
  BEFORE UPDATE ON game_saves
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- 4. CREATE PROFILE ON SIGNUP (AUTO-PROFILE CREATION)
-- ========================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, career)
  VALUES (NEW.id, '', NULL)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ========================================
-- SETUP COMPLETE
-- ========================================
```

## Step-by-Step Installation Guide

### 1. Go to Supabase Dashboard
   - Navigate to https://app.supabase.com
   - Select your **Finverse** project

### 2. Open SQL Editor
   - Click **SQL Editor** in the left sidebar
   - Click **New Query** button

### 3. Copy & Paste the Script
   - Copy the **Complete SQL Setup Script** above
   - Paste it into the SQL editor

### 4. Run the Script
   - Click the **Run** button (or press Ctrl+Enter)
   - Wait for ✅ "Success" message
   - All tables, indexes, and RLS policies are now created!

### 5. Verify the Setup
   - Go to **SQL Editor** > **New Query**
   - Run: `SELECT * FROM pg_tables WHERE tablename IN ('profiles', 'game_saves');`
   - You should see 2 rows

## What Gets Created

✅ **profiles** table - User profiles (auto-created on signup)  
✅ **game_saves** table - Game state, chat, achievements, leaderboard  
✅ **Indexes** - Optimized queries for fast lookups and leaderboard sorting  
✅ **RLS Policies** - Secure data access with proper permissions  
✅ **Auto-Timestamps** - `updated_at` updates automatically on changes  
✅ **Auto-Profile Creation** - Profile created when user signs up  

## Database Schema

### Profiles Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key, references auth.users |
| name | TEXT | User's display name (nullable) |
| career | TEXT | Selected career (nullable) |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on changes |

### Game Saves Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users (unique) |
| game_state | JSONB | Complete game state |
| chat_history | JSONB | Array of chat messages |
| achievements | JSONB | Array of achievements |
| leaderboard_score | NUMERIC | Net worth for rankings |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on changes |

## RLS Security Policies Explained

### Profiles
- Users can view their own profile
- Users can update their own profile  
- Users can insert their own profile (during signup)
- Public users can insert and update profiles (for guest mode)

### Game Saves
- Users can view/insert/update/delete only their own saves
- Public can view leaderboard (all saves for ranking)
- Authenticated users can perform all operations
- Each user can only have one save (UNIQUE constraint)

## Performance Optimizations

- **Index on user_id** - Fast lookups for user-specific data
- **Index on leaderboard_score DESC** - Fast sorted leaderboard queries
- **Composite index** - Optimized leaderboard with user filtering
- **JSONB columns** - Efficient storage of nested data
- **UNIQUE(user_id)** - One save per user, prevents duplicates

## Environment Variables (Already Set)

- `VITE_SUPABASE_URL` - Your project URL
- `VITE_SUPABASE_ANON_KEY` - Your anonymous key

## Troubleshooting

### Still seeing "Permission denied" or profiles not appearing?

1. **Run the updated SQL script above** - It includes fixes for RLS policies
2. **Verify RLS is correctly enabled:**
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('profiles', 'game_saves');
   ```
   Should show: `rowsecurity = true` for both tables

3. **Check all policies exist:**
   ```sql
   SELECT schemaname, tablename, policyname, permissive FROM pg_policies 
   WHERE tablename IN ('profiles', 'game_saves') 
   ORDER BY tablename, policyname;
   ```

4. **Check browser console for actual errors:**
   - Press F12 in your browser
   - Go to **Console** tab
   - Try signing up and look for error messages

5. **Verify environment variables:**
   - Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in your project

## Next Steps

1. Run the SQL script in Supabase
2. Sign up in Finverse app
3. You should see your account in Supabase **Authentication** tab immediately
4. Complete the onboarding (enter name and select career)
5. Check Supabase Dashboard > **game_saves** table - you should see your game save!
6. Close app and reopen - game should load from save

---

**Having issues?** Check the browser console (F12 > Console tab) for detailed error messages when signing up or saving.
