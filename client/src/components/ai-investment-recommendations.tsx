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
      
      if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
      } else {
        throw new Error('No recommendations received from AI');
      }
    } catch (err) {
      console.error('AI recommendation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate AI recommendations. Please try again.');
      setRecommendations([]);
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
      {loading && (
        <div className="p-6 bg-indigo-900/20 rounded-lg border border-indigo-400/20 text-center">
          <Loader2 className="h-5 w-5 text-indigo-400 animate-spin mx-auto mb-2" />
          <p className="text-sm text-indigo-300">Analyzing your financial profile...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300 mb-1">AI Analysis Failed</p>
            <p className="text-xs text-red-200/70">{error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchAIRecommendations}
              className="mt-2 text-xs h-7"
              data-testid="button-retry-recommendations"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
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
          ))}
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-6 pt-6 border-t border-indigo-400/20">
        <p className="text-xs text-indigo-200/60 mb-3">
          💰 Recommendations are based on your current financial profile. Review your profile regularly for updated suggestions.
        </p>
      </div>
    </Card>
  );
}
