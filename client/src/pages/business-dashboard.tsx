import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Activity, Zap } from 'lucide-react';

// Dummy business metrics
const businessMetrics = {
  totalUsers: 15000,
  paidUsers: 4500, // 30% conversion
  freeUsers: 10500,
  
  tierBreakdown: {
    free: { users: 10500, percentage: 70 },
    pro: { users: 3000, percentage: 20, price: 199 },
    premium: { users: 1500, percentage: 10, price: 499 },
  },

  monthlyRevenue: {
    subscriptions: {
      pro: 3000 * 199,       // 597,000
      premium: 1500 * 499,   // 748,500
      total: (3000 * 199) + (1500 * 499), // 1,345,500
    },
    inAppPurchases: 450000,  // 30% conversion × 100 avg purchase
    courses: 225000,         // 15% conversion × 400 avg course price
    affiliates: 75000,       // 5% commission on referrals
  },

  revenueBySource: [
    { name: 'Subscriptions', value: 1345500, percentage: 74 },
    { name: 'In-App Purchases', value: 450000, percentage: 25 },
    { name: 'Courses', value: 225000, percentage: 12 },
    { name: 'Affiliates', value: 75000, percentage: 4 },
  ],

  monthlyGrowth: [
    { month: 'Jan', users: 2000, revenue: 200000 },
    { month: 'Feb', users: 4500, revenue: 450000 },
    { month: 'Mar', users: 8000, revenue: 850000 },
    { month: 'Apr', users: 12000, revenue: 1200000 },
    { month: 'May', users: 15000, revenue: 1800000 },
    { month: 'Jun', users: 18000, revenue: 2100000 },
  ],

  conversionFunnels: [
    { stage: 'Free Users', users: 10500, percentage: 100 },
    { stage: 'Viewed Pricing', users: 4950, percentage: 47 },
    { stage: 'Purchased (Free→Paid)', users: 4500, percentage: 43 },
    { stage: 'Store Purchases', users: 1350, percentage: 30 },
    { stage: 'Course Enrollments', users: 675, percentage: 15 },
  ],

  tierMetrics: [
    { tier: 'Free', users: 10500, arpu: 0, mrr: 0 },
    { tier: 'Pro', users: 3000, arpu: 199, mrr: 597000 },
    { tier: 'Premium', users: 1500, arpu: 499, mrr: 748500 },
  ],
};

// Calculate totals
const totalMonthlyRevenue = 
  businessMetrics.monthlyRevenue.subscriptions.total +
  businessMetrics.monthlyRevenue.inAppPurchases +
  businessMetrics.monthlyRevenue.courses +
  businessMetrics.monthlyRevenue.affiliates;

const profitEstimate = totalMonthlyRevenue * 0.65; // Assume 35% costs, 65% profit
const annualRevenue = totalMonthlyRevenue * 12;
const annualProfit = profitEstimate * 12;

