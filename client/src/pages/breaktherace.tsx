import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import Auth from './auth';
import { AppHeader } from '@/components/app-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Dices,
  Trophy,
  Coins,
  Zap,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  RotateCcw,
  DollarSign,
  Briefcase,
  Home,
  TrendingUpIcon,
} from 'lucide-react';

type Career = 'Teacher' | 'Engineer' | 'Doctor' | 'Manager' | 'Accountant' | 'Designer';
type BoardSpace = 'payday' | 'smalldeal' | 'bigdeal' | 'doodad' | 'market' | 'charity' | 'opportunity' | 'start';

interface CareerProfile {
  name: string;
  salary: number;
  expenses: number;
  startingCash: number;
  startingLiabilities: number;
}

interface Asset {
  type: 'stocks' | 'realestate' | 'business';
  name: string;
  cost: number;
  passiveIncome: number;
  value: number;
}

interface Liability {
  type: 'car' | 'home' | 'education';
  name: string;
  amount: number;
  monthlyPayment: number;
}

interface GameState {
  career: Career | null;
  boardPosition: number;
  dice: number;
  cash: number;
  passiveIncome: number;
  totalExpenses: number;
  assets: Asset[];
  liabilities: Liability[];
  onFastTrack: boolean;
  hasWon: boolean;
  userProfile: { name: string; career: Career } | null;
}

const CAREERS: Record<Career, CareerProfile> = {
  Teacher: { name: 'Teacher', salary: 50000, expenses: 25000, startingCash: 100000, startingLiabilities: 200000 },
  Engineer: { name: 'Software Engineer', salary: 120000, expenses: 40000, startingCash: 300000, startingLiabilities: 500000 },
  Doctor: { name: 'Doctor', salary: 180000, expenses: 60000, startingCash: 500000, startingLiabilities: 1000000 },
  Manager: { name: 'Sales Manager', salary: 80000, expenses: 35000, startingCash: 150000, startingLiabilities: 300000 },
  Accountant: { name: 'Accountant', salary: 70000, expenses: 30000, startingCash: 120000, startingLiabilities: 250000 },
  Designer: { name: 'UI Designer', salary: 65000, expenses: 28000, startingCash: 110000, startingLiabilities: 220000 },
};

const BOARD_SPACES: BoardSpace[] = ['start', 'payday', 'smalldeal', 'market', 'doodad', 'bigdeal', 'opportunity', 'charity'];

const SMALL_DEALS = [
  { name: 'Stock Portfolio', cost: 5000, passiveIncome: 500 },
  { name: 'Small Rental', cost: 50000, passiveIncome: 3000 },
  { name: 'Online Business', cost: 10000, passiveIncome: 1000 },
];

const BIG_DEALS = [
  { name: 'Apartment', cost: 500000, passiveIncome: 25000 },
  { name: 'Commercial Property', cost: 1000000, passiveIncome: 60000 },
  { name: 'Business Franchise', cost: 300000, passiveIncome: 40000 },
];

const DOODADS = [
  { name: 'Car Repair', cost: 5000 },
  { name: 'Medical Emergency', cost: 20000 },
  { name: 'Vacation', cost: 30000 },
  { name: 'Home Repair', cost: 15000 },
];

const MARKET_CARDS = [
  { name: 'Stock Rally', effect: 10000 },
  { name: 'Property Boom', effect: 50000 },
  { name: 'Market Crash', effect: -30000 },
  { name: 'Interest Hike', effect: -5000 },
];

