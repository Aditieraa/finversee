-- Fix duplicate user_id entries in game_saves table
-- Step 1: Delete duplicates, keep only the latest record per user_id

DELETE FROM game_saves g1
WHERE g1.id NOT IN (
  SELECT id FROM (
    SELECT DISTINCT ON (user_id) id
    FROM game_saves
    ORDER BY user_id, updated_at DESC NULLS LAST, created_at DESC NULLS LAST
  ) AS latest
);

-- Step 2: Now add the columns
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS board_position INTEGER DEFAULT 0;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS dice INTEGER DEFAULT 0;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS passive_income NUMERIC DEFAULT 0;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS total_expenses NUMERIC DEFAULT 0;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS assets JSONB DEFAULT '[]'::jsonb;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS liabilities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS on_fast_track BOOLEAN DEFAULT FALSE;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS has_won BOOLEAN DEFAULT FALSE;
ALTER TABLE game_saves ADD COLUMN IF NOT EXISTS career VARCHAR(50);

-- Step 3: Remove gold_coins column
ALTER TABLE game_saves DROP COLUMN IF EXISTS gold_coins;

-- Step 4: Create unique constraint (now should work)
ALTER TABLE game_saves DROP CONSTRAINT IF EXISTS game_saves_user_id_unique;
ALTER TABLE game_saves ADD CONSTRAINT game_saves_user_id_unique UNIQUE(user_id);

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_game_saves_is_latest ON game_saves(is_latest);

-- Step 6: Verify the results
-- SELECT COUNT(*), user_id FROM game_saves GROUP BY user_id HAVING COUNT(*) > 1;
