import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GameSave {
  id?: string;
  user_id: string;
  career: string;
  board_position: number;
  dice: number;
  cash_balance: number;
  passive_income: number;
  total_expenses: number;
  assets: any[];
  liabilities: any[];
  on_fast_track: boolean;
  has_won: boolean;
  level: number;
  xp: number;
  is_latest: boolean;
  updated_at?: string;
  created_at?: string;
}