export default function BreakTheRace() {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showCareerSelect, setShowCareerSelect] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardData, setCardData] = useState<any>(null);

  const [gameState, setGameState] = useState<GameState>({
    career: null,
    boardPosition: 0,
    dice: 0,
    cash: 0,
    passiveIncome: 0,
    totalExpenses: 0,
    assets: [],
    liabilities: [],
    onFastTrack: false,
    hasWon: false,
    userProfile: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUserId(session.user.id);
    }
    setAuthChecked(true);
  };

  const startNewGame = async (career: Career) => {
    const profile = CAREERS[career];
    const newGameState: GameState = {
      career,
      boardPosition: 0,
      dice: 0,
      cash: profile.startingCash,
      passiveIncome: 0,
      totalExpenses: profile.expenses,
      assets: [],
      liabilities: [
        { type: 'home', name: 'Home Loan', amount: profile.startingLiabilities, monthlyPayment: profile.startingLiabilities / 240 }
      ],
      onFastTrack: false,
      hasWon: false,
      userProfile: { name: career, career },
    };

    setGameState(newGameState);
    setShowCareerSelect(false);
    await saveGameState(newGameState);
  };

  const rollDice = async () => {
    setDiceRolling(true);
    await new Promise(r => setTimeout(r, 1000));
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRolling(false);
    
    const newPosition = (gameState.boardPosition + roll) % BOARD_SPACES.length;
    setGameState(prev => ({ ...prev, boardPosition: newPosition, dice: roll }));
    
    handleBoardSpace(newPosition);
  };

  const handleBoardSpace = async (position: number) => {
    const space = BOARD_SPACES[position];
    
    if (space === 'payday') {
      const cashIncome = gameState.userProfile ? CAREERS[gameState.userProfile.career].salary : 0;
      const totalIncome = cashIncome + gameState.passiveIncome - gameState.totalExpenses;
      setGameState(prev => ({ ...prev, cash: prev.cash + totalIncome }));
      toast({ title: '💰 Payday!', description: `+₹${totalIncome.toLocaleString('en-IN')}` });
    } else if (space === 'smalldeal') {
      const deal = SMALL_DEALS[Math.floor(Math.random() * SMALL_DEALS.length)];
      setCardData({ type: 'deal', ...deal });
      setShowCardModal(true);
    } else if (space === 'bigdeal') {
      const deal = BIG_DEALS[Math.floor(Math.random() * BIG_DEALS.length)];
      setCardData({ type: 'bigdeal', ...deal });
      setShowCardModal(true);
    } else if (space === 'doodad') {
      const doodad = DOODADS[Math.floor(Math.random() * DOODADS.length)];
      setGameState(prev => ({ ...prev, cash: Math.max(0, prev.cash - doodad.cost) }));
      toast({ title: '⚠️ Oops!', description: `${doodad.name}: -₹${doodad.cost.toLocaleString('en-IN')}`, variant: 'destructive' });
    } else if (space === 'market') {
      const card = MARKET_CARDS[Math.floor(Math.random() * MARKET_CARDS.length)];
      setGameState(prev => ({ ...prev, cash: prev.cash + card.effect }));
      toast({ title: '📊 Market Event', description: `${card.name}: ${card.effect > 0 ? '+' : ''}₹${card.effect.toLocaleString('en-IN')}` });
    }

    await saveGameState(gameState);
    checkEscapeRatRace();
  };

  const buyAsset = async (name: string, cost: number, passiveIncome: number) => {
    if (gameState.cash < cost) {
      toast({ title: 'Insufficient Funds', variant: 'destructive' });
      return;
    }

    const newAsset: Asset = { type: 'realestate', name, cost, passiveIncome, value: cost };
    const newPassiveIncome = gameState.passiveIncome + passiveIncome;

    setGameState(prev => ({
      ...prev,
      cash: prev.cash - cost,
      assets: [...prev.assets, newAsset],
      passiveIncome: newPassiveIncome,
    }));

    setShowCardModal(false);
    toast({ title: '✅ Purchased!', description: `${name} - Passive income: ₹${passiveIncome.toLocaleString('en-IN')}/month` });

    const updatedState = { ...gameState, cash: gameState.cash - cost, assets: [...gameState.assets, newAsset], passiveIncome: newPassiveIncome };
    await saveGameState(updatedState);
    checkEscapeRatRace();
  };

  const checkEscapeRatRace = () => {
    if (gameState.passiveIncome >= gameState.totalExpenses && !gameState.onFastTrack) {
      setGameState(prev => ({ ...prev, onFastTrack: true }));
      confetti();
      toast({ title: '🚀 You Escaped the Rat Race!', description: 'Welcome to the Fast Track!' });
    }

    const dreamThreshold = gameState.totalExpenses + 4000000;
    if (gameState.passiveIncome >= dreamThreshold && gameState.onFastTrack) {
      setGameState(prev => ({ ...prev, hasWon: true }));
    }
  };

  const saveGameState = async (state: GameState) => {
    if (!userId || userId === 'guest') return;

    try {
      // First mark old saves as not latest
      await supabase
        .from('game_saves')
        .update({ is_latest: false })
        .eq('user_id', userId)
        .eq('is_latest', true);

      const saveData = {
        user_id: userId,
        level: state.assets.length + 1,
        xp: Math.round(state.passiveIncome / 1000),
        current_month: state.boardPosition,
        cash_balance: state.cash,
        gold_coins: 50000,
        portfolio: { sip: 0, stocks: 0, gold: 0, realEstate: state.assets.length, savings: 0 },
        achievements: [],
        financial_goal: 5000000,
        goal_progress: (state.cash / 5000000) * 100,
        monthly_investments: { sip: 0, stocks: 0, gold: 0, realEstate: 0, savings: 0 },
        is_latest: true,
      };

      await supabase.from('game_saves').insert([saveData]);
      console.log('📊 Game saved and synced to leaderboard');
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const resetGame = () => {
    setGameState({
      career: null,
      boardPosition: 0,
      dice: 0,
      cash: 0,
      passiveIncome: 0,
      totalExpenses: 0,
      assets: [],
      liabilities: [],
      onFastTrack: false,
      hasWon: false,
      userProfile: null,
    });
    setShowCareerSelect(true);
  };

  if (!authChecked) return <div>Loading...</div>;
  if (!userId) return <Auth onAuthSuccess={(uid) => setUserId(uid)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AppHeader level={gameState.assets.length + 1} xp={Math.round(gameState.passiveIncome / 1000)} netWorth={gameState.cash} />

      {gameState.hasWon ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="border-primary/30 glassmorphic p-12 text-center max-w-2xl">
            <Trophy className="h-24 w-24 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-primary mb-2">You Won! 🎉</h1>
            <p className="text-xl text-foreground/80 mb-6">You Broke the Race and Achieved Financial Freedom!</p>
            <div className="space-y-2 mb-6 text-left">
              <p className="text-foreground/70"><strong>Passive Income:</strong> ₹{gameState.passiveIncome.toLocaleString('en-IN')}/month</p>
              <p className="text-foreground/70"><strong>Total Assets:</strong> {gameState.assets.length}</p>
              <p className="text-foreground/70"><strong>Cash on Hand:</strong> ₹{gameState.cash.toLocaleString('en-IN')}</p>
            </div>
            <Button onClick={resetGame} className="w-full">Play Again</Button>
          </Card>
        </div>
      ) : !gameState.career ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <Card className="border-primary/30 glassmorphic p-8 max-w-4xl w-full">
            <h1 className="text-3xl font-bold text-primary mb-2 text-center">Choose Your Career</h1>
            <p className="text-foreground/70 text-center mb-8">Select a career to start your journey to financial freedom</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(CAREERS).map(([key, career]) => (
                <Button
                  key={key}
                  onClick={() => startNewGame(key as Career)}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-start"
                >
                  <span className="font-bold text-lg">{career.name}</span>
                  <span className="text-sm text-foreground/60">₹{career.salary.toLocaleString('en-IN')} salary</span>
                  <span className="text-sm text-foreground/60">₹{career.expenses.toLocaleString('en-IN')} expenses</span>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="container mx-auto p-4 pb-8">
          {/* Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-primary/30 glassmorphic p-4">
              <div className="text-sm text-foreground/70">Cash on Hand</div>
              <div className="text-2xl font-bold text-primary">₹{gameState.cash.toLocaleString('en-IN')}</div>
            </Card>
            <Card className="border-primary/30 glassmorphic p-4">
              <div className="text-sm text-foreground/70">Passive Income</div>
              <div className="text-2xl font-bold text-green-400">₹{gameState.passiveIncome.toLocaleString('en-IN')}</div>
            </Card>
            <Card className="border-primary/30 glassmorphic p-4">
              <div className="text-sm text-foreground/70">Monthly Expenses</div>
              <div className="text-2xl font-bold text-red-400">₹{gameState.totalExpenses.toLocaleString('en-IN')}</div>
            </Card>
            <Card className="border-primary/30 glassmorphic p-4">
              <div className="text-sm text-foreground/70">Assets Owned</div>
              <div className="text-2xl font-bold text-blue-400">{gameState.assets.length}</div>
            </Card>
          </div>

          {/* Board Game */}
          <Card className="border-primary/30 glassmorphic p-8 mb-6">
            <h2 className="text-2xl font-bold text-primary mb-4 text-center">
              {gameState.onFastTrack ? '🚀 FAST TRACK' : '🐭 RAT RACE'}
            </h2>

            {/* Circular Board */}
            <div className="flex justify-center mb-8">
              <div className="relative w-64 h-64 rounded-full border-4 border-primary/50 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="absolute text-center">
                  <div className="text-4xl">🎲</div>
                  <div className="text-sm text-foreground/70 mt-2">Position: {gameState.boardPosition + 1}/8</div>
                </div>
                {/* Player token */}
                <div
                  className="absolute w-8 h-8 bg-primary rounded-full border-2 border-primary/50 transition-all"
                  style={{
                    transform: `rotate(${(gameState.boardPosition / BOARD_SPACES.length) * 360}deg) translateY(-120px) rotate(-${(gameState.boardPosition / BOARD_SPACES.length) * 360}deg)`,
                  }}
                >
                  👤
                </div>
              </div>
            </div>

            {/* Dice Roll */}
            <div className="text-center mb-6">
              <Button
                onClick={rollDice}
                disabled={diceRolling}
                size="lg"
                className="w-full md:w-48"
              >
                {diceRolling ? '🎲 Rolling...' : `🎲 Roll Dice (Last: ${gameState.dice})`}
              </Button>
            </div>

            {/* Current Space */}
            <div className="text-center p-4 bg-foreground/5 rounded-lg border border-primary/20">
              <p className="text-foreground/70">Current Space:</p>
              <p className="text-xl font-bold text-primary">{BOARD_SPACES[gameState.boardPosition].toUpperCase()}</p>
            </div>
          </Card>

          {/* Assets */}
          {gameState.assets.length > 0 && (
            <Card className="border-primary/30 glassmorphic p-6 mb-6">
              <h3 className="text-lg font-bold text-primary mb-4">Your Assets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameState.assets.map((asset, idx) => (
                  <div key={idx} className="p-3 bg-foreground/5 rounded-lg border border-primary/20">
                    <p className="font-semibold text-foreground">{asset.name}</p>
                    <p className="text-sm text-foreground/70">Cost: ₹{asset.cost.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-green-400">Income: ₹{asset.passiveIncome.toLocaleString('en-IN')}/month</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => setShowHelp(true)}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </div>
        </div>
      )}

      {/* Card Modal */}
      <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
        <DialogContent className="border-primary/30 glassmorphic">
          <DialogHeader>
            <DialogTitle className="text-primary">Deal Opportunity!</DialogTitle>
          </DialogHeader>
          {cardData && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">{cardData.name}</h3>
              <p className="text-foreground/70">Cost: ₹{cardData.cost.toLocaleString('en-IN')}</p>
              <p className="text-green-400">Monthly Income: ₹{cardData.passiveIncome.toLocaleString('en-IN')}</p>
              <Button
                onClick={() => buyAsset(cardData.name, cardData.cost, cardData.passiveIncome)}
                disabled={gameState.cash < cardData.cost}
              >
                {gameState.cash >= cardData.cost ? '✅ Buy Now' : '❌ Insufficient Funds'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="border-primary/30 glassmorphic max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">How to Play</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-foreground/80">
            <div>
              <h4 className="font-bold text-primary mb-2">🎯 Objective</h4>
              <p>Escape the Rat Race by earning passive income ≥ your monthly expenses. Then reach the Fast Track and win!</p>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-2">🎲 Board Spaces</h4>
              <ul className="space-y-1 ml-4">
                <li>• Payday: Get salary + passive income - expenses</li>
                <li>• Small Deal: Affordable investments</li>
                <li>• Big Deal: High-value investments (Fast Track only)</li>
                <li>• Doodad: Unexpected expenses</li>
                <li>• Market: Random market events</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-2">💰 Winning</h4>
              <p>Reach passive income ≥ expenses + ₹40,00,000 to buy your dream and WIN!</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
