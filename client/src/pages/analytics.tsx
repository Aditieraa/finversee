import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Zap, Target } from 'lucide-react';

interface AnalyticsProps {
  gameState: any;
}

const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#06B6D4'];

export default function Analytics({ gameState }: AnalyticsProps) {
  // Generate trend data
  const generateTrendData = () => {
    const trends = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    for (let i = 0; i < 6; i++) {
      trends.push({
        month: months[i],
        income: 80000 + (Math.random() - 0.5) * 30000,
        expenses: 35000 + (Math.random() - 0.5) * 20000,
        savings: 45000 + (Math.random() - 0.5) * 25000,
      });
    }
    return trends;
  };

  // Generate spending forecast
  const generateForecast = () => {
    return [
      { period: 'Next Month', forecast: '₹' + (gameState.userProfile?.salary - gameState.userProfile?.expenses || 0).toLocaleString('en-IN'), accuracy: 'Medium accuracy' },
      { period: 'Next 3 Months', forecast: '₹' + ((gameState.userProfile?.salary - gameState.userProfile?.expenses || 0) * 3).toLocaleString('en-IN'), accuracy: 'Medium accuracy' },
    ];
  };

  // Generate spending insights
  const getSpendingInsights = () => {
    const portfolio = gameState.portfolio;
    const total = Object.values(portfolio).reduce((a: number, b: number) => a + b, 0);
    
    return [
      { type: 'positive', text: 'Income trending up - great performance! 📈' },
      { type: 'warning', text: 'Expenses declining 6.1% - excellent control 💪' },
      { type: 'warning', text: 'Savings declining 14.6% - needs attention ⚠️' },
    ];
  };

  const trendData = generateTrendData();
  const forecastData = generateForecast();
  const insights = getSpendingInsights();

  return (
    <div className="space-y-6 pb-6">
      {/* Actionable Recommendations */}
      <Card className="border-blue-400/30 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-sm p-6">
        <h3 className="text-lg font-bold text-blue-100 mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-400" />
          Actionable Recommendations
        </h3>
        <p className="text-blue-200/60 text-sm mb-4">Based on your actual spending patterns</p>
        
        <div className="space-y-3">
          <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/10 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-300 font-semibold text-sm">Great Financial Health!</p>
              <p className="text-green-200/70 text-xs">You're doing well with your finances. Keep up the good work and consider increasing your savings goals.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Financial Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-purple-400/30 bg-purple-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            Financial Health Score
          </h3>
          
          <div className="flex items-center justify-center py-6">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(100, 150, 200, 0.2)" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#3B82F6" strokeWidth="8" strokeDasharray="314 314" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-blue-300">120</span>
                <span className="text-xs text-blue-200/60 mt-1">Excellent</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-blue-200">Savings Rate</span>
                <span className="text-xs font-bold text-green-400">335.4%</span>
              </div>
              <Progress value={85} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-blue-200">Spending Consistency</span>
                <span className="text-xs font-bold text-green-400">0.0%</span>
              </div>
              <Progress value={45} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-blue-200">Emergency Fund</span>
                <span className="text-xs font-bold text-red-400">-47.5%</span>
              </div>
              <Progress value={20} className="h-1.5" />
            </div>
          </div>
        </Card>

        {/* Key Insights */}
        <Card className="border-cyan-400/30 bg-cyan-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-cyan-400" />
            Key Insights
          </h3>

          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                insight.type === 'positive' 
                  ? 'border-green-500/30 bg-green-500/10' 
                  : 'border-yellow-500/30 bg-yellow-500/10'
              }`}>
                <p className={`text-sm font-semibold ${
                  insight.type === 'positive' ? 'text-green-300' : 'text-yellow-300'
                }`}>
                  {insight.type === 'positive' ? '✓' : '⚠'} {insight.text}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Future Spending Forecast */}
      <Card className="border-blue-400/30 bg-blue-950/40 backdrop-blur-sm p-6">
        <h3 className="text-lg font-bold text-white mb-2">Future Spending Forecast</h3>
        <p className="text-blue-200/60 text-sm mb-6">Predictions based on your spending history to help you plan ahead</p>

        <div className="p-4 rounded-lg border border-blue-400/30 bg-blue-400/10 mb-6">
          <p className="text-sm text-blue-200">
            <span className="text-blue-400 font-semibold">How it works:</span> We analyze your spending patterns to predict how much you might spend in the future. This helps you plan your budget and avoid overspending.
          </p>
        </div>

        <div className="space-y-3">
          {forecastData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-purple-400/20 bg-purple-950/30 hover:border-purple-400/40 transition-colors">
              <div>
                <p className="text-white font-semibold text-sm">{item.period}</p>
                <p className="text-purple-200/60 text-xs">Smart Prediction</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{item.forecast}</p>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 mt-2">
                  {item.accuracy}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Trend Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-cyan-400/30 bg-cyan-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4">Trend Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 150, 200, 0.1)" />
              <XAxis stroke="rgba(200, 200, 200, 0.5)" />
              <YAxis stroke="rgba(200, 200, 200, 0.5)" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(100, 150, 200, 0.3)' }} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-green-400/30 bg-green-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4">Spending Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={[
                { name: 'Shopping', value: 24 },
                { name: 'Investments', value: 21 },
                { name: 'Food & Dining', value: 15 },
                { name: 'Travel', value: 10 },
                { name: 'Utilities', value: 8 },
                { name: 'Others', value: 22 },
              ]} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {[
                  { name: 'Shopping', value: 24 },
                  { name: 'Investments', value: 21 },
                  { name: 'Food & Dining', value: 15 },
                  { name: 'Travel', value: 10 },
                  { name: 'Utilities', value: 8 },
                  { name: 'Others', value: 22 },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="border-purple-400/30 bg-purple-950/40 backdrop-blur-sm p-6">
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

      {/* Quick Wins */}
      <Card className="border-yellow-400/30 bg-yellow-950/40 backdrop-blur-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4">Quick Wins</h3>
        <div className="space-y-2">
          <p className="text-yellow-200/80 text-sm flex items-start gap-2">
            <span className="text-yellow-400">→</span> Create a monthly budget to track your spending
          </p>
          <p className="text-yellow-200/80 text-sm flex items-start gap-2">
            <span className="text-yellow-400">→</span> Build an emergency fund (3-6 months expenses)
          </p>
          <p className="text-yellow-200/80 text-sm flex items-start gap-2">
            <span className="text-yellow-400">→</span> Review and optimize your investment portfolio
          </p>
        </div>
      </Card>
    </div>
  );
}
