# Supabase Database Setup for Finverse

## SQL Table Creation

Run this SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Enable Row Level Security
CREATE TABLE IF NOT EXISTS game_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_state JSONB NOT NULL,
  chat_history JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  leaderboard_score BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_game_saves_leaderboard ON game_saves(leaderboard_score DESC);

-- Enable Row Level Security
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own save"
  ON game_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own save"
  ON game_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own save"
  ON game_saves FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own save"
  ON game_saves FOR DELETE
  USING (auth.uid() = user_id);

-- Public leaderboard view (anonymized)
CREATE POLICY "Anyone can view leaderboard"
  ON game_saves FOR SELECT
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_game_saves_updated_at
  BEFORE UPDATE ON game_saves
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Authentication Setup

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Providers
3. Enable Email provider
4. Configure email templates (optional)

## Next Steps

The application will automatically:
- Create user accounts when they sign up
- Save game state to the database
- Load saved games on login
- Update leaderboard scores
