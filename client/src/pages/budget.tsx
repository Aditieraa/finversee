import { useState } from 'react';
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

const BUDGET_CATEGORIES = [
  { name: 'Shopping', budget: 5000, spent: 4700, icon: '🛍️' },
  { name: 'Food & Dining', budget: 8000, spent: 6500, icon: '🍽️' },
  { name: 'Transportation', budget: 3000, spent: 2800, icon: '🚗' },
  { name: 'Entertainment', budget: 2000, spent: 1200, icon: '🎬' },
  { name: 'Utilities', budget: 4000, spent: 3800, icon: '💡' },
  { name: 'Education', budget: 3000, spent: 2500, icon: '📚' },
];

export default function Budget({ gameState }: BudgetProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 200000,
      currentAmount: 85000,
      deadline: '10/10/2025',
      priority: 'high',
      status: 'active',
    },
    {
      id: '2',
      name: 'Vacation Trip',
      targetAmount: 150000,
      currentAmount: 120000,
      deadline: '12/31/2025',
      priority: 'medium',
      status: 'active',
    },
    {
      id: '3',
      name: 'Car Down Payment',
      targetAmount: 500000,
      currentAmount: 250000,
      deadline: '03/31/2026',
      priority: 'high',
      status: 'active',
    },
  ]);

  const budgetAlerts: BudgetAlert[] = [
    {
      id: '1',
      title: 'Deadline Approaching',
      description: 'Your Food goal deadline is approaching in 6 days',
      type: 'deadline',
      category: 'Food',
      daysLeft: 6,
    },
    {
      id: '2',
      title: 'Deadline Approaching',
      description: 'Your Food goal deadline is approaching in 6 days',
      type: 'deadline',
      category: 'Food',
      daysLeft: 6,
    },
    {
      id: '3',
      title: 'Over Budget Alert',
      description: "You've exceeded your Food budget by ₹800",
      type: 'over-budget',
      category: 'Food',
    },
    {
      id: '4',
      title: 'Goal Achieved',
      description: "Congratulations! You've achieved your Food goal",
      type: 'achieved',
      category: 'Food',
    },
  ];

  const totalBudget = BUDGET_CATEGORIES.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = BUDGET_CATEGORIES.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudget - totalSpent;
  const budgetUsed = (totalSpent / totalBudget) * 100;

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
      {/* Budget Alerts */}
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
                <button className="text-red-400 hover:text-red-300 ml-2">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <p className="text-xs text-red-300/50 mt-4">Showing 1-5 of 9 alerts</p>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-blue-800/10 backdrop-blur-sm p-6">
          <p className="text-sm text-blue-200/60 mb-2">Total Budget</p>
          <p className="text-3xl font-bold text-blue-100">₹{totalBudget.toLocaleString('en-IN')}</p>
          <p className="text-xs text-blue-200/40 mt-2">4 categories</p>
        </Card>

        <Card className="border-purple-400/20 bg-gradient-to-br from-purple-900/20 to-purple-800/10 backdrop-blur-sm p-6">
          <p className="text-sm text-purple-200/60 mb-2">Total Spent</p>
          <p className="text-3xl font-bold text-purple-100">₹{totalSpent.toLocaleString('en-IN')}</p>
          <p className="text-xs text-purple-200/40 mt-2">148.6% of budget used</p>
        </Card>

        <Card className={`border-cyan-400/20 backdrop-blur-sm p-6 ${
          remaining < 0
            ? 'bg-gradient-to-br from-red-900/20 to-red-800/10'
            : 'bg-gradient-to-br from-green-900/20 to-green-800/10'
        }`}>
          <p className={`text-sm mb-2 ${remaining < 0 ? 'text-red-200/60' : 'text-green-200/60'}`}>
            Remaining
          </p>
          <p className={`text-3xl font-bold ${remaining < 0 ? 'text-red-100' : 'text-green-100'}`}>
            {remaining < 0 ? '-' : ''}₹{Math.abs(remaining).toLocaleString('en-IN')}
          </p>
          <p className={`text-xs mt-2 ${remaining < 0 ? 'text-red-200/40' : 'text-green-200/40'}`}>
            {remaining < 0 ? 'Over budget' : 'Under budget'}
          </p>
        </Card>
      </div>

      {/* Budget Tracking */}
      <Card className="border-purple-400/30 bg-purple-950/40 backdrop-blur-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4">Budget Tracking</h3>
        <p className="text-purple-200/60 text-sm mb-6">Monitor your spending against budget limits</p>

        <div className="space-y-5">
          {BUDGET_CATEGORIES.map((category, idx) => {
            const percentage = (category.spent / category.budget) * 100;
            const isOverBudget = percentage > 100;

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
                  value={Math.min(percentage, 100)}
                  className="h-2"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-purple-200/50">{percentage.toFixed(1)}% used</span>
                  {isOverBudget && (
                    <span className="text-xs text-red-400">₹{(category.spent - category.budget).toLocaleString('en-IN')} over</span>
                  )}
                </div>
              </div>
            );
          })}
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
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
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
                    <p className="text-blue-200/60 text-xs">Target: 10/10/2025</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${priorityColor[goal.priority]}`}>
                      {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                    </Badge>
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <Progress value={percentage} className="h-2 mb-2" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-200">
                    ₹{goal.currentAmount.toLocaleString('en-IN')} of ₹{goal.targetAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-blue-400">{percentage.toFixed(1)}%</span>
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
        <DialogContent className="border-blue-400/30 bg-slate-900/95 backdrop-blur-sm">
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
              <p className="text-cyan-200 font-semibold text-sm">Reduce discretionary spending</p>
              <p className="text-cyan-200/60 text-xs">Cut back on non-essential categories to increase savings</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-200 font-semibold text-sm">Track irregular expenses</p>
              <p className="text-green-200/60 text-xs">Monitor one-time purchases to maintain budget accuracy</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-200 font-semibold text-sm">Set realistic goals</p>
              <p className="text-yellow-200/60 text-xs">Achieve your financial goals by setting achievable milestones</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
