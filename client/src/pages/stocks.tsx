import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Search, Plus, Zap } from 'lucide-react';
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

export default function Stocks() {
  const [selectedStock, setSelectedStock] = useState<string>('RELIANCE');
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'indian' | 'global'>('indian');

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
          
          // Set selected stock history for chart
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
    const interval = setInterval(fetchStocks, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [activeTab]);

  // Generate mock history data for chart visualization
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

  const selectedStockData = stocks.find(s => s.symbol === selectedStock);
  const filteredStocks = stocks.filter(s =>
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {/* Search */}
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

          {/* Stock List */}
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
                    setStockHistory(generateHistoryData(stock.price));
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">{stock.symbol}</h3>
                      <p className="text-xs text-blue-200/60 mt-1">₹{stock.price.toFixed(2)}</p>
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
                      <p className={`text-xs ${
                        stock.changePercent >= 0 ? 'text-green-300/70' : 'text-red-300/70'
                      }`}>
                        {stock.changePercent >= 0 ? '+' : ''}₹{stock.change.toFixed(2)}
                      </p>
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
                      <p className="text-2xl font-bold text-cyan-100">₹{selectedStockData.price.toFixed(2)}</p>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 150, 200, 0.1)" />
                    <XAxis stroke="rgba(200, 200, 200, 0.5)" />
                    <YAxis stroke="rgba(200, 200, 200, 0.5)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(100, 150, 200, 0.3)' }}
                      formatter={(value: any) => `₹${value.toFixed(2)}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#3B82F6"
                      strokeWidth={2}
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
                          {(parseInt(investmentAmount || '0') / selectedStockData.price).toFixed(2)} shares
                        </span>
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      if (investmentAmount) {
                        alert(`Investment of ₹${investmentAmount} in ${selectedStockData.symbol} added to portfolio!`);
                        setInvestmentAmount('');
                      }
                    }}
                    disabled={!investmentAmount || parseInt(investmentAmount) <= 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 flex items-center justify-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Invest Now
                  </Button>

                  <p className="text-xs text-green-200/50 text-center">
                    Note: This adds real market data to your portfolio simulation
                  </p>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* All Stocks Comparison */}
      <Card className="border-yellow-400/30 bg-yellow-950/40 backdrop-blur-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4">Top Performers - {activeTab === 'indian' ? 'Indian' : 'Global'} Stocks</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stocks.sort((a, b) => b.changePercent - a.changePercent).slice(0, 5)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 150, 200, 0.1)" />
            <XAxis dataKey="symbol" stroke="rgba(200, 200, 200, 0.5)" />
            <YAxis stroke="rgba(200, 200, 200, 0.5)" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(100, 150, 200, 0.3)' }}
              formatter={(value: any) => `${value.toFixed(2)}%`}
            />
            <Bar dataKey="changePercent" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
