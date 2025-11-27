import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Search, Plus, Zap, Trash2, AlertCircle } from 'lucide-react';
import { INDIAN_STOCKS, GLOBAL_STOCKS } from '@/lib/stocks-client';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
  lastUpdated: string;
}

interface StockHistory {
  time: string;
  price: number;
}

interface StockHolding {
  symbol: string;
  shares: number;
  buyPrice: number;
  investmentAmount: number;
  purchaseDate: string;
}

interface GameState {
  cashBalance: number;
  portfolio: { stocks: number };
  stockHoldings: StockHolding[];
  userProfile?: { salary: number; expenses: number };
  currentMonth?: number;
}

interface StocksProps {
  gameState: GameState;
  setGameState: (state: any) => void;
}

// Dummy prices for when API hasn't loaded yet
const getDummyPrice = (symbol: string): number => {
  const dummyPrices: Record<string, number> = {
    RELIANCE: 2800,
    INFY: 3000,
    TCS: 3500,
    HDFC: 1600,
    ICICI: 900,
    AAPL: 180,
    GOOGL: 140,
    MSFT: 420,
    AMZN: 190,
    TSLA: 250,
  };
  return dummyPrices[symbol] || 100;
};

// Get display price (real or dummy)
const getDisplayPrice = (price: number, symbol: string): number => {
  return price > 0 ? price : getDummyPrice(symbol);
};

