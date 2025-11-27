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
  sip: '#4CAF50',      /* Vibrant Green */
  stocks: '#42A5F5',   /* Accent Blue */
  gold: '#FFB74D',     /* Warm Amber */
  realEstate: '#CE93D8', /* Modern Purple */
  savings: '#29B6F6',  /* Sky Blue */
  income: '#66BB6A',   /* Green */
  expenses: '#E53935', /* Warning Red */
  net: '#42A5F5',      /* Accent Blue */
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

  const calculateStockPortfolioValue = () => {
    if (!gameState.stockHoldings || gameState.stockHoldings.length === 0) return 0;
    return gameState.stockHoldings.reduce((total, holding) => {
      return total + (holding.shares * holding.buyPrice);
    }, 0);
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
  const stockPortfolioValue = calculateStockPortfolioValue();

  const totalPortfolio = Object.values(gameState.portfolio).reduce((a: number, b: number) => a + b, 0);
  const growthRate = gameState.netWorth > 0 ? ((gameState.netWorth - (gameState.userProfile?.salary - gameState.userProfile?.expenses || 0)) / (gameState.userProfile?.salary - gameState.userProfile?.expenses || 1) * 100) : 0;
  const financialHealth = Math.min(Math.max((growthRate / 5 * 100), 0), 100);

  return (
    <div className="space-y-6 pb-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-blue-950/30 backdrop-blur-sm p-6 hover-elevate">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-blue-200/70 mb-2 font-semibold">CASH AVAILABLE</p>
              <p className="text-3xl font-bold text-blue-50 animate-countUp">₹{Math.round(gameState.cashBalance).toLocaleString('en-IN')}</p>
              <p className="text-xs text-blue-200/50 mt-2">Total savings</p>
            </div>
            <Coins className="h-8 w-8 text-blue-400/60" />
          </div>
        </Card>

        <Card className="border-red-400/30 bg-gradient-to-br from-red-900/40 to-red-950/30 backdrop-blur-sm p-6 hover-elevate">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-red-200/70 mb-2 font-semibold">MONTHLY EXPENSES</p>
              <p className="text-3xl font-bold text-red-50 animate-countUp">₹{Math.round(gameState.userProfile?.expenses || 0).toLocaleString('en-IN')}</p>
              <p className="text-xs text-red-200/50 mt-2">Monthly spending</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-400/60" />
          </div>
        </Card>

        <Card className="border-blue-400/30 bg-gradient-to-br from-blue-900/40 to-blue-950/30 backdrop-blur-sm p-6 hover-elevate">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-blue-200/70 mb-2 font-semibold">PORTFOLIO VALUE</p>
              <p className="text-3xl font-bold text-blue-50 animate-countUp">₹{Math.round(totalPortfolio + calculateStockPortfolioValue()).toLocaleString('en-IN')}</p>
              <p className="text-xs text-blue-200/50 mt-2">All investments</p>
            </div>
            <Target className="h-8 w-8 text-blue-400/60" />
          </div>
        </Card>

        <Card className="border-green-400/30 bg-gradient-to-br from-green-900/40 to-green-950/30 backdrop-blur-sm p-6 hover-elevate">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-green-200/70 mb-2 font-semibold">GROWTH RATE</p>
              <p className="text-3xl font-bold text-green-50 animate-countUp">{growthRate.toFixed(1)}%</p>
              <p className="text-xs text-green-200/50 mt-2">Monthly growth</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400/60" />
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Money Flow Chart - Area Chart with Gradient */}
        <Card className="border-blue-400/20 bg-blue-950/40 backdrop-blur-sm p-6 shadow-card">
          <h3 className="text-xl font-bold text-white mb-1">Monthly Cash Flow</h3>
          <p className="text-sm text-blue-200/60 mb-4">Income, Expenses & Net Savings</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#66BB6A" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E53935" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E53935" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 150, 200, 0.15)" vertical={false} />
              <XAxis stroke="rgba(160, 180, 204, 0.4)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(160, 180, 204, 0.4)" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1A237E', border: '1px solid rgba(66, 165, 245, 0.3)', borderRadius: '8px' }} />
              <Area type="monotoneX" dataKey="income" stroke="#66BB6A" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotoneX" dataKey="expenses" stroke="#E53935" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Portfolio Breakdown Donut Chart */}
        {(() => {
          const totalValue = categoryData.reduce((sum, item) => sum + item.value, 0);
          const donutData = categoryData.filter(item => item.value > 0).map(item => ({
            ...item,
            percentage: totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0
          }));
          
          return (
            <Card className="border-purple-400/20 bg-purple-950/40 backdrop-blur-sm p-6 shadow-card lg:col-span-1">
              <h3 className="text-xl font-bold text-white mb-1">Portfolio Breakdown</h3>
              <p className="text-sm text-purple-200/60 mb-4">Asset allocation across categories</p>
              
              {donutData.length === 0 ? (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-purple-300/60 text-center">No investments yet. Start investing to see your portfolio breakdown!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1A237E', 
                          border: '1px solid rgba(66, 165, 245, 0.3)',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {donutData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-purple-900/20 hover-elevate cursor-pointer transition-all">
                        <div 
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-purple-200 truncate">{item.name}</p>
                          <p className="text-xs text-purple-200/60">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })()}

        {/* Trend Analysis */}
        <Card className="border-cyan-400/20 bg-cyan-950/40 backdrop-blur-sm p-6 shadow-card">
          <h3 className="text-xl font-bold text-white mb-1">Financial Trends</h3>
          <p className="text-sm text-cyan-200/60 mb-4">Performance metrics & indicators</p>
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

        {/* Spending Pattern - Gradient Area Chart */}
        <Card className="border-green-400/20 bg-green-950/40 backdrop-blur-sm p-6 shadow-card">
          <h3 className="text-xl font-bold text-white mb-1">Weekly Spending Pattern</h3>
          <p className="text-sm text-green-200/60 mb-4">Daily spending trends</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={spendingData}>
              <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC107" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFC107" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 150, 200, 0.15)" vertical={false} />
              <XAxis stroke="rgba(160, 180, 204, 0.4)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(160, 180, 204, 0.4)" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1A237E', border: '1px solid rgba(66, 165, 245, 0.3)', borderRadius: '8px' }} />
              <Area type="monotoneX" dataKey="spending" stroke="#FFB74D" strokeWidth={2} fillOpacity={1} fill="url(#colorSpending)" />
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(149, 165, 166, 0.2)" />
            <XAxis stroke="rgba(149, 165, 166, 0.6)" />
            <YAxis stroke="rgba(149, 165, 166, 0.6)" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(52, 152, 219, 0.3)' }} />
            <Legend />
            <Bar dataKey="income" fill="#BA68C8" />
            <Bar dataKey="expenses" fill="#FF8C42" />
            <Bar dataKey="savings" fill="#64B5F6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
