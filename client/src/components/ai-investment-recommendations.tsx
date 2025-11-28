import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Lightbulb, Loader2, Target, AlertCircle } from 'lucide-react';

interface Recommendation {
  title: string;
  description: string;
  expectedReturn: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  minimumInvestment: number;
  reason: string;
}

interface AIInvestmentRecommendationsProps {
  gameState: any;
}

export function AIInvestmentRecommendations({ gameState }: AIInvestmentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const salary = gameState.userProfile?.salary || 0;
  const expenses = gameState.userProfile?.expenses || 0;
  const cashBalance = gameState.cashBalance || 0;
  const passiveIncome = gameState.passiveIncome || 0;
  const monthlyExpenses = gameState.monthlyExpensesThisMonth || expenses;

  // Calculate investor profile metrics
  const monthlySavings = salary - monthlyExpenses;
  const availableCash = cashBalance;
  const savingsRate = salary > 0 ? (monthlySavings / salary) * 100 : 0;
  const investmentCapacity = Math.floor(availableCash * 0.3); // Can invest 30% of cash

  // Generate default recommendations (fallback if API call fails)
  const getDefaultRecommendations = (): Recommendation[] => {
    const defaults: Recommendation[] = [];

    // 1. Emergency Fund Check
    if (availableCash < monthlyExpenses * 3) {
      defaults.push({
        title: '🏦 Build Emergency Fund',
        description: `Create a safety net of ₹${Math.round(monthlyExpenses * 3).toLocaleString('en-IN')}. Currently: ₹${Math.round(availableCash).toLocaleString('en-IN')}`,
        expectedReturn: 'Safety (5-6% in savings account)',
        riskLevel: 'Low',
        minimumInvestment: monthlyExpenses * 3 - availableCash,
        reason: 'Essential for financial stability',
      });
    }

    // 2. Index Funds for Steady Growth
    if (investmentCapacity > 50000) {
      defaults.push({
        title: '📈 Nifty 50 Index Funds',
        description: 'Diversified equity investment tracking Indian market',
        expectedReturn: '8-12% annually',
        riskLevel: 'Medium',
        minimumInvestment: 5000,
        reason: `With ₹${monthlySavings.toLocaleString('en-IN')}/month savings, you can build long-term wealth`,
      });
    }

    // 3. Debt Reduction Priority
    if (expenses > salary * 0.6) {
      defaults.push({
        title: '🛡️ Reduce Expenses First',
        description: 'Focus on reducing your expense-to-income ratio before aggressive investing',
        expectedReturn: 'Guaranteed savings',
        riskLevel: 'Low',
        minimumInvestment: 0,
        reason: `Your expense ratio is ${((expenses / salary) * 100).toFixed(0)}%. Ideal is <50%`,
      });
    }

    // 4. SIPs (Systematic Investment Plan)
    if (monthlySavings > 10000) {
      defaults.push({
        title: '💰 SIP in Mutual Funds',
        description: `Invest ₹${Math.round(monthlySavings * 0.5).toLocaleString('en-IN')}/month through SIPs`,
        expectedReturn: '10-15% annually',
        riskLevel: 'Medium',
        minimumInvestment: 5000,
        reason: 'Disciplined investing with rupee-cost averaging',
      });
    }

    // 5. High-Risk High-Reward (if good financial health)
    if (availableCash > monthlyExpenses * 6 && savingsRate > 30) {
      defaults.push({
        title: '🚀 Growth Stocks Portfolio',
        description: 'Allocate 10-15% to high-growth tech/pharma stocks',
        expectedReturn: '15-25% annually',
        riskLevel: 'High',
        minimumInvestment: 50000,
        reason: `Your strong savings rate (${savingsRate.toFixed(0)}%) supports higher risk`,
      });
    }

    // 6. Passive Income Stream
    if (passiveIncome < salary * 0.1) {
      defaults.push({
        title: '🎯 Build Passive Income',
        description: `Current passive income: ₹${passiveIncome.toLocaleString('en-IN')}. Target: ₹${Math.round(salary * 0.1).toLocaleString('en-IN')}/month`,
        expectedReturn: 'Recurring monthly income',
        riskLevel: 'Medium',
        minimumInvestment: 100000,
        reason: 'Creates financial freedom and reduces job dependency',
      });
    }

    return defaults.slice(0, 5); // Show top 5 recommendations
  };

  // Fetch AI recommendations from Gemini
  const fetchAIRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `You are a financial AI advisor. Based on this profile, provide 5 specific investment recommendations:

Profile:
- Monthly Salary: ₹${salary.toLocaleString('en-IN')}
- Monthly Expenses: ₹${monthlyExpenses.toLocaleString('en-IN')}
- Monthly Savings: ₹${monthlySavings.toLocaleString('en-IN')}
- Cash Available: ₹${availableCash.toLocaleString('en-IN')}
- Passive Income: ₹${passiveIncome.toLocaleString('en-IN')}
- Savings Rate: ${savingsRate.toFixed(1)}%

For each recommendation provide JSON format:
{
  "title": "Investment Name",
  "description": "2-3 sentence explanation",
  "expectedReturn": "X-Y% annually or timeframe",
  "riskLevel": "Low/Medium/High",
  "minimumInvestment": number,
  "reason": "Why this for this profile"
}

Provide exactly 5 recommendations. Return as JSON array.`;

      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      } else {
        setRecommendations(getDefaultRecommendations());
      }
    } catch (err) {
      console.error('AI recommendation error:', err);
      setRecommendations(getDefaultRecommendations());
    } finally {
      setLoading(false);
    }
  };

  // Load recommendations on mount or when financial profile changes
  useEffect(() => {
    fetchAIRecommendations();
  }, [salary, monthlySavings, cashBalance]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'High':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <Card className="border-indigo-400/30 bg-gradient-to-br from-indigo-950/60 to-blue-950/40 backdrop-blur-sm p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-indigo-400" />
          AI Investment Recommendations
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchAIRecommendations}
          disabled={loading}
          className="text-xs h-8"
          data-testid="button-refresh-recommendations"
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="h-3 w-3 mr-1" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Profile Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 pb-6 border-b border-indigo-400/20">
        <div className="p-3 bg-indigo-900/30 rounded-lg border border-indigo-400/20">
          <p className="text-xs text-indigo-200/60 mb-1">Monthly Savings</p>
          <p className="text-lg font-bold text-indigo-300">₹{Math.round(monthlySavings).toLocaleString('en-IN')}</p>
        </div>
        <div className="p-3 bg-indigo-900/30 rounded-lg border border-indigo-400/20">
          <p className="text-xs text-indigo-200/60 mb-1">Savings Rate</p>
          <p className="text-lg font-bold text-indigo-300">{savingsRate.toFixed(1)}%</p>
        </div>
        <div className="p-3 bg-indigo-900/30 rounded-lg border border-indigo-400/20">
          <p className="text-xs text-indigo-200/60 mb-1">Available Cash</p>
          <p className="text-lg font-bold text-indigo-300">₹{Math.round(availableCash).toLocaleString('en-IN')}</p>
        </div>
        <div className="p-3 bg-indigo-900/30 rounded-lg border border-indigo-400/20">
          <p className="text-xs text-indigo-200/60 mb-1">Can Invest</p>
          <p className="text-lg font-bold text-indigo-300">₹{Math.round(investmentCapacity).toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Recommendations List */}
      {error && (
        <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 bg-indigo-900/20 rounded-lg border border-indigo-400/20 hover-elevate transition-all"
              data-testid={`card-recommendation-${idx}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-indigo-200 text-sm">{rec.title}</h4>
                <Badge className={`${getRiskColor(rec.riskLevel)} border text-xs font-semibold`}>
                  {rec.riskLevel} Risk
                </Badge>
              </div>

              <p className="text-xs text-indigo-200/70 mb-3">{rec.description}</p>

              <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                <div className="p-2 bg-indigo-950/40 rounded border border-indigo-400/10">
                  <p className="text-indigo-300/60">Returns</p>
                  <p className="font-bold text-indigo-300">{rec.expectedReturn}</p>
                </div>
                <div className="p-2 bg-indigo-950/40 rounded border border-indigo-400/10">
                  <p className="text-indigo-300/60">Min. Investment</p>
                  <p className="font-bold text-indigo-300">₹{Math.round(rec.minimumInvestment).toLocaleString('en-IN')}</p>
                </div>
                <div className="p-2 bg-indigo-950/40 rounded border border-indigo-400/10">
                  <p className="text-indigo-300/60">Alignment</p>
                  <p className="font-bold text-green-300 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Good Fit
                  </p>
                </div>
              </div>

              <p className="text-xs text-indigo-200/50 italic border-t border-indigo-400/10 pt-2">
                💡 {rec.reason}
              </p>
            </div>
          ))
        ) : (
          <div className="p-4 bg-indigo-900/20 rounded-lg border border-indigo-400/20 text-center">
            <p className="text-xs text-indigo-300">Loading recommendations...</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-6 border-t border-indigo-400/20">
        <p className="text-xs text-indigo-200/60 mb-3">
          💰 Recommendations are based on your current financial profile. Review your profile regularly for updated suggestions.
        </p>
      </div>
    </Card>
  );
}
