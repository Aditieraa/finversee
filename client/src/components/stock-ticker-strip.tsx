import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerData {
  symbol: string;
  price: number;
  changePercent: number;
}

interface StockTickerStripProps {
  stocks: TickerData[];
  hoveredStock?: string | null;
  onHover?: (symbol: string | null) => void;
}

export function StockTickerStrip({ stocks, hoveredStock, onHover }: StockTickerStripProps) {
  if (!stocks || stocks.length === 0) return null;

  // Display top 5 most active stocks
  const displayStocks = stocks.slice(0, 5);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 animate-slideInUp">
      {displayStocks.map((stock) => {
        const isPositive = stock.changePercent >= 0;
        const isHovered = hoveredStock === stock.symbol;
        
        return (
          <Badge
            key={stock.symbol}
            className={`flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap transition-all ${
              isHovered 
                ? 'bg-blue-400/30 border-blue-400/60' 
                : isPositive
                ? 'bg-green-500/20 border-green-500/40 text-green-300'
                : 'bg-red-500/20 border-red-500/40 text-red-300'
            } hover:ring-2 hover:ring-blue-400/50 cursor-pointer`}
            onMouseEnter={() => onHover?.(stock.symbol)}
            onMouseLeave={() => onHover?.(null)}
          >
            <span className="font-bold text-xs">{stock.symbol}</span>
            <span className="text-xs">₹{stock.price.toFixed(2)}</span>
            <div className="flex items-center gap-0.5">
              {isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-400" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400" />
              )}
              <span className="text-xs font-semibold">{Math.abs(stock.changePercent).toFixed(1)}%</span>
            </div>
          </Badge>
        );
      })}
    </div>
  );
}
