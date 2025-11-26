/**
 * Stocks API Integration for Finverse
 * Supports Finnhub (recommended), Alpha Vantage, and Polygon.io
 * All have free tiers available
 */

interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
  lastUpdated: string;
}

interface StockCache {
  data: StockPrice;
  timestamp: number;
}

// Cache for stock prices (5 minute TTL to avoid rate limits)
const stockCache = new Map<string, StockCache>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get stock price from Finnhub (RECOMMENDED - Best free tier)
 * Free tier: 60 requests/minute
 * No credit card required
 * Website: https://finnhub.io
 */
export async function getStockPriceFinnhub(symbol: string): Promise<StockPrice> {
  const apiKey = process.env.FINNHUB_API_KEY;
  
  if (!apiKey) {
    console.error('FINNHUB_API_KEY not set');
    return generateMockStock(symbol);
  }

  // Check cache first
  const cached = stockCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    
    if (!response.ok) {
      console.warn(`Finnhub API error for ${symbol}:`, response.status);
      return generateMockStock(symbol);
    }

    const data = await response.json();
    
    const stockPrice: StockPrice = {
      symbol,
      price: data.c || 0, // current price
      change: data.d || 0, // change
      changePercent: data.dp || 0, // change percent
      timestamp: Date.now(),
      lastUpdated: new Date().toISOString(),
    };

    // Cache the result
    stockCache.set(symbol, { data: stockPrice, timestamp: Date.now() });
    return stockPrice;
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return generateMockStock(symbol);
  }
}

/**
 * Get stock price from Alpha Vantage
 * Free tier: 5 requests/minute
 * Website: https://www.alphavantage.co
 */
export async function getStockPriceAlphaVantage(symbol: string): Promise<StockPrice> {
  const apiKey = process.env.ALPHAVANTAGE_API_KEY;
  
  if (!apiKey) {
    console.error('ALPHAVANTAGE_API_KEY not set');
    return generateMockStock(symbol);
  }

  // Check cache first
  const cached = stockCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      return generateMockStock(symbol);
    }

    const data = await response.json();
    const quote = data['Global Quote'] || {};
    
    const stockPrice: StockPrice = {
      symbol,
      price: parseFloat(quote['05. price'] || '0'),
      change: parseFloat(quote['09. change'] || '0'),
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
      timestamp: Date.now(),
      lastUpdated: new Date().toISOString(),
    };

    // Cache the result
    stockCache.set(symbol, { data: stockPrice, timestamp: Date.now() });
    return stockPrice;
  } catch (error) {
    console.error(`Error fetching stock price from Alpha Vantage for ${symbol}:`, error);
    return generateMockStock(symbol);
  }
}

/**
 * Get stock price from Polygon.io
 * Free tier: 5 requests/minute
 * Website: https://polygon.io
 */
export async function getStockPricePolygon(symbol: string): Promise<StockPrice> {
  const apiKey = process.env.POLYGON_API_KEY;
  
  if (!apiKey) {
    console.error('POLYGON_API_KEY not set');
    return generateMockStock(symbol);
  }

  // Check cache first
  const cached = stockCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://api.polygon.io/v3/quotes/latest?ticker=${symbol}&apiKey=${apiKey}`
    );
    
    if (!response.ok) {
      return generateMockStock(symbol);
    }

    const data = await response.json();
    const quote = data.results || {};
    
    const stockPrice: StockPrice = {
      symbol,
      price: quote.c || 0, // close price
      change: quote.l || 0, // last quote
      changePercent: 0, // Would need to calculate
      timestamp: Date.now(),
      lastUpdated: new Date().toISOString(),
    };

    // Cache the result
    stockCache.set(symbol, { data: stockPrice, timestamp: Date.now() });
    return stockPrice;
  } catch (error) {
    console.error(`Error fetching stock price from Polygon for ${symbol}:`, error);
    return generateMockStock(symbol);
  }
}

/**
 * Main function - Get stock price (uses Finnhub by default)
 * Fallback to mock data if API fails or not configured
 */
export async function getStockPrice(symbol: string): Promise<StockPrice> {
  // Try Finnhub first (best free tier)
  if (process.env.FINNHUB_API_KEY) {
    return getStockPriceFinnhub(symbol);
  }
  
  // Fallback to Alpha Vantage
  if (process.env.ALPHAVANTAGE_API_KEY) {
    return getStockPriceAlphaVantage(symbol);
  }
  
  // Fallback to Polygon
  if (process.env.POLYGON_API_KEY) {
    return getStockPricePolygon(symbol);
  }

  // If no API key configured, use mock data
  console.warn('No stock API configured, using mock data');
  return generateMockStock(symbol);
}

/**
 * Generate mock stock data (fallback when APIs aren't available)
 */
function generateMockStock(symbol: string): StockPrice {
  const basePrice = 100 + Math.random() * 200;
  const change = (Math.random() - 0.5) * 10;
  
  return {
    symbol,
    price: basePrice,
    change,
    changePercent: (change / basePrice) * 100,
    timestamp: Date.now(),
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get multiple stock prices
 */
export async function getStockPrices(symbols: string[]): Promise<StockPrice[]> {
  const promises = symbols.map(symbol => getStockPrice(symbol));
  return Promise.all(promises);
}

/**
 * Clear cache (useful for testing or manual refresh)
 */
export function clearStockCache(): void {
  stockCache.clear();
  console.log('Stock price cache cleared');
}

/**
 * Get cache stats
 */
export function getCacheStats(): { size: number; symbols: string[] } {
  return {
    size: stockCache.size,
    symbols: Array.from(stockCache.keys()),
  };
}
