/**
 * Client-side stocks API utilities
 * Fetches real-time stock data from backend
 */

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
  lastUpdated: string;
}

/**
 * Get real-time stock price for a single symbol
 */
export async function getStock(symbol: string): Promise<StockData | null> {
  try {
    const response = await fetch(`/api/stocks/${symbol.toUpperCase()}`);
    if (!response.ok) {
      console.error(`Failed to fetch stock ${symbol}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching stock ${symbol}:`, error);
    return null;
  }
}

/**
 * Get real-time stock prices for multiple symbols
 */
export async function getStocks(symbols: string[]): Promise<StockData[]> {
  try {
    const response = await fetch('/api/stocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols: symbols.map(s => s.toUpperCase()) }),
    });
    if (!response.ok) {
      console.error('Failed to fetch stocks');
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }
}

/**
 * Get cache statistics
 */
export async function getStockCacheStats(): Promise<{ size: number; symbols: string[] } | null> {
  try {
    const response = await fetch('/api/stocks-cache/stats');
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    return null;
  }
}

/**
 * Popular Indian stocks for investment simulation
 */
export const INDIAN_STOCKS = [
  'RELIANCE',  // Reliance Industries
  'INFY',      // Infosys
  'TCS',       // Tata Consultancy Services
  'HDFC',      // HDFC Bank
  'ICICI',     // ICICI Bank
];

/**
 * Popular global stocks for investment simulation
 */
export const GLOBAL_STOCKS = [
  'AAPL',      // Apple
  'GOOGL',     // Google
  'MSFT',      // Microsoft
  'AMZN',      // Amazon
  'TSLA',      // Tesla
];

/**
 * All available stocks for portfolio
 */
export const ALL_AVAILABLE_STOCKS = [...INDIAN_STOCKS, ...GLOBAL_STOCKS];
