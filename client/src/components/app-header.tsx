import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Star } from 'lucide-react';

interface AppHeaderProps {
  level: number;
  xp: number;
  netWorth: number;
  userName?: string;
}

export function AppHeader({ level, xp, netWorth, userName }: AppHeaderProps) {
  const xpForNextLevel = level * 1000;
  const xpProgress = (xp % xpForNextLevel) / xpForNextLevel * 100;
  
  return (
    <header className="sticky top-0 z-50 bg-blue-950/80 backdrop-blur-md border-b border-blue-400/20 shadow-lg">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-400 animate-pulse" />
          <h1 className="text-xl font-bold text-white">Finverse</h1>
        </div>

        {/* Center: Gamification Status */}
        <div className="hidden md:flex items-center gap-6">
          {/* Level Badge */}
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/80 hover:bg-purple-500 text-white flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" />
              Level {level}
            </Badge>
          </div>

          {/* XP Progress Bar */}
          <div className="w-40">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-xs text-yellow-200/80 font-semibold">XP</span>
            </div>
            <div className="w-full h-2 bg-blue-900/50 rounded-full overflow-hidden border border-blue-400/20">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 animate-fadeIn"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-blue-200/60 mt-1">{(xp % xpForNextLevel).toLocaleString()} / {xpForNextLevel.toLocaleString()}</p>
          </div>
        </div>

        {/* Right: Net Worth Display */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="text-right">
            <p className="text-xs text-blue-200/60 font-semibold">NET WORTH</p>
            <p className="text-lg font-bold text-green-400 animate-countUp">
              ₹{Math.round(netWorth).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
