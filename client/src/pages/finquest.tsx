import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import Auth from './auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles, TrendingUp, TrendingDown, Coins, Wallet, Target, Trophy, Zap, Settings,
  Download, RotateCcw, Sun, Moon, Send, Menu, X, Award, BarChart3, Clock, AlertCircle,
  Check, Home, Play as PlayIcon, BookOpen, LayoutDashboard, TrendingUpIcon, Users,
  User, Briefcase, DollarSign, Calendar, Flame, Star
} from 'lucide-react';

type Career = 'Software Engineer' | 'Doctor' | 'Teacher' | 'Business Owner';

interface UserProfile {
  name: string;
  career: Career;
  salary: number;
  expenses: number;
  avatar: string;
}

interface Portfolio {
  sip: number;
  stocks: number;
  gold: number;
  realEstate: number;
  savings: number;
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

interface GameState {
  currentMonth: number;
  currentYear: number;
  cashBalance: number;
  netWorth: number;
  userProfile: UserProfile | null;
  portfolio: Portfolio;
  chatHistory: ChatMessage[];
  xp: number;
  level: number;
  achievements: Achievement[];
  lastLoginDate: string;
  consecutiveLogins: number;
  monthlyInvestments: { sip: number; stocks: number; gold: number; realEstate: number; savings: number };
}

const AVATARS = ['👾', '🤖', '🦄', '🎯', '🚀', '🌟', '💎', '⚡'];

const CAREER_DATA: Record<Career, { salary: number; expenses: number }> = {
  'Software Engineer': { salary: 120000, expenses: 45000 },
  'Doctor': { salary: 150000, expenses: 55000 },
  'Teacher': { salary: 60000, expenses: 28000 },
  'Business Owner': { salary: 200000, expenses: 70000 },
};

const LIFE_EVENTS = [
  { name: 'Job Loss', impact: -150000, probability: 0.05 },
  { name: 'IPO Win', impact: 200000, probability: 0.08 },
  { name: 'Medical Emergency', impact: -80000, probability: 0.1 },
  { name: 'Inheritance', impact: 300000, probability: 0.06 },
  { name: 'Market Dip', impact: -50000, probability: 0.12 },
  { name: 'Promotion', impact: 50000, probability: 0.15 },
  { name: 'Salary Hike', impact: 30000, probability: 0.2 },
  { name: 'Tax Penalty', impact: -20000, probability: 0.08 },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-investment', title: 'First Step', description: 'Made your first investment', unlocked: false, icon: '🎯' },
  { id: 'millionaire', title: 'Millionaire', description: 'Reached ₹50,00,000 net worth', unlocked: false, icon: '💰' },
  { id: 'diversified', title: 'Diversified', description: 'Invested in all 5 categories', unlocked: false, icon: '📊' },
  { id: 'steady-investor', title: 'Steady Investor', description: 'Maintained SIP for 6 months', unlocked: false, icon: '📈' },
  { id: 'level-5', title: 'Financial Guru', description: 'Reached Level 5', unlocked: false, icon: '🏆' },
  { id: 'week-streak', title: 'Committed', description: '7 consecutive daily logins', unlocked: false, icon: '🔥' },
];

const SIDEBAR_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'play', label: 'Play', icon: PlayIcon },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'investments', label: 'Investments', icon: TrendingUpIcon },
  { id: 'leaderboard', label: 'Leaderboard', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'career', label: 'Career & Income', icon: Briefcase },
  { id: 'expenses', label: 'Expenses', icon: DollarSign },
  { id: 'events', label: 'Life Events', icon: Calendar },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'chat', label: 'Aura Twin AI', icon: Sparkles },
];

