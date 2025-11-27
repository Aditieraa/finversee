import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle, Target, Plus, X, TrendingUp, TrendingDown } from 'lucide-react';

interface BudgetProps {
  gameState: any;
}

interface BudgetAlert {
  id: string;
  title: string;
  description: string;
  type: 'deadline' | 'over-budget' | 'achieved';
  category?: string;
  daysLeft?: number;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed';
}

interface BudgetCategory {
  name: string;
  budget: number;
  spent: number;
  icon: string;
  percentage: number;
}

interface BudgetProps {
  gameState: any;
  onExpenseAdd?: (amount: number) => void;
}

export default function Budget({ gameState, onExpenseAdd }: BudgetProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [customBudgets, setCustomBudgets] = useState<BudgetCategory[]>([]);

  // Calculate budget categories based on user's actual expenses
  useEffect(() => {
    const userExpenses = gameState.userProfile?.expenses || 0;
    const portfolio = gameState.portfolio || {};
    const investments = gameState.monthlyInvestments || {};

    // Break down expenses into proportional categories
    const categories: BudgetCategory[] = [
      { name: 'Food & Dining', budget: Math.round(userExpenses * 0.25), spent: Math.round(userExpenses * 0.22), icon: '🍽️', percentage: 0 },
      { name: 'Transportation', budget: Math.round(userExpenses * 0.15), spent: Math.round(userExpenses * 0.13), icon: '🚗', percentage: 0 },
      { name: 'Shopping', budget: Math.round(userExpenses * 0.2), spent: Math.round(userExpenses * 0.18), icon: '🛍️', percentage: 0 },
      { name: 'Utilities & Bills', budget: Math.round(userExpenses * 0.2), spent: Math.round(userExpenses * 0.19), icon: '💡', percentage: 0 },
      { name: 'Entertainment', budget: Math.round(userExpenses * 0.1), spent: Math.round(userExpenses * 0.08), icon: '🎬', percentage: 0 },
      { name: 'Education', budget: Math.round(userExpenses * 0.1), spent: Math.round(userExpenses * 0.09), icon: '📚', percentage: 0 },
    ];

    // Calculate percentages
    const updatedCategories = categories.map(cat => ({
      ...cat,
      percentage: cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0,
    }));

    setBudgetCategories(updatedCategories);
    
    // Load custom budgets from localStorage
    const saved = localStorage.getItem('customBudgets');
    if (saved) {
      try {
        setCustomBudgets(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading custom budgets:', e);
      }
    }

    // Initialize goals based on portfolio
    const totalPortfolio = Object.values(portfolio).reduce((a: number, b: number) => a + b, 0);
    const initialGoals: Goal[] = [
      {
        id: '1',
        name: 'Emergency Fund',
        targetAmount: userExpenses * 6,
        currentAmount: gameState.cashBalance,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        priority: 'high',
        status: gameState.cashBalance >= userExpenses * 6 ? 'completed' : 'active',
      },
      {
        id: '2',
        name: 'Investment Portfolio',
        targetAmount: userExpenses * 10,
        currentAmount: totalPortfolio,
        deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        priority: 'high',
        status: totalPortfolio >= userExpenses * 10 ? 'completed' : 'active',
      },
      {
        id: '3',
        name: 'Net Worth Target',
        targetAmount: gameState.userProfile?.salary * 12,
        currentAmount: gameState.netWorth,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        priority: 'medium',
        status: gameState.netWorth >= gameState.userProfile?.salary * 12 ? 'completed' : 'active',
      },
    ];

    setGoals(initialGoals);
  }, [gameState]);

  // Add custom budget
  const handleAddCustomBudget = () => {
    if (!budgetName || !budgetAmount) return;
    
    const newBudget: BudgetCategory = {
      name: budgetName,
      budget: parseInt(budgetAmount),
      spent: 0,
      icon: '📊',
      percentage: 0,
    };
    
    const updated = [...customBudgets, newBudget];
    setCustomBudgets(updated);
    localStorage.setItem('customBudgets', JSON.stringify(updated));
    
    setBudgetName('');
    setBudgetAmount('');
    setShowAddBudget(false);
  };

  // Generate real-time alerts based on actual data
  const generateAlerts = (): BudgetAlert[] => {
    const alerts: BudgetAlert[] = [];
    const userExpenses = gameState.userProfile?.expenses || 0;

    // Check for over-budget categories
    budgetCategories.forEach((cat, idx) => {
      if (cat.percentage > 100) {
        alerts.push({
          id: `over-${idx}`,
          title: 'Over Budget Alert',
          description: `You've exceeded your ${cat.name} budget by ₹${Math.round(cat.spent - cat.budget)}`,
          type: 'over-budget',
          category: cat.name,
        });
      }
    });

    // Check if emergency fund is low
    if (gameState.cashBalance < userExpenses * 3) {
      alerts.push({
        id: 'emergency',
        title: 'Low Emergency Fund',
        description: 'Your emergency fund is below 3 months of expenses. Consider saving more.',
        type: 'deadline',
        category: 'Emergency Fund',
      });
    }

    // Check for completed goals
    goals.forEach((goal) => {
      if (goal.status === 'completed') {
        alerts.push({
          id: `complete-${goal.id}`,
          title: 'Goal Achieved',
          description: `Congratulations! You've achieved your ${goal.name} goal`,
          type: 'achieved',
          category: goal.name,
        });
      }
    });

    // Add savings rate alert
    const savingRate = gameState.userProfile?.salary
      ? ((gameState.userProfile.salary - gameState.userProfile.expenses) / gameState.userProfile.salary) * 100
      : 0;

    if (savingRate < 20) {
      alerts.push({
        id: 'savings-rate',
        title: 'Low Savings Rate',
        description: `Your savings rate is ${savingRate.toFixed(1)}%. Aim for at least 20%.`,
        type: 'deadline',
        category: 'Savings',
      });
    }

    return alerts.slice(0, 9); // Show max 9 alerts
  };

  const budgetAlerts = generateAlerts();

  // Calculate totals
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudget - totalSpent;
  const userExpenses = gameState.userProfile?.expenses || 0;
  const userSalary = gameState.userProfile?.salary || 0;
  const monthlyIncome = userSalary;
  const savingsPerMonth = monthlyIncome - userExpenses;

  const handleAddGoal = () => {
    if (goalName && goalAmount) {
      const newGoal: Goal = {
        id: Date.now().toString(),
        name: goalName,
        targetAmount: parseInt(goalAmount),
        currentAmount: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        priority: 'medium',
        status: 'active',
      };
      setGoals([...goals, newGoal]);
      setGoalName('');
      setGoalAmount('');
      setShowAddGoal(false);
    }
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Custom Budgets Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Target className="h-6 w-6" />
            Custom Budgets
          </h2>
          <Button
            onClick={() => setShowAddBudget(true)}
            className="flex items-center gap-2 neon-glow interactive-hover"
            data-testid="button-new-budget"
          >
            <Plus className="h-4 w-4" />
            New Budget
          </Button>
        </div>
        
        {customBudgets.length === 0 ? (
          <Card className="border-primary/20 glassmorphic p-8">
            <p className="text-foreground/60 text-center">No custom budgets yet. Create your first one!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customBudgets.map((budget, idx) => (
              <Card key={idx} className="border-primary/30 glassmorphic p-4" data-testid={`custom-budget-${idx}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">{budget.name}</p>
                  <span className="text-sm text-foreground/60">₹{budget.budget.toLocaleString('en-IN')}</span>
                </div>
                <Progress value={Math.min(budget.percentage, 100)} className="h-2" />
                <p className="text-xs text-foreground/50 mt-2">{budget.percentage.toFixed(1)}% spent</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Custom Budget Creation Dialog */}
      <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
        <DialogContent className="border-primary/30 glassmorphic modal-slide w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Custom Budget
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="budget-name" className="text-sm text-foreground/70">Budget Category</Label>
              <Input
                id="budget-name"
                type="text"
                placeholder="e.g., Gym Membership"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                className="mt-2 interactive-hover"
                data-testid="input-budget-name"
              />
            </div>
            <div>
              <Label htmlFor="budget-amount" className="text-sm text-foreground/70">Monthly Budget (₹)</Label>
              <Input
                id="budget-amount"
                type="number"
                placeholder="0"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="mt-2 interactive-hover"
                data-testid="input-budget-amount"
              />
            </div>
            <Button
              onClick={handleAddCustomBudget}
              className="w-full neon-glow interactive-hover font-bold"
              data-testid="button-add-custom-budget"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Budget
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <Card className="border-red-400/30 bg-red-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-red-100 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            Budget Alerts
          </h3>
          <p className="text-red-200/60 text-sm mb-4">Stay informed about your spending and budget status</p>

          <ScrollArea className="h-64 pr-4">
            <div className="space-y-3">
              {budgetAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border flex items-start justify-between ${
                    alert.type === 'deadline'
                      ? 'border-yellow-500/30 bg-yellow-500/10'
                      : alert.type === 'over-budget'
                        ? 'border-red-500/30 bg-red-500/10'
                        : 'border-green-500/30 bg-green-500/10'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${
                      alert.type === 'deadline'
                        ? 'text-yellow-300'
                        : alert.type === 'over-budget'
                          ? 'text-red-300'
                          : 'text-green-300'
                    }`}>
                      {alert.title}
                    </p>
                    <p className="text-xs mt-1 opacity-80">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <p className="text-xs text-red-300/50 mt-4">Showing 1-{Math.min(budgetAlerts.length, 9)} of {budgetAlerts.length} alerts</p>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-blue-800/10 backdrop-blur-sm p-6">
          <p className="text-sm text-blue-200/60 mb-2">Monthly Income</p>
          <p className="text-2xl font-bold text-blue-100">₹{monthlyIncome.toLocaleString('en-IN')}</p>
          <p className="text-xs text-blue-200/40 mt-2">Your salary</p>
        </Card>

        <Card className="border-purple-400/20 bg-gradient-to-br from-purple-900/20 to-purple-800/10 backdrop-blur-sm p-6">
          <p className="text-sm text-purple-200/60 mb-2">Total Expenses</p>
          <p className="text-2xl font-bold text-purple-100">₹{userExpenses.toLocaleString('en-IN')}</p>
          <p className="text-xs text-purple-200/40 mt-2">Monthly spending</p>
        </Card>

        <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 backdrop-blur-sm p-6">
          <p className="text-sm text-cyan-200/60 mb-2">Monthly Savings</p>
          <p className="text-2xl font-bold text-cyan-100">₹{savingsPerMonth.toLocaleString('en-IN')}</p>
          <p className="text-xs text-cyan-200/40 mt-2">Available to invest</p>
        </Card>

        <Card className="border-green-400/20 bg-gradient-to-br from-green-900/20 to-green-800/10 backdrop-blur-sm p-6">
          <p className="text-sm text-green-200/60 mb-2">Savings Rate</p>
          <p className="text-2xl font-bold text-green-100">
            {monthlyIncome > 0 ? ((savingsPerMonth / monthlyIncome) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-xs text-green-200/40 mt-2">Of income saved</p>
        </Card>
      </div>

      {/* Budget Tracking */}
      <Card className="border-purple-400/30 bg-purple-950/40 backdrop-blur-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4">Budget Tracking</h3>
        <p className="text-purple-200/60 text-sm mb-6">Monitor your spending against budget limits based on your monthly expenses</p>

        <div className="space-y-5">
          {budgetCategories.map((category, idx) => {
            const isOverBudget = category.percentage > 100;

            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-200 flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    {category.name}
                  </span>
                  <span className="text-sm font-semibold text-purple-300">
                    ₹{category.spent.toLocaleString('en-IN')} / ₹{category.budget.toLocaleString('en-IN')}
                  </span>
                </div>
                <Progress
                  value={Math.min(category.percentage, 100)}
                  className="h-2"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-purple-200/50">{category.percentage.toFixed(1)}% used</span>
                  {isOverBudget && (
                    <span className="text-xs text-red-400">₹{(category.spent - category.budget).toLocaleString('en-IN')} over</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall Budget Summary */}
        <div className="mt-6 p-4 rounded-lg border border-purple-400/20 bg-purple-950/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">Total Monthly Budget</span>
            <span className="text-white font-bold">₹{totalBudget.toLocaleString('en-IN')}</span>
          </div>
          <Progress value={(totalSpent / totalBudget) * 100} className="h-2 mb-3" />
          <div className="flex justify-between text-xs text-purple-200/60">
            <span>Spent: ₹{totalSpent.toLocaleString('en-IN')}</span>
            <span>Remaining: ₹{remaining.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </Card>

      {/* Financial Goals Section */}
      <Card className="border-blue-400/30 bg-blue-950/40 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            Financial Goals
          </h3>
          <Button
            onClick={() => setShowAddGoal(true)}
            size="sm"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            const priorityColor = {
              high: 'bg-red-500/20 text-red-300 border-red-400/30',
              medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
              low: 'bg-green-500/20 text-green-300 border-green-400/30',
            };

            return (
              <div
                key={goal.id}
                className="p-4 rounded-lg border border-blue-400/20 bg-blue-950/30 hover:border-blue-400/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold text-sm">{goal.name}</h4>
                    <p className="text-blue-200/60 text-xs">Target: {goal.deadline}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${priorityColor[goal.priority]}`}>
                      {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                    </Badge>
                    {goal.id !== '1' && goal.id !== '2' && goal.id !== '3' && (
                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <Progress value={Math.min(percentage, 100)} className="h-2 mb-2" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-200">
                    ₹{goal.currentAmount.toLocaleString('en-IN')} of ₹{goal.targetAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-blue-400">{Math.min(percentage, 100).toFixed(1)}%</span>
                </div>

                {goal.status === 'completed' && (
                  <div className="mt-2 p-2 rounded bg-green-500/10 border border-green-500/30">
                    <p className="text-xs text-green-300 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Goal completed!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add Goal Dialog */}
      <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
        <DialogContent className="border-blue-400/30 bg-blue-950/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Goal</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-blue-100 text-sm">Goal Name</Label>
              <Input
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g., Save for vacation"
                className="mt-2 bg-blue-950/30 border-blue-400/20 text-white placeholder:text-blue-300/30"
              />
            </div>

            <div>
              <Label className="text-blue-100 text-sm">Target Amount (₹)</Label>
              <Input
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="100000"
                className="mt-2 bg-blue-950/30 border-blue-400/20 text-white placeholder:text-blue-300/30"
              />
            </div>

            <Button
              onClick={handleAddGoal}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Budget Tips */}
      <Card className="border-cyan-400/30 bg-cyan-950/40 backdrop-blur-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4">Budget Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <TrendingDown className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-cyan-200 font-semibold text-sm">Track Every Rupee</p>
              <p className="text-cyan-200/60 text-xs">Review your spending regularly to identify patterns and opportunities to save</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-200 font-semibold text-sm">Build Emergency Fund</p>
              <p className="text-green-200/60 text-xs">Aim to save 6 months of expenses for unexpected situations</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-200 font-semibold text-sm">Set Realistic Goals</p>
              <p className="text-yellow-200/60 text-xs">Achieve your financial goals by breaking them into smaller milestones</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
