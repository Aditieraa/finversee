import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Sparkles, Zap, Settings, LayoutDashboard, TrendingUp, DollarSign, Users } from 'lucide-react';

// Format net worth with intelligent unit selection
const formatNetWorth = (value: number): string => {
  if (value >= 10000000) {
    // Crores (1 Cr = 10,000,000)
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    // Lakhs (1 L = 100,000)
    return `₹${(value / 100000).toFixed(1)}L`;
  } else {
    // Regular format with commas
    return `₹${Math.round(value).toLocaleString('en-IN')}`;
  }
};

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

interface AppHeaderProps {
  level: number;
  xp: number;
  netWorth: number;
  userName?: string;
  userAvatar?: string;
  tabs?: Tab[];
  onAuraTwin?: () => void;
  onProfile?: () => void;
}

export function AppHeader({ 
  level, 
  xp, 
  netWorth, 
  userName, 
  userAvatar,
  tabs = [],
  onAuraTwin = () => {},
  onProfile = () => {},
}: AppHeaderProps) {
  const xpForNextLevel = level * 1000;
  const xpProgress = (xp % xpForNextLevel) / xpForNextLevel * 100;
  
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-950/95 to-blue-900/90 backdrop-blur-md border-b border-blue-400/20 shadow-lg">
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Branding */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="relative">
            <Sparkles className="h-5 w-5 text-blue-400 animate-glow" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent hidden sm:inline">
            Finverse
          </h1>
        </div>

        {/* Center-Left: Navigation Tabs */}
        {tabs.length > 0 && (
          <div className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={tab.active ? 'default' : 'ghost'}
                size="sm"
                onClick={tab.onClick}
                className="flex items-center gap-1.5 whitespace-nowrap text-xs px-2.5 py-1 h-7"
                data-testid={`button-tab-${tab.id}`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Center: Gamification Status */}
        <div className="hidden lg:flex items-center gap-3 flex-grow justify-center">
          {/* Level Badge with Trophy */}
          <Badge className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white flex items-center gap-1 px-2.5 py-0.5 shadow-card text-xs">
            <Trophy className="h-3 w-3" />
            <span className="font-bold">L{level}</span>
          </Badge>

          {/* XP Progress Bar */}
          <div className="w-28">
            <div className="flex items-center gap-1 mb-0.5">
              <Star className="h-3 w-3 text-yellow-400 animate-bounceUp" />
              <span className="text-xs text-yellow-200 font-semibold">XP</span>
            </div>
            <div className="w-full h-1.5 bg-blue-900/50 rounded-full overflow-hidden border border-blue-400/30 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Net Worth Display + Buttons + Avatar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Net Worth (hidden on mobile) */}
          <div className="text-right hidden md:block">
            <p className="text-xs text-blue-200/70 font-semibold uppercase tracking-wide">NET WORTH</p>
            <p className="text-sm font-black text-green-400 animate-countUp">
              {formatNetWorth(netWorth)}
            </p>
          </div>

          {/* Status Badge */}
          <Badge className="bg-green-500/20 text-green-300 border-green-500/40 text-xs font-semibold px-2 py-0.5 flex items-center gap-1">
            {netWorth > 5000000 ? 'Elite' : netWorth > 1000000 ? 'Rising' : 'Growing'}
          </Badge>

          {/* Aura Twin Button */}
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-300 hover:bg-blue-500/20 text-xs px-2.5 py-1 h-7 hidden sm:flex"
            onClick={onAuraTwin}
            data-testid="button-aura-twin"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span className="hidden lg:inline">Aura Twin</span>
          </Button>

          {/* Profile Button */}
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-300 hover:bg-blue-500/20 text-xs px-2.5 py-1 h-7"
            onClick={onProfile}
            data-testid="button-profile"
          >
            <Settings className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">{userName || 'Profile'}</span>
          </Button>

          {/* User Avatar */}
          {userAvatar && (
            <div className="w-9 h-9 rounded-md overflow-hidden border-2 border-green-400/60 flex-shrink-0 shadow-lg hover:shadow-green-500/30 transition-shadow">
              <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