const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Business Analytics</h1>
          <p className="text-blue-200">Finverse Monetization Model & Profit Generation</p>
        </div>

        {/* Key Metrics Row 1 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Total Users */}
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-white">{businessMetrics.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-blue-300 mt-2">📈 +30% This Month</p>
              </div>
              <Users className="w-10 h-10 text-blue-400 opacity-50" />
            </div>
          </Card>

          {/* Monthly Revenue */}
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm mb-1">Monthly Revenue</p>
                <p className="text-3xl font-bold text-white">₹{(totalMonthlyRevenue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-green-300 mt-2">🚀 {((totalMonthlyRevenue / 100000) * 12 / 10).toFixed(1)}Cr/year</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-400 opacity-50" />
            </div>
          </Card>

          {/* Monthly Profit */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm mb-1">Monthly Profit (Est.)</p>
                <p className="text-3xl font-bold text-white">₹{(profitEstimate / 100000).toFixed(1)}L</p>
                <p className="text-xs text-purple-300 mt-2">65% margin | 35% costs</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-400 opacity-50" />
            </div>
          </Card>

          {/* Conversion Rate */}
          <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm mb-1">Free→Paid Conversion</p>
                <p className="text-3xl font-bold text-white">43%</p>
                <p className="text-xs text-orange-300 mt-2">{businessMetrics.paidUsers.toLocaleString()} paid users</p>
              </div>
              <Target className="w-10 h-10 text-orange-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Sources */}
          <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-6">Revenue Sources</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={businessMetrics.revenueBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {businessMetrics.revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Revenue Details */}
            <div className="space-y-3 mt-6">
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                <span className="text-slate-300">Subscriptions (Pro + Premium)</span>
                <span className="text-blue-300 font-semibold">₹{(businessMetrics.monthlyRevenue.subscriptions.total / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                <span className="text-slate-300">In-App Store (Boosters, Skins)</span>
                <span className="text-blue-300 font-semibold">₹{(businessMetrics.monthlyRevenue.inAppPurchases / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                <span className="text-slate-300">Courses</span>
                <span className="text-blue-300 font-semibold">₹{(businessMetrics.monthlyRevenue.courses / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                <span className="text-slate-300">Affiliate Commissions</span>
                <span className="text-blue-300 font-semibold">₹{(businessMetrics.monthlyRevenue.affiliates / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </Card>

          {/* Subscription Tier Distribution */}
          <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-6">User Distribution by Tier</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { tier: 'Free', users: businessMetrics.tierBreakdown.free.users, percentage: 70 },
                  { tier: 'Pro', users: businessMetrics.tierBreakdown.pro.users, percentage: 20 },
                  { tier: 'Premium', users: businessMetrics.tierBreakdown.premium.users, percentage: 10 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="tier" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="users" fill="#3b82f6" />
                <Bar dataKey="percentage" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>

            {/* Tier Stats */}
            <div className="space-y-3 mt-6">
              <div className="p-3 bg-slate-700/30 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 font-semibold">Free</span>
                  <Badge className="bg-slate-600">70%</Badge>
                </div>
                <p className="text-sm text-slate-400">{businessMetrics.tierBreakdown.free.users.toLocaleString()} users | ₹0 ARPU</p>
              </div>
              <div className="p-3 bg-blue-900/30 rounded border border-blue-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-300 font-semibold">Pro (₹199/mo)</span>
                  <Badge className="bg-blue-600">20%</Badge>
                </div>
                <p className="text-sm text-blue-200">{businessMetrics.tierBreakdown.pro.users.toLocaleString()} users | ₹199 ARPU | ₹{(businessMetrics.monthlyRevenue.subscriptions.pro / 100000).toFixed(1)}L/mo</p>
              </div>
              <div className="p-3 bg-purple-900/30 rounded border border-purple-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-300 font-semibold">Premium (₹499/mo)</span>
                  <Badge className="bg-purple-600">10%</Badge>
                </div>
                <p className="text-sm text-purple-200">{businessMetrics.tierBreakdown.premium.users.toLocaleString()} users | ₹499 ARPU | ₹{(businessMetrics.monthlyRevenue.subscriptions.premium / 100000).toFixed(1)}L/mo</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Growth Projection */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-6">User & Revenue Growth Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={businessMetrics.monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#f1f5f9' }}
                formatter={(value) => {
                  if (value > 1000) return `₹${(value / 100000).toFixed(1)}L`;
                  return value.toLocaleString();
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Total Users"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                name="Revenue (₹)"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Profit Model Breakdown */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Monthly */}
          <Card className="bg-gradient-to-br from-green-900/30 to-slate-900 border-green-500/30 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Monthly Economics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Revenue</span>
                <span className="text-green-300 font-semibold">₹{(totalMonthlyRevenue / 100000).toFixed(1)}L</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between">
                <span className="text-slate-300">Operating Costs (35%)</span>
                <span className="text-orange-300 font-semibold">₹{((totalMonthlyRevenue * 0.35) / 100000).toFixed(1)}L</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between bg-green-900/30 p-2 rounded">
                <span className="text-green-200 font-semibold">Net Profit (65%)</span>
                <span className="text-green-300 font-bold text-lg">₹{(profitEstimate / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </Card>

          {/* Annual */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-slate-900 border-blue-500/30 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Annual Economics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Revenue</span>
                <span className="text-blue-300 font-semibold">₹{(annualRevenue / 10000000).toFixed(1)}Cr</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between">
                <span className="text-slate-300">Operating Costs (35%)</span>
                <span className="text-orange-300 font-semibold">₹{((annualRevenue * 0.35) / 10000000).toFixed(1)}Cr</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between bg-blue-900/30 p-2 rounded">
                <span className="text-blue-200 font-semibold">Net Profit (65%)</span>
                <span className="text-blue-300 font-bold text-lg">₹{(annualProfit / 10000000).toFixed(1)}Cr</span>
              </div>
            </div>
          </Card>

          {/* KPIs */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900 border-purple-500/30 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Key Performance Indicators</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">ARPU (All Users)</span>
                <span className="text-purple-300 font-semibold">₹{(totalMonthlyRevenue / businessMetrics.totalUsers).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">CAC (Customer Acq. Cost)</span>
                <span className="text-purple-300 font-semibold">₹500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">LTV (Lifetime Value)</span>
                <span className="text-purple-300 font-semibold">₹15,000</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between">
                <span className="text-slate-300 font-semibold">LTV:CAC Ratio</span>
                <Badge className="bg-green-600">30:1 ✓</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Revenue Model Explanation */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            Monetization Model Breakdown
          </h3>

          <div className="grid md:grid-cols-5 gap-4">
            {/* Subscriptions */}
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 font-semibold text-sm mb-3">1. SUBSCRIPTIONS</p>
              <div className="text-xs text-slate-300 space-y-2">
                <div>
                  <p className="font-semibold text-blue-200">Pro: ₹199/mo</p>
                  <p>3,000 users × 12 = ₹72L/year</p>
                </div>
                <div>
                  <p className="font-semibold text-purple-200">Premium: ₹499/mo</p>
                  <p>1,500 users × 12 = ₹90L/year</p>
                </div>
                <p className="text-blue-300 font-bold mt-2">₹162L/year</p>
              </div>
            </div>

            {/* In-App */}
            <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4">
              <p className="text-orange-300 font-semibold text-sm mb-3">2. IN-APP STORE</p>
              <div className="text-xs text-slate-300 space-y-2">
                <p>30% of paid users buy items</p>
                <p>₹1,350 avg spent per buyer</p>
                <div className="border-t border-slate-700 pt-2">
                  <p className="text-orange-300 font-bold">₹54L/year</p>
                </div>
              </div>
            </div>

            {/* Courses */}
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 font-semibold text-sm mb-3">3. COURSES</p>
              <div className="text-xs text-slate-300 space-y-2">
                <p>15% of users enroll</p>
                <p>Avg ₹400 per course</p>
                <p>2,250 enrollments</p>
                <div className="border-t border-slate-700 pt-2">
                  <p className="text-green-300 font-bold">₹27L/year</p>
                </div>
              </div>
            </div>

            {/* Affiliates */}
            <div className="bg-pink-900/30 border border-pink-500/30 rounded-lg p-4">
              <p className="text-pink-300 font-semibold text-sm mb-3">4. AFFILIATE</p>
              <div className="text-xs text-slate-300 space-y-2">
                <p>Zerodha, Digit, Banking</p>
                <p>1-5% commission</p>
                <p>₹75L/month estimated</p>
                <div className="border-t border-slate-700 pt-2">
                  <p className="text-pink-300 font-bold">₹9L/year</p>
                </div>
              </div>
            </div>

            {/* B2B */}
            <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-4">
              <p className="text-indigo-300 font-semibold text-sm mb-3">5. B2B LICENSING</p>
              <div className="text-xs text-slate-300 space-y-2">
                <p>Schools: ₹7,500/mo</p>
                <p>20 institutions</p>
                <p>Potential ₹18L/year</p>
                <div className="border-t border-slate-700 pt-2">
                  <p className="text-indigo-300 font-bold">₹18L/year</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <p className="text-green-300 font-bold text-lg">
              Total Annual Revenue: ₹{(annualRevenue / 10000000).toFixed(1)}Cr | Profit Margin: 65% | Annual Profit: ₹{(annualProfit / 10000000).toFixed(1)}Cr
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
