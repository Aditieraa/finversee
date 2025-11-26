import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import Auth from './auth';
import Dashboard from './dashboard';
import Analytics from './analytics';
import Budget from './budget';
import Stocks from './stocks';
import Leaderboard from './leaderboard';
// @ts-ignore
import avatar1 from '@assets/generated_images/female_professional_avatar.png';
// @ts-ignore
import avatar2 from '@assets/generated_images/male_professional_avatar.png';
// @ts-ignore
import avatar3 from '@assets/generated_images/woman_curly_hair_avatar.png';
// @ts-ignore
import avatar4 from '@assets/generated_images/man_blonde_hair_avatar.png';
// @ts-ignore
import avatar5 from '@assets/generated_images/woman_red_hair_avatar.png';
// @ts-ignore
import avatar6 from '@assets/generated_images/man_brown_hair_avatar.png';
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
  LayoutDashboard,
  TrendingUpIcon,
  PieChart,
  DollarSign,
  Users,
} from 'lucide-react';

type Career = 'Engineer' | 'Designer' | 'CA' | 'Doctor' | 'Sales';
type AvatarType = 'female1' | 'male1' | 'female2' | 'male2' | 'female3' | 'male3';

interface UserProfile {
  name: string;
  career: Career;
  salary: number;
  expenses: number;
  avatar?: AvatarType;
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

interface StockHolding {
  symbol: string;
  shares: number;
  buyPrice: number;
  investmentAmount: number;
  purchaseDate: string;
}

interface GameState {
  currentMonth: number;
  currentYear: number;
  cashBalance: number;
  netWorth: number;
  userProfile: UserProfile | null;
  portfolio: Portfolio;
  stockHoldings: StockHolding[];
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
    stockHoldings: [],
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
    career: '' as string,
    salary: '',
    expenses: '',
    avatar: 'female1' as AvatarType,
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'game' | 'analytics' | 'budget' | 'stocks' | 'leaderboard'>('dashboard');

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

      if (error) {
        console.error('❌ Save error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userId,
        });
        throw error;
      }

