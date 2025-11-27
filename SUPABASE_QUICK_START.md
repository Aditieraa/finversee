# Finverse - Supabase Quick Start (5 Steps)

Fast setup guide to get your Supabase database running in minutes.

## 🚀 Quick Setup (Copy-Paste Ready)

### Step 1: Login to Supabase
- Go to: https://supabase.com
- Sign in to project: **jswgmgqfksskqhmsinvs**

### Step 2: Run SQL Queries

Go to **SQL Editor** and copy-paste these in order:

#### Query 1: Create Base Function
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### Query 2: Create Profiles Table
```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar VARCHAR(50) DEFAULT 'female1',
  career VARCHAR(50),
  monthly_salary DECIMAL(12, 2) DEFAULT 0,
  monthly_expenses DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
```

#### Query 3: Create Game Saves Table
```sql
CREATE TABLE IF NOT EXISTS game_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  current_month INTEGER DEFAULT 1,
  cash_balance DECIMAL(15, 2) DEFAULT 0,
  portfolio JSONB DEFAULT '{"sip": 0, "stocks": 0, "gold": 0, "realEstate": 0, "savings": 0}',
  achievements JSONB DEFAULT '[]',
  financial_goal DECIMAL(15, 2),
  goal_progress DECIMAL(5, 2) DEFAULT 0,
  monthly_investments JSONB DEFAULT '{"sip": 0, "stocks": 0, "gold": 0, "realEstate": 0, "savings": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  is_latest BOOLEAN DEFAULT TRUE
);

DROP TRIGGER IF EXISTS update_game_saves_updated_at ON game_saves;
CREATE TRIGGER update_game_saves_updated_at BEFORE UPDATE ON game_saves FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_game_saves_user_latest ON game_saves(user_id, is_latest);
CREATE INDEX IF NOT EXISTS idx_game_saves_created_at ON game_saves(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_saves_updated_at ON game_saves(updated_at DESC);
```

#### Query 4: Create Stocks Table
```sql
CREATE TABLE IF NOT EXISTS stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_save_id UUID NOT NULL REFERENCES game_saves(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  company_name TEXT,
  quantity INTEGER DEFAULT 0,
  buy_price DECIMAL(10, 2) DEFAULT 0,
  current_price DECIMAL(10, 2) DEFAULT 0,
  total_invested DECIMAL(15, 2) DEFAULT 0,
  current_value DECIMAL(15, 2) DEFAULT 0,
  gain_loss DECIMAL(15, 2) DEFAULT 0,
  gain_loss_percentage DECIMAL(5, 2) DEFAULT 0,
  market_data JSONB DEFAULT '{}',
  price_history JSONB DEFAULT '[]',
  purchase_date TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

DROP TRIGGER IF EXISTS update_stocks_updated_at ON stocks;
CREATE TRIGGER update_stocks_updated_at BEFORE UPDATE ON stocks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX IF NOT EXISTS idx_stocks_user_id ON stocks(user_id);
CREATE INDEX IF NOT EXISTS idx_stocks_game_save_id ON stocks(game_save_id);
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_stocks_user_symbol ON stocks(user_id, symbol);
```

#### Query 5: Create Chat Messages Table
```sql
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_save_id UUID NOT NULL REFERENCES game_saves(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'ai')),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  sentiment VARCHAR(20),
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages;
CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX IF NOT EXISTS idx_chat_messages_game_save ON chat_messages(game_save_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(game_save_id, created_at DESC);
```

### Step 3: Enable Row Level Security (RLS)

#### Query 6: Enable RLS & Profiles Policies
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Public can view profile names for leaderboard" ON profiles;
CREATE POLICY "Public can view profile names for leaderboard" ON profiles FOR SELECT USING (TRUE);
```

#### Query 7: Enable RLS & Game Saves Policies
```sql
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own game saves" ON game_saves;
CREATE POLICY "Users can view their own game saves" ON game_saves FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own game saves" ON game_saves;
CREATE POLICY "Users can insert their own game saves" ON game_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own game saves" ON game_saves;
CREATE POLICY "Users can update their own game saves" ON game_saves FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own game saves" ON game_saves;
CREATE POLICY "Users can delete their own game saves" ON game_saves FOR DELETE USING (auth.uid() = user_id);
```

#### Query 8: Enable RLS & Stocks Policies
```sql
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own stocks" ON stocks;
CREATE POLICY "Users can view their own stocks" ON stocks FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own stocks" ON stocks;
CREATE POLICY "Users can insert their own stocks" ON stocks FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own stocks" ON stocks;
CREATE POLICY "Users can update their own stocks" ON stocks FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own stocks" ON stocks;
CREATE POLICY "Users can delete their own stocks" ON stocks FOR DELETE USING (auth.uid() = user_id);
```

#### Query 9: Enable RLS & Chat Messages Policies
```sql
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;
CREATE POLICY "Users can view their own chat messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own chat messages" ON chat_messages;
CREATE POLICY "Users can insert their own chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own chat messages" ON chat_messages;
CREATE POLICY "Users can update their own chat messages" ON chat_messages FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

### Step 4: Create Database Functions

#### Query 10: Auto-Profile Creation
```sql
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar', 'female1')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Query 11: Get Latest Game Save Function
```sql
CREATE OR REPLACE FUNCTION get_latest_game_save(user_uuid UUID)
RETURNS TABLE (
  id UUID, user_id UUID, level INTEGER, xp INTEGER, current_month INTEGER, 
  cash_balance DECIMAL, portfolio JSONB, achievements JSONB, financial_goal DECIMAL, 
  goal_progress DECIMAL, created_at TIMESTAMP WITH TIME ZONE, updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT gs.id, gs.user_id, gs.level, gs.xp, gs.current_month, gs.cash_balance, 
         gs.portfolio, gs.achievements, gs.financial_goal, gs.goal_progress, 
         gs.created_at, gs.updated_at
  FROM game_saves gs
  WHERE gs.user_id = user_uuid AND gs.is_latest = TRUE
  ORDER BY gs.updated_at DESC LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

### Step 5: Verify Setup

Run this in SQL Editor to verify all 4 tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'game_saves', 'stocks', 'chat_messages')
ORDER BY table_name;
```

Should return **4 rows**: chat_messages, game_saves, profiles, stocks

---

## 📝 Checklist

- [ ] Queries 1-5 executed (tables created)
- [ ] Queries 6-9 executed (RLS enabled)
- [ ] Queries 10-11 executed (functions created)
- [ ] Verification query returns 4 tables
- [ ] Environment variables set in Replit
- [ ] Authentication enabled in Supabase
- [ ] Ready to test!

## 🔗 Your Project Details

- **Supabase URL**: https://jswgmgqfksskqhmsinvs.supabase.co
- **Project ID**: jswgmgqfksskqhmsinvs
- **Environment**: Already configured in Replit

---

**Total Setup Time**: ~5-10 minutes  
**Status**: Production Ready  
**For Detailed Info**: See `supabase_setup.md`
