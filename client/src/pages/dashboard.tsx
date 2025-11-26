import { LineChart, Line, PieChart, Pie, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Coins, Target, AlertCircle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  gameState: any;
  monthlyDecisions: any;
}

const CHART_COLORS = {
  sip: '#10B981',
  stocks: '#3B82F6',
  gold: '#F59E0B',
  realEstate: '#8B5CF6',
  savings: '#6366F1',
  income: '#10B981',
  expenses: '#EF4444',
  net: '#3B82F6',
};

export default function Dashboard({ gameState, monthlyDecisions }: DashboardProps) {
  // Generate chart data from game state
  const generateMonthlyData = () => {
    const data = [];
    for (let i = 1; i <= Math.min(gameState.currentMonth, 12); i++) {
      data.push({
        month: `Month ${i}`,
        income: gameState.userProfile?.salary || 0,
        expenses: gameState.userProfile?.expenses || 0,
        net: (gameState.userProfile?.salary || 0) - (gameState.userProfile?.expenses || 0),
      });
    }
    return data;
  };

  const generateCategoryData = () => {
    const portfolio = gameState.portfolio;
    const total = Object.values(portfolio).reduce((a: number, b: number) => a + b, 0);
    return Object.entries(portfolio).map(([name, value]: [string, any]) => ({
      name: name === 'realEstate' ? 'Real Estate' : name.charAt(0).toUpperCase() + name.slice(1),
      value: value,
      percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
      color: CHART_COLORS[name as keyof typeof CHART_COLORS],
    }));
  };

  const generateTrendData = () => {
    const trends = [];
    const currentIncome = gameState.userProfile?.salary || 0;
    for (let i = 0; i < 6; i++) {
      trends.push({
        month: `${String.fromCharCode(74 + i)}an`,
        income: currentIncome + (Math.random() - 0.5) * 20000,
        expenses: (gameState.userProfile?.expenses || 0) + (Math.random() - 0.5) * 15000,
        savings: (Math.random() - 0.5) * 50000,
      });
    }
    return trends;
  };

  const generateSpendingPattern = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, idx) => ({
      day,
      spending: 15000 + (idx * 5000) + (Math.random() - 0.5) * 10000,
    }));
  };

  const monthlyData = generateMonthlyData();
  const categoryData = generateCategoryData();
  const trendData = generateTrendData();
  const spendingData = generateSpendingPattern();

  const totalPortfolio = Object.values(gameState.portfolio).reduce((a: number, b: number) => a + b, 0);
  const growthRate = gameState.netWorth > 0 ? ((gameState.netWorth - (gameState.userProfile?.salary - gameState.userProfile?.expenses || 0)) / (gameState.userProfile?.salary - gameState.userProfile?.expenses || 1) * 100) : 0;
  const financialHealth = Math.min(Math.max((growthRate / 5 * 100), 0), 100);

  return (
    <div className="space-y-6 pb-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-blue-800/10 backdrop-blur-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-200/60 mb-1">Total Savings</p>
              <p className="text-2xl font-bold text-blue-100">₹{Math.round(gameState.cashBalance).toLocaleString('en-IN')}</p>
              <p className="text-xs text-blue-200/40 mt-2">Cash available</p>
            </div>
            <Coins className="h-8 w-8 text-blue-400/50" />
          </div>
        </Card>

        <Card className="border-purple-400/20 bg-gradient-to-br from-purple-900/20 to-purple-800/10 backdrop-blur-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-purple-200/60 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-purple-100">₹{Math.round(gameState.userProfile?.expenses || 0).toLocaleString('en-IN')}</p>
              <p className="text-xs text-purple-200/40 mt-2">Monthly spending</p>
            </div>
            <TrendingDown className="h-8 w-8 text-purple-400/50" />
          </div>
        </Card>

        <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 backdrop-blur-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-cyan-200/60 mb-1">Portfolio Value</p>
              <p className="text-2xl font-bold text-cyan-100">₹{Math.round(totalPortfolio).toLocaleString('en-IN')}</p>
              <p className="text-xs text-cyan-200/40 mt-2">Investments total</p>
            </div>
            <Target className="h-8 w-8 text-cyan-400/50" />
          </div>
        </Card>

        <Card className="border-green-400/20 bg-gradient-to-br from-green-900/20 to-green-800/10 backdrop-blur-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-200/60 mb-1">Growth Rate</p>
              <p className="text-2xl font-bold text-green-100">{growthRate.toFixed(1)}%</p>
              <p className="text-xs text-green-200/40 mt-2">Monthly growth</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400/50" />
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Money Flow Chart */}
        <Card className="border-blue-400/20 bg-blue-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4">Monthly Cash Flow</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 150, 200, 0.1)" />
              <XAxis stroke="rgba(200, 200, 200, 0.5)" />
              <YAxis stroke="rgba(200, 200, 200, 0.5)" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(100, 150, 200, 0.3)' }} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Portfolio Breakdown Pie */}
        <Card className="border-purple-400/20 bg-purple-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4">Portfolio Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percentage }) => `${name} ${percentage}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Trend Analysis */}
        <Card className="border-cyan-400/20 bg-cyan-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4">Financial Trends</h3>
          <div className="space-y-4 mb-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-cyan-200">Income Trend</span>
                <span className="text-sm font-bold text-green-400">+5.2%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-cyan-200">Expenses Trend</span>
                <span className="text-sm font-bold text-red-400">-3.1%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-cyan-200">Savings Rate</span>
                <span className="text-sm font-bold text-blue-400">+12.8%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Spending Pattern */}
        <Card className="border-green-400/20 bg-green-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4">Weekly Spending Pattern</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 150, 200, 0.1)" />
              <XAxis stroke="rgba(200, 200, 200, 0.5)" />
              <YAxis stroke="rgba(200, 200, 200, 0.5)" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(100, 150, 200, 0.3)' }} />
              <Area type="monotone" dataKey="spending" stroke="#10B981" fill="rgba(16, 185, 129, 0.1)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Financial Health & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-400/20 bg-blue-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-400" />
            Financial Health Score
          </h3>
          <div className="flex items-center justify-center py-8">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(100, 150, 200, 0.2)" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#3B82F6" strokeWidth="8" strokeDasharray={`${(financialHealth / 100) * 314} 314`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-300">{Math.round(financialHealth)}</span>
              </div>
            </div>
          </div>
          <p className="text-center text-blue-200 text-sm">Excellent</p>
        </Card>

        <Card className="border-yellow-400/20 bg-yellow-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            Key Insights
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
              <p className="text-sm text-green-300">✓ Great cost control - expenses down 6.1%</p>
            </div>
            <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
              <p className="text-sm text-yellow-300">⚠ Savings declining 14.6% - urgent attention needed</p>
            </div>
            <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10">
              <p className="text-sm text-blue-300">📈 Portfolio growing steadily - maintain momentum</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Bar Chart Trends */}
      <Card className="border-purple-400/20 bg-purple-950/40 backdrop-blur-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4">Monthly Income vs Expenses vs Savings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 150, 200, 0.1)" />
            <XAxis stroke="rgba(200, 200, 200, 0.5)" />
            <YAxis stroke="rgba(200, 200, 200, 0.5)" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(100, 150, 200, 0.3)' }} />
            <Legend />
            <Bar dataKey="income" fill="#10B981" />
            <Bar dataKey="expenses" fill="#EF4444" />
            <Bar dataKey="savings" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
