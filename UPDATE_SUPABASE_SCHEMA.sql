-- BreakTheRace Game - Complete Schema Update
-- Run this in your Supabase SQL Editor

-- Add game state columns to game_saves table
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS board_position INTEGER DEFAULT 0;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS dice INTEGER DEFAULT 0;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS passive_income NUMERIC DEFAULT 0;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS total_expenses NUMERIC DEFAULT 0;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS assets JSONB DEFAULT '[]'::jsonb;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS liabilities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS on_fast_track BOOLEAN DEFAULT FALSE;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS has_won BOOLEAN DEFAULT FALSE;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS career VARCHAR(50);

-- Remove unused gold coins column
ALTER TABLE game_saves DROP COLUMN IF EXISTS gold_coins;

-- Create unique constraint on user_id for upsert operations
ALTER TABLE game_saves DROP CONSTRAINT IF EXISTS game_saves_user_id_unique;
ALTER TABLE game_saves ADD CONSTRAINT game_saves_user_id_unique UNIQUE(user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_game_saves_is_latest ON game_saves(is_latest);

-- Update existing data with defaults
UPDATE game_saves 
SET 
  is_latest = COALESCE(is_latest, TRUE),
  on_fast_track = COALESCE(on_fast_track, FALSE),
  has_won = COALESCE(has_won, FALSE),
  assets = COALESCE(assets, '[]'::jsonb),
  liabilities = COALESCE(liabilities, '[]'::jsonb)
WHERE TRUE;
