-- Fix game_saves RLS policies to allow saving
DROP POLICY IF EXISTS "Authenticated can insert" ON game_saves;
DROP POLICY IF EXISTS "Authenticated can update" ON game_saves;
DROP POLICY IF EXISTS "Authenticated can select own" ON game_saves;
DROP POLICY IF EXISTS "Public can select all" ON game_saves;

-- Create new permissive policies that actually work
CREATE POLICY "Anyone can insert game saves" ON game_saves FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update game saves" ON game_saves FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can select game saves" ON game_saves FOR SELECT USING (true);
