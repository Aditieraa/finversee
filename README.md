# 🎮 Finverse - Financial Freedom Game

Welcome to **Finverse**, an immersive neon-themed financial education game where you learn Indian personal finance by playing, investing, and achieving financial freedom with guidance from **Aura Twin**, your AI financial mentor.

## 🌟 Features

### Core Gameplay
- **Career-Based Journey**: Choose from Engineer, Designer, CA, Doctor, or Sales - each with unique salary and expense profiles
- **Monthly Investment Decisions**: Invest in SIP, Stocks, Gold, Real Estate, or Savings
- **Market Simulation**: Realistic returns with volatility:
  - SIP: +0.6% to +1.2% monthly
  - Stocks: -5% to +8% monthly  
  - Gold: -1% to +3% monthly
  - Real Estate: 0% to +1.2% monthly
  - Savings: 0% (safe haven)
- **Random Life Events**: Job Loss, IPO Wins, Medical Emergencies, Promotions, Salary Hikes, Tax Penalties, and more
- **Win/Loss Conditions**: Achieve ₹50 lakh net worth for Financial Freedom or face Bankruptcy

### AI Mentor - Aura Twin
- **Emotional Support**: Warm, encouraging Indian financial coach persona
- **Contextual Advice**: Powered by Google Gemini AI with real-time financial insights
- **Predictive Guidance**: Get suggestions based on your portfolio and decisions
- **Always Available**: Chat anytime for financial wisdom

### Progression System
- **XP & Leveling**: Earn experience points for investments and milestones
- **Daily Login Rewards**: +50 XP daily, with streak bonuses
- **Achievements**: Unlock badges for milestones like "First Investment", "Millionaire", "Diversified Portfolio"
- **Career Upgrades**: Progress through your chosen career path

### Cloud Features (Supabase)
- **Email Authentication**: Secure account creation and login
- **Cloud Saves**: Automatic progress backup every minute
- **Guest Mode**: Play without creating an account (no cloud saves)
- **Cross-Device**: Access your game from anywhere

### Stunning UI
- **Neon Aesthetic**: Futuristic cyber-finance theme with glowing accents
- **Glassmorphic Design**: Blurred panels with depth and transparency
- **Responsive Layout**: 
  - Desktop: 3-column (AI Chat | Dashboard | Portfolio)
  - Mobile: Vertical stack with floating action buttons
- **Smooth Animations**: Pulse glows, slide-ins, and confetti celebrations
- **Dark/Light Theme**: Toggle between dark neon and minimal light themes

## 🚀 Setup Instructions

### 1. Supabase Database Setup

This game requires a Supabase database for authentication and cloud saves.

#### Step 1: Run SQL Setup

1. Go to your Supabase Dashboard
2. Navigate to the **SQL Editor**
3. Open the file `SUPABASE_SETUP.md` in this project
4. Copy the SQL script and run it in your Supabase SQL Editor
5. This creates the `game_saves` table with proper RLS policies

#### Step 2: Enable Authentication

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Enable **Email** provider
3. (Optional) Configure email templates

### 2. Environment Variables

The following environment variables are already configured in Replit:

- `GEMINI_API_KEY` - Your Google AI API key for Aura Twin mentor
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase public anon key

### 3. Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## 🎯 How to Play

### Getting Started
1. **Sign Up or Guest Mode**: Create an account or continue as guest
2. **Choose Career**: Select your profession (affects starting salary/expenses)
3. **Monthly Cycle**:
   - Receive salary
   - Pay expenses
   - Decide investments across 5 categories
   - Get AI advice from Aura Twin
   - Experience random life events
   - Watch your net worth grow (or shrink!)

### Winning Strategy
- **Diversify**: Spread investments across multiple categories
- **Stay Consistent**: Maintain regular SIP contributions
- **Listen to Aura**: The AI mentor provides valuable insights
- **Manage Risk**: Balance volatile stocks with stable investments
- **Build Streaks**: Login daily for bonus XP
- **Unlock Achievements**: Complete milestones for rewards

