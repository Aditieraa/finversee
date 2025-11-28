import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingDown, Target, BarChart3 } from 'lucide-react';

interface SmartBudgetAnalyzerProps {
  gameState: any;
}

export function SmartBudgetAnalyzer({ gameState }: SmartBudgetAnalyzerProps) {
  const salary = gameState.userProfile?.salary || 0;
  const expenses = gameState.userProfile?.expenses || 0;
  const monthlyExpenses = gameState.monthlyExpensesThisMonth || expenses;
  const cashBalance = gameState.cashBalance || 0;
  
  // Simulate budget categories (percentages)
  const budgetCategories = [
    { name: 'Housing', allocated: salary * 0.3, ideal: salary * 0.25, icon: '🏠' },
    { name: 'Food & Groceries', allocated: salary * 0.15, ideal: salary * 0.12, icon: '🍔' },
    { name: 'Transportation', allocated: salary * 0.12, ideal: salary * 0.10, icon: '🚗' },
    { name: 'Subscriptions', allocated: salary * 0.08, ideal: salary * 0.03, icon: '📺' },
    { name: 'Entertainment', allocated: salary * 0.10, ideal: salary * 0.08, icon: '🎮' },
    { name: 'Savings & Investments', allocated: salary * 0.25, ideal: salary * 0.42, icon: '💰' },
  ];

  // Calculate overspending
  const anomalies = budgetCategories
    .filter(cat => cat.allocated > cat.ideal)
    .sort((a, b) => (b.allocated - b.ideal) - (a.allocated - a.ideal));

  const totalOverspend = anomalies.reduce((sum, cat) => sum + (cat.allocated - cat.ideal), 0);
  const savingsOpportunity = totalOverspend;

  // Spending trend analysis
  const recentSpendingTrend = monthlyExpenses > expenses ? 'increasing' : 'decreasing';
  const spendingChange = ((monthlyExpenses - expenses) / expenses * 100);

  // Budget Health
  const budgetHealth = Math.min(Math.max((salary - monthlyExpenses) / salary * 100, 0), 100);

  return (
    <Card className="border-teal-400/30 bg-gradient-to-br from-teal-950/60 to-cyan-950/40 backdrop-blur-sm p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-teal-400" />
          Smart Budget Analyzer
        </h3>
        <Badge className={`${budgetHealth > 70 ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'} border text-xs font-semibold px-3 py-1`}>
          {budgetHealth > 70 ? 'Healthy' : 'Review Needed'}
        </Badge>
      </div>

      {/* Budget Health Bar */}
      <div className="mb-6 pb-6 border-b border-teal-400/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-teal-200 font-semibold">Monthly Budget Health</span>
          <span className="text-sm font-bold text-teal-300">{Math.round(budgetHealth)}%</span>
        </div>
        <div className="w-full h-2 bg-teal-900/30 rounded-full overflow-hidden border border-teal-400/20">
          <div 
            className={`h-full transition-all ${budgetHealth > 70 ? 'bg-green-500' : budgetHealth > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${budgetHealth}%` }}
          />
        </div>
        <p className="text-xs text-teal-200/60 mt-2">
          Monthly savings: ₹{Math.round(salary - monthlyExpenses).toLocaleString('en-IN')}
        </p>
      </div>

      {/* Spending Trend */}
      <div className="mb-6 pb-6 border-b border-teal-400/20 p-4 bg-teal-900/20 rounded-lg border border-teal-400/20">
        <div className="flex items-center gap-3 mb-2">
          {recentSpendingTrend === 'increasing' ? (
            <TrendingDown className="h-4 w-4 text-red-400 rotate-180" />
          ) : (
            <TrendingDown className="h-4 w-4 text-green-400" />
          )}
          <p className="text-sm font-semibold text-teal-200">Spending Trend: {recentSpendingTrend === 'increasing' ? '📈 Increasing' : '📉 Decreasing'}</p>
        </div>
        <p className="text-xs text-teal-200/60">
          {recentSpendingTrend === 'increasing' 
            ? `Expenses up by ${Math.abs(spendingChange).toFixed(1)}% from usual - review category budgets`
            : `Expenses down by ${Math.abs(spendingChange).toFixed(1)}% - great control!`
          }
        </p>
      </div>

      {/* Anomalies & Optimization */}
      {anomalies.length > 0 ? (
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            Areas to Optimize
          </h4>
          <div className="space-y-2 mb-6">
            {anomalies.slice(0, 4).map((category, idx) => {
              const overspend = category.allocated - category.ideal;
              const percentOver = ((overspend / category.ideal) * 100);
              return (
                <div key={idx} className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-semibold text-orange-300 flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      {category.name}
                    </span>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                      +{percentOver.toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-orange-200/60">
                    Currently: ₹{Math.round(category.allocated).toLocaleString('en-IN')} | Ideal: ₹{Math.round(category.ideal).toLocaleString('en-IN')}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Savings Opportunity */}
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-400" />
              <p className="text-sm font-semibold text-green-300">Savings Opportunity</p>
            </div>
            <p className="text-lg font-bold text-green-300 mb-2">
              ₹{Math.round(savingsOpportunity).toLocaleString('en-IN')}/month
            </p>
            <p className="text-xs text-green-200/60">
              If optimized: Could invest ₹{Math.round((savingsOpportunity * 12) / 100000).toFixed(1)}L annually
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-sm font-semibold text-green-300 flex items-center gap-2">
            ✅ Budget is well-optimized!
          </p>
          <p className="text-xs text-green-200/60 mt-2">
            Your spending aligns well with recommended allocations.
          </p>
        </div>
      )}

      {/* Budget Breakdown */}
      <div className="mt-6 pt-6 border-t border-teal-400/20">
        <h4 className="text-xs font-semibold text-teal-200 uppercase tracking-wide mb-3">Budget Breakdown</h4>
        <div className="space-y-2">
          {budgetCategories.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-lg flex-shrink-0 w-6">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs font-semibold text-teal-200 truncate">{cat.name}</span>
                  <span className="text-xs text-teal-300 font-bold">
                    {((cat.allocated / salary) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 bg-teal-900/40 rounded-full overflow-hidden border border-teal-400/10">
                  <div 
                    className={`h-full ${cat.allocated > cat.ideal ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min((cat.allocated / salary) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
