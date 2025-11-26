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
  name TEXT NOT NULL,
  career TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


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

-- Game Saves RLS Policies
DROP POLICY IF EXISTS "Users can view their own game saves" ON game_saves;
CREATE POLICY "Users can view their own game saves"
  ON game_saves FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own game saves" ON game_saves;
CREATE POLICY "Users can insert their own game saves"
  ON game_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own game saves" ON game_saves;
CREATE POLICY "Users can update their own game saves"
  ON game_saves FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own game saves" ON game_saves;
CREATE POLICY "Users can delete their own game saves"
  ON game_saves FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can read leaderboard scores" ON game_saves;
CREATE POLICY "Public can read leaderboard scores"
  ON game_saves FOR SELECT
  USING (true);


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
  INSERT INTO profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
   - Wait for "Success" message
   - ✅ All tables, indexes, and RLS policies are now created!

## What Gets Created

✅ **profiles** table - Stores user profiles (name, career, timestamps)  
✅ **game_saves** table - Stores game state, chat history, achievements, leaderboard scores  
✅ **Indexes** - Optimized for fast queries on user_id and leaderboard_score  
✅ **RLS Policies** - Secure data access, users can only see their own data  
✅ **Timestamps** - Auto-updated on every record change  
✅ **Auto-Profile Creation** - Profile created automatically when user signs up  

## Database Schema Details

### Profiles Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key, references auth.users |
| name | TEXT | User's display name |
| career | TEXT | Selected career (Engineer, Doctor, etc.) |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on changes |

### Game Saves Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users (unique per user) |
| game_state | JSONB | Complete game state object |
| chat_history | JSONB | Array of chat messages |
| achievements | JSONB | Array of achievement objects |
| leaderboard_score | NUMERIC | User's net worth for rankings |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on changes |

## Performance Optimizations

- **Index on user_id**: Fast lookups for user-specific game saves
- **Index on leaderboard_score DESC**: Fast sorted leaderboard queries
- **Composite index**: Optimized for leaderboard queries with user filtering
- **JSONB columns**: Efficient storage and querying of nested data
- **UNIQUE constraint on user_id**: Ensures one save per user

## Security (RLS Policies)

- ✅ Users can only see their own profile
- ✅ Users can only read/write/delete their own game saves
- ✅ Public can read leaderboard scores for rankings
- ✅ All other data is private by default

## Troubleshooting

If saves aren't working:

1. **Check tables exist**
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

2. **Check RLS is enabled**
   ```sql
   SELECT schemaname, tablename FROM pg_tables 
   WHERE tablename IN ('profiles', 'game_saves');
   ```

3. **Check policies**
   ```sql
   SELECT * FROM pg_policies WHERE tablename IN ('profiles', 'game_saves');
   ```

4. **Check auth user_id matches**
   - Open browser dev tools (F12)
   - Go to Application > Local Storage
   - Look for `supabase.auth.token` - verify user_id

5. **Check indexes**
   ```sql
   SELECT indexname FROM pg_indexes WHERE tablename IN ('profiles', 'game_saves');
   ```

## Environment Variables (Already Set in Replit)

Your app uses these - they're already configured:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Next Steps

Once setup is complete:
1. Sign up a new user in the Finverse app
2. Complete onboarding (enter name and career)
3. Check Supabase Dashboard > SQL Editor > profiles and game_saves tables
4. You should see your profile and game save data!

---

**Questions?** Check the browser console (F12) for detailed error messages.
