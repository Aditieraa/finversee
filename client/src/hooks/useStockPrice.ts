import { useQuery } from '@tanstack/react-query';
import { getStock, StockData } from '@/lib/stocks-client';

/**
 * Custom hook to fetch real-time stock price
 */
export function useStockPrice(symbol: string) {
  return useQuery({
    queryKey: ['/api/stocks', symbol],
    queryFn: () => getStock(symbol),
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: !!symbol,
  });
}

/**
 * Custom hook to fetch multiple stock prices
 */
export function useStockPrices(symbols: string[]) {
  return useQuery<StockData[]>({
    queryKey: ['/api/stocks', symbols],
    queryFn: async () => {
      if (symbols.length === 0) return [];
      
      const response = await fetch('/api/stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch stocks');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: symbols.length > 0,
  });
}
