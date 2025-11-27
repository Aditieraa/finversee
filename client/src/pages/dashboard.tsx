import { useState } from 'react';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Coins, Target, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { NumberCounter } from '@/components/number-counter';
import { NextStepWidget } from '@/components/next-step-widget';
import { QuickActionsBar } from '@/components/quick-actions-bar';
import { GrowthRateChart } from '@/components/growth-rate-chart';

interface DashboardProps {
  gameState: any;
  monthlyDecisions: any;
  onAddIncome?: (amount: number) => void;
  onAddExpense?: (amount: number) => void;
  onInvest?: () => void;
  quickActionsOpen?: boolean;
  onToggleQuickActions?: () => void;
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

export default function Dashboard({
  gameState,
  monthlyDecisions,
  onAddIncome = () => {},
  onAddExpense = () => {},
  onInvest = () => {},
  quickActionsOpen = false,
  onToggleQuickActions = () => {},
}: DashboardProps) {
  const [timeframe, setTimeframe] = useState<3 | 6 | 12>(6);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // Generate chart data from game state
  const generateMonthlyData = (months: number) => {
    const data = [];
    // Always show requested months for better visualization (not limited by currentMonth)
    for (let i = 1; i <= months; i++) {
      // Show actual monthly expenses (tracked from Quick Actions) or profile expenses if no tracked expenses
      const monthlyExpenses = i === gameState.currentMonth ? (gameState.monthlyExpensesThisMonth || gameState.userProfile?.expenses || 0) : (gameState.userProfile?.expenses || 0);
      const salary = gameState.userProfile?.salary || 0;
      data.push({
        month: `M${i}`,
        income: salary,
        expenses: monthlyExpenses,
        net: salary - monthlyExpenses,
      });
    }
    return data.length > 0 ? data : [
      { month: 'M1', income: 0, expenses: 0, net: 0 },
      { month: 'M2', income: 0, expenses: 0, net: 0 },
      { month: 'M3', income: 0, expenses: 0, net: 0 },
    ];
  };

  const generateCategoryData = () => {
    // Portfolio breakdown = stock holdings only (breakdown by stock)
    if (!gameState.stockHoldings || gameState.stockHoldings.length === 0) {
      return [];
    }
    
    const total = gameState.stockHoldings.reduce((sum: number, h: any) => sum + (h.investmentAmount || 0), 0);
    const colors = Object.values(CHART_COLORS);
    return gameState.stockHoldings.map((holding: any, idx: number) => ({
      name: holding.symbol,
      value: holding.investmentAmount || 0,
      percentage: total > 0 ? (((holding.investmentAmount || 0) / total) * 100).toFixed(1) : 0,
      color: colors[idx % colors.length],
    }));
  };

  const calculateStockPortfolioValue = () => {
    if (!gameState.stockHoldings || gameState.stockHoldings.length === 0) return 0;
    return gameState.stockHoldings.reduce((total: number, holding: any) => {
      return total + (holding.investmentAmount || 0);
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

  // ACTUAL PORTFOLIO - from gameState only
  const monthlyAvailable = (gameState.userProfile?.salary || 0) - (gameState.userProfile?.expenses || 0);
  
  // Portfolio value = only actual stock investments (investmentAmount)
  const stockInvestmentValue = gameState.stockHoldings && gameState.stockHoldings.length > 0
    ? gameState.stockHoldings.reduce((total: number, holding: any) => total + (holding.investmentAmount || 0), 0)
    : 0;
  const totalInvestedValue = stockInvestmentValue;
  
  // Cash available to invest = Monthly savings capacity (salary - expenses)
  const cashBalance = monthlyAvailable;
  
  const growthRate = monthlyAvailable > 0 ? (totalInvestedValue / monthlyAvailable / Math.max(gameState.currentMonth - 1, 1) * 100) : 0;
  const financialHealth = Math.min(Math.max((growthRate / 50 * 100), 0), 100);

  // Calculate emergency fund level (target: 3-6 months of expenses)
  const emergencyFundTarget = (gameState.userProfile?.expenses || 50000) * 6;
  const emergencyFundLevel = (cashBalance / emergencyFundTarget) * 100;

  // Calculate savings rate
  const savingsRate = monthlyAvailable > 0 ? (monthlyAvailable / (gameState.userProfile?.salary || 1)) * 100 : 0;

  // Calculate portfolio percentage - net worth = cash + investments
  const totalNetWorth = cashBalance + totalInvestedValue;
  const portfolioPercentage = totalNetWorth > 0 ? (totalInvestedValue / totalNetWorth) * 100 : 0;

  return (
    <div className="space-y-6 pb-20">
      {/* Quick Actions Bar */}
      <QuickActionsBar
        onAddIncome={onAddIncome}
        onAddExpense={onAddExpense}
        onInvest={onInvest}
        isOpen={quickActionsOpen}
        onToggle={onToggleQuickActions}
      />
      {/* SECTION 1: Financial Snapshot - Top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cash Available - REAL DATA */}
        <Card className="border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-blue-950/30 backdrop-blur-sm p-6 hover-elevate shadow-card card-interactive">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-blue-200/70 mb-2 font-semibold">CASH AVAILABLE</p>
              <p className="text-3xl font-bold text-blue-50">
                ₹<NumberCounter value={Math.round(cashBalance)} />
              </p>
              <p className="text-xs text-blue-200/50 mt-2">Cash on hand</p>
            </div>
            <Coins className="h-8 w-8 text-blue-400/60" />
          </div>
        </Card>

        {/* Monthly Expenses */}
        <Card className="border-red-400/30 bg-gradient-to-br from-red-900/40 to-red-950/30 backdrop-blur-sm p-6 hover-elevate shadow-card card-interactive">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-red-200/70 mb-2 font-semibold">MONTHLY EXPENSES</p>
              <p className="text-3xl font-bold text-red-50">
                ₹<NumberCounter value={Math.round(gameState.monthlyExpensesThisMonth || gameState.userProfile?.expenses || 0)} />
              </p>
              <p className="text-xs text-red-200/50 mt-2">Monthly spending</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-400/60" />
          </div>
        </Card>

        {/* Portfolio Value - REAL DATA - LARGER (spans 2 cols on medium+) */}
        <Card className="border-blue-400/30 bg-gradient-to-br from-blue-900/40 to-blue-950/30 backdrop-blur-sm p-6 hover-elevate shadow-card md:col-span-2 card-interactive">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-blue-200/70 mb-2 font-semibold">PORTFOLIO VALUE</p>
              <p className="text-4xl font-bold text-blue-50">
                ₹<NumberCounter value={Math.round(totalInvestedValue)} />
              </p>
              <p className="text-xs text-blue-200/50 mt-2">Actual investments (Portfolio + Stocks)</p>
            </div>
            <Target className="h-8 w-8 text-blue-400/60" />
          </div>
        </Card>
      </div>

      {/* SECTION 2: Monthly Cash Flow - PRIMARY CENTRAL WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-blue-400/20 bg-blue-950/40 backdrop-blur-sm p-6 shadow-card lg:col-span-2 card-interactive animate-tabSlideIn">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Monthly Cash Flow</h3>
              <p className="text-sm text-blue-200/60">Income, Expenses & Net Savings</p>
            </div>
            {/* Timeframe Toggle */}
            <div className="flex gap-2">
              {[3, 6, 12].map((months: number) => (
                <Button
                  key={months}
                  size="sm"
                  variant={timeframe === months ? 'default' : 'outline'}
                  onClick={() => setTimeframe(months as 3 | 6 | 12)}
                  className="text-xs h-8 transition-all hover:shadow-md"
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
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A237E', 
                  border: '1px solid rgba(66, 165, 245, 0.3)', 
                  borderRadius: '8px',
                  boxShadow: '0 0 12px rgba(66, 165, 245, 0.2)'
                }}
                cursor={{ strokeDasharray: '5 5', stroke: 'rgba(66, 165, 245, 0.5)' }}
              />
              <Legend />
              <Area 
                type="monotoneX" 
                dataKey="income" 
                stroke="#66BB6A" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorIncome)"
               
              />
              <Area 
                type="monotoneX" 
                dataKey="expenses" 
                stroke="#E53935" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorExpenses)"
               
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* SECTION 3: Right-Hand Rail - Growth Rate Chart */}
        <GrowthRateChart currentGrowthRate={growthRate} />
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

          {/* Toggle Button - Toggle Switch Style */}
          <div className="flex justify-start" style={{ visibility: quickActionsOpen ? 'hidden' : 'visible' }}>
            <button
              onClick={onToggleQuickActions}
              className="relative inline-flex h-8 w-20 items-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-purple-300/50 overflow-hidden group"
              style={{
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(168, 85, 247, 0.3)'
              }}
              data-testid="button-toggle-actions"
            >
              {/* Star decoration */}
              <span className="absolute left-1 top-0.5 w-1 h-1 rounded-full bg-purple-200/40 group-hover:bg-purple-200/60 transition-colors" />
              <span className="absolute left-8 -top-0.5 w-0.5 h-0.5 rounded-full bg-pink-200/40 group-hover:bg-pink-200/60 transition-colors" />
              <span className="absolute left-4 bottom-1 w-0.5 h-0.5 rounded-full bg-purple-200/30 group-hover:bg-purple-200/50 transition-colors" />
              
              {/* White circle - toggle indicator */}
              <span className="inline-flex h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform duration-300 group-hover:shadow-xl ml-0.5 flex-shrink-0 relative" style={{
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.4)'
              }} />
            </button>
          </div>
        </div>

        {/* Right: Persistent Right-Hand Rail */}
        <div className="space-y-6">
          {/* Next Step Widget - Top Priority Recommendation */}
          <div style={{ minHeight: '390px' }}>
            <NextStepWidget
              financialHealth={financialHealth}
              emergencyFundLevel={Math.min(emergencyFundLevel, 100)}
              savingsRate={savingsRate}
              portfolioPercentage={portfolioPercentage}
              onTakeAction={() => {
                if (emergencyFundLevel < 30) {
                  alert('Set up automatic savings for your emergency fund');
                } else if (savingsRate < 20) {
                  alert('Create a savings goal');
                } else {
                  onInvest();
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: Portfolio Breakdown & Health Score - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Breakdown Donut Chart */}
        {(() => {
          const totalValue = categoryData.reduce((sum: number, item: any) => sum + item.value, 0);
          const donutData = categoryData.filter((item: any) => item.value > 0).map((item: any) => ({
            ...item,
            percentage: totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0
          }));
          
          return (
            <Card className="border-purple-400/20 bg-purple-950/40 backdrop-blur-sm p-6 shadow-card h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-1">Portfolio Breakdown</h3>
              <p className="text-xs text-purple-200/60 mb-4">Asset allocation</p>
              
              {donutData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-purple-300/60 text-xs text-center">No investments yet</p>
                </div>
              ) : (
                <div className="flex-1 space-y-3 flex flex-col">
                  <div className="relative flex items-center justify-center flex-1">
                    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={3}
                          dataKey="value"
                          onMouseEnter={(_, index) => setHoveredSlice(index)}
                          onMouseLeave={() => setHoveredSlice(null)}
                          animationDuration={600}
                        >
                          {donutData.map((entry: any, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              opacity={hoveredSlice === null || hoveredSlice === index ? 1 : 0.4}
                              className="transition-all hover:filter hover:brightness-110"
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
                    {/* Center Text Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-xs text-purple-200/60">Total Portfolio</p>
                      <p className="text-lg font-bold text-purple-100">
                        ₹{(totalValue / 100000).toFixed(1)}L
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {donutData.map((item: any, idx: number) => (
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
        <Card className="border-cyan-400/20 bg-cyan-950/40 backdrop-blur-sm p-6 shadow-card h-full flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-cyan-400" />
            Health Score
          </h3>
          
          <div className="flex items-center justify-center py-4 mb-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 120 120">
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
                <span className="text-lg font-bold text-cyan-300">{Math.round(financialHealth)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-center text-cyan-200 text-xs font-semibold mb-4">
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
  );
}