### Goals
- **Financial Freedom**: Reach ₹50,00,000 net worth
- **Avoid Bankruptcy**: Don't let net worth drop below -₹1,00,000
- **Level Up**: Gain XP to unlock career upgrades
- **Master Finances**: Learn real investing principles through gameplay

## 🎨 Design Philosophy

Finverse combines:
- **Futuristic Aesthetics**: Neon glows, glassmorphism, space-age fonts
- **Educational Value**: Real market volatility, authentic Indian financial scenarios
- **Emotional Engagement**: AI mentor that celebrates wins and supports through losses
- **Gamification**: XP, levels, achievements, daily rewards

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Google Gemini AI
- **Database**: Supabase (PostgreSQL + Authentication)
- **Deployment**: Replit
- **UI Libraries**: Radix UI, Lucide Icons, Canvas Confetti

## 📊 Game Mechanics

### Investment Returns (Monthly)
| Asset Class | Min Return | Max Return | Risk Level |
|-------------|-----------|------------|------------|
| SIP         | +0.6%     | +1.2%      | Low        |
| Stocks      | -5%       | +8%        | High       |
| Gold        | -1%       | +3%        | Medium     |
| Real Estate | 0%        | +1.2%      | Low        |
| Savings     | 0%        | 0%         | Zero       |

### Career Profiles
| Career   | Monthly Salary | Monthly Expenses | Available to Invest |
|----------|---------------|-----------------|---------------------|
| Engineer | ₹80,000       | ₹35,000         | ₹45,000             |
| Designer | ₹60,000       | ₹28,000         | ₹32,000             |
| CA       | ₹90,000       | ₹38,000         | ₹52,000             |
| Doctor   | ₹1,20,000     | ₹45,000         | ₹75,000             |
| Sales    | ₹70,000       | ₹30,000         | ₹40,000             |

### Life Events (Random)
- **Job Loss**: -₹1,50,000 (5% chance)
- **IPO Win**: +₹2,00,000 (8% chance)
- **Medical Emergency**: -₹80,000 (10% chance)
- **Inheritance**: +₹3,00,000 (6% chance)
- **Market Dip**: -₹50,000 (12% chance)
- **Promotion**: +₹50,000 (15% chance)
- **Salary Hike**: +₹30,000 (20% chance)
- **Tax Penalty**: -₹20,000 (8% chance)

## 💡 Educational Value

Finverse teaches:
1. **Diversification**: Spreading risk across asset classes
2. **Systematic Investing**: Benefits of regular SIP contributions
3. **Risk Management**: Balancing volatile vs. stable investments
4. **Emergency Planning**: Preparing for unexpected life events
5. **Long-term Thinking**: Building wealth over time
6. **Market Volatility**: Understanding market ups and downs
7. **Financial Discipline**: Consistent investing habits

## 🎮 Controls & UI

### Desktop
- **Left Panel**: AI Chat with Aura Twin
- **Center Panel**: Dashboard, investment decisions, monthly summary
- **Right Panel**: Portfolio breakdown, achievements

### Mobile
- **Vertical Stack**: All panels stack top to bottom
- **Floating Buttons**: Quick access to decisions and chat

### Keyboard Shortcuts
- **Enter** in chat: Send message to Aura Twin
- **ESC**: Close modals

## 🏆 Achievements

- **First Step**: Make your first investment
- **Millionaire**: Reach ₹10,00,000 net worth
- **Diversified**: Invest in all 5 categories in one month
- **Steady Investor**: Maintain SIP for 6 months
- **Financial Guru**: Reach Level 5
- **Committed**: 7 consecutive daily logins

## 📱 Future Features

Coming soon:
- Multiplayer leaderboard
- Advanced investment options (Crypto, Bonds, Startup Equity)
- Financial education modules
- Voice interaction with Aura Twin
- Historical analytics dashboard
- Tax calculation engine
- Portfolio rebalancing suggestions

## 🤝 Contributing

Finverse is a single-file React application designed for educational purposes. Feel free to fork and customize!

## 📄 License

This project is built for educational purposes.

---

**Made with 💙 in India**

*Play. Learn. Conquer Financial Freedom.*
