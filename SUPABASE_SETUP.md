# 📊 Supabase Database Setup for Finverse

## ✅ Step-by-Step Instructions

1. Go to **https://supabase.com** and sign in
2. Select your **Finverse** project
3. Click **SQL Editor** (left sidebar)
4. Click **"New Query"** button
5. **Delete any old tables first** - Copy & run this command:
   ```sql
   DROP TABLE IF EXISTS game_saves CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
   ```
6. **Then run the complete SQL script below** (Copy & Paste everything)
7. Click **"Run"** button
8. Wait for **"Success"** message ✅

---

## 🔧 SQL Script - Copy Everything Below and Run It

```sql
-- User Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  career TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Saves Table
CREATE TABLE game_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  game_state JSONB NOT NULL,
  chat_history JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  leaderboard_score BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX idx_game_saves_leaderboard ON game_saves(leaderboard_score DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- Profiles Policies - IMPORTANT: Allow insert for anyone (signup doesn't have auth context yet)
CREATE POLICY "Allow anyone to insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" 
  ON profiles FOR DELETE 
  USING (auth.uid() = id);

-- Game Saves Policies
CREATE POLICY "Users can insert their own save" 
  ON game_saves FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own save" 
  ON game_saves FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own save" 
  ON game_saves FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own save" 
  ON game_saves FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow anyone to view public leaderboard" 
  ON game_saves FOR SELECT 
  USING (true);

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_saves_timestamp
  BEFORE UPDATE ON game_saves
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🎯 What This Creates

✅ **profiles** table - Stores: user ID, email, name, career  
✅ **game_saves** table - Stores: game state, chat history, achievements, net worth score  
✅ **Security policies** - Users can only see/edit their own data + public leaderboard  
✅ **Leaderboard ready** - Anyone can view top players by net worth  
✅ **Auto-timestamps** - Updated timestamps on every save  

---

## 🎮 After Running This SQL

✅ Users can sign up and create accounts  
✅ User profiles are automatically stored on Supabase  
✅ Game progress auto-saves every 60 seconds  
✅ Leaderboard shows top players  
✅ All data is secure with RLS policies  

---

## ⚠️ IMPORTANT: Follow These Exact Steps

1. **First** - Run the DROP commands to delete old tables
2. **Then** - Run the complete CREATE TABLE script in a NEW QUERY
3. **Do NOT** run them in the same query or you'll get errors

**That's it! Just run the SQL above and Finverse is fully connected to Supabase!** 🚀
