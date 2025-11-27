# Finverse - Supabase Setup Guide (Complete)

Complete setup guide for Supabase database with Profiles, Game Saves, Stocks, and Chat Messages tables for Finverse.

## Prerequisites

- Supabase account (https://supabase.com)
- A Finverse project in Supabase
- Project URL: `https://jswgmgqfksskqhmsinvs.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzd2dtZ3Fma3Nza3FobXNpbnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMTkwNzMsImV4cCI6MjA3OTc5NTA3M30.MqQ1FAi6nG_17z7HAivA4GDCTYORBZCRZ8zvOX4TioA`

## Step 1: Initial Supabase Project Setup

Your Supabase project is already created. Log in to your dashboard at:
- **URL**: https://supabase.com
- **Project**: jswgmgqfksskqhmsinvs

## Step 2: Enable Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Ensure "Email" provider is enabled
3. Go to **Authentication** → **URL Configuration**
4. Set **Site URL** to your app URL:
   - Development: `http://localhost:5173`
   - Production: Your deployed domain
5. Set **Redirect URLs** to:
   - `http://localhost:5173/`
   - `http://localhost:5173/*`
   - Your production domain/*

## Step 3: Create All Tables and Schemas

Go to your Supabase **SQL Editor** and run ALL these queries in order:

### 3.1 Create Updated At Function (Run First)

```sql
-- Create the update_updated_at function (only once)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3.2 Create Profiles Table

```sql
-- Create profiles table
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

-- Create trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
```

### 3.3 Create Game Saves Table

```sql
-- Create game_saves table
CREATE TABLE IF NOT EXISTS game_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Game State
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  current_month INTEGER DEFAULT 1,
  cash_balance DECIMAL(15, 2) DEFAULT 0,
  
  -- Portfolio (JSON format)
  portfolio JSONB DEFAULT '{"sip": 0, "stocks": 0, "gold": 0, "realEstate": 0, "savings": 0}',
  
  -- Achievements
  achievements JSONB DEFAULT '[]',
  
  -- Financial Goals
  financial_goal DECIMAL(15, 2),
  goal_progress DECIMAL(5, 2) DEFAULT 0,
  
  -- Monthly Data
  monthly_investments JSONB DEFAULT '{"sip": 0, "stocks": 0, "gold": 0, "realEstate": 0, "savings": 0}',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  is_latest BOOLEAN DEFAULT TRUE
);

-- Create trigger for game_saves
DROP TRIGGER IF EXISTS update_game_saves_updated_at ON game_saves;
CREATE TRIGGER update_game_saves_updated_at
BEFORE UPDATE ON game_saves
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_game_saves_user_latest ON game_saves(user_id, is_latest);
CREATE INDEX IF NOT EXISTS idx_game_saves_created_at ON game_saves(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_saves_updated_at ON game_saves(updated_at DESC);
```

### 3.4 Create Stocks Table

```sql
-- Create stocks table for storing stock data and user holdings
CREATE TABLE IF NOT EXISTS stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_save_id UUID NOT NULL REFERENCES game_saves(id) ON DELETE CASCADE,
  
  -- Stock Information
  symbol VARCHAR(10) NOT NULL,
  company_name TEXT,
  quantity INTEGER DEFAULT 0,
  buy_price DECIMAL(10, 2) DEFAULT 0,
  current_price DECIMAL(10, 2) DEFAULT 0,
  total_invested DECIMAL(15, 2) DEFAULT 0,
  current_value DECIMAL(15, 2) DEFAULT 0,
  gain_loss DECIMAL(15, 2) DEFAULT 0,
  gain_loss_percentage DECIMAL(5, 2) DEFAULT 0,
  
  -- Stock Market Data
  market_data JSONB DEFAULT '{}',
  price_history JSONB DEFAULT '[]',
  
  -- Metadata
  purchase_date TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create trigger for stocks
DROP TRIGGER IF EXISTS update_stocks_updated_at ON stocks;
CREATE TRIGGER update_stocks_updated_at
BEFORE UPDATE ON stocks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stocks_user_id ON stocks(user_id);
CREATE INDEX IF NOT EXISTS idx_stocks_game_save_id ON stocks(game_save_id);
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_stocks_user_symbol ON stocks(user_id, symbol);
```

### 3.5 Create Chat Messages Table

```sql
-- Create chat_messages table for Aura Twin conversations
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_save_id UUID NOT NULL REFERENCES game_saves(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Message Content
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'ai')), -- 'user' or 'ai'
  content TEXT NOT NULL,
  
  -- Message Metadata
  message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'achievement', 'event', 'advice'
  sentiment VARCHAR(20), -- 'positive', 'neutral', 'negative'
  tags JSONB DEFAULT '[]', -- For categorizing messages
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create trigger for chat_messages
DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages;
CREATE TRIGGER update_chat_messages_updated_at
BEFORE UPDATE ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_game_save ON chat_messages(game_save_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(game_save_id, created_at DESC);
```

## Step 4: Enable Row Level Security (RLS)

### 4.1 Profiles Table RLS

```sql
-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy: Public can view profiles for leaderboard
DROP POLICY IF EXISTS "Public can view profile names for leaderboard" ON profiles;
CREATE POLICY "Public can view profile names for leaderboard"
ON profiles FOR SELECT
USING (TRUE);
```

### 4.2 Game Saves Table RLS

```sql
-- Enable RLS on game_saves
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own game saves
DROP POLICY IF EXISTS "Users can view their own game saves" ON game_saves;
CREATE POLICY "Users can view their own game saves"
ON game_saves FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own game saves
DROP POLICY IF EXISTS "Users can insert their own game saves" ON game_saves;
CREATE POLICY "Users can insert their own game saves"
ON game_saves FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own game saves
DROP POLICY IF EXISTS "Users can update their own game saves" ON game_saves;
CREATE POLICY "Users can update their own game saves"
ON game_saves FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own game saves
DROP POLICY IF EXISTS "Users can delete their own game saves" ON game_saves;
CREATE POLICY "Users can delete their own game saves"
ON game_saves FOR DELETE
USING (auth.uid() = user_id);
```

### 4.3 Stocks Table RLS

```sql
-- Enable RLS on stocks
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own stocks
DROP POLICY IF EXISTS "Users can view their own stocks" ON stocks;
CREATE POLICY "Users can view their own stocks"
ON stocks FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own stocks
DROP POLICY IF EXISTS "Users can insert their own stocks" ON stocks;
CREATE POLICY "Users can insert their own stocks"
ON stocks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own stocks
DROP POLICY IF EXISTS "Users can update their own stocks" ON stocks;
CREATE POLICY "Users can update their own stocks"
ON stocks FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own stocks
DROP POLICY IF EXISTS "Users can delete their own stocks" ON stocks;
CREATE POLICY "Users can delete their own stocks"
ON stocks FOR DELETE
USING (auth.uid() = user_id);
```

### 4.4 Chat Messages Table RLS

```sql
-- Enable RLS on chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own chat messages
DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;
CREATE POLICY "Users can view their own chat messages"
ON chat_messages FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own chat messages
DROP POLICY IF EXISTS "Users can insert their own chat messages" ON chat_messages;
CREATE POLICY "Users can insert their own chat messages"
ON chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own chat messages
DROP POLICY IF EXISTS "Users can update their own chat messages" ON chat_messages;
CREATE POLICY "Users can update their own chat messages"
ON chat_messages FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## Step 5: Database Functions

### 5.1 Auto-Create Profile on Signup

```sql
-- Create function to handle new user signup
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

### 5.2 Function to Get User's Latest Game Save

```sql
-- Get latest game save for a user
CREATE OR REPLACE FUNCTION get_latest_game_save(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  level INTEGER,
  xp INTEGER,
  current_month INTEGER,
  cash_balance DECIMAL,
  portfolio JSONB,
  achievements JSONB,
  financial_goal DECIMAL,
  goal_progress DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gs.id,
    gs.user_id,
    gs.level,
    gs.xp,
    gs.current_month,
    gs.cash_balance,
    gs.portfolio,
    gs.achievements,
    gs.financial_goal,
    gs.goal_progress,
    gs.created_at,
    gs.updated_at
  FROM game_saves gs
  WHERE gs.user_id = user_uuid AND gs.is_latest = TRUE
  ORDER BY gs.updated_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

## Step 6: Database Schema Reference

### 6.1 Profiles Table

```
Column                Type           Description
------                ----           -----------
id                    UUID           User ID (from auth.users)
email                 TEXT           User email (unique)
name                  TEXT           User display name
avatar                VARCHAR(50)    Avatar type (female1, male1, female2, male2, female3, male3)
career                VARCHAR(50)    Career path (Engineer, Designer, CA, Doctor, Sales)
monthly_salary        DECIMAL(12,2)  Monthly salary in rupees
monthly_expenses      DECIMAL(12,2)  Monthly expenses in rupees
created_at            TIMESTAMP      Account creation time
updated_at            TIMESTAMP      Last profile update time
```

### 6.2 Game Saves Table

```
Column                Type           Description
------                ----           -----------
id                    UUID           Game save ID (primary key)
user_id               UUID           Reference to profiles.id
level                 INTEGER        Current game level
xp                    INTEGER        Experience points
current_month         INTEGER        Current game month
cash_balance          DECIMAL(15,2)  Available cash in rupees
portfolio             JSONB          {sip, stocks, gold, realEstate, savings} amounts
achievements          JSONB          Array of achievement objects {id, title, description, icon, unlocked}
financial_goal        DECIMAL(15,2)  Target net worth
goal_progress         DECIMAL(5,2)   Progress toward goal (0-100%)
monthly_investments   JSONB          {sip, stocks, gold, realEstate, savings} monthly amounts
created_at            TIMESTAMP      Save creation time
updated_at            TIMESTAMP      Last save update time
is_latest             BOOLEAN        Whether this is the latest save
```

### 6.3 Stocks Table

```
Column                Type           Description
------                ----           -----------
id                    UUID           Stock holding ID
user_id               UUID           Reference to profiles.id
game_save_id          UUID           Reference to game_saves.id
symbol                VARCHAR(10)    Stock symbol (e.g., RELIANCE, TCS)
company_name          TEXT           Full company name
quantity              INTEGER        Number of shares held
buy_price             DECIMAL(10,2)  Purchase price per share
current_price         DECIMAL(10,2)  Current market price per share
total_invested        DECIMAL(15,2)  Total amount invested
current_value         DECIMAL(15,2)  Current portfolio value
gain_loss             DECIMAL(15,2)  Profit/loss in rupees
gain_loss_percentage  DECIMAL(5,2)   Profit/loss percentage
market_data           JSONB          Market data snapshot {price, change, changePercent}
price_history         JSONB          Array of price updates with timestamps
purchase_date         TIMESTAMP      When stock was purchased
last_updated          TIMESTAMP      Last market data update
created_at            TIMESTAMP      Record creation time
updated_at            TIMESTAMP      Last record update time
```

### 6.4 Chat Messages Table

```
Column                Type           Description
------                ----           -----------
id                    UUID           Message ID
game_save_id          UUID           Reference to game_saves.id
user_id               UUID           Reference to profiles.id
role                  VARCHAR(50)    'user' or 'ai'
content               TEXT           Message content
message_type          VARCHAR(50)    'text', 'achievement', 'event', 'advice'
sentiment             VARCHAR(20)    'positive', 'neutral', 'negative'
tags                  JSONB          Array of tag strings for categorization
created_at            TIMESTAMP      Message creation time
updated_at            TIMESTAMP      Last message update time
```

## Step 7: Environment Variables

Set these in your `.env.local` or Replit Secrets:

```
VITE_SUPABASE_URL=https://jswgmgqfksskqhmsinvs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzd2dtZ3Fma3Nza3FobXNpbnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMTkwNzMsImV4cCI6MjA3OTc5NTA3M30.MqQ1FAi6nG_17z7HAivA4GDCTYORBZCRZ8zvOX4TioA
```

## Step 8: Verification Checklist

After setting up all tables, verify in your Supabase dashboard:

- [ ] Profiles table created with all columns
- [ ] Game Saves table created with all columns
- [ ] Stocks table created with all columns
- [ ] Chat Messages table created with all columns
- [ ] All indexes created successfully
- [ ] RLS enabled on all tables
- [ ] RLS policies configured for all tables
- [ ] Triggers created for updated_at
- [ ] Functions created (handle_new_user, get_latest_game_save)
- [ ] Auth email provider enabled
- [ ] Site URL and Redirect URLs configured

Run this query to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'game_saves', 'stocks', 'chat_messages')
ORDER BY table_name;
```

Should return 4 rows.

## Step 9: Sample Data for Testing

```sql
-- Test data (replace 'your-user-id' with actual auth.users id)
-- Get actual user ID from auth.users table first

-- Insert test profile (only if you have auth user)
-- INSERT INTO profiles (id, email, name, avatar, career, monthly_salary, monthly_expenses)
-- VALUES ('your-user-id', 'test@example.com', 'Test Player', 'male1', 'Engineer', 100000, 50000);

-- Insert test game save
-- INSERT INTO game_saves (user_id, level, xp, cash_balance, financial_goal, portfolio)
-- VALUES ('your-user-id', 5, 1500, 500000, 5000000, '{"sip": 100000, "stocks": 200000, "gold": 50000, "realEstate": 150000, "savings": 100000}');
```

## Step 10: Troubleshooting

### Issue: Can't insert data
**Solution:**
- Check RLS policies are correctly set
- Verify user is authenticated (auth.uid() must work)
- Check user ID matches between auth.users and profiles
- Ensure INSERT policy exists for your table

### Issue: Queries returning empty
**Solution:**
- Verify data exists in table (check in Table Editor)
- Check RLS policies allow SELECT
- Verify auth.uid() matches user_id in record

### Issue: Trigger not updating updated_at
**Solution:**
- Verify trigger is created: `SELECT * FROM pg_trigger WHERE tgname LIKE '%updated_at%'`
- Check function exists: `SELECT * FROM pg_proc WHERE proname = 'update_updated_at'`
- Verify trigger is ON BEFORE UPDATE

### Issue: Performance issues
**Solution:**
- Add indexes on frequently queried columns
- Monitor Supabase dashboard for slow queries
- Consider denormalizing chat_messages into game_saves JSONB if too many queries
- Archive old game saves to maintain performance

## Step 11: Backup and Security

1. **Enable Automatic Backups:**
   - Go to **Database** → **Backups** in Supabase dashboard
   - Enable automatic daily backups

2. **Security Checklist:**
   - Never expose Anon Key in public repos (store in .env)
   - Keep Service Role Key completely secret
   - Always use RLS on production tables
   - Rotate keys periodically (Settings → API)
   - Monitor Supabase logs for unusual activity
   - Limit row size (keep JSONB data reasonable)

3. **Export Data:**
   - Regular exports available in Settings → Database → Backups
   - Use pg_dump for manual backups

## Step 12: API Rate Limits & Quotas

**Supabase Free Tier:**
- Up to 50,000 monthly active users
- 5 GB storage
- Unlimited API calls (fair use)
- 200 MB/month for backups

**For Production:**
- Upgrade to Pro plan: $25/month
- Pro Tier: Up to 100,000 monthly active users
- 500 GB storage
- Higher rate limits

## Step 13: Integration with App

Your app is already configured to use these tables:

1. **client/src/lib/supabase.ts** - Client initialization
2. **Authentication** - Handled via auth.users
3. **Profiles** - User data storage
4. **Game Saves** - Game state persistence
5. **Stocks** - Stock holdings and market data
6. **Chat Messages** - Aura Twin conversations

No additional configuration needed once tables are set up!

---

**Setup Version**: 1.0  
**Last Updated**: November 2025  
**Project**: Finverse Financial Freedom Game  
**Database**: PostgreSQL via Supabase  
**Status**: Production Ready
