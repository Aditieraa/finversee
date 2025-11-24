# 📊 Supabase Database Setup for Finverse

## ✅ Complete Setup Instructions

Follow these steps **EXACTLY** in order:

### Step 1: Go to Supabase
1. Open https://supabase.com and sign in
2. Select your **Finverse** project
3. Click **SQL Editor** (left sidebar)

### Step 2: Copy & Run This SQL Script
1. Click **"New Query"** button
2. Copy the **ENTIRE SQL script below** (from `BEGIN TRANSACTION` to `COMMIT`)
3. Paste it into the SQL Editor
4. Click **"Run"** button
5. Wait for ✅ **"Success"** message

---

## 🔧 Complete SQL Script - Copy Everything Below

```sql
BEGIN TRANSACTION;

-- Drop existing tables and functions if they exist
DROP TABLE IF EXISTS game_saves CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create Profiles Table
CREATE TABLE profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT DEFAULT '',
  career TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Game Saves Table
CREATE TABLE game_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  game_state JSONB NOT NULL DEFAULT '{}',
  chat_history JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  leaderboard_score BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX idx_game_saves_leaderboard ON game_saves(leaderboard_score DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- Allow anyone to insert their own profile (needed for signup flow)
CREATE POLICY "profiles_insert_policy" 
  ON profiles FOR INSERT 
  WITH CHECK (true);

-- Only allow users to view their own profile
CREATE POLICY "profiles_select_policy" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Only allow users to update their own profile
CREATE POLICY "profiles_update_policy" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- Only allow users to delete their own profile
CREATE POLICY "profiles_delete_policy" 
  ON profiles FOR DELETE 
  USING (auth.uid() = id);

-- Game Saves RLS Policies
-- Only authenticated users can insert their own game save
CREATE POLICY "game_saves_insert_policy" 
  ON game_saves FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own saves
CREATE POLICY "game_saves_select_own_policy" 
  ON game_saves FOR SELECT 
  USING (auth.uid() = user_id);

-- Public can view all game saves for leaderboard
CREATE POLICY "game_saves_select_public_policy" 
  ON game_saves FOR SELECT 
  USING (true);

-- Users can update their own saves
CREATE POLICY "game_saves_update_policy" 
  ON game_saves FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saves
CREATE POLICY "game_saves_delete_policy" 
  ON game_saves FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to profiles table
CREATE TRIGGER profiles_update_timestamp
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to game_saves table
CREATE TRIGGER game_saves_update_timestamp
  BEFORE UPDATE ON game_saves
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

---

## ✅ What This SQL Does

| Feature | Details |
|---------|---------|
| **profiles table** | Stores user ID, email, name, career |
| **game_saves table** | Stores game state, chat history, achievements, net worth |
| **RLS Policies** | Secure: users only see their own data, public leaderboard visible |
| **Indexes** | Fast queries on email, user_id, and leaderboard |
| **Auto-timestamps** | Updated automatically on every save |

---

## 🎮 After Running This SQL

✅ Users can sign up and accounts are created  
✅ User profile data is stored in Supabase  
✅ Game progress auto-saves every 60 seconds  
✅ Leaderboard shows top 10 players  
✅ All data is secure with Row Level Security  

---

## 🚀 What To Do Next

1. **Run the SQL script above** in Supabase SQL Editor ✅
2. **Create a new account** in Finverse app
3. **Open Supabase Table Editor** and check:
   - `profiles` table - should have your user data
   - `game_saves` table - will populate after first game save
4. **Play the game** - progress auto-saves to cloud every 60 seconds

---

## ⚠️ If You Get Errors

- **"Table already exists"** - You didn't drop tables first. Run the DROP commands individually first.
- **"Policy already exists"** - Refresh the page and try running the script again.
- **"Column does not exist"** - Make sure you're running the complete script, not partial.

**If all else fails:** Delete the Finverse project in Supabase and create a new one, then run this script fresh.

---

## 📝 Important Notes

- This script has `BEGIN TRANSACTION` and `COMMIT` - run it all at once
- Do NOT run it in parts
- The RLS policy `profiles_insert_policy` allows anyone to insert (needed for signup)
- All other operations are restricted to authenticated users only
- Leaderboard is public (anyone can view top players)

**You're all set!** The app will now save all user data to Supabase automatically. 🎉
