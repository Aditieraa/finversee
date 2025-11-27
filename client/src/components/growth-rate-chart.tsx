import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface GrowthRateChartProps {
  currentGrowthRate: number;
  historicalData?: Array<{ month: string; rate: number }>;
}

export function GrowthRateChart({ currentGrowthRate, historicalData = [] }: GrowthRateChartProps) {
  // Generate mock historical data if none provided
  const data = historicalData.length > 0 ? historicalData : Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    rate: Math.max(0, currentGrowthRate - (12 - i) * 0.5 + Math.random() * 2),
  }));

  const avgRate = data.reduce((sum, d) => sum + d.rate, 0) / data.length;

  return (
    <Card className="border-green-400/30 bg-gradient-to-br from-green-900/40 to-green-950/30 backdrop-blur-sm p-6 shadow-card">
      <div className="space-y-4">
        <div>
          <p className="text-xs text-green-200/70 mb-1 font-semibold">GROWTH RATE TREND</p>
          <p className="text-3xl font-bold text-green-50 animate-countUp">{currentGrowthRate.toFixed(1)}%</p>
          <p className="text-xs text-green-200/50 mt-1">Current month • Avg: {avgRate.toFixed(1)}%</p>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} animationDuration={800}>
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#66BB6A" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 200, 100, 0.15)" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="rgba(160, 180, 204, 0.4)" 
              style={{ fontSize: '11px' }} 
              tick={{ fill: 'rgba(160, 180, 204, 0.6)' }}
            />
            <YAxis 
              stroke="rgba(160, 180, 204, 0.4)" 
              style={{ fontSize: '11px' }}
              tick={{ fill: 'rgba(160, 180, 204, 0.6)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A2E0E', 
                border: '1px solid rgba(102, 187, 106, 0.3)',
                borderRadius: '8px',
                boxShadow: '0 0 12px rgba(102, 187, 106, 0.2)'
              }}
              cursor={{ strokeDasharray: '5 5', stroke: 'rgba(102, 187, 106, 0.5)' }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Line
              type="monotoneX"
              dataKey="rate"
              stroke="#66BB6A"
              strokeWidth={2}
              dot={{ fill: '#66BB6A', r: 3 }}
              activeDot={{ r: 5 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <span className="text-xs text-green-200 font-semibold">Status</span>
          <span className={`text-sm font-bold ${currentGrowthRate > 10 ? 'text-green-400' : currentGrowthRate > 5 ? 'text-yellow-400' : 'text-orange-400'}`}>
            {currentGrowthRate > 10 ? 'Excellent' : currentGrowthRate > 5 ? 'Good' : currentGrowthRate > 0 ? 'Fair' : 'Needs Work'}
          </span>
        </div>
      </div>
    </Card>
  );
}
