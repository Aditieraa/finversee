# BreakTheRace - Updated Supabase Queries

## Current Schema Analysis
Your database has:
- ✅ `profiles` - User profiles (career, salary, expenses)
- ✅ `game_saves` - Game state storage
- ✅ `stocks` - Stock portfolio (not used in game yet)
- ✅ `chat_messages` - Chat system

---

## 📋 REQUIRED UPDATES TO SCHEMA

### 1. Add Missing Columns to `game_saves` Table

```sql
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
```

### 2. Update `profiles` Table (if needed)

```sql
-- Ensure profiles has game-related fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS career VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS monthly_salary NUMERIC;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS monthly_expenses NUMERIC;
```

---

## 🎮 SAVE GAME QUERY (TypeScript/Supabase)

```typescript
// Save game state to Supabase
async function saveGameToSupabase(userId: string, gameState: GameState) {
  const { error } = await supabase
    .from('game_saves')
    .upsert({
      user_id: userId,
      career: gameState.userProfile?.career,
      board_position: gameState.boardPosition,
      dice: gameState.dice,
      cash_balance: gameState.cash,
      passive_income: gameState.passiveIncome,
      total_expenses: gameState.totalExpenses,
      assets: gameState.assets,
      liabilities: gameState.liabilities,
      on_fast_track: gameState.onFastTrack,
      has_won: gameState.hasWon,
      level: gameState.assets.length + 1, // Level = assets owned + 1
      xp: Math.round(gameState.passiveIncome / 1000), // XP = passive income / 1000
      is_latest: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) console.error('Save error:', error);
}
```

---

## 📊 LOAD GAME QUERY (TypeScript/Supabase)

```typescript
// Load latest game state for user
async function loadGameFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from('game_saves')
    .select('*')
    .eq('user_id', userId)
    .eq('is_latest', true)
    .single();

  if (error) {
    console.log('No saved game found');
    return null;
  }

  return {
    career: data.career,
    boardPosition: data.board_position || 0,
    dice: data.dice || 0,
    cash: data.cash_balance || 0,
    passiveIncome: data.passive_income || 0,
    totalExpenses: data.total_expenses || 0,
    assets: data.assets || [],
    liabilities: data.liabilities || [],
    onFastTrack: data.on_fast_track || false,
    hasWon: data.has_won || false,
    userProfile: { name: data.career, career: data.career }
  };
}
```

---

## 🏆 LEADERBOARD QUERY (Real-time)

```typescript
// Get top 10 players by passive income (XP)
async function getLeaderboard() {
  const { data, error } = await supabase
    .from('game_saves')
    .select('user_id, level, xp, passive_income, career, is_latest')
    .eq('is_latest', true)
    .order('xp', { ascending: false })
    .limit(10);

  if (error) console.error('Leaderboard error:', error);
  return data || [];
}

// Real-time leaderboard subscription (updates every 10 seconds)
export function subscribeToLeaderboard(callback: (data: any[]) => void) {
  supabase
    .channel('leaderboard')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'game_saves',
      },
      () => {
        // Debounce leaderboard updates
        setTimeout(() => getLeaderboard().then(callback), 10000);
      }
    )
    .subscribe();
}
```

---

## 👤 PROFILE UPDATE QUERY

```typescript
// Save user profile with game career info
async function saveUserProfile(userId: string, profile: {
  email: string;
  name: string;
  career: Career;
  monthly_salary: number;
  monthly_expenses: number;
}) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...profile,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) console.error('Profile save error:', error);
}
```

---

## 📈 STATISTICS QUERY (Dashboard)

```typescript
// Get all game statistics for user
async function getUserGameStats(userId: string) {
  const { data, error } = await supabase
    .from('game_saves')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return null;

  const latest = data?.[0];
  return {
    totalGamesPlayed: data?.length || 0,
    lastCareer: latest?.career,
    highestPassiveIncome: Math.max(...(data?.map(d => d.passive_income || 0) || [0])),
    totalAssetsOwned: latest?.level - 1 || 0,
    gamesWon: data?.filter(d => d.has_won)?.length || 0,
    currentLevel: latest?.level || 1,
  };
}
```

---

## 🔄 SYNC GAME STATE (on logout/close)

```typescript
// Ensure game is saved before user leaves
async function syncGameBeforeLogout(userId: string, gameState: GameState) {
  await saveGameToSupabase(userId, gameState);
  console.log('Game synced before logout');
}

// Use this in useEffect cleanup
useEffect(() => {
  return () => {
    if (userId && gameState.career) {
      syncGameBeforeLogout(userId, gameState);
    }
  };
}, [userId]);
```

---

## ✅ TABLE STRUCTURE AFTER UPDATES

### game_saves table will have:
| Column | Type | Purpose |
|--------|------|---------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| career | varchar | Current career |
| board_position | int | Current board space |
| dice | int | Last dice roll |
| cash_balance | numeric | Cash on hand |
| passive_income | numeric | Monthly passive income |
| total_expenses | numeric | Monthly expenses + liabilities |
| assets | jsonb | Array of assets owned |
| liabilities | jsonb | Array of liabilities |
| on_fast_track | boolean | Escaped rat race? |
| has_won | boolean | Won the game? |
| level | int | Assets count + 1 |
| xp | int | Passive income / 1000 |
| is_latest | boolean | Latest save? |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

---

## 🚀 IMPLEMENTATION STEPS

1. **Run the schema update SQL** in your Supabase SQL editor
2. **Update the app** to use these queries in `supabase.ts`
3. **Test save/load** by playing a game and checking Supabase
4. **Enable real-time** for leaderboard subscriptions

---

## 📝 NOTES

- **JSONB columns** (assets, liabilities) store complex nested data
- **is_latest flag** helps you query only current game state
- **Leaderboard** ranks by XP (passive income / 1000)
- **Timestamps** auto-update on every save
- All queries include error handling and null checks
