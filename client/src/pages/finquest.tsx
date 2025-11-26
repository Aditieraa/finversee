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
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Coins,
  Wallet,
  Target,
  Trophy,
  Zap,
  Settings,
  Download,
  RotateCcw,
  Sun,
  Moon,
  Send,
  Menu,
  X,
  Award,
  BarChart3,
  Clock,
  AlertCircle,
  Check,
} from 'lucide-react';

type Career = 'Engineer' | 'Designer' | 'CA' | 'Doctor' | 'Sales';

interface UserProfile {
  name: string;
  career: Career;
  salary: number;
  expenses: number;
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

const CAREER_DATA: Record<Career, { salary: number; expenses: number }> = {
  Engineer: { salary: 80000, expenses: 35000 },
  Designer: { salary: 60000, expenses: 28000 },
  CA: { salary: 90000, expenses: 38000 },
  Doctor: { salary: 120000, expenses: 45000 },
  Sales: { salary: 70000, expenses: 30000 },
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
  { id: 'millionaire', title: 'Millionaire', description: 'Reached ₹10,00,000 net worth', unlocked: false, icon: '💰' },
  { id: 'diversified', title: 'Diversified', description: 'Invested in all 5 categories', unlocked: false, icon: '📊' },
  { id: 'steady-investor', title: 'Steady Investor', description: 'Maintained SIP for 6 months', unlocked: false, icon: '📈' },
  { id: 'level-5', title: 'Financial Guru', description: 'Reached Level 5', unlocked: false, icon: '🏆' },
  { id: 'week-streak', title: 'Committed', description: '7 consecutive daily logins', unlocked: false, icon: '🔥' },
];

export default function FinQuest() {
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  
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
  const [leaderboard, setLeaderboard] = useState<Array<{ name: string; score: number; level: number }>>([]);
  const [showAuraTwin, setShowAuraTwin] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.chatHistory]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId && userId !== 'guest') {
      loadGameState();
    }
    if (userId) {
      checkDailyLogin();
      loadLeaderboard();
    }
  }, [userId]);

  useEffect(() => {
    if (userId && userId !== 'guest' && gameState.userProfile) {
      const autoSaveInterval = setInterval(() => {
        saveGameState(true);
      }, 60000);

      return () => clearInterval(autoSaveInterval);
    }
  }, [userId, gameState]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUserId(session.user.id);
    }
    setAuthChecked(true);
  };

  const handleAuthSuccess = (uid: string) => {
    setUserId(uid);
  };

  const saveGameState = async (silent = false) => {
    if (!userId || userId === 'guest' || !gameState.userProfile) return;

    try {
      const { error } = await supabase
        .from('game_saves')
        .upsert({
          user_id: userId,
          game_state: gameState,
          chat_history: gameState.chatHistory,
          achievements: gameState.achievements,
          leaderboard_score: gameState.netWorth,
        });

      if (error) throw error;

      if (!silent) {
        toast({
          title: '💾 Game Saved',
          description: 'Your progress has been saved to the cloud',
        });
      }
      
      await loadLeaderboard();
    } catch (error: any) {
      console.error('Save error:', error);
      if (!silent) {
        toast({
          title: 'Save Failed',
          description: 'Could not save game progress',
          variant: 'destructive',
        });
      }
    }
  };

  const loadGameState = async () => {
    if (!userId || userId === 'guest') return;

    try {
      const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setGameState(data.game_state);
        toast({
          title: '✨ Progress Loaded',
          description: 'Welcome back! Your game has been restored.',
        });
      }
    } catch (error: any) {
      console.error('Load error:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('game_saves')
        .select('game_state, leaderboard_score')
        .order('leaderboard_score', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        const leaderboardData = data
          .filter(entry => entry.game_state?.userProfile?.name)
          .map(entry => ({
            name: entry.game_state.userProfile.name,
            score: entry.leaderboard_score || 0,
            level: entry.game_state.level || 1,
          }));

        setLeaderboard(leaderboardData);
      }
    } catch (error: any) {
      console.error('Leaderboard error:', error);
    }
  };

  const checkDailyLogin = () => {
    const today = new Date().toISOString().split('T')[0];
    if (gameState.lastLoginDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const newConsecutive = gameState.lastLoginDate === yesterdayStr 
        ? gameState.consecutiveLogins + 1 
        : 1;

      setGameState(prev => ({
        ...prev,
        lastLoginDate: today,
        consecutiveLogins: newConsecutive,
        xp: prev.xp + 50,
      }));

      toast({
        title: '🎁 Daily Login Reward',
        description: `+50 XP! ${newConsecutive} day streak`,
      });

      if (newConsecutive === 7) {
        unlockAchievement('week-streak');
      }
    }
  };

  const completeOnboarding = async () => {
    if (!onboarding.name || !onboarding.career) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your name and select a career',
        variant: 'destructive',
      });
      return;
    }

    const careerData = CAREER_DATA[onboarding.career];
    const profile: UserProfile = {
      name: onboarding.name,
      career: onboarding.career,
      salary: careerData.salary,
      expenses: careerData.expenses,
    };

    const initialCash = careerData.salary - careerData.expenses;

    if (userId && userId !== 'guest') {
      try {
        await supabase
          .from('profiles')
          .update({
            name: onboarding.name,
            career: onboarding.career,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }

    setGameState(prev => ({
      ...prev,
      userProfile: profile,
      cashBalance: initialCash,
      netWorth: initialCash,
      chatHistory: [
        {
          role: 'ai',
          content: `Namaste ${onboarding.name}! Welcome to your financial freedom journey. I'm Aura Twin, your AI financial mentor. As a ${onboarding.career}, you're starting with ₹${careerData.salary.toLocaleString('en-IN')} monthly salary. After expenses of ₹${careerData.expenses.toLocaleString('en-IN')}, you have ₹${initialCash.toLocaleString('en-IN')} to invest. Let's build your wealth together! 🌟`,
          timestamp: Date.now(),
        },
      ],
    }));

    setOnboarding({ active: false, step: 1, name: '', career: '' });
  };

  const calculateReturns = (amount: number, type: keyof Portfolio): number => {
    let returnRate = 0;
    switch (type) {
      case 'sip':
        returnRate = 0.006 + Math.random() * 0.006;
        break;
      case 'stocks':
        returnRate = -0.05 + Math.random() * 0.13;
        break;
      case 'gold':
        returnRate = -0.01 + Math.random() * 0.04;
        break;
      case 'realEstate':
        returnRate = 0 + Math.random() * 0.012;
        break;
      case 'savings':
        returnRate = 0;
        break;
    }
    return amount * returnRate;
  };

  const getRandomLifeEvent = () => {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const event of LIFE_EVENTS) {
      cumulative += event.probability;
      if (rand <= cumulative) {
        return event;
      }
    }
    return null;
  };

  const unlockAchievement = (id: string) => {
    setGameState(prev => {
      const achievement = prev.achievements.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        const updatedAchievements = prev.achievements.map(a =>
          a.id === id ? { ...a, unlocked: true } : a
        );

        toast({
          title: `🏆 Achievement Unlocked!`,
          description: `${achievement.icon} ${achievement.title}`,
        });

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        return {
          ...prev,
          achievements: updatedAchievements,
          xp: prev.xp + 100,
        };
      }
      return prev;
    });
  };

  const processMonthlyDecisions = async () => {
    if (processingMonth) return;
    
    const totalInvestment = Object.values(monthlyDecisions).reduce((a, b) => a + b, 0);
    
    if (totalInvestment === 0) {
      toast({
        title: 'No Investments',
        description: 'Please enter at least one investment amount',
        variant: 'destructive',
      });
      return;
    }
    
    if (totalInvestment > gameState.cashBalance) {
      toast({
        title: 'Insufficient Funds',
        description: `You only have ₹${Math.round(gameState.cashBalance).toLocaleString('en-IN')} available. Total investment: ₹${totalInvestment.toLocaleString('en-IN')}`,
        variant: 'destructive',
      });
      return;
    }

    if (Object.values(monthlyDecisions).some(v => v < 0)) {
      toast({
        title: 'Invalid Amount',
        description: 'Investment amounts cannot be negative',
        variant: 'destructive',
      });
      return;
    }

    setProcessingMonth(true);

    setGameState(prev => {
      const newCash = prev.cashBalance - totalInvestment;
      const updatedPortfolio = {
        sip: prev.portfolio.sip + monthlyDecisions.sip,
        stocks: prev.portfolio.stocks + monthlyDecisions.stocks,
        gold: prev.portfolio.gold + monthlyDecisions.gold,
        realEstate: prev.portfolio.realEstate + monthlyDecisions.realEstate,
        savings: prev.portfolio.savings + monthlyDecisions.savings,
      };

      return {
        ...prev,
        cashBalance: newCash,
        portfolio: updatedPortfolio,
        monthlyInvestments: monthlyDecisions,
      };
    });

    await sendAIMessage(`I invested ₹${totalInvestment.toLocaleString('en-IN')} this month: SIP ₹${monthlyDecisions.sip.toLocaleString('en-IN')}, Stocks ₹${monthlyDecisions.stocks.toLocaleString('en-IN')}, Gold ₹${monthlyDecisions.gold.toLocaleString('en-IN')}, Real Estate ₹${monthlyDecisions.realEstate.toLocaleString('en-IN')}, Savings ₹${monthlyDecisions.savings.toLocaleString('en-IN')}`);

    setTimeout(() => {
      processMonthEnd();
    }, 2000);
  };

  const processMonthEnd = () => {
    setGameState(prev => {
      if (!prev.userProfile) return prev;

      const portfolioReturns = {
        sip: calculateReturns(prev.portfolio.sip, 'sip'),
        stocks: calculateReturns(prev.portfolio.stocks, 'stocks'),
        gold: calculateReturns(prev.portfolio.gold, 'gold'),
        realEstate: calculateReturns(prev.portfolio.realEstate, 'realEstate'),
        savings: 0,
      };

      const updatedPortfolio = {
        sip: prev.portfolio.sip + portfolioReturns.sip,
        stocks: prev.portfolio.stocks + portfolioReturns.stocks,
        gold: prev.portfolio.gold + portfolioReturns.gold,
        realEstate: prev.portfolio.realEstate + portfolioReturns.realEstate,
        savings: prev.portfolio.savings,
      };

      const lifeEvent = Math.random() < 0.3 ? getRandomLifeEvent() : null;
      const lifeEventImpact = lifeEvent ? lifeEvent.impact : 0;

      const nextMonth = prev.currentMonth + 1;
      const nextYear = nextMonth > 12 ? prev.currentYear + 1 : prev.currentYear;
      const actualNextMonth = nextMonth > 12 ? 1 : nextMonth;

      const newSalary = prev.userProfile.salary;
      const newExpenses = prev.userProfile.expenses;
      const monthlySavings = newSalary - newExpenses;

      const newCash = prev.cashBalance + monthlySavings + lifeEventImpact;
      const portfolioValue = Object.values(updatedPortfolio).reduce((a, b) => a + b, 0);
      const newNetWorth = newCash + portfolioValue;

      let aiMessage = `Month ${actualNextMonth}, ${nextYear} update:\n`;
      aiMessage += `💰 Salary: +₹${newSalary.toLocaleString('en-IN')}\n`;
      aiMessage += `💸 Expenses: -₹${newExpenses.toLocaleString('en-IN')}\n`;
      
      const totalReturns = Object.values(portfolioReturns).reduce((a, b) => a + b, 0);
      if (totalReturns > 0) {
        aiMessage += `📈 Portfolio gains: +₹${Math.round(totalReturns).toLocaleString('en-IN')}\n`;
      } else if (totalReturns < 0) {
        aiMessage += `📉 Portfolio loss: ₹${Math.round(totalReturns).toLocaleString('en-IN')}\n`;
      }

      if (lifeEvent) {
        aiMessage += `⚡ ${lifeEvent.name}: ${lifeEvent.impact > 0 ? '+' : ''}₹${lifeEvent.impact.toLocaleString('en-IN')}\n`;
      }

      aiMessage += `\n💼 Net Worth: ₹${Math.round(newNetWorth).toLocaleString('en-IN')}`;

      if (newNetWorth >= 1000000 && prev.netWorth < 1000000) {
        unlockAchievement('millionaire');
      }

      const allCategoriesInvested = Object.values(prev.monthlyInvestments).every(v => v > 0);
      if (allCategoriesInvested) {
        unlockAchievement('diversified');
      }

      if (prev.monthlyInvestments.sip > 0) {
        unlockAchievement('first-investment');
      }

      const newXP = prev.xp + 20;
      const newLevel = Math.floor(newXP / 200) + 1;
      
      if (newLevel >= 5 && prev.level < 5) {
        unlockAchievement('level-5');
      }

      if (newNetWorth >= 5000000) {
        setGameOver('win');
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
        });
      } else if (newNetWorth < -100000) {
        setGameOver('loss');
      }

      return {
        ...prev,
        currentMonth: actualNextMonth,
        currentYear: nextYear,
        cashBalance: newCash,
        netWorth: newNetWorth,
        portfolio: updatedPortfolio,
        chatHistory: [
          ...prev.chatHistory,
          { role: 'ai', content: aiMessage, timestamp: Date.now() },
        ],
        xp: newXP,
        level: newLevel,
      };
    });

    setMonthlyDecisions({ sip: 0, stocks: 0, gold: 0, realEstate: 0, savings: 0 });
    setProcessingMonth(false);
  };

  const sendAIMessage = async (userMessage: string) => {
    if (!userMessage.trim() && chatInput.trim()) {
      userMessage = chatInput;
    }
    
    if (!userMessage.trim()) return;

    const userMsg = { role: 'user' as const, content: userMessage, timestamp: Date.now() };
    
    setGameState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMsg],
    }));

    setChatInput('');
    setAiLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          gameState: {
            netWorth: gameState.netWorth,
            portfolio: gameState.portfolio,
            level: gameState.level,
            career: gameState.userProfile?.career,
          },
        }),
      });

      if (!response.ok) throw new Error('AI response failed');

      const data = await response.json();

      setGameState(prev => ({
        ...prev,
        chatHistory: [
          ...prev.chatHistory,
          { role: 'ai', content: data.response, timestamp: Date.now() },
        ],
      }));
    } catch (error) {
      console.error('AI chat error:', error);
      
      const fallbackMsg = `I'm having trouble connecting right now, but I'm here to support you! ${
        userMessage.includes('invest') 
          ? "Remember: Diversification is key to managing risk. Keep building your portfolio steadily! 💪" 
          : "Keep making smart financial decisions. Your future self will thank you! 🌟"
      }`;
      
      setGameState(prev => ({
        ...prev,
        chatHistory: [
          ...prev.chatHistory,
          { role: 'ai', content: fallbackMsg, timestamp: Date.now() },
        ],
      }));
    } finally {
      setAiLoading(false);
    }
  };

  const exportChat = () => {
    const chatText = gameState.chatHistory
      .map(msg => `[${msg.role.toUpperCase()}]: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finverse-chat-history.txt';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Chat Exported',
      description: 'Your conversation history has been downloaded',
    });
  };

  const resetGame = async () => {
    if (!confirm('Are you sure you want to reset your game? All progress will be lost.')) {
      return;
    }

    setGameState({
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

    setOnboarding({ active: true, step: 1, name: '', career: '' });
    setGameOver(null);

    if (userId && userId !== 'guest') {
      await supabase
        .from('game_saves')
        .delete()
        .eq('user_id', userId);
    }

    toast({
      title: 'Game Reset',
      description: 'Your financial journey begins anew',
    });
  };

  const handleLogout = async () => {
    if (userId !== 'guest') {
      await saveGameState();
      await supabase.auth.signOut();
    }
    setUserId(null);
    setAuthChecked(false);
    resetGame();
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#0A0F1F' }}>
        <div className="text-neon-cyan text-xl animate-pulse">Loading Finverse...</div>
      </div>
    );
  }

  if (!userId) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (onboarding.active) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: '#0A0F1F' }}>
        <Card className="w-full max-w-2xl border-neon-cyan/30 bg-black/40 backdrop-blur-xl shadow-neon-cyan">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#00E5FF' }}>
                <Sparkles className="inline mr-2 h-8 w-8" />
                Finverse
              </h1>
              <p className="text-lg" style={{ color: '#E6F1FF' }}>
                Play. Learn. Conquer Financial Freedom.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-neon-purple text-lg">What's your name?</Label>
                <Input
                  id="name"
                  data-testid="input-name"
                  value={onboarding.name}
                  onChange={(e) => setOnboarding(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="mt-2 bg-black/60 border-neon-cyan/50 text-white placeholder:text-gray-500 focus:border-neon-cyan focus:shadow-neon-cyan"
                />
              </div>

              <div>
                <Label htmlFor="career" className="text-neon-purple text-lg">Choose your career path</Label>
                <Select
                  value={onboarding.career}
                  onValueChange={(value) => setOnboarding(prev => ({ ...prev, career: value as Career }))}
                >
                  <SelectTrigger 
                    id="career"
                    data-testid="select-career"
                    className="mt-2 bg-black/60 border-neon-cyan/50 text-white focus:border-neon-cyan focus:shadow-neon-cyan"
                  >
                    <SelectValue placeholder="Select a career" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-neon-cyan/50">
                    {Object.entries(CAREER_DATA).map(([career, data]) => (
                      <SelectItem 
                        key={career} 
                        value={career}
                        className="text-white focus:bg-neon-cyan/20 focus:text-neon-cyan"
                        data-testid={`option-career-${career.toLowerCase()}`}
                      >
                        {career} - ₹{data.salary.toLocaleString('en-IN')}/month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {onboarding.career && (
                <div className="p-4 rounded-lg border border-neon-purple/30 bg-neon-purple/10 animate-slide-in">
                  <p className="text-sm" style={{ color: '#E6F1FF' }}>
                    <span className="text-neon-lime font-semibold">Monthly Salary:</span> ₹{CAREER_DATA[onboarding.career].salary.toLocaleString('en-IN')}
                    <br />
                    <span className="text-neon-pink font-semibold">Monthly Expenses:</span> ₹{CAREER_DATA[onboarding.career].expenses.toLocaleString('en-IN')}
                    <br />
                    <span className="text-neon-cyan font-semibold">Available to Invest:</span> ₹{(CAREER_DATA[onboarding.career].salary - CAREER_DATA[onboarding.career].expenses).toLocaleString('en-IN')}
                  </p>
                </div>
              )}

              <Button
                data-testid="button-start-journey"
                onClick={completeOnboarding}
                className="w-full bg-neon-cyan text-black hover:bg-neon-cyan/90 shadow-neon-cyan font-bold text-lg py-6"
              >
                <Zap className="mr-2 h-5 w-5" />
                Start Your Financial Journey
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ background: '#0A0F1F', color: '#E6F1FF' }}>
      {/* Header */}
      <header className="border-b border-neon-cyan/20 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              data-testid="button-mobile-menu"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6 text-neon-cyan" /> : <Menu className="h-6 w-6 text-neon-cyan" />}
            </button>
            <h1 className="text-2xl font-bold text-neon-cyan flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              Finverse
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/50">
              Level {gameState.level}
            </Badge>
            <Badge className="bg-primary/30 text-white border-primary/50">
              {gameState.xp} XP
            </Badge>
            <Button
              data-testid="button-aura-twin"
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/20"
              onClick={() => setShowAuraTwin(true)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Aura Twin
            </Button>
            <Button
              data-testid="button-settings"
              size="icon"
              variant="ghost"
              onClick={() => setShowSettings(true)}
              className="text-primary hover:bg-primary/20"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Full Width - Dashboard & Decisions */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Current Status */}
              <Card className="border-neon-cyan/30 bg-black/40 backdrop-blur-xl shadow-neon-cyan">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-neon-cyan">
                        {gameState.userProfile?.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {gameState.userProfile?.career} • Month {gameState.currentMonth}, {gameState.currentYear}
                      </p>
                    </div>
                    <Badge className="bg-neon-lime/20 text-neon-lime border-neon-lime/50 text-lg px-4 py-2">
                      <Coins className="mr-2 h-5 w-5" />
                      ₹{Math.round(gameState.netWorth).toLocaleString('en-IN')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5">
                      <p className="text-xs text-gray-400 mb-1">Cash Balance</p>
                      <p className="text-xl font-bold text-neon-cyan" data-testid="text-cash-balance">
                        ₹{Math.round(gameState.cashBalance).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-neon-lime/30 bg-neon-lime/5">
                      <p className="text-xs text-gray-400 mb-1">Portfolio Value</p>
                      <p className="text-xl font-bold text-neon-lime" data-testid="text-portfolio-value">
                        ₹{Math.round(Object.values(gameState.portfolio).reduce((a, b) => a + b, 0)).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Investment Decisions */}
              <Card className="border-neon-purple/30 bg-black/40 backdrop-blur-xl shadow-neon-purple">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neon-purple mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Monthly Investment Decisions
                  </h3>

                  <div className="space-y-4">
                    {(['sip', 'stocks', 'gold', 'realEstate', 'savings'] as const).map((type) => (
                      <div key={type}>
                        <Label htmlFor={type} className="text-sm text-gray-300 capitalize">
                          {type === 'realEstate' ? 'Real Estate' : type}
                        </Label>
                        <Input
                          id={type}
                          data-testid={`input-${type}`}
                          type="number"
                          value={monthlyDecisions[type]}
                          onChange={(e) =>
                            setMonthlyDecisions(prev => ({ ...prev, [type]: Number(e.target.value) || 0 }))
                          }
                          placeholder="₹0"
                          className="mt-1 bg-black/60 border-neon-cyan/50 text-white placeholder:text-gray-500 focus:border-neon-cyan focus:shadow-neon-cyan"
                        />
                      </div>
                    ))}

                    <Separator className="bg-neon-cyan/20" />

                    <div className="flex items-center justify-between p-3 rounded-lg border border-neon-lime/30 bg-neon-lime/5">
                      <span className="font-semibold">Total Investment</span>
                      <span className="text-xl font-bold text-neon-lime" data-testid="text-total-investment">
                        ₹{Object.values(monthlyDecisions).reduce((a, b) => a + b, 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Button
                      data-testid="button-confirm-investments"
                      onClick={processMonthlyDecisions}
                      disabled={processingMonth || Object.values(monthlyDecisions).reduce((a, b) => a + b, 0) === 0}
                      className="w-full bg-neon-cyan text-black hover:bg-neon-cyan/90 shadow-neon-cyan font-bold text-lg py-6 animate-pulse-glow"
                    >
                      {processingMonth ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Confirm & Process Month
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Panel - Sidebar */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {/* Portfolio Breakdown */}
              <Card className="border-neon-lime/30 bg-black/40 backdrop-blur-xl shadow-neon-lime">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neon-lime mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Portfolio
                  </h3>

                  <div className="space-y-3">
                    {Object.entries(gameState.portfolio).map(([type, value]) => {
                      const total = Object.values(gameState.portfolio).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? (value / total) * 100 : 0;

                      return (
                        <div key={type} data-testid={`portfolio-${type}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-400 capitalize">
                              {type === 'realEstate' ? 'Real Estate' : type}
                            </span>
                            <span className="text-sm font-semibold">
                              ₹{Math.round(value).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2 bg-black/60" />
                          <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* Achievements */}
              <Card className="border-neon-pink/30 bg-black/40 backdrop-blur-xl shadow-neon-pink">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neon-pink mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Achievements
                  </h3>

                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {gameState.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          data-testid={`achievement-${achievement.id}`}
                          className={`p-3 rounded-lg border ${
                            achievement.unlocked
                              ? 'border-neon-lime/50 bg-neon-lime/10'
                              : 'border-gray-700 bg-black/20 opacity-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{achievement.icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{achievement.title}</p>
                              <p className="text-xs text-gray-400">{achievement.description}</p>
                            </div>
                            {achievement.unlocked && (
                              <Check className="h-4 w-4 text-neon-lime" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </Card>

              {/* Leaderboard */}
              {leaderboard.length > 0 && (
                <Card className="border-neon-cyan/30 bg-black/40 backdrop-blur-xl shadow-neon-cyan">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neon-cyan mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Top Players
                    </h3>

                    <div className="space-y-2">
                      {leaderboard.slice(0, 5).map((player, idx) => (
                        <div
                          key={idx}
                          data-testid={`leaderboard-${idx}`}
                          className={`p-3 rounded-lg border ${
                            idx === 0
                              ? 'border-neon-lime/50 bg-neon-lime/10'
                              : 'border-gray-700 bg-black/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-gray-400">
                                #{idx + 1}
                              </span>
                              <div>
                                <p className="font-semibold text-sm">{player.name}</p>
                                <p className="text-xs text-gray-400">Level {player.level}</p>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-neon-lime">
                              ₹{Math.round(player.score).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Aura Twin Modal */}
      <Dialog open={showAuraTwin} onOpenChange={setShowAuraTwin}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col border-primary/30 bg-black/50 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Aura Twin - Your AI Financial Mentor
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {gameState.chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.role === 'ai'
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-primary/20 border border-primary/40 ml-4'
                  }`}
                  data-testid={`chat-message-${idx}`}
                >
                  <p className="text-sm whitespace-pre-line text-gray-200">{msg.content}</p>
                </div>
              ))}
              {aiLoading && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-sm text-primary animate-pulse">Aura Twin is thinking...</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          <div className="flex gap-2 pt-4 border-t border-primary/20">
            <Input
              data-testid="input-chat"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendAIMessage(chatInput)}
              placeholder="Ask Aura Twin..."
              className="bg-black/60 border-primary/50 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Button
              data-testid="button-send-chat"
              size="icon"
              onClick={() => sendAIMessage(chatInput)}
              disabled={aiLoading}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-black border-neon-cyan/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-neon-cyan">Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              data-testid="button-export-chat"
              onClick={exportChat}
              variant="outline"
              className="w-full border-neon-purple/50 text-neon-purple hover:bg-neon-purple/20"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Chat History
            </Button>
            <Button
              data-testid="button-set-goal"
              onClick={() => {
                setShowSettings(false);
                setShowGoals(true);
              }}
              variant="outline"
              className="w-full border-neon-lime/50 text-neon-lime hover:bg-neon-lime/20"
            >
              <Target className="mr-2 h-4 w-4" />
              Set Financial Goal
            </Button>
            <Button
              data-testid="button-reset-game"
              onClick={resetGame}
              variant="outline"
              className="w-full border-neon-pink/50 text-neon-pink hover:bg-neon-pink/20"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Game
            </Button>
            {userId && userId !== 'guest' && (
              <Button
                data-testid="button-save-game"
                onClick={() => saveGameState(false)}
                variant="outline"
                className="w-full border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20"
              >
                <Download className="mr-2 h-4 w-4" />
                Save Game Now
              </Button>
            )}
            <Button
              data-testid="button-logout"
              onClick={handleLogout}
              variant="outline"
              className="w-full border-gray-500 text-gray-400 hover:bg-gray-800"
            >
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Goals Modal */}
      <Dialog open={showGoals} onOpenChange={setShowGoals}>
        <DialogContent className="bg-black border-neon-lime/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-neon-lime">Set Your Financial Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goalAmount">Target Net Worth (₹)</Label>
              <Input
                id="goalAmount"
                data-testid="input-goal-amount"
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="e.g., 5000000"
                className="mt-2 bg-black/60 border-neon-lime/50 text-white"
              />
            </div>
            <Button
              data-testid="button-save-goal"
              onClick={() => {
                toast({
                  title: 'Goal Set!',
                  description: `Target: ₹${Number(goalAmount).toLocaleString('en-IN')}`,
                });
                setShowGoals(false);
              }}
              className="w-full bg-neon-lime text-black hover:bg-neon-lime/90"
            >
              Save Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Game Over Modal */}
      {gameOver && (
        <Dialog open={!!gameOver} onOpenChange={() => setGameOver(null)}>
          <DialogContent className={`bg-black border-${gameOver === 'win' ? 'neon-lime' : 'neon-pink'}/50 text-white`}>
            <DialogHeader>
              <DialogTitle className={`text-2xl text-${gameOver === 'win' ? 'neon-lime' : 'neon-pink'}`}>
                {gameOver === 'win' ? '🎉 Financial Freedom Achieved!' : '💀 Bankruptcy'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-center">
                {gameOver === 'win'
                  ? `Congratulations! You've reached ₹${Math.round(gameState.netWorth).toLocaleString('en-IN')} net worth and achieved financial freedom!`
                  : 'Your net worth has fallen too low. Time to start fresh and learn from your mistakes.'}
              </p>
              <Button
                data-testid="button-play-again"
                onClick={() => {
                  setGameOver(null);
                  resetGame();
                }}
                className={`w-full bg-${gameOver === 'win' ? 'neon-lime' : 'neon-pink'} text-black hover:opacity-90`}
              >
                Play Again
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
