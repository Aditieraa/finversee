import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Star, Sparkles } from 'lucide-react';

interface AppHeaderProps {
  level: number;
  xp: number;
  netWorth: number;
  userName?: string;
  userAvatar?: string;
}

export function AppHeader({ level, xp, netWorth, userName, userAvatar }: AppHeaderProps) {
  const xpForNextLevel = level * 1000;
  const xpProgress = (xp % xpForNextLevel) / xpForNextLevel * 100;
  
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-950/90 to-blue-900/80 backdrop-blur-md border-b border-blue-400/20 shadow-lg">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-blue-400 animate-glow" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
            Finverse
          </h1>
        </div>

        {/* Center: Gamification Status */}
        <div className="hidden lg:flex items-center gap-8 flex-grow justify-center">
          {/* Level Badge with Trophy */}
          <Badge className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white flex items-center gap-1.5 px-3 py-1.5 shadow-card">
            <Trophy className="h-4 w-4" />
            <span className="font-bold">Level {level}</span>
          </Badge>

          {/* XP Progress Bar */}
          <div className="w-48">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-yellow-400 animate-bounceUp" />
              <span className="text-xs text-yellow-200 font-semibold">Experience</span>
            </div>
            <div className="w-full h-2.5 bg-blue-900/50 rounded-full overflow-hidden border border-blue-400/30 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-blue-200/60 mt-1 text-center">{((xp % xpForNextLevel) / 1000).toFixed(1)}K / {(xpForNextLevel / 1000).toFixed(0)}K XP</p>
          </div>
        </div>

        {/* Right: Net Worth Display (Gamified Status) + Avatar */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-blue-200/70 font-semibold uppercase tracking-wide">Net Worth</p>
            <p className="text-xl font-black text-green-400 animate-countUp">
              ₹{Math.round(netWorth / 100000).toFixed(1)}L
            </p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-blue-400/20" />
          <Badge className="bg-green-500/20 text-green-300 border-green-500/40 text-xs font-semibold px-2 py-1">
            {netWorth > 5000000 ? '🔥 Elite' : netWorth > 1000000 ? '⭐ Rising' : '📈 Growing'}
          </Badge>
          {userAvatar && (
            <div className="w-9 h-11 rounded-md overflow-hidden border border-blue-400/40 flex-shrink-0">
              <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
