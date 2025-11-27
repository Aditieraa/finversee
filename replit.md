# Finverse - Financial Freedom Game

## Overview

Finverse is an immersive financial education game that teaches Indian personal finance through interactive gameplay. Players choose a career path, make monthly investment decisions, and work towards achieving financial freedom (₹50 lakh net worth) while learning from an AI mentor called Aura Twin.

The game simulates realistic market conditions with volatility across multiple investment types (SIP, Stocks, Gold, Real Estate, Savings) and features random life events like job loss, promotions, and medical emergencies. Players progress through a leveling system, unlock achievements, and compete on global leaderboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript using functional components and hooks
- Vite as the build tool and development server
- Single-page application (SPA) with wouter for lightweight routing
- TanStack Query (React Query) for server state management
- Tailwind CSS for styling with custom design tokens

**UI Component System**
- Radix UI primitives for accessible, unstyled components
- Custom component library built with shadcn/ui patterns
- Class Variance Authority (CVA) for component variants
- Responsive design with mobile-first approach

**Design System**
- Navy/Indigo color scheme with vibrant accent colors
- Dark mode as primary theme with glassmorphic card designs
- Neon aesthetic with glowing accents and smooth animations
- Custom animations for level-ups, celebrations, and transitions
- Recharts for data visualization (line charts, area charts, pie charts, bar charts)

**State Management Strategy**
- Local React state for UI interactions
- Supabase real-time subscriptions for cloud data
- Session storage for guest mode gameplay
- Auto-save mechanism (1-minute intervals for authenticated users)

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- Separate entry points for development (index-dev.ts) and production (index-prod.ts)
- Custom logging and request tracking middleware

**API Design**
- RESTful endpoints for AI chat and stock data
- POST `/api/ai/chat` - Gemini AI integration for financial advice
- GET `/api/stocks/:symbol` - Individual stock price lookup
- POST `/api/stocks` - Bulk stock price fetching

**Business Logic**
- Server-side stock price caching (5-minute TTL) to respect API rate limits
- Game state simulation runs client-side
- AI mentor responses generated server-side via Google Gemini
- Multi-language support detection (English, Hindi, Marathi, German)

### Data Storage Solutions

**Primary Database: Supabase (PostgreSQL)**

Tables:
- `profiles` - User profile data (name, career, email, avatar)
- `game_saves` - Game state snapshots (portfolio, cash, achievements, chat history)
- Row Level Security (RLS) policies for user data isolation
- Automatic timestamp triggers via `update_updated_at()` function

**Authentication**
- Supabase Auth with email/password
- Guest mode support (no cloud saves)
- Session management via Supabase client

**Cloud Save System**
- Automatic save every 60 seconds for logged-in users
- Manual save/load functionality
- Latest save tracking via `is_latest` boolean flag
- Leaderboard scores indexed for performance

### External Dependencies

**AI Integration**
- Google Gemini API (`@google/genai`) for contextual financial advice
- Environment variable: `GEMINI_API_KEY`
- Custom markdown cleaning for consistent formatting
- Emotional, supportive financial coach persona

**Stock Market Data**
- Multiple provider support: Finnhub (recommended), Alpha Vantage, Polygon.io
- All have free tier options
- In-memory caching with 5-minute TTL
- Fallback to mock data generation if API unavailable
- Support for Indian stocks (RELIANCE, INFY, TCS, HDFC, ICICI) and global stocks

**Database**
- Supabase for PostgreSQL database and authentication
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Real-time subscriptions capability (not currently utilized)

**UI Libraries**
- Radix UI component primitives (18+ components)
- Recharts for financial data visualization
- canvas-confetti for celebration animations
- Lucide React for iconography

**Development Tools**
- Drizzle Kit for database schema management (configured but not actively used)
- TypeScript for type safety
- ESBuild for production bundling
- TSX for development server with hot reload

**Deployment Considerations**
- Built for Replit deployment
- Environment-based configuration
- Static asset serving from `/public` directory
- Client build outputs to `dist/public`, server to `dist/index.js`