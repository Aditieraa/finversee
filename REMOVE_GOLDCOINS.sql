-- Remove gold_coins column from game_saves table
-- This cleans up any unused gold coins logic from the database

ALTER TABLE game_saves DROP COLUMN IF EXISTS gold_coins;

-- Verify the cleanup
-- SELECT column_name FROM information_schema.columns WHERE table_name='game_saves';
