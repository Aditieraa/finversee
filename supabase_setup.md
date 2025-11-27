# Finverse - Supabase Setup Guide

Complete setup guide for Supabase database with Profiles and Game Saves for Finverse.

## Prerequisites

- Supabase account (https://supabase.com)
- A Finverse project in Supabase
- Project URL and Anon Key from Supabase dashboard

## Step 1: Initial Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in details:
   - **Name**: `finverse`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Wait for the project to initialize (5-10 minutes)
5. Once ready, note your:
   - **Project URL** (Settings → API)
   - **Anon Public Key** (Settings → API)
   - **Service Role Key** (Settings → API) - Keep this secret!

## Step 2: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable "Email" provider
3. Go to **Authentication** → **URL Configuration**
4. Set **Site URL** to your app URL (e.g., `http://localhost:5173`)
5. Set **Redirect URLs** to:
   - `http://localhost:5173/` (development)
   - `http://localhost:5173/*` (development)
   - Your production domain when deployed

## Step 3: Create Tables

Go to **SQL Editor** and run these queries:

### 3.1 Create Users/Profiles Table

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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create index on email for faster lookups
CREATE INDEX idx_profiles_email ON profiles(email);
```

### 3.2 Create Game Saves Table

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
  
  -- Portfolio (JSON format for flexibility)
  portfolio JSONB DEFAULT '{"sip": 0, "stocks": 0, "gold": 0, "realEstate": 0, "savings": 0}',
  
  -- Achievements
  achievements JSONB DEFAULT '[]',
  
  -- Financial Goals
  financial_goal DECIMAL(15, 2),
  goal_progress DECIMAL(5, 2) DEFAULT 0,
  
  -- Monthly Data
  monthly_investments JSONB DEFAULT '{"sip": 0, "stocks": 0, "gold": 0, "realEstate": 0, "savings": 0}',
  
  -- Chat/Mentor History
  chat_history JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  is_latest BOOLEAN DEFAULT TRUE
);

-- Create updated_at trigger for game_saves
CREATE TRIGGER update_game_saves_updated_at
BEFORE UPDATE ON game_saves
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create indexes for better query performance
CREATE INDEX idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX idx_game_saves_user_latest ON game_saves(user_id, is_latest);
CREATE INDEX idx_game_saves_created_at ON game_saves(created_at DESC);
```

### 3.3 Create Chat History Table (Optional - for better organization)

```sql
-- Create chat_messages table (optional, for better chat management)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_save_id UUID NOT NULL REFERENCES game_saves(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- 'user' or 'ai'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_chat_messages_game_save ON chat_messages(game_save_id);
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
```

## Step 4: Set Row Level Security (RLS) Policies

Enable RLS and create policies:

### 4.1 Profiles Table Policies

```sql
-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile (during signup)
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy: Allow public read for leaderboard (names only, optional)
CREATE POLICY "Public can view profile names for leaderboard"
ON profiles FOR SELECT
USING (TRUE);
```

### 4.2 Game Saves Table Policies

```sql
-- Enable RLS on game_saves
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own game saves
CREATE POLICY "Users can view their own game saves"
ON game_saves FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own game saves
CREATE POLICY "Users can insert their own game saves"
ON game_saves FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own game saves
CREATE POLICY "Users can update their own game saves"
ON game_saves FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own game saves
CREATE POLICY "Users can delete their own game saves"
ON game_saves FOR DELETE
USING (auth.uid() = user_id);
```

### 4.3 Chat Messages Table Policies (Optional)

```sql
-- Enable RLS on chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own chat messages
CREATE POLICY "Users can view their own chat messages"
ON chat_messages FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own chat messages
CREATE POLICY "Users can insert their own chat messages"
ON chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## Step 5: Database Schema Reference

### Profiles Table

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

### Game Saves Table

```
Column                Type           Description
------                ----           -----------
id                    UUID           Game save ID (primary key)
user_id               UUID           Reference to profiles.id
level                 INTEGER        Current game level
xp                    INTEGER        Experience points
current_month         INTEGER        Current game month
cash_balance          DECIMAL(15,2)  Available cash in rupees
portfolio             JSONB          Investment portfolio breakdown
achievements          JSONB          Array of unlocked achievements
financial_goal        DECIMAL(15,2)  Target net worth
goal_progress         DECIMAL(5,2)   Progress toward goal (0-100%)
monthly_investments   JSONB          Monthly investment breakdown
chat_history          JSONB          Array of chat messages with Aura Twin
created_at            TIMESTAMP      Save creation time
updated_at            TIMESTAMP      Last save update time
is_latest             BOOLEAN        Whether this is the latest save
```

### Chat Messages Table (Optional)

```
Column                Type           Description
------                ----           -----------
id                    UUID           Message ID
game_save_id          UUID           Reference to game_saves.id
user_id               UUID           Reference to profiles.id
role                  VARCHAR(50)    'user' or 'ai'
content               TEXT           Message content
created_at            TIMESTAMP      Message creation time
```

## Step 6: Set Environment Variables

Add these to your `.env.local` or Replit secrets:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**For server-side** (if needed):
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (DO NOT expose to frontend)
```

## Step 7: Database Function for Auto-Profile Creation

Create a trigger to automatically create a profile when a user signs up:

```sql
-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar', 'female1')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

## Step 8: Verify Setup

1. Go to **Table Editor** in Supabase dashboard
2. Verify you can see:
   - `profiles` table
   - `game_saves` table
   - `chat_messages` table (if created)
3. Go to **Authentication** and verify auth providers are enabled
4. Test creating a user through your app's signup flow

## Sample Data (For Testing)

Run in SQL Editor to add test data:

```sql
-- Note: Replace 'test-user-id' with an actual user ID from auth.users
-- This is just for reference

INSERT INTO profiles (id, email, name, avatar, career, monthly_salary, monthly_expenses)
VALUES (
  'test-user-id',
  'test@example.com',
  'Test Player',
  'male1',
  'Engineer',
  100000,
  50000
);

INSERT INTO game_saves (user_id, level, xp, cash_balance, financial_goal)
VALUES (
  'test-user-id',
  1,
  0,
  100000,
  5000000
);
```

## Troubleshooting

### Can't insert data
- Check RLS policies are correctly set
- Verify user is authenticated
- Check user ID matches

### Queries returning empty
- Verify data exists in tables
- Check RLS policies allow SELECT
- Verify auth.uid() is working

### Performance issues
- Check indexes are created
- Consider adding more indexes on frequently queried columns
- Monitor query performance in Supabase dashboard

## Backup and Recovery

1. Go to **Database** → **Backups** in Supabase dashboard
2. Enable automatic daily backups
3. Store service role key securely
4. Regularly export data for backup

## Security Best Practices

1. **Never expose Service Role Key** - Only use Anon Key in frontend
2. **Keep RLS enabled** - Always use Row Level Security
3. **Use environment variables** - Never hardcode API keys
4. **Rotate keys periodically** - Go to Settings → API to rotate keys
5. **Monitor access** - Check Supabase logs for suspicious activity
6. **Backup regularly** - Enable automatic backups in Supabase

## Migration from In-Memory Storage

If you're migrating from in-memory storage:

1. Export game data from current storage
2. Transform data to match Supabase schema
3. Bulk insert using SQL or API
4. Test thoroughly before going live
5. Keep old storage as backup temporarily

## API Rate Limits

Supabase free tier includes:
- Up to 50,000 monthly active users
- 5 GB storage
- Unlimited API calls (with fair use policy)
- 200 MB/month for free tier

For production, upgrade to paid plan for higher limits.

---

**Last Updated**: November 2025
**Version**: 1.0
