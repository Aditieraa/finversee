import { useState } from 'react';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Coins, Target, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

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
  const [timeframe, setTimeframe] = useState<3 | 6 | 12>(6);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // Generate chart data from game state
  const generateMonthlyData = (months: number) => {
    const data = [];
    const displayMonths = Math.min(months, gameState.currentMonth, 12);
    for (let i = 1; i <= displayMonths; i++) {
      data.push({
        month: `M${i}`,
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

  const generateSpendingPattern = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, idx) => ({
      day,
      spending: 15000 + (idx * 5000) + (Math.random() - 0.5) * 10000,
    }));
  };

  const monthlyData = generateMonthlyData(timeframe);
  const categoryData = generateCategoryData();
  const spendingData = generateSpendingPattern();
  const stockPortfolioValue = calculateStockPortfolioValue();

  const totalPortfolio = Object.values(gameState.portfolio).reduce((a: number, b: number) => a + b, 0);
  const growthRate = gameState.netWorth > 0 ? ((gameState.netWorth - (gameState.userProfile?.salary - gameState.userProfile?.expenses || 0)) / (gameState.userProfile?.salary - gameState.userProfile?.expenses || 1) * 100) : 0;
  const financialHealth = Math.min(Math.max((growthRate / 5 * 100), 0), 100);

  return (
    <div className="space-y-6 pb-6">
      {/* SECTION 1: Financial Snapshot - Top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cash Available */}
        <Card className="border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-blue-950/30 backdrop-blur-sm p-6 hover-elevate shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-blue-200/70 mb-2 font-semibold">CASH AVAILABLE</p>
              <p className="text-3xl font-bold text-blue-50 animate-countUp">₹{Math.round(gameState.cashBalance).toLocaleString('en-IN')}</p>
              <p className="text-xs text-blue-200/50 mt-2">Total savings</p>
            </div>
            <Coins className="h-8 w-8 text-blue-400/60" />
          </div>
        </Card>

        {/* Monthly Expenses */}
        <Card className="border-red-400/30 bg-gradient-to-br from-red-900/40 to-red-950/30 backdrop-blur-sm p-6 hover-elevate shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-red-200/70 mb-2 font-semibold">MONTHLY EXPENSES</p>
              <p className="text-3xl font-bold text-red-50 animate-countUp">₹{Math.round(gameState.userProfile?.expenses || 0).toLocaleString('en-IN')}</p>
              <p className="text-xs text-red-200/50 mt-2">Monthly spending</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-400/60" />
          </div>
        </Card>

        {/* Portfolio Value - LARGER (spans 2 cols on medium+) */}
        <Card className="border-blue-400/30 bg-gradient-to-br from-blue-900/40 to-blue-950/30 backdrop-blur-sm p-6 hover-elevate shadow-card md:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-blue-200/70 mb-2 font-semibold">PORTFOLIO VALUE</p>
              <p className="text-4xl font-bold text-blue-50 animate-countUp">₹{Math.round(totalPortfolio + stockPortfolioValue).toLocaleString('en-IN')}</p>
              <p className="text-xs text-blue-200/50 mt-2">All investments (stocks + holdings)</p>
            </div>
            <Target className="h-8 w-8 text-blue-400/60" />
          </div>
        </Card>
      </div>

      {/* SECTION 2: Monthly Cash Flow - PRIMARY CENTRAL WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-blue-400/20 bg-blue-950/40 backdrop-blur-sm p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Monthly Cash Flow</h3>
              <p className="text-sm text-blue-200/60">Income, Expenses & Net Savings</p>
            </div>
            {/* Timeframe Toggle */}
            <div className="flex gap-2">
              {[3, 6, 12].map(months => (
                <Button
                  key={months}
                  size="sm"
                  variant={timeframe === months ? 'default' : 'outline'}
                  onClick={() => setTimeframe(months as 3 | 6 | 12)}
                  className="text-xs h-8"
                  data-testid={`button-timeframe-${months}`}
                >
                  {months}M
                </Button>
              ))}
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={320}>
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
              <Legend />
              <Area type="monotoneX" dataKey="income" stroke="#66BB6A" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotoneX" dataKey="expenses" stroke="#E53935" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* SECTION 3: Right-Hand Rail - Growth Rate Indicator */}
        <Card className="border-green-400/30 bg-gradient-to-br from-green-900/40 to-green-950/30 backdrop-blur-sm p-6 shadow-card">
          <div className="h-full flex flex-col justify-between">
            <div>
              <p className="text-xs text-green-200/70 mb-2 font-semibold">GROWTH RATE</p>
              <p className="text-3xl font-bold text-green-50 animate-countUp">{growthRate.toFixed(1)}%</p>
              <p className="text-xs text-green-200/50 mt-2">Monthly growth</p>
            </div>
            <div className="mt-4 pt-4 border-t border-green-400/20">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/40 text-xs">
                {growthRate > 10 ? 'Excellent' : growthRate > 5 ? 'Good' : growthRate > 0 ? 'Fair' : 'Needs Work'}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 4: Main Content + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Secondary Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Spending Pattern */}
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

        {/* Right: Persistent Right-Hand Rail */}
        <div className="space-y-6">
          {/* Portfolio Breakdown Donut Chart */}
          {(() => {
            const totalValue = categoryData.reduce((sum, item) => sum + item.value, 0);
            const donutData = categoryData.filter(item => item.value > 0).map(item => ({
              ...item,
              percentage: totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0
            }));
            
            return (
              <Card className="border-purple-400/20 bg-purple-950/40 backdrop-blur-sm p-6 shadow-card">
                <h3 className="text-lg font-bold text-white mb-1">Portfolio Breakdown</h3>
                <p className="text-xs text-purple-200/60 mb-4">Asset allocation</p>
                
                {donutData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-purple-300/60 text-xs text-center">No investments yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="value"
                          onMouseEnter={(_, index) => setHoveredSlice(index)}
                          onMouseLeave={() => setHoveredSlice(null)}
                        >
                          {donutData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              opacity={hoveredSlice === null || hoveredSlice === index ? 1 : 0.5}
                              className="transition-opacity"
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1A237E', 
                            border: '1px solid rgba(66, 165, 245, 0.3)',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="space-y-2">
                      {donutData.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center gap-2 p-2 rounded-lg bg-purple-900/20 hover-elevate cursor-pointer transition-all text-xs"
                          onMouseEnter={() => setHoveredSlice(idx)}
                          onMouseLeave={() => setHoveredSlice(null)}
                        >
                          <div 
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-purple-200 truncate">{item.name}</p>
                            <p className="text-purple-200/60">{item.percentage}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })()}

          {/* Consolidated Key Insights & Health Score */}
          <Card className="border-cyan-400/20 bg-cyan-950/40 backdrop-blur-sm p-6 shadow-card">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-cyan-400" />
              Health Score
            </h3>
            
            <div className="flex items-center justify-center py-4 mb-4">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(100, 150, 200, 0.2)" strokeWidth="8" />
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    fill="none" 
                    stroke="#42A5F5" 
                    strokeWidth="8" 
                    strokeDasharray={`${(financialHealth / 100) * 314} 314`}
                    className="transition-all"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-cyan-300">{Math.round(financialHealth)}</span>
                </div>
              </div>
            </div>
            
            <p className="text-center text-cyan-200 text-xs font-semibold mb-3">
              {financialHealth > 75 ? 'Excellent' : financialHealth > 50 ? 'Good' : financialHealth > 25 ? 'Fair' : 'Needs Work'}
            </p>

            {/* Key Insights */}
            <div className="border-t border-cyan-400/20 pt-4 space-y-2">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-xs text-green-300 font-semibold">✓ Portfolio diversified</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-300 font-semibold">⚠ Increase savings</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-300 font-semibold">📈 On track for goals</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
