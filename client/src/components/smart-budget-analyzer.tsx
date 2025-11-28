import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingDown, Target, BarChart3 } from 'lucide-react';

interface SmartBudgetAnalyzerProps {
  gameState: any;
}

interface BudgetCategory {
  name: string;
  budget: number;
  spent: number;
  icon: string;
  percentage: number;
}

export function SmartBudgetAnalyzer({ gameState }: SmartBudgetAnalyzerProps) {
  const salary = gameState.userProfile?.salary || 0;
  const expenses = gameState.userProfile?.expenses || 0;
  const monthlyExpenses = gameState.monthlyExpensesThisMonth || expenses;
  const cashBalance = gameState.cashBalance || 0;
  
  // SYNCED: Use EXACT same categories as Budget component
  const budgetCategories: BudgetCategory[] = [
    { name: 'Food & Dining', budget: Math.round(monthlyExpenses * 0.25), spent: Math.round(monthlyExpenses * 0.22), icon: '🍽️', percentage: 0 },
    { name: 'Transportation', budget: Math.round(monthlyExpenses * 0.15), spent: Math.round(monthlyExpenses * 0.13), icon: '🚗', percentage: 0 },
    { name: 'Shopping', budget: Math.round(monthlyExpenses * 0.2), spent: Math.round(monthlyExpenses * 0.18), icon: '🛍️', percentage: 0 },
    { name: 'Utilities & Bills', budget: Math.round(monthlyExpenses * 0.2), spent: Math.round(monthlyExpenses * 0.19), icon: '💡', percentage: 0 },
    { name: 'Entertainment', budget: Math.round(monthlyExpenses * 0.1), spent: Math.round(monthlyExpenses * 0.08), icon: '🎬', percentage: 0 },
    { name: 'Education', budget: Math.round(monthlyExpenses * 0.1), spent: Math.round(monthlyExpenses * 0.09), icon: '📚', percentage: 0 },
  ].map(cat => ({
    ...cat,
    percentage: cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0,
  }));

  // Calculate overspending (categories where spent > budget)
  const anomalies = budgetCategories
    .filter(cat => cat.spent > cat.budget)
    .sort((a, b) => (b.spent - b.budget) - (a.spent - a.budget));

  const totalOverspend = anomalies.reduce((sum, cat) => sum + (cat.spent - cat.budget), 0);

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
            Areas Over Budget
          </h4>
          <div className="space-y-2 mb-6">
            {anomalies.slice(0, 4).map((category, idx) => {
              const overspend = category.spent - category.budget;
              const percentOver = ((overspend / category.budget) * 100);
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
                    Spent: ₹{Math.round(category.spent).toLocaleString('en-IN')} | Budget: ₹{Math.round(category.budget).toLocaleString('en-IN')}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Savings Opportunity */}
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-400" />
              <p className="text-sm font-semibold text-green-300">Optimization Potential</p>
            </div>
            <p className="text-lg font-bold text-green-300 mb-2">
              ₹{Math.round(totalOverspend).toLocaleString('en-IN')}/month
            </p>
            <p className="text-xs text-green-200/60">
              Reduce overspending across categories to unlock ₹{Math.round((totalOverspend * 12) / 100000).toFixed(1)}L annual savings
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-sm font-semibold text-green-300 flex items-center gap-2">
            ✅ All categories within budget!
          </p>
          <p className="text-xs text-green-200/60 mt-2">
            Your spending is well-controlled across all categories.
          </p>
        </div>
      )}

      {/* Budget Breakdown - SYNCED with Budget Component */}
      <div className="mt-6 pt-6 border-t border-teal-400/20">
        <h4 className="text-xs font-semibold text-teal-200 uppercase tracking-wide mb-3">Monthly Budget Status</h4>
        <div className="space-y-2">
          {budgetCategories.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-lg flex-shrink-0 w-6">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs font-semibold text-teal-200 truncate">{cat.name}</span>
                  <span className={`text-xs font-bold ${cat.percentage > 100 ? 'text-red-400' : cat.percentage > 80 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {cat.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 bg-teal-900/40 rounded-full overflow-hidden border border-teal-400/10">
                  <div 
                    className={`h-full transition-all ${cat.percentage > 100 ? 'bg-red-500' : cat.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-teal-300 mt-0.5">
                  ₹{cat.spent.toLocaleString('en-IN')} / ₹{cat.budget.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