export default function FinQuest() {
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const [gameState, setGameState] = useState<GameState>({
    currentMonth: 1,
    currentYear: 2025,
    cashBalance: 0,
    netWorth: 0,
    userProfile: null,
    portfolio: { sip: 0, stocks: 0, gold: 0, realEstate: 0, savings: 0 },
    chatHistory: [],
    xp: 0,
    level: 1,
    achievements: ACHIEVEMENTS,
    lastLoginDate: new Date().toISOString().split('T')[0],
    consecutiveLogins: 1,
    monthlyInvestments: { sip: 0, stocks: 0, gold: 0, realEstate: 0, savings: 0 },
  });

  const [onboarding, setOnboarding] = useState({
    active: true,
    step: 1,
    name: '',
    career: '' as Career | '',
    avatar: '🚀',
  });

  const [monthlyDecisions, setMonthlyDecisions] = useState({
    sip: 0,
    stocks: 0,
    gold: 0,
    realEstate: 0,
    savings: 0,
  });

  const [chatInput, setChatInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showSettings, setShowSettings] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [goalAmount, setGoalAmount] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gameOver, setGameOver] = useState<'win' | 'loss' | null>(null);
  const [processingMonth, setProcessingMonth] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          await loadGameState(user.id);
        } else {
          setUserId('guest');
        }
      } catch (error) {
        setUserId('guest');
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.chatHistory]);

  const handleAuthSuccess = (uid: string) => {
    setUserId(uid);
    setShowLanding(false);
  };

  const loadGameState = async (uid: string) => {
    try {
      const { data } = await supabase
        .from('game_saves')
        .select('game_state')
        .eq('user_id', uid)
        .single();
      if (data?.game_state) {
        setGameState(data.game_state);
        setOnboarding({ active: false, step: 1, name: '', career: '', avatar: '🚀' });
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  };

  const completeOnboarding = async () => {
    if (!onboarding.name || !onboarding.career) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const careerData = CAREER_DATA[onboarding.career];
    const initialCash = careerData.salary - careerData.expenses;

    const newGameState: GameState = {
      ...gameState,
      userProfile: {
        name: onboarding.name,
        career: onboarding.career,
        avatar: onboarding.avatar,
        ...careerData,
      },
      cashBalance: initialCash,
      netWorth: initialCash,
      xp: 0,
      level: 1,
    };

    setGameState(newGameState);
    setOnboarding({ active: false, step: 1, name: '', career: '', avatar: '🚀' });
    setShowLanding(false);

    if (userId && userId !== 'guest') {
      try {
        await supabase.from('game_saves').upsert({
          user_id: userId,
          game_state: newGameState,
        });
      } catch (error) {
        console.error('Failed to save:', error);
      }
    }

    toast({ title: 'Welcome to Finverse!', description: 'Your journey begins now' });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#101C2E]">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-foreground/70">Loading Finverse...</p>
        </div>
      </div>
    );
  }

  if (showLanding && !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#101C2E] to-[#1a2847]">
        <div className="text-center space-y-8 px-4">
          <div className="text-7xl animate-bounce">💎</div>
          <h1 className="text-6xl font-bold text-white">Finverse Play</h1>
          <p className="text-muted-foreground text-xl">Master Your Financial Journey</p>
          <p className="text-muted-foreground">Play. Learn. Conquer Financial Freedom</p>
          <Button 
            onClick={() => setShowLanding(false)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-bold"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    );
  }

  if (!userId) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Avatar Selection Screen
  if (onboarding.active && onboarding.step === 1 && !gameState.userProfile) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#101C2E] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card border-border dark:bg-[#1F2636]">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Create Your Avatar</h1>
              <p className="text-muted-foreground">Choose how you want to be represented in Finverse</p>
            </div>

            {/* Avatar Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-foreground">Select Your Avatar</Label>
              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setOnboarding(prev => ({ ...prev, avatar }))}
                    className={`p-6 rounded-lg text-3xl transition-all ${
                      onboarding.avatar === avatar
                        ? 'bg-primary text-primary-foreground border-2 border-primary scale-105'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground border-2 border-transparent'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-semibold text-foreground">Your Name</Label>
              <Input
                id="name"
                data-testid="input-name"
                value={onboarding.name}
                onChange={(e) => setOnboarding(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Career Selection */}
            <div className="space-y-2">
              <Label htmlFor="career" className="text-lg font-semibold text-foreground">Career Path</Label>
              <Select
                value={onboarding.career}
                onValueChange={(value) => setOnboarding(prev => ({ ...prev, career: value as Career }))}
              >
                <SelectTrigger id="career" data-testid="select-career" className="bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Select a career" />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  {Object.entries(CAREER_DATA).map(([career, data]) => (
                    <SelectItem key={career} value={career} className="text-foreground">
                      {career} - ₹{data.salary.toLocaleString('en-IN')}/month
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Career Details */}
            {onboarding.career && (
              <Card className="bg-primary/10 border-primary/30 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Salary:</span>
                    <span className="font-semibold text-accent">₹{CAREER_DATA[onboarding.career].salary.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Expenses:</span>
                    <span className="font-semibold text-destructive">₹{CAREER_DATA[onboarding.career].expenses.toLocaleString('en-IN')}</span>
                  </div>
                  <Separator className="my-2 bg-border" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available to Invest:</span>
                    <span className="font-semibold text-accent text-lg">₹{(CAREER_DATA[onboarding.career].salary - CAREER_DATA[onboarding.career].expenses).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* CTA Button */}
            <Button
              data-testid="button-start-journey"
              onClick={completeOnboarding}
              disabled={!onboarding.name || !onboarding.career}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
            >
              <Zap className="mr-2 h-5 w-5" />
              Embark on Your Journey
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Main Game Interface
  return (
    <div className="min-h-screen bg-background dark:bg-[#101C2E] text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card dark:bg-[#1F2636] sticky top-0 z-40 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              data-testid="button-mobile-menu"
              className="lg:hidden text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              Finverse Play
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/50">Level {gameState.level}</Badge>
            <Badge className="bg-accent/20 text-accent border-accent/50">{gameState.xp} XP</Badge>
            <Button size="icon" variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-primary">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setShowSettings(true)} className="text-primary">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <aside className={`lg:col-span-2 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <Card className="bg-card dark:bg-[#1F2636] border-border p-4 space-y-4">
              {/* Profile Card */}
              {gameState.userProfile && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
                  <div className="text-3xl mb-2">{gameState.userProfile.avatar}</div>
                  <p className="font-semibold text-foreground text-sm">{gameState.userProfile.name}</p>
                  <p className="text-xs text-muted-foreground">{gameState.userProfile.career}</p>
                  <div className="flex gap-1 justify-center mt-2">
                    <span className="text-lg">⭐</span>
                    <span className="text-lg">💰</span>
                    <span className="text-lg">📈</span>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <nav className="space-y-2">
                {SIDEBAR_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        currentPage === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-secondary'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-10">
            {currentPage === 'dashboard' && (
              <div className="space-y-6">
                {/* Financial Snapshot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-card dark:bg-[#1F2636] border-border p-6">
                    <p className="text-sm text-muted-foreground mb-2">Net Worth</p>
                    <p className="text-3xl font-bold text-accent">₹{Math.round(gameState.netWorth).toLocaleString('en-IN')}</p>
                  </Card>
                  <Card className="bg-card dark:bg-[#1F2636] border-border p-6">
                    <p className="text-sm text-muted-foreground mb-2">Monthly Income</p>
                    <p className="text-3xl font-bold text-primary">₹{gameState.userProfile?.salary.toLocaleString('en-IN') || '0'}</p>
                  </Card>
                  <Card className="bg-card dark:bg-[#1F2636] border-border p-6">
                    <p className="text-sm text-muted-foreground mb-2">Monthly Expenses</p>
                    <p className="text-3xl font-bold text-destructive">₹{gameState.userProfile?.expenses.toLocaleString('en-IN') || '0'}</p>
                  </Card>
                </div>

                {/* Investment Options Grid */}
                <Card className="bg-card dark:bg-[#1F2636] border-border p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">Investment Classes</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'SIPs', icon: '📊' },
                      { name: 'Stocks', icon: '📈' },
                      { name: 'Gold', icon: '💛' },
                      { name: 'Real Estate', icon: '🏠' },
                    ].map((inv) => (
                      <button
                        key={inv.name}
                        className="p-4 rounded-lg bg-primary/10 border border-primary/30 hover:border-primary transition-colors text-center"
                      >
                        <div className="text-3xl mb-2">{inv.icon}</div>
                        <p className="text-sm font-semibold text-foreground">{inv.name}</p>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Upcoming Events */}
                <Card className="bg-card dark:bg-[#1F2636] border-border p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Events</h2>
                  <div className="space-y-3">
                    {[
                      { name: 'Market Review', date: 'Tomorrow' },
                      { name: 'Tax Planning', date: 'Next Week' },
                      { name: 'Portfolio Review', date: 'Next Month' },
                    ].map((event, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <span className="text-foreground font-medium">{event.name}</span>
                        <span className="text-muted-foreground text-sm">{event.date}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Map Placeholder */}
                <Card className="bg-card dark:bg-[#1F2636] border-border p-6">
                  <p className="text-muted-foreground text-center py-12">📍 Investment Map - Your Location & Portfolio Focus</p>
                </Card>
              </div>
            )}

            {currentPage === 'leaderboard' && (
              <Card className="bg-card dark:bg-[#1F2636] border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Leaderboard</h2>
                
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-secondary">
                    <TabsTrigger value="all">All Time</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-6 space-y-3">
                    {[
                      { rank: 1, name: 'Alex Kumar', level: 15, score: 5000000 },
                      { rank: 2, name: 'Priya Singh', level: 14, score: 4800000 },
                      { rank: 3, name: 'Raj Patel', level: 13, score: 4500000 },
                      { rank: 4, name: 'Sarah Jones', level: 12, score: 4200000 },
                      { rank: 5, name: 'You', level: gameState.level, score: Math.round(gameState.netWorth) },
                    ].map((player, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge className="bg-primary text-primary-foreground">{player.rank}</Badge>
                          <div>
                            <p className="font-semibold text-foreground">{player.name}</p>
                            <p className="text-sm text-muted-foreground">Level {player.level}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">⭐</span>
                          <p className="font-bold text-accent">₹{(player.score / 1000000).toFixed(1)}M</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="weekly" className="mt-6 text-center text-muted-foreground py-8">
                    Weekly leaderboard data loading...
                  </TabsContent>
                </Tabs>
              </Card>
            )}

            {currentPage === 'investments' && (
              <div className="space-y-6">
                {['SIPs', 'Stocks', 'Gold', 'Real Estate'].map((asset) => (
                  <Card key={asset} className="bg-card dark:bg-[#1F2636] border-border p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">{asset}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 text-muted-foreground">Amount</th>
                            <th className="text-right py-2 text-muted-foreground">Current Value</th>
                            <th className="text-right py-2 text-muted-foreground">Returns</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border">
                            <td className="py-3 text-foreground">₹500,000</td>
                            <td className="py-3 text-right text-foreground">₹650,000</td>
                            <td className="py-3 text-right font-semibold text-accent">+₹150,000 (+30%)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {currentPage === 'chat' && (
              <Card className="bg-card dark:bg-[#1F2636] border-border p-6 h-[600px] flex flex-col">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Aura Twin - Your AI Financial Mentor
                </h2>
                
                <ScrollArea className="flex-1 mb-4 p-4 bg-secondary rounded-lg">
                  <div className="space-y-4">
                    {gameState.chatHistory.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Ask me anything about financial planning!</p>
                    ) : (
                      gameState.chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                          <div
                            className={`max-w-xs p-3 rounded-lg ${
                              msg.role === 'ai'
                                ? 'bg-primary/20 text-foreground border border-primary/30'
                                : 'bg-accent/20 text-foreground border border-accent/30'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    data-testid="input-chat"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Aura Twin..."
                    className="bg-secondary border-border text-foreground"
                  />
                  <Button size="icon" className="bg-primary text-primary-foreground">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Default Page Content for Other Pages */}
            {!['dashboard', 'leaderboard', 'investments', 'chat'].includes(currentPage) && (
              <Card className="bg-card dark:bg-[#1F2636] border-border p-12 text-center">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">This page is coming soon...</p>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-card dark:bg-[#1F2636] border-border">
          <DialogHeader>
            <DialogTitle className="text-primary">Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button variant="outline" className="w-full border-primary/50 text-foreground hover:bg-primary/10">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" className="w-full border-primary/50 text-foreground hover:bg-primary/10">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Game
            </Button>
            <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10">
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