      console.log('✅ Game state saved successfully');

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
          title: 'Save Warning',
          description: 'Could not save game state. Your progress may be lost if you close the app.',
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
    if (!onboarding.name || !onboarding.career || !onboarding.salary || !onboarding.expenses) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your name, profession, salary, and expenses',
        variant: 'destructive',
      });
      return;
    }

    const salary = parseInt(onboarding.salary) || 0;
    const expenses = parseInt(onboarding.expenses) || 0;

    if (salary <= 0 || expenses < 0 || expenses > salary) {
      toast({
        title: 'Invalid Values',
        description: 'Please enter valid salary and expenses (expenses cannot exceed salary)',
        variant: 'destructive',
      });
      return;
    }

    const profile: UserProfile = {
      name: onboarding.name,
      career: onboarding.career as Career,
      salary: salary,
      expenses: expenses,
      avatar: onboarding.avatar,
    };

    const initialCash = salary - expenses;

    if (userId && userId !== 'guest') {
      try {
        // First try to upsert (insert or update) the profile
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            name: onboarding.name,
            career: onboarding.career,
            email: undefined,
            updated_at: new Date().toISOString(),
          });
        
        if (upsertError) {
          console.error('Error upserting profile:', upsertError);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }

    const newGameState = {
      currentMonth: 1,
      currentYear: 2025,
      cashBalance: initialCash,
      netWorth: initialCash,
      userProfile: profile,
      portfolio: { sip: 0, stocks: 0, gold: 0, realEstate: 0, savings: 0 },
      chatHistory: [
        {
          role: 'ai' as const,
          content: `Hello ${onboarding.name}! I'm Aura Twin, your financial advisor. I see you're a ${onboarding.career} with a monthly salary of ₹${salary.toLocaleString('en-IN')}. After accounting for ₹${expenses.toLocaleString('en-IN')} in monthly expenses, you have ₹${initialCash.toLocaleString('en-IN')} available for investment. I'm here to help you build a sustainable financial plan.`,
          timestamp: Date.now(),
        },
      ],
      xp: 0,
      level: 1,
      achievements: ACHIEVEMENTS,
      lastLoginDate: new Date().toISOString().split('T')[0],
      consecutiveLogins: 1,
      monthlyInvestments: { sip: 0, stocks: 0, gold: 0, realEstate: 0, savings: 0 },
    };

    setGameState(newGameState);
    setOnboarding({ active: false, step: 1, name: '', career: '', salary: '', expenses: '', avatar: 'female1' });

    // Save game state immediately after onboarding to prevent data loss
    if (userId && userId !== 'guest') {
      try {
        const { error } = await supabase
          .from('game_saves')
          .upsert({
            user_id: userId,
            game_state: newGameState,
            chat_history: newGameState.chatHistory,
            achievements: newGameState.achievements,
            leaderboard_score: newGameState.netWorth,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error saving game state after onboarding:', error);
          toast({
            title: 'Save Warning',
            description: 'Could not save game state. Your progress may be lost if you close the app.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: '💾 Game Saved',
            description: 'Your financial profile has been created and saved!',
          });
        }
      } catch (error) {
        console.error('Unexpected error saving game state:', error);
      }
    }
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
          context: {
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
      try {
        // Save game state before logout
        await saveGameState(true);
        
        // Wait a moment to ensure save completes
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Then sign out
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Logout error:', error);
          toast({
            title: 'Logout Error',
            description: 'Could not sign out. Please try again.',
            variant: 'destructive',
          });
          return;
        }
      } catch (error) {
        console.error('Error during logout:', error);
        toast({
          title: 'Logout Error',
          description: 'An error occurred while logging out.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Clear local state
    setUserId(null);
    resetGame();
    
    // Set authChecked to true so the Auth page shows (don't set to false to avoid infinite loading)
    setAuthChecked(true);
    
    toast({
      title: 'Logged Out',
      description: 'You have been signed out successfully.',
    });
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

  const avatarMap: Record<string, string> = {
    female1: avatar1,
    male1: avatar2,
    female2: avatar3,
    male2: avatar4,
    female3: avatar5,
    male3: avatar6,
  };

  const AVATARS = [
    { id: 'female1', name: 'Priya' },
    { id: 'male1', name: 'Arjun' },
    { id: 'female2', name: 'Ananya' },
    { id: 'male2', name: 'Rohan' },
    { id: 'female3', name: 'Sophia' },
    { id: 'male3', name: 'Vikram' },
  ];

  const getAvatarUrl = (avatarId: string) => avatarMap[avatarId];

  if (onboarding.active) {
    const selectedAvatar = AVATARS.find(a => a.id === onboarding.avatar);
    
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #1B263B 0%, #2E4057 50%, #4A90E2 100%)' }}>
        <Card className="w-full max-w-2xl border-primary/30 glassmorphic">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 text-primary">
                <Sparkles className="inline mr-2 h-8 w-8 glow" />
                Finverse
              </h1>
              <p className="text-lg text-foreground">
                Play. Learn. Conquer Financial Freedom.
              </p>
            </div>

            <div className="space-y-6">
              {/* Avatar Selection */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-4">Choose Your Avatar</h2>
                <p className="text-foreground/70 mb-6">Personalize your in-game character and choose your path to financial freedom.</p>
                
                {selectedAvatar && (
                  <div className="mb-6 flex justify-center">
                    <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-primary/50 shadow-lg">
                      <img src={getAvatarUrl(onboarding.avatar)} alt={selectedAvatar.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {AVATARS.map((avatar) => (
                    <button key={avatar.id} onClick={() => setOnboarding(prev => ({ ...prev, avatar: avatar.id }))} className={`p-2 rounded-lg border-2 transition ${onboarding.avatar === avatar.id ? 'border-primary bg-primary/20' : 'border-primary/30 hover:border-primary/60'}`}>
                      <div className="w-20 h-24 mx-auto rounded overflow-hidden">
                        <img src={getAvatarUrl(avatar.id)} alt={avatar.name} className="w-full h-full object-cover" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="name" className="text-primary text-lg">Name</Label>
                <Input
                  id="name"
                  data-testid="input-name"
                  value={onboarding.name}
                  onChange={(e) => setOnboarding(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="mt-2 interactive-hover"
                />
              </div>

              <div>
                <Label htmlFor="career" className="text-primary text-lg">Your Profession</Label>
                <Input
                  id="career"
                  data-testid="input-profession"
                  value={onboarding.career}
                  onChange={(e) => setOnboarding(prev => ({ ...prev, career: e.target.value }))}
                  placeholder="e.g., Software Engineer, Doctor, Teacher"
                  className="mt-2 interactive-hover"
                />
              </div>

              <div>
                <Label htmlFor="salary" className="text-primary text-lg">Monthly Salary (₹)</Label>
                <Input
                  id="salary"
                  data-testid="input-salary"
                  type="number"
                  value={onboarding.salary}
                  onChange={(e) => setOnboarding(prev => ({ ...prev, salary: e.target.value }))}
                  placeholder="Enter your monthly salary"
                  className="mt-2 interactive-hover"
                />
              </div>

              <div>
                <Label htmlFor="expenses" className="text-primary text-lg">Monthly Expenses (₹)</Label>
                <Input
                  id="expenses"
                  data-testid="input-expenses"
                  type="number"
                  value={onboarding.expenses}
                  onChange={(e) => setOnboarding(prev => ({ ...prev, expenses: e.target.value }))}
                  placeholder="Enter your monthly expenses"
                  className="mt-2 interactive-hover"
                />
              </div>

              {onboarding.salary && onboarding.expenses && (
                <div className="p-4 rounded-lg border border-neon-purple/30 bg-neon-purple/10 animate-slide-in">
                  <p className="text-sm" style={{ color: '#E6F1FF' }}>
                    <span className="text-neon-lime font-semibold">Monthly Salary:</span> ₹{parseInt(onboarding.salary || '0').toLocaleString('en-IN')}
                    <br />
                    <span className="text-neon-pink font-semibold">Monthly Expenses:</span> ₹{parseInt(onboarding.expenses || '0').toLocaleString('en-IN')}
                    <br />
                    <span className="text-neon-cyan font-semibold">Available to Invest:</span> ₹{(parseInt(onboarding.salary || '0') - parseInt(onboarding.expenses || '0')).toLocaleString('en-IN')}
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
    <div className="min-h-screen w-full" style={{ background: 'linear-gradient(135deg, #1B263B 0%, #2E4057 50%, #4A90E2 100%)', color: '#E6F1FF' }}>
      {/* Header */}
      <header className="border-b border-primary/20 glassmorphic sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 mb-2">
            <div className="flex items-center gap-4">
              <button
                data-testid="button-mobile-menu"
                className="lg:hidden text-primary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Sparkles className="h-6 w-6 glow" />
                Finverse
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {gameState.userProfile?.avatar && (
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/50">
                  <img src={getAvatarUrl(gameState.userProfile.avatar)} alt={gameState.userProfile.name} className="w-full h-full object-cover" />
                </div>
              )}
              <Badge className="bg-primary/20 text-primary border-primary/50 neon-glow">
                Level {gameState.level}
              </Badge>
              <Badge className="bg-primary/30 text-white border-primary/50 neon-glow">
                {gameState.xp} XP
              </Badge>
              <Button
                data-testid="button-aura-twin"
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/20 neon-glow interactive-hover"
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
                className="text-primary hover:bg-primary/20 interactive-hover"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={currentView === 'game' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('game')}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Game
            </Button>
            <Button
              variant={currentView === 'analytics' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('analytics')}
              className="flex items-center gap-2"
            >
              <TrendingUpIcon className="h-4 w-4" />
              Analytics
            </Button>
            <Button
              variant={currentView === 'budget' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('budget')}
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Budget
            </Button>
            <Button
              variant={currentView === 'stocks' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('stocks')}
              className="flex items-center gap-2"
            >
              <TrendingUpIcon className="h-4 w-4" />
              Stocks
            </Button>
            <Button
              variant={currentView === 'leaderboard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('leaderboard')}
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <Dashboard gameState={gameState} monthlyDecisions={monthlyDecisions} />
        )}

        {/* Game View */}
        {currentView === 'game' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Full Width - Dashboard & Decisions */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Current Status */}
              <Card className="border-primary/30 glassmorphic">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-primary">
                        {gameState.userProfile?.name}
                      </h3>
                      <p className="text-sm text-foreground/60">
                        {gameState.userProfile?.career} • Month {gameState.currentMonth}, {gameState.currentYear}
                      </p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/50 text-lg px-4 py-2 neon-glow">
                      <Coins className="mr-2 h-5 w-5" />
                      ₹{Math.round(gameState.netWorth).toLocaleString('en-IN')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-primary/30 glassmorphic interactive-hover">
                      <p className="text-xs text-foreground/60 mb-1">Cash Balance</p>
                      <p className="text-xl font-bold text-primary" data-testid="text-cash-balance">
                        ₹{Math.round(gameState.cashBalance).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-primary/30 glassmorphic interactive-hover">
                      <p className="text-xs text-foreground/60 mb-1">Portfolio Value</p>
                      <p className="text-xl font-bold text-primary" data-testid="text-portfolio-value">
                        ₹{Math.round(Object.values(gameState.portfolio).reduce((a, b) => a + b, 0)).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Investment Decisions */}
              <Card className="border-primary/30 glassmorphic">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Monthly Investment Decisions
                  </h3>

                  <div className="space-y-4">
                    {(['sip', 'stocks', 'gold', 'realEstate', 'savings'] as const).map((type) => (
                      <div key={type}>
                        <Label htmlFor={type} className="text-sm text-foreground/70 capitalize">
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
                          className="mt-1 interactive-hover"
                        />
                      </div>
                    ))}

                    <Separator className="bg-primary/20" />

                    <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 glassmorphic interactive-hover">
                      <span className="font-semibold text-foreground">Total Investment</span>
                      <span className="text-xl font-bold text-primary" data-testid="text-total-investment">
                        ₹{Object.values(monthlyDecisions).reduce((a, b) => a + b, 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Button
                      data-testid="button-confirm-investments"
                      onClick={processMonthlyDecisions}
                      disabled={processingMonth || Object.values(monthlyDecisions).reduce((a, b) => a + b, 0) === 0}
                      className="w-full neon-glow interactive-hover font-bold text-lg py-6"
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
              <Card className="border-primary/30 glassmorphic">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Portfolio
                  </h3>

                  <div className="space-y-3">
                    {Object.entries(gameState.portfolio).map(([type, value]) => {
                      const total = Object.values(gameState.portfolio).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? (value / total) * 100 : 0;

                      return (
                        <div key={type} data-testid={`portfolio-${type}`} className="interactive-hover p-2 rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-foreground/60 capitalize">
                              {type === 'realEstate' ? 'Real Estate' : type}
                            </span>
                            <span className="text-sm font-semibold text-primary">
                              ₹{Math.round(value).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2 progress-fill" />
                          <p className="text-xs text-foreground/50 mt-1">{percentage.toFixed(1)}%</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* Achievements */}
              <Card className="border-primary/30 glassmorphic">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Achievements
                  </h3>

                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {gameState.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          data-testid={`achievement-${achievement.id}`}
                          className={`p-3 rounded-lg border interactive-hover achievement-pop ${
                            achievement.unlocked
                              ? 'border-primary/50 glassmorphic'
                              : 'border-primary/20 bg-foreground/5 opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{achievement.icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-foreground">{achievement.title}</p>
                              <p className="text-xs text-foreground/60">{achievement.description}</p>
                            </div>
                            {achievement.unlocked && (
                              <Check className="h-4 w-4 text-primary" />
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
                <Card className="border-primary/30 glassmorphic">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Top Players
                    </h3>

                    <div className="space-y-2">
                      {leaderboard.slice(0, 5).map((player, idx) => (
                        <div
                          key={idx}
                          data-testid={`leaderboard-${idx}`}
                          className={`p-3 rounded-lg border interactive-hover ${
                            idx === 0
                              ? 'border-primary/50 glassmorphic neon-glow'
                              : 'border-primary/20 glassmorphic'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-primary">
                                #{idx + 1}
                              </span>
                              <div>
                                <p className="font-semibold text-sm text-foreground">{player.name}</p>
                                <p className="text-xs text-foreground/60">Level {player.level}</p>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-primary">
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
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <Analytics gameState={gameState} />
        )}

        {/* Budget View */}
        {currentView === 'budget' && (
          <Budget gameState={gameState} />
        )}

        {/* Stocks View */}
        {currentView === 'stocks' && (
          <Stocks gameState={gameState} setGameState={setGameState} />
        )}

        {/* Leaderboard View */}
        {currentView === 'leaderboard' && (
          <Leaderboard />
        )}
      </div>

      {/* Aura Twin Modal */}
      <Dialog open={showAuraTwin} onOpenChange={setShowAuraTwin}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col border-primary/30 glassmorphic modal-slide">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
              <Sparkles className="h-5 w-5 glow" />
              Aura Twin - Your AI Financial Mentor
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4 bg-gradient-to-b from-slate-900/30 to-slate-800/20">
            <div className="space-y-3 p-4">
              {gameState.chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                  data-testid={`chat-message-${idx}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.role === 'ai'
                        ? 'bg-gradient-to-br from-blue-600/40 to-blue-700/30 border border-blue-400/40 text-blue-50'
                        : 'bg-gradient-to-br from-purple-600/50 to-purple-700/40 border border-purple-400/40 text-purple-50'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line break-words">{msg.content}</p>
                    <p className={`text-xs mt-2 ${msg.role === 'ai' ? 'text-blue-200/60' : 'text-purple-200/60'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-blue-600/40 to-blue-700/30 border border-blue-400/40 rounded-2xl px-4 py-3">
                    <p className="text-sm text-blue-50 animate-pulse">Aura Twin is thinking...</p>
                  </div>
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
              className="interactive-hover"
            />
            <Button
              data-testid="button-send-chat"
              size="icon"
              onClick={() => sendAIMessage(chatInput)}
              disabled={aiLoading}
              className="neon-glow interactive-hover"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="border-primary/30 glassmorphic modal-slide">
          <DialogHeader>
            <DialogTitle className="text-primary">Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              data-testid="button-export-chat"
              onClick={exportChat}
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary/20 interactive-hover"
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
              className="w-full border-primary/50 text-primary hover:bg-primary/20 interactive-hover"
            >
              <Target className="mr-2 h-4 w-4" />
              Set Financial Goal
            </Button>
            <Button
              data-testid="button-reset-game"
              onClick={resetGame}
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary/20 interactive-hover"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Game
            </Button>
            {userId && userId !== 'guest' && (
              <Button
                data-testid="button-save-game"
                onClick={() => saveGameState(false)}
                variant="outline"
                className="w-full border-primary/50 text-primary hover:bg-primary/20 interactive-hover"
              >
                <Download className="mr-2 h-4 w-4" />
                Save Game Now
              </Button>
            )}
            <Button
              data-testid="button-logout"
              onClick={handleLogout}
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary/20 interactive-hover"
            >
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Goals Modal */}
      <Dialog open={showGoals} onOpenChange={setShowGoals}>
        <DialogContent className="border-primary/30 glassmorphic modal-slide">
          <DialogHeader>
            <DialogTitle className="text-primary">Set Your Financial Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goalAmount" className="text-foreground">Target Net Worth (₹)</Label>
              <Input
                id="goalAmount"
                data-testid="input-goal-amount"
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="e.g., 5000000"
                className="mt-2 interactive-hover"
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
              className="w-full neon-glow interactive-hover"
            >
              Save Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Game Over Modal */}
      {gameOver && (
        <Dialog open={!!gameOver} onOpenChange={() => setGameOver(null)}>
          <DialogContent className="border-primary/30 glassmorphic modal-slide">
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary">
                {gameOver === 'win' ? 'Financial Freedom Achieved!' : 'Bankruptcy'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-center text-foreground">
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
                className="w-full neon-glow interactive-hover achievement-pop"
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
