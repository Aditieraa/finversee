import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Zap } from 'lucide-react';

interface LevelUpCelebrationProps {
  level: number;
  isVisible: boolean;
  onClose: () => void;
}

export function LevelUpCelebration({ level, isVisible, onClose }: LevelUpCelebrationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <Card className="bg-gradient-to-br from-green-500/80 to-emerald-600/80 border-green-300/50 backdrop-blur-md p-8 shadow-2xl animate-levelUpPop">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <Trophy className="h-16 w-16 text-yellow-300 animate-bounceUp" />
            <Star className="absolute top-0 right-0 h-6 w-6 text-yellow-200 animate-glow" />
            <Star className="absolute bottom-0 left-0 h-6 w-6 text-yellow-200 animate-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-2">LEVEL UP!</h2>
            <p className="text-2xl font-bold text-yellow-100">You reached Level {level}</p>
          </div>
          <div className="flex gap-2 mt-2">
            <Zap className="h-5 w-5 text-yellow-300 animate-pulse" />
            <span className="text-sm text-green-100 font-semibold">Keep up the great work!</span>
            <Zap className="h-5 w-5 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  );
}
