# BreakTheRace - Financial Strategy Game

## Overview

BreakTheRace is a single-player financial strategy board game where players escape the "rat race," reach the "fast track," and achieve financial independence. Players roll dice, make strategic investment decisions, and build passive income to win.

## Game Mechanics

### Core Gameplay
- **Career Selection**: Choose from 6 professions (Teacher, Engineer, Doctor, Manager, Accountant, Designer)
- **Board Movement**: Roll 1-6 dice and move clockwise around an 8-space circular board
- **Rat Race Phase**: Escape when passive income ≥ monthly expenses
- **Fast Track Phase**: Win when passive income ≥ monthly expenses + ₹40,00,000

### Board Spaces
1. **Start** - Game start position
2. **Payday** - Receive salary + passive income - expenses
3. **Small Deal** - Buy affordable investments (stocks, small rental, online business)
4. **Big Deal** - Purchase high-value assets (apartments, commercial property, franchises)
5. **Market** - Random market events (stock rally, property boom, crashes, rate changes)
6. **Doodad** - Unexpected expenses (car repair, medical, vacation, home repair)
7. **Charity** - Opportunity spaces
8. **Opportunity** - Special opportunities

### Financial Dashboard (Real-Time)
- **Income**: Salary + Passive Income
- **Expenses**: Monthly living expenses
- **Assets**: Count and details of owned investments
- **Liabilities**: Loans and EMIs
- **Net Cash**: Cash on hand

### Investment System
- **Small Deals**: Low cost (₹5-50K), small passive income (₹500-3K/month)
- **Big Deals** (Fast Track): High cost (₹300K-1M), high passive income (₹25-60K/month)
- **Passive Income**: Accumulates monthly and counts toward escape condition

### Win Condition
Player wins when they click "Buy Your Dream" after reaching:
- Passive income ≥ monthly expenses + ₹40,00,000
- Victory screen displays financial summary

## Game State Schema

```typescript
interface GameState {
  career: Career | null
  boardPosition: number
  dice: number
  cash: number
  passiveIncome: number
  totalExpenses: number
  assets: Asset[]
  liabilities: Liability[]
  onFastTrack: boolean
  hasWon: boolean
  userProfile: { name: string; career: Career }
}
```

## Supabase Integration

- **Persistence**: Game saves to `game_saves` table after each action
- **Leaderboard Sync**: Top players sync with real-time leaderboard (updates every 10 seconds)
- **Save Fields**: 
  - `level`: Number of assets owned + 1
  - `xp`: Passive income / 1000
  - `cash_balance`: Current cash on hand
  - `portfolio`: Asset counts

## Features

### Current Implementation
- ✅ Career selection with 6 professions
- ✅ Circular board with dice rolling (1-6)
- ✅ Card system (Small/Big Deals, Market, Doodads)
- ✅ Real-time financial dashboard
- ✅ Rat race escape animation
- ✅ Fast track mode with 10x multiplier
- ✅ Victory screen with statistics
- ✅ Help/Tutorial modal
- ✅ Leaderboard persistence

### Extra Features (Planned)
- Sound effects for dice rolls and card draws
- Animations on financial updates
- Card pop-up animations
- Celebration effects on milestones

## User Preferences

Preferred communication style: Simple, everyday language.

## Architecture Notes

- **Frontend**: React 18, TypeScript, Wouter for routing
- **UI**: Shadcn components, Tailwind CSS, glassmorphic design
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **State Management**: React hooks + Supabase auto-sync
- **Animations**: Canvas Confetti for celebrations
- **Styling**: Navy/Indigo dark mode (#1A237E primary, #42A5F5 accent)
