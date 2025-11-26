# Supabase Setup for Finverse

## Database Schema

### 1. Profiles Table
Stores user profile information linked to Supabase Auth.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  career TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
CREATE INDEX idx_profiles_updated_at ON profiles(updated_at);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 2. Game Saves Table
Stores game state, chat history, and leaderboard scores.

```sql
CREATE TABLE game_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  game_state JSONB NOT NULL,
  chat_history JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  leaderboard_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX idx_game_saves_leaderboard_score ON game_saves(leaderboard_score DESC);
CREATE INDEX idx_game_saves_updated_at ON game_saves(updated_at DESC);

-- Composite index for leaderboard queries
CREATE INDEX idx_game_saves_leaderboard ON game_saves(leaderboard_score DESC, user_id);

-- RLS Policies
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own game saves"
  ON game_saves FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IS NULL); -- Allow public leaderboard reads

CREATE POLICY "Users can insert their own game saves"
  ON game_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game saves"
  ON game_saves FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own game saves"
  ON game_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Public can read leaderboard scores"
  ON game_saves FOR SELECT
  USING (true);
```

## Setup Instructions

1. **Create the tables** using the SQL above in Supabase SQL Editor
2. **Configure RLS (Row Level Security)** as shown in the policies
3. **Verify indexes** are created for optimal query performance
4. **Test the connections** by saving and loading game state

## Performance Considerations

- **Indexes on leaderboard_score**: Ensures fast sorting for leaderboard queries
- **Indexes on user_id**: Enables fast lookups for user-specific saves
- **Composite index**: Optimizes leaderboard queries that filter by user
- **JSONB columns**: Efficient storage for nested game state and chat history
- **RLS Policies**: Secure data access while allowing public leaderboard reads

## Troubleshooting

If saves aren't working:
1. Check that the `game_saves` table exists
2. Verify RLS policies are enabled
3. Ensure user_id matches the authenticated user's ID
4. Check browser console for error messages
5. Verify environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
