import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';

interface PortfolioDonutProps {
  data: Array<{
    name: string;
    value: number;
    percentage: string | number;
    color: string;
  }>;
  totalValue: number;
}

export function PortfolioDonutChart({ data, totalValue }: PortfolioDonutProps) {
  const validData = data.filter(item => item.value > 0);
  const hasData = validData.length > 0;

  if (!hasData) {
    return (
      <Card className="border-purple-400/20 bg-purple-950/40 backdrop-blur-sm p-6 shadow-card h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-purple-300/60 mb-2">No investments yet</p>
          <p className="text-sm text-purple-200/40">Start investing to see your portfolio breakdown!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-purple-400/20 bg-purple-950/40 backdrop-blur-sm p-6 shadow-card">
      <h3 className="text-xl font-bold text-white mb-1">Portfolio Breakdown</h3>
      <p className="text-sm text-purple-200/60 mb-4">Asset allocation across categories</p>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Donut Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={validData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
              >
                {validData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity"
                  />
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
        </div>

        {/* Center Display */}
        <div className="flex flex-col items-center justify-center lg:items-end gap-4">
          <div className="text-center lg:text-right">
            <p className="text-sm text-purple-200/60 mb-1">TOTAL PORTFOLIO</p>
            <p className="text-4xl font-bold text-purple-50 animate-countUp">
              ₹{Math.round(totalValue).toLocaleString('en-IN')}
            </p>
          </div>

          {/* Legend */}
          <div className="space-y-2 w-full">
            {validData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 p-2 rounded-lg hover-elevate cursor-pointer transition-all">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-purple-200/80">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-purple-50">{item.percentage}%</p>
                  <p className="text-xs text-purple-200/50">₹{Math.round(item.value).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
