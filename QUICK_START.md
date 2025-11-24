# 🚀 Finverse - Quick Start Guide

**Your neon-themed financial freedom game is ready to play!**

## Step 1: Play the Game Right Now ✅
The app is **already running** at your Replit URL. You can:
- **Sign up** with email/password
- **Play as guest** (no account needed - but progress won't be saved)
- Start your financial journey immediately!

## Step 2: Enable Cloud Saves (Optional but Recommended)

To save your progress to the cloud and see the leaderboard:

### 2.1 Go to Supabase Dashboard
1. Visit https://supabase.com and sign in
2. Open your **Finverse** project
3. Click **SQL Editor**

### 2.2 Run the Setup Script
Copy and paste this SQL into the SQL Editor and click **Run**:

```sql
-- Enable Row Level Security
CREATE TABLE IF NOT EXISTS game_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_state JSONB NOT NULL,
  chat_history JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  leaderboard_score BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_game_saves_leaderboard ON game_saves(leaderboard_score DESC);

ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own save"
  ON game_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own save"
  ON game_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own save"
  ON game_saves FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own save"
  ON game_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view leaderboard"
  ON game_saves FOR SELECT
  USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_game_saves_updated_at
  BEFORE UPDATE ON game_saves
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

✅ **Done!** Cloud saves now work. Sign in, play, and your progress saves automatically!

## 🎮 How to Play

1. **Choose Your Career**: Engineer, Designer, CA, Doctor, or Sales (each has different starting salary)
2. **Each Month**:
   - Earn salary
   - Pay expenses  
   - Decide how much to invest in: SIP, Stocks, Gold, Real Estate, or Savings
3. **Chat with Aura Twin**: Ask your AI financial mentor for advice
4. **Manage Random Events**: Promotions, emergencies, market dips, inheritances, etc.
5. **Build Your Wealth**: Watch your net worth grow month after month
6. **Win Condition**: Reach ₹50,00,000 net worth for Financial Freedom!

## 🎯 Game Features

✨ **AI Mentor** - Real financial advice from Google Gemini  
📈 **Market Simulation** - Realistic investment returns  
🏆 **Achievements** - Unlock badges for milestones  
⭐ **Leaderboard** - Compete with other players  
💰 **5 Asset Classes** - SIP, Stocks, Gold, Real Estate, Savings  
🎪 **Random Events** - Life happens! Handle job loss, promotions, emergencies  
📊 **XP & Leveling** - Progress through levels  
☁️ **Cloud Saves** - Play from any device  

## 🎨 UI Highlights

- **Neon Cyber-Finance Theme** - Glowing cyan, purple, pink, lime colors
- **3-Column Desktop Layout** - AI Chat | Dashboard | Portfolio/Leaderboard
- **Mobile Responsive** - Perfect on phones and tablets
- **Dark/Light Theme** - Toggle your preference
- **Smooth Animations** - Confetti on wins, pulse glows, smooth transitions

## 📱 Career Salaries

| Career   | Salary    | Expenses  | To Invest |
|----------|-----------|-----------|-----------|
| Engineer | ₹80,000   | ₹35,000   | ₹45,000   |
| Designer | ₹60,000   | ₹28,000   | ₹32,000   |
| CA       | ₹90,000   | ₹38,000   | ₹52,000   |
| Doctor   | ₹1,20,000 | ₹45,000   | ₹75,000   |
| Sales    | ₹70,000   | ₹30,000   | ₹40,000   |

## 💡 Pro Tips

- **Diversify**: Spread investments across asset classes
- **Stay Consistent**: Regular SIP investments compound over time
- **Listen to Aura**: The AI mentor gives valuable insights
- **Balance Risk**: Mix stable (SIP, Gold) with volatile (Stocks)
- **Check Leaderboard**: See how you rank against other players
- **Daily Logins**: +50 XP every day!

## 🆘 Troubleshooting

**"Save Failed" message?**  
→ Make sure you've run the SQL setup in Supabase (Step 2)

**"AI connection error"?**  
→ The game still works with fallback responses. Aura Twin will still help!

**Progress not saving?**  
→ Make sure you're signed in (not guest mode)

## 📞 Support

All code is self-contained in `/client/src/pages/finquest.tsx` - a single React file with 1000+ lines of beautiful, documented code.

**Happy playing! Achieve financial freedom! 🚀**

---

*Made with 💙 in India*  
*Play. Learn. Conquer Financial Freedom.*
