import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Target, TrendingUp, Heart, PiggyBank } from 'lucide-react';

interface NextStepWidgetProps {
  financialHealth: number;
  emergencyFundLevel: number;
  savingsRate: number;
  portfolioPercentage: number;
  onTakeAction?: () => void;
}

export function NextStepWidget({
  financialHealth,
  emergencyFundLevel,
  savingsRate,
  portfolioPercentage,
  onTakeAction = () => {},
}: NextStepWidgetProps) {
  // Determine the most urgent recommendation based on financial metrics
  const getRecommendation = () => {
    if (emergencyFundLevel < 30) {
      return {
        icon: Heart,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        title: 'Emergency Fund Low',
        description: 'Build your safety net with 3-6 months of expenses saved.',
        action: 'Set Up Emergency Fund',
        priority: 'critical',
      };
    }
    if (savingsRate < 20) {
      return {
        icon: PiggyBank,
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        title: 'Savings Rate Low',
        description: 'Aim for 20-30% monthly savings to accelerate wealth growth.',
        action: 'Create Savings Goal',
        priority: 'warning',
      };
    }
    if (portfolioPercentage < 40) {
      return {
        icon: TrendingUp,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        title: 'Diversify Your Portfolio',
        description: 'Invest 40%+ of net worth across multiple asset classes for growth.',
        action: 'Start Investing',
        priority: 'moderate',
      };
    }
    if (financialHealth > 75) {
      return {
        icon: Target,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        title: 'Excellent Progress!',
        description: 'You are on track for financial freedom. Keep maintaining this momentum.',
        action: 'View Milestones',
        priority: 'success',
      };
    }
    return {
      icon: Target,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      title: 'Next Goal',
      description: 'Continue building wealth with consistent investing habits.',
      action: 'View Goals',
      priority: 'info',
    };
  };

  const recommendation = getRecommendation();
  const Icon = recommendation.icon;

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'warning':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'success':
        return 'bg-green-500/20 text-green-300 border-green-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <Card
      className={`${recommendation.bgColor} border ${recommendation.borderColor} backdrop-blur-sm p-5 shadow-card card-interactive overflow-hidden relative`}
    >
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 opacity-30 animate-pulse pointer-events-none" style={{
        background: `radial-gradient(circle at top right, ${recommendation.color}, transparent)`,
      }} />

      <div className="relative z-10 space-y-3">
        {/* Header with Icon and Priority Badge */}
        <div className="flex items-start justify-between gap-3">
          <Icon className={`h-6 w-6 ${recommendation.color} flex-shrink-0 mt-0.5`} />
          <Badge className={`${getPriorityBadgeVariant(recommendation.priority)} text-xs font-semibold`}>
            {recommendation.priority === 'critical' ? '🔴 Critical' : recommendation.priority === 'warning' ? '⚠️ Warning' : recommendation.priority === 'success' ? '✓ Great' : 'Info'}
          </Badge>
        </div>

        {/* Title and Description */}
        <div>
          <h3 className={`text-lg font-bold ${recommendation.color} mb-1`}>
            {recommendation.title}
          </h3>
          <p className="text-sm text-blue-200/70 leading-relaxed">
            {recommendation.description}
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onTakeAction}
          className={`w-full text-sm font-semibold h-9 transition-all rounded-lg ${
            recommendation.priority === 'critical'
              ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
              : recommendation.priority === 'warning'
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600'
              : recommendation.priority === 'success'
              ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
              : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
          }`}
          data-testid="button-next-step-action"
        >
          {recommendation.action}
        </Button>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between text-xs text-blue-200/60 pt-2 border-t border-white/10">
          <span>Financial Health</span>
          <span className="font-semibold text-blue-300">{Math.round(financialHealth)}%</span>
        </div>
      </div>
    </Card>
  );
}