export default function Stocks({ gameState, setGameState }: StocksProps) {
  const [selectedStock, setSelectedStock] = useState<string>('RELIANCE');
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'indian' | 'global'>('indian');
  const [successMessage, setSuccessMessage] = useState('');
  const [hoveredStock, setHoveredStock] = useState<string | null>(null);

  // Fetch real-time stock data
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const symbolsToFetch = activeTab === 'indian' ? INDIAN_STOCKS : GLOBAL_STOCKS;
        const response = await fetch('/api/stocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols: symbolsToFetch }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setStocks(data);
          
          if (data.length > 0) {
            const history = generateHistoryData(data[0].price);
            setStockHistory(history);
          }
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const generateHistoryData = (currentPrice: number): StockHistory[] => {
    const history = [];
    for (let i = 24; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * (currentPrice * 0.05);
      const price = currentPrice + variation * (i / 24);
      history.push({
        time: `${24 - i}:00`,
        price: Math.max(price, currentPrice * 0.9),
      });
    }
    return history;
  };

  // REAL cash available from user = Monthly Savings (salary - expenses)
  const realCashAvailable = (gameState.userProfile?.salary || 0) - (gameState.userProfile?.expenses || 0);
  
  const selectedStockData = stocks.find(s => s.symbol === selectedStock);
  const filteredStocks = stocks.filter(s =>
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle investment from REAL cash
  const handleInvest = async () => {
    if (!investmentAmount || parseInt(investmentAmount) <= 0 || !selectedStockData) {
      alert('Please enter a valid investment amount');
      return;
    }

    // IMPORTANT: Always use getDisplayPrice to get actual investable price
    const buyPrice = getDisplayPrice(selectedStockData.price, selectedStockData.symbol);
    
    // Validate buyPrice
    if (isNaN(buyPrice) || !isFinite(buyPrice) || buyPrice <= 0) {
      alert('Stock price unavailable. Please try again.');
      return;
    }

    const amount = parseInt(investmentAmount);
    // Calculate only whole shares
    const wholeShares = Math.floor(amount / buyPrice);
    
    // Validate whole shares
    if (wholeShares <= 0) {
      alert('Amount is too low to buy even 1 share. Please increase the investment amount.');
      return;
    }

    // Recalculate actual investment based on whole shares
    const actualInvestment = wholeShares * buyPrice;

    // Create holding with whole shares only
    const newHolding: StockHolding = {
      symbol: selectedStockData.symbol,
      shares: wholeShares,
      buyPrice: buyPrice,  // Store actual dummy/real price, never 0
      investmentAmount: actualInvestment,
      purchaseDate: new Date().toISOString(),
    };

    // Ensure stockHoldings is initialized
    const holdings = gameState.stockHoldings || [];

    // Check if stock already held
    const existingIndex = holdings.findIndex(h => h.symbol === selectedStockData.symbol);
    let updatedHoldings;

    if (existingIndex >= 0) {
      // Update existing holding - calculate new average buy price
      const existingHolding = holdings[existingIndex];
      const totalInvested = existingHolding.investmentAmount + actualInvestment;
      const totalShares = existingHolding.shares + wholeShares;
      const avgBuyPrice = totalInvested / totalShares;

      updatedHoldings = [...holdings];
      updatedHoldings[existingIndex] = {
        ...existingHolding,
        shares: totalShares,
        buyPrice: avgBuyPrice,  // Average price
        investmentAmount: totalInvested,
      };
    } else {
      updatedHoldings = [...holdings, newHolding];
    }

    // Calculate final average buy price for database
    const finalAvgBuyPrice = existingIndex >= 0 
      ? (holdings[existingIndex].investmentAmount + actualInvestment) / (holdings[existingIndex].shares + wholeShares)
      : buyPrice;

    // Only track holdings - do NOT update portfolio (portfolio is for game only)
    setGameState({
      ...gameState,
      stockHoldings: updatedHoldings,
    });

    // Save stock to database
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      console.log('📊 Stock Investment - User ID:', userId);

      if (!userId) {
        console.error('❌ No user ID found - user may not be authenticated');
        return;
      }

      // Get latest game save
      const { data: latestSave, error: saveError } = await supabase
        .from('game_saves')
        .select('id')
        .eq('user_id', userId)
        .eq('is_latest', true)
        .single();

      console.log('📝 Latest Save:', latestSave, 'Error:', saveError);

      if (!latestSave?.id) {
        console.error('❌ No game save found for user');
        return;
      }

      // Try to insert new stock (store prices as integers in paise to avoid numeric overflow)
      const { data, error: insertError } = await supabase
        .from('stocks')
        .insert({
          user_id: userId,
          game_save_id: latestSave.id,
          symbol: selectedStockData.symbol,
          company_name: selectedStockData.symbol,
          quantity: wholeShares,
          buy_price: Math.round(buyPrice * 100),
          current_price: Math.round(buyPrice * 100),
          total_invested: Math.round(actualInvestment * 100),
          current_value: Math.round(actualInvestment * 100),
          purchase_date: new Date().toISOString(),
        })
        .select();

      console.log('✅ Insert Result:', data, 'Error:', insertError);

      if (insertError) {
        console.error('❌ Stock insert failed:', insertError.message, insertError.details);
        alert(`Error saving to database: ${insertError.message}`);
      }
    } catch (error) {
      console.error('❌ Unexpected error saving stock to database:', error);
    }

    setSuccessMessage(`✓ Invested ₹${actualInvestment.toFixed(0)} in ${selectedStockData.symbol}! You now own ${wholeShares} shares @ ₹${buyPrice.toFixed(2)}`);
    setInvestmentAmount('');
    
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle selling stock
  const handleSell = (holding: StockHolding, currentPrice: number) => {
    const currentValue = holding.shares * currentPrice;
    const profitLoss = currentValue - holding.investmentAmount;

    const updatedHoldings = gameState.stockHoldings && gameState.stockHoldings.length > 0
      ? gameState.stockHoldings.filter(h => h.symbol !== holding.symbol)
      : [];
    
    // Only update holdings - do NOT update portfolio (portfolio is for game only)
    setGameState({
      ...gameState,
      stockHoldings: updatedHoldings,
    });

    const profitOrLoss = profitLoss >= 0 ? `Profit: ₹${profitLoss.toFixed(0)}` : `Loss: ₹${Math.abs(profitLoss).toFixed(0)}`;
    setSuccessMessage(`✓ Sold ${Math.floor(holding.shares)} shares of ${holding.symbol}. ${profitOrLoss}`);
    
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Calculate portfolio values - ACTUAL INVESTED AMOUNT (not current market value)
  const portfolioValue = gameState.stockHoldings && gameState.stockHoldings.length > 0
    ? gameState.stockHoldings.reduce((total, holding) => {
        return total + (holding.investmentAmount || 0);
      }, 0)
    : 0;

  const portfolioGainLoss = gameState.stockHoldings && gameState.stockHoldings.length > 0
    ? gameState.stockHoldings.reduce((total, holding) => {
        // Ensure buyPrice is valid (never 0)
        const buyPrice = isNaN(holding.buyPrice) || holding.buyPrice <= 0 ? getDummyPrice(holding.symbol) : holding.buyPrice;
        
        // Get current price
        const currentStock = stocks.find(s => s.symbol === holding.symbol);
        const currentPrice = currentStock ? getDisplayPrice(currentStock.price, holding.symbol) : getDummyPrice(holding.symbol);
        
        // Calculate gain/loss: (current - buy) * shares
        const gainLoss = (currentPrice - buyPrice) * holding.shares;
        return total + (isNaN(gainLoss) || !isFinite(gainLoss) ? 0 : gainLoss);
      }, 0)
    : 0;

  const chartColors = ['#A5D6A7', '#FFD54F', '#FFAB91', '#CE93D8', '#80DEEA', '#BA68C8', '#81C784', '#FFB74D'];

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Stock Explorer</h1>
          <p className="text-blue-200/60 text-sm mt-1">Real-time market data powered by Finnhub</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-300 border-green-400/30">Live Data</Badge>
        </div>
      </div>

      {/* Real Cash Available */}
      <Card className="border-amber-400/20 bg-amber-950/40 backdrop-blur-sm p-4">
        <p className="text-amber-200/60 text-xs mb-1">Cash Available (Real Budget)</p>
        <p className="text-2xl font-bold text-amber-100">₹{realCashAvailable.toFixed(0)}</p>
        <p className="text-xs text-amber-200/40 mt-1">Use this to invest in real stocks</p>
      </Card>

      {/* Portfolio Summary */}
      {gameState.stockHoldings && gameState.stockHoldings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-cyan-400/20 bg-cyan-950/40 backdrop-blur-sm p-4">
            <p className="text-cyan-200/60 text-xs mb-1">Portfolio Value</p>
            <p className="text-2xl font-bold text-cyan-100">₹{portfolioValue.toFixed(0)}</p>
          </Card>
          <Card className={`border-green-400/20 bg-green-950/40 backdrop-blur-sm p-4`}>
            <p className={`text-xs mb-1 ${portfolioGainLoss >= 0 ? 'text-green-200/60' : 'text-red-200/60'}`}>
              Gain/Loss
            </p>
            <p className={`text-2xl font-bold flex items-center gap-1 ${
              portfolioGainLoss >= 0 ? 'text-green-300' : 'text-red-300'
            }`}>
              {portfolioGainLoss >= 0 ? '+' : ''}₹{portfolioGainLoss.toFixed(0)}
            </p>
          </Card>
          <Card className="border-purple-400/20 bg-purple-950/40 backdrop-blur-sm p-4">
            <p className="text-purple-200/60 text-xs mb-1">Holdings</p>
            <p className="text-2xl font-bold text-purple-100">{gameState.stockHoldings.length}</p>
          </Card>
        </div>
      )}

      {successMessage && (
        <Card className="border-green-400/30 bg-green-950/40 backdrop-blur-sm p-4">
          <p className="text-green-300 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {successMessage}
          </p>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'indian' ? 'default' : 'outline'}
          onClick={() => setActiveTab('indian')}
          className="flex items-center gap-2"
        >
          🇮🇳 Indian Stocks
        </Button>
        <Button
          variant={activeTab === 'global' ? 'default' : 'outline'}
          onClick={() => setActiveTab('global')}
          className="flex items-center gap-2"
        >
          🌍 Global Stocks
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Stock List */}
        <div className="space-y-4">
          <Card className="border-blue-400/20 bg-blue-950/40 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-400" />
              <Input
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-blue-900/30 border-blue-400/20 text-white placeholder:text-blue-300/30"
              />
            </div>
          </Card>

          <div className="space-y-2">
            {loading ? (
              <Card className="border-blue-400/20 bg-blue-950/40 p-4">
                <p className="text-blue-200 text-sm">Loading stocks...</p>
              </Card>
            ) : (
              filteredStocks.map((stock) => (
                <Card
                  key={stock.symbol}
                  className={`border-blue-400/20 bg-blue-950/40 backdrop-blur-sm p-4 cursor-pointer transition-all hover:border-blue-400/60 ${
                    selectedStock === stock.symbol ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => {
                    setSelectedStock(stock.symbol);
                    const displayPrice = getDisplayPrice(stock.price, stock.symbol);
                    setStockHistory(generateHistoryData(displayPrice));
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">{stock.symbol}</h3>
                      <p className="text-xs text-blue-200/60 mt-1">₹{getDisplayPrice(stock.price, stock.symbol).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold flex items-center gap-1 ${
                        stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stock.changePercent >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Chart & Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedStockData && (
            <>
              {/* Stock Details */}
              <Card className="border-cyan-400/30 bg-cyan-950/40 backdrop-blur-sm p-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedStockData.symbol}</h2>
                    <p className="text-cyan-200/60 text-sm mt-1">
                      Last updated: {new Date(selectedStockData.lastUpdated).toLocaleTimeString('en-IN')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-cyan-400/20 bg-cyan-950/30">
                      <p className="text-cyan-200/60 text-xs mb-1">Current Price</p>
                      <p className="text-2xl font-bold text-cyan-100">₹{getDisplayPrice(selectedStockData.price, selectedStockData.symbol).toFixed(2)}</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${
                      selectedStockData.changePercent >= 0
                        ? 'border-green-400/20 bg-green-950/30'
                        : 'border-red-400/20 bg-red-950/30'
                    }`}>
                      <p className={`text-xs mb-1 ${
                        selectedStockData.changePercent >= 0 ? 'text-green-200/60' : 'text-red-200/60'
                      }`}>
                        Daily Change
                      </p>
                      <p className={`text-2xl font-bold flex items-center gap-1 ${
                        selectedStockData.changePercent >= 0 ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {selectedStockData.changePercent >= 0 ? '+' : ''}{selectedStockData.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Chart */}
              <Card className="border-purple-400/30 bg-purple-950/40 backdrop-blur-sm p-6">
                <h3 className="text-lg font-bold text-white mb-4">24-Hour Price Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stockHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(149, 165, 166, 0.2)" />
                    <XAxis stroke="rgba(149, 165, 166, 0.6)" />
                    <YAxis stroke="rgba(149, 165, 166, 0.6)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(186, 104, 200, 0.3)' }}
                      formatter={(value: any) => `₹${value.toFixed(2)}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#BA68C8"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Investment Card */}
              <Card className="border-green-400/30 bg-green-950/40 backdrop-blur-sm p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-400" />
                  Invest in {selectedStockData.symbol}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-green-200 text-sm font-semibold">Investment Amount (₹)</label>
                    <Input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder="Enter amount to invest"
                      className="mt-2 bg-green-950/30 border-green-400/20 text-white placeholder:text-green-300/30"
                    />
                  </div>

                  {investmentAmount && (
                    <div className="p-3 rounded-lg border border-green-400/20 bg-green-400/5">
                      <p className="text-green-200/70 text-sm">
                        You will get{' '}
                        <span className="font-bold text-green-300">
                          {Math.floor(parseInt(investmentAmount || '0') / getDisplayPrice(selectedStockData.price, selectedStockData.symbol))} shares
                        </span>
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleInvest}
                    disabled={!investmentAmount || parseInt(investmentAmount) <= 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 flex items-center justify-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Invest Now
                  </Button>

                  <p className="text-xs text-green-200/50 text-center">
                    Cash available to invest: ₹{realCashAvailable.toFixed(0)}
                  </p>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Your Stock Holdings */}
      {gameState.stockHoldings && gameState.stockHoldings.length > 0 && (
        <Card className="border-indigo-400/30 bg-indigo-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4">Your Stock Holdings</h3>
          <div className="space-y-3">
            {gameState.stockHoldings.map((holding) => {
              const currentStock = stocks.find(s => s.symbol === holding.symbol);
              const currentPrice = currentStock ? getDisplayPrice(currentStock.price, holding.symbol) : getDummyPrice(holding.symbol);
              const currentValue = holding.shares * currentPrice;
              const gainLoss = currentValue - holding.investmentAmount;
              const gainLossPercent = (gainLoss / holding.investmentAmount) * 100;

              return (
                <div key={holding.symbol} className="p-4 border border-indigo-400/20 bg-indigo-900/20 rounded-lg flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{holding.symbol}</h4>
                    <p className="text-xs text-indigo-200/60 mt-1">
                      {Math.floor(holding.shares)} shares @ ₹{holding.buyPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-white font-bold">₹{currentValue.toFixed(0)}</p>
                    <p className={`text-sm ${gainLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {gainLoss >= 0 ? '+' : ''}₹{gainLoss.toFixed(0)} ({gainLossPercent.toFixed(1)}%)
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleSell(holding, currentPrice)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Top Performers */}
      <Card className="border-yellow-400/30 bg-yellow-950/40 backdrop-blur-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4">Top Performers - {activeTab === 'indian' ? 'Indian' : 'Global'} Stocks</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stocks.sort((a, b) => b.changePercent - a.changePercent).slice(0, 5)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(149, 165, 166, 0.2)" />
            <XAxis dataKey="symbol" stroke="rgba(149, 165, 166, 0.6)" />
            <YAxis stroke="rgba(149, 165, 166, 0.6)" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(255, 181, 76, 0.3)' }}
              formatter={(value: any) => `${value.toFixed(2)}%`}
            />
            <Bar dataKey="changePercent" fill="#FFD54F" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
