import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GameSave {
  id?: string;
  user_id: string;
  game_state: any;
  chat_history: any[];
  achievements: any[];
  leaderboard_score: number;
  updated_at?: string;
  created_at?: string;
}
