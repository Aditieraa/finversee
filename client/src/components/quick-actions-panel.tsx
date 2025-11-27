import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Coins, Zap, Target } from 'lucide-react';

interface QuickActionsProps {
  onInvest?: () => void;
  onBuyStock?: () => void;
  onSavings?: () => void;
  onGoals?: () => void;
}

export function QuickActionsPanel({ onInvest, onBuyStock, onSavings, onGoals }: QuickActionsProps) {
  return (
    <Card className="border-blue-400/20 bg-blue-950/40 backdrop-blur-sm p-6 shadow-card">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-blue-400" />
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={onInvest}
          variant="default"
          className="gap-2 h-11 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-card hover-elevate"
          data-testid="button-invest"
        >
          <Plus className="h-4 w-4" />
          Start Investing
        </Button>

        <Button
          onClick={onBuyStock}
          variant="default"
          className="gap-2 h-11 text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-card hover-elevate"
          data-testid="button-buy-stock"
        >
          <TrendingUp className="h-4 w-4" />
          Buy Stock
        </Button>

        <Button
          onClick={onSavings}
          variant="default"
          className="gap-2 h-11 text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-card hover-elevate"
          data-testid="button-add-savings"
        >
          <Coins className="h-4 w-4" />
          Add Savings
        </Button>

        <Button
          onClick={onGoals}
          variant="default"
          className="gap-2 h-11 text-sm font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-card hover-elevate"
          data-testid="button-set-goals"
        >
          <Target className="h-4 w-4" />
          Set Goals
        </Button>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-200/80">
          💡 <span className="font-semibold">Pro Tip:</span> Diversify your portfolio across multiple asset classes for better risk management.
        </p>
      </div>
    </Card>
  );
}
