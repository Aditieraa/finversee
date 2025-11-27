import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import Auth from './auth';
import Dashboard from './dashboard';
import Analytics from './analytics';
import Budget from './budget';
import Stocks from './stocks';
import Leaderboard from './leaderboard';
import BreakTheRaceGame from './breaktherace';
import { AppHeader } from '@/components/app-header';
import { QuickActionsPanel } from '@/components/quick-actions-panel';
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
// @ts-ignore
import auraTwinImage from '@assets/generated_images/ai_mentor_assistant_icon.png';
// @ts-ignore
import piggyBankImage from '@assets/image_1764239697855.png';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ScrollableTabs } from '@/components/scrollable-tabs';

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
  goldCoins: number;
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
  monthlyExpensesThisMonth?: number;
  financialGoal?: number;
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
    goldCoins: 50000,
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
    monthlyExpensesThisMonth: 0,
    financialGoal: 5000000,
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
  const [showProfile, setShowProfile] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [goalAmount, setGoalAmount] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gameOver, setGameOver] = useState<'win' | 'loss' | null>(null);
  const [processingMonth, setProcessingMonth] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Array<{ name: string; score: number; level: number; avatar?: string }>>([]);
  const [showAuraTwin, setShowAuraTwin] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
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
      checkDailyLogin();
    }
    if (userId) {
      loadLeaderboard();
    }
  }, [userId]);

  useEffect(() => {
    if (userId && userId !== 'guest' && gameState.userProfile) {
      // Auto-save every 60 seconds
      const autoSaveInterval = setInterval(() => {
        saveGameState(true);
      }, 60000);

      // Refresh leaderboard every 10 seconds for real-time syncing
      const leaderboardInterval = setInterval(() => {
        loadLeaderboard();
      }, 10000);

      return () => {
        clearInterval(autoSaveInterval);
        clearInterval(leaderboardInterval);
      };
    }
  }, [userId, gameState]);

  // Calculate netWorth from current gameState
  const calculateNetWorth = () => {
    const portfolioTotal = Object.values(gameState.portfolio).reduce((a: number, b: number) => a + b, 0);
    const stockInvestmentValue = gameState.stockHoldings && gameState.stockHoldings.length > 0
      ? gameState.stockHoldings.reduce((total: number, holding: any) => total + (holding.investmentAmount || 0), 0)
      : 0;
    return gameState.cashBalance + portfolioTotal + stockInvestmentValue;
  };

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
      const portfolioTotal = Object.values(gameState.portfolio).reduce((a: number, b: number) => a + b, 0);
      const netWorth = gameState.cashBalance + portfolioTotal;
      
      // Save game state
      const saveData = {
        user_id: userId,
        level: gameState.level,
        xp: gameState.xp,
        current_month: gameState.currentMonth,
        cash_balance: gameState.cashBalance,
        portfolio: gameState.portfolio,
        achievements: gameState.achievements,
        financial_goal: gameState.financialGoal || 5000000,
        goal_progress: gameState.financialGoal ? (netWorth / gameState.financialGoal) * 100 : 0,
        monthly_investments: gameState.monthlyInvestments,
        is_latest: true,
        updated_at: new Date().toISOString(),
      };

      console.log('💾 Attempting to save game state:', { userId, ...saveData });

      // Upsert: update if exists, insert if new
      const { data, error } = await supabase
        .from('game_saves')
        .upsert(saveData, { onConflict: 'user_id' });

      if (error) {
        console.error('❌ Save failed:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userId,
        });
        throw error;
      }

      console.log('✅ Game state saved successfully');

      // Also save/update user profile to ensure all user data is persisted
      if (gameState.userProfile) {
        await supabase
          .from('profiles')
          .update({
            name: gameState.userProfile.name,
            career: gameState.userProfile.career,
            avatar: gameState.userProfile.avatar,
            monthly_salary: gameState.userProfile.salary,
            monthly_expenses: gameState.userProfile.expenses,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      }

      if (!silent) {
        toast({
          title: '💾 Game Saved',
          description: 'Your progress has been saved to the cloud',
        });
      }
      
      await loadLeaderboard();
    } catch (error: any) {
      console.error('❌ Final Save error:', error);
      console.error('Error message:', error?.message);
      console.error('Error details:', error?.details);
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
      // 1. Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile load error:', profileError);
      }

      // 2. Load game save data
      const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('user_id', userId)
        .eq('is_latest', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        // Load chat messages from database
        const { data: chatMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('game_save_id', data.id)
          .order('created_at', { ascending: true });

        // Load stock holdings from database
        const { data: stocks } = await supabase
          .from('stocks')
          .select('*')
          .eq('game_save_id', data.id);

        // Convert chat messages to game format
        const chatHistory = (chatMessages || []).map((msg: any) => ({
          role: msg.role as 'user' | 'ai',
          content: msg.content,
          timestamp: new Date(msg.created_at).getTime(),
        }));

        // Convert stocks to stockHoldings format (convert prices from paise to rupees)
        const stockHoldings = (stocks || []).map((stock: any) => ({
          symbol: stock.symbol,
          shares: stock.quantity,
          buyPrice: stock.buy_price / 100,
          investmentAmount: stock.total_invested / 100,
          purchaseDate: stock.purchase_date,
        }));

        // Restore user profile from profiles table
        const userProfile = profileData ? {
          name: profileData.name || '',
          career: profileData.career as Career,
          salary: profileData.monthly_salary || 0,
          expenses: profileData.monthly_expenses || 0,
          avatar: profileData.avatar as AvatarType,
        } : null;

        setGameState(prev => ({
          ...prev,
          userProfile: userProfile,
          level: data.level,
          xp: data.xp,
          currentMonth: data.current_month,
          cashBalance: data.cash_balance,
          goldCoins: 50000,
          portfolio: data.portfolio,
          achievements: data.achievements,
          financialGoal: data.financial_goal,
          monthlyInvestments: data.monthly_investments,
          chatHistory: chatHistory.length > 0 ? chatHistory : prev.chatHistory,
          stockHoldings: stockHoldings.length > 0 ? stockHoldings : prev.stockHoldings,
        }));

        // Close onboarding since we loaded user data
        setOnboarding({ active: false, step: 1, name: '', career: '', salary: '', expenses: '', avatar: 'female1' });

        toast({
          title: '✨ Welcome Back!',
          description: `Progress restored for ${userProfile?.name || 'Player'}. Level ${data.level}`,
        });
      }
    } catch (error: any) {
      console.error('Load error:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      // Query game_saves table for both FinQuest and BreakTheRace players
      const { data: savesData, error: savesError } = await supabase
        .from('game_saves')
        .select('user_id, level, xp, cash_balance, passive_income, career, portfolio')
        .eq('is_latest', true);

      if (savesError) throw savesError;

      if (savesData && savesData.length > 0) {
        // Get user profiles for names and avatars
        const userIds = savesData.map((save: any) => save.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, avatar')
          .in('id', userIds);

        // Create a map of user IDs to profiles
        const profileMap = (profilesData || []).reduce((acc: any, profile: any) => {
          acc[profile.id] = profile;
          return acc;
        }, {});

        // Map game saves to leaderboard format with names and avatars
        const leaderboardData = savesData
          .map((save: any) => {
            const profile = profileMap[save.user_id];
            const avatarId = profile?.avatar || 'female1';
            const avatarPath = avatarMap[avatarId] || avatar1;
            
            // Calculate score based on available data
            // For BreakTheRace: use XP (passive_income / 1000)
            // For FinQuest: use cash_balance + portfolio
            let score = save.xp || 0; // Primary: XP from BreakTheRace
            
            if (save.portfolio) {
              const portfolio = save.portfolio || {};
              const portfolioTotal = Object.values(portfolio).reduce((a: number, b: number) => a + b, 0);
              const netWorth = (save.cash_balance || 0) + portfolioTotal;
              // If has portfolio data, use net worth (FinQuest)
              if (Object.keys(portfolio).some((k: string) => portfolio[k] > 0)) {
                score = Math.max(score, netWorth);
              }
            }
            
            return {
              name: profile?.name || 'Player',
              score: score || 0,
              level: save.level || 1,
              avatar: avatarPath,
              xp: save.xp || 0,
              career: save.career || '',
            };
          })
          // Only filter out entries with no name, don't filter by score
          .filter((entry: any) => entry.name && entry.name !== 'Player')
          // Sort by score/XP descending
          .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
          .slice(0, 10); // Top 10

        console.log('📊 Leaderboard updated with', leaderboardData.length, 'real players:', leaderboardData);
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

    const initialCash = salary;

    if (userId && userId !== 'guest') {
      try {
        // Update the profile - it was auto-created by the trigger
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            name: onboarding.name,
            career: onboarding.career,
            avatar: onboarding.avatar,
            monthly_salary: salary,
            monthly_expenses: expenses,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }

    const cashAvailable = salary - expenses;
    
    const newGameState = {
      currentMonth: 1,
      currentYear: 2025,
      cashBalance: cashAvailable,
      goldCoins: 50000,
      netWorth: cashAvailable,
      userProfile: profile,
      portfolio: { sip: 0, stocks: 0, gold: 0, realEstate: 0, savings: 0 },
      stockHoldings: [],
      chatHistory: [
        {
          role: 'ai' as const,
          content: `🎮 Welcome to FinVerse, ${onboarding.name}! I'm Aura Twin, your AI financial mentor 🤖\n\n✨ Your monthly salary is ₹${salary.toLocaleString('en-IN')} and expenses are ₹${expenses.toLocaleString('en-IN')}\n\n💰 Cash Available: ₹${cashAvailable.toLocaleString('en-IN')} (tracked in Dashboard, Stocks, and Analytics)\n\n🎮 Game World: Use your 50,000 gold coins in BreakTheRace for gamified investing and learning!\n\nI'm here to guide you toward your financial freedom goal of ₹50,00,000.\n\nLet's build wealth together! 💪`,
          timestamp: Date.now(),
        },
      ],
      xp: 0,
      level: 1,
      achievements: ACHIEVEMENTS,
      lastLoginDate: new Date().toISOString().split('T')[0],
      consecutiveLogins: 1,
      monthlyInvestments: { sip: 0, stocks: 0, gold: 0, realEstate: 0, savings: 0 },
      monthlyExpensesThisMonth: expenses,
      financialGoal: 5000000,
    };

    setGameState(newGameState);
    setOnboarding({ active: false, step: 1, name: '', career: '', salary: '', expenses: '', avatar: 'female1' });

    // Save game state immediately after onboarding to prevent data loss
    if (userId && userId !== 'guest') {
      try {
        const { error } = await supabase
          .from('game_saves')
          .insert({
            user_id: userId,
            level: newGameState.level,
            xp: newGameState.xp,
            current_month: newGameState.currentMonth,
            cash_balance: newGameState.cashBalance,
            portfolio: newGameState.portfolio,
            achievements: newGameState.achievements,
            financial_goal: 5000000,
            goal_progress: 0,
            monthly_investments: newGameState.monthlyInvestments,
            is_latest: true,
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
    
    if (totalInvestment > gameState.goldCoins) {
      toast({
        title: 'Insufficient Gold Coins',
        description: `You only have ${Math.round(gameState.goldCoins).toLocaleString('en-IN')} gold coins. Total investment: ${totalInvestment.toLocaleString('en-IN')}`,
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
      const newGoldCoins = prev.goldCoins - totalInvestment;
      const updatedPortfolio = {
        sip: prev.portfolio.sip + monthlyDecisions.sip,
        stocks: prev.portfolio.stocks + monthlyDecisions.stocks,
        gold: prev.portfolio.gold + monthlyDecisions.gold,
        realEstate: prev.portfolio.realEstate + monthlyDecisions.realEstate,
        savings: prev.portfolio.savings + monthlyDecisions.savings,
      };

      return {
        ...prev,
        goldCoins: newGoldCoins,
        portfolio: updatedPortfolio,
        monthlyInvestments: monthlyDecisions,
      };
    });

    const diversificationScore = Object.values(monthlyDecisions).filter(v => v > 0).length;
    await sendAIMessage(`🎯 I invested ₹${totalInvestment.toLocaleString('en-IN')} this month:\n• SIP: ₹${monthlyDecisions.sip.toLocaleString('en-IN')}\n• Stocks: ₹${monthlyDecisions.stocks.toLocaleString('en-IN')}\n• Gold: ₹${monthlyDecisions.gold.toLocaleString('en-IN')}\n• Real Estate: ₹${monthlyDecisions.realEstate.toLocaleString('en-IN')}\n• Savings: ₹${monthlyDecisions.savings.toLocaleString('en-IN')}\n\n${diversificationScore === 5 ? '✨ Excellent diversification!' : diversificationScore >= 3 ? '👍 Good spread across assets!' : '💡 Consider diversifying more!'}`);

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
      
      const netWorthGrowth = newNetWorth - prev.netWorth;
      if (netWorthGrowth > 500000) {
        aiMessage += `\n\n🔥 WOW! You grew your wealth by ₹${Math.round(netWorthGrowth).toLocaleString('en-IN')} this month! That's amazing momentum!`;
      } else if (netWorthGrowth < -100000) {
        aiMessage += `\n\n⚠️ Tough month! But don't worry - market volatility is normal. Let's refocus and build back stronger next month!`;
      } else if (newNetWorth >= 5000000) {
        aiMessage += `\n\n🎉🎉🎉 CONGRATULATIONS! You've reached FINANCIAL FREEDOM! ₹50,00,000 net worth achieved!`;
      }

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
        monthlyExpensesThisMonth: 0,
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
      // Save user message to database
      if (userId && userId !== 'guest') {
        const { data: latestSave } = await supabase
          .from('game_saves')
          .select('id')
          .eq('user_id', userId)
          .eq('is_latest', true)
          .single();

        if (latestSave?.id) {
          await supabase.from('chat_messages').insert({
            user_id: userId,
            game_save_id: latestSave.id,
            role: 'user',
            content: userMessage,
            message_type: 'text',
          });
        }
      }

      const totalInvested = Object.values(gameState.portfolio).reduce((a, b) => a + b, 0);
      const monthlyAvailable = (gameState.userProfile?.salary || 0) - (gameState.userProfile?.expenses || 0);
      const projectedFinalNetWorth = gameState.netWorth + (monthlyAvailable * (12 - gameState.currentMonth));

      console.log('🤖 Sending AI chat request:', { message: userMessage.substring(0, 50), context: gameState.userProfile?.career });

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
            salary: gameState.userProfile?.salary,
            expenses: gameState.userProfile?.expenses,
            monthlyAvailable: monthlyAvailable,
            totalInvested: totalInvested,
            goldCoins: gameState.goldCoins,
            currentMonth: gameState.currentMonth,
            projectedFinalNetWorth: projectedFinalNetWorth,
            achievements: gameState.achievements.filter(a => a.unlocked).map(a => a.title),
          },
        }),
      });

      console.log('📨 AI response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API error response:', errorData);
        throw new Error(`API error: ${response.status} - ${errorData.error}`);
      }

      const data = await response.json();
      console.log('✅ AI response received:', data.response?.substring(0, 50));
      let aiMessage = data.response || '';
      
      if (!aiMessage) {
        throw new Error('Empty response from AI API');
      }
      
      if (userMessage.toLowerCase().includes('gold') || userMessage.toLowerCase().includes('coin')) {
        aiMessage += '\n\n💰 Pro tip: Gold coins can be converted to real investments! Ask me how to use them wisely.';
      }

      setGameState(prev => ({
        ...prev,
        chatHistory: [
          ...prev.chatHistory,
          { role: 'ai', content: aiMessage, timestamp: Date.now() },
        ],
      }));

      setAiLoading(false);

      // Save AI message to database
      if (userId && userId !== 'guest') {
        const { data: latestSave } = await supabase
          .from('game_saves')
          .select('id')
          .eq('user_id', userId)
          .eq('is_latest', true)
          .single();

        if (latestSave?.id) {
          await supabase.from('chat_messages').insert({
            user_id: userId,
            game_save_id: latestSave.id,
            role: 'ai',
            content: aiMessage,
            message_type: 'advice',
          });
        }
      }
    } catch (error) {
      console.error('❌ AI chat error:', error);
      
      const fallbackMsg = `I'm here to support you, even when I'm thinking! 🤔\n\n${
        userMessage.includes('invest') 
          ? "📊 Remember: Diversification across SIPs, Stocks, Gold & Real Estate reduces risk and maximizes growth!" 
          : userMessage.includes('goal') 
          ? "🎯 You're doing great! Stay focused on reaching ₹50,00,000. Every month counts!" 
          : "💪 Keep making smart financial decisions. Your future self will thank you!"
      }`;
      
      setGameState(prev => ({
        ...prev,
        chatHistory: [
          ...prev.chatHistory,
          { role: 'ai', content: fallbackMsg, timestamp: Date.now() },
        ],
      }));

      setAiLoading(false);

      // Save fallback message
      if (userId && userId !== 'guest') {
        const { data: latestSave } = await supabase
          .from('game_saves')
          .select('id')
          .eq('user_id', userId)
          .eq('is_latest', true)
          .single();

        if (latestSave?.id) {
          await supabase.from('chat_messages').insert({
            user_id: userId,
            game_save_id: latestSave.id,
            role: 'ai',
            content: fallbackMsg,
            message_type: 'advice',
          });
        }
      }
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

    setOnboarding({ active: true, step: 1, name: '', career: '', salary: '', expenses: '', avatar: 'female1' });
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
                  className="mt-2 interactive-hover text-slate-900 h-12"
                  style={{
                    backgroundColor: '#F0FAFF',
                    color: '#1a1a1a',
                  }}
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
                  className="mt-2 interactive-hover text-slate-900 h-12"
                  style={{
                    backgroundColor: '#F0FAFF',
                    color: '#1a1a1a',
                  }}
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
                  className="mt-2 interactive-hover text-slate-900 h-12"
                  style={{
                    backgroundColor: '#F0FAFF',
                    color: '#1a1a1a',
                  }}
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
                  className="mt-2 interactive-hover text-slate-900 h-12"
                  style={{
                    backgroundColor: '#F0FAFF',
                    color: '#1a1a1a',
                  }}
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
                className="w-full font-bold text-lg py-6 text-slate-900"
                style={{
                  background: 'linear-gradient(135deg, #B3D9FF 0%, #D1E8FF 100%)',
                  boxShadow: '0 0 30px rgba(177, 217, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3)',
                }}
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
      {/* Unified Header - All elements merged */}
      <AppHeader 
        level={gameState.level}
        xp={gameState.xp}
        netWorth={gameState.netWorth}
        userName={gameState.userProfile?.name}
        userAvatar={gameState.userProfile?.avatar ? avatarMap[gameState.userProfile.avatar] : undefined}
        tabs={[
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <LayoutDashboard className="h-3.5 w-3.5" />,
            active: currentView === 'dashboard',
            onClick: () => setCurrentView('dashboard'),
          },
          {
            id: 'game',
            label: 'Game',
            icon: <Zap className="h-3.5 w-3.5" />,
            active: currentView === 'game',
            onClick: () => setCurrentView('game'),
          },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: <TrendingUpIcon className="h-3.5 w-3.5" />,
            active: currentView === 'analytics',
            onClick: () => setCurrentView('analytics'),
          },
          {
            id: 'budget',
            label: 'Budget',
            icon: <DollarSign className="h-3.5 w-3.5" />,
            active: currentView === 'budget',
            onClick: () => setCurrentView('budget'),
          },
          {
            id: 'stocks',
            label: 'Stocks',
            icon: <TrendingUpIcon className="h-3.5 w-3.5" />,
            active: currentView === 'stocks',
            onClick: () => setCurrentView('stocks'),
          },
          {
            id: 'leaderboard',
            label: 'Leaderboard',
            icon: <Trophy className="h-3.5 w-3.5" />,
            active: currentView === 'leaderboard',
            onClick: () => setCurrentView('leaderboard'),
          },
        ]}
        onAuraTwin={() => setShowAuraTwin(true)}
        onProfile={() => setShowProfile(true)}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <Dashboard 
            gameState={gameState} 
            monthlyDecisions={monthlyDecisions}
            onAddIncome={async (amount) => {
              setGameState(prev => {
                const newState = {
                  ...prev,
                  userProfile: prev.userProfile ? { ...prev.userProfile, salary: prev.userProfile.salary + amount } : prev.userProfile,
                  cashBalance: prev.cashBalance + amount,
                };
                newState.netWorth = newState.cashBalance + Object.values(newState.portfolio).reduce((a: number, b: number) => a + b, 0) + (newState.stockHoldings && newState.stockHoldings.length > 0 ? newState.stockHoldings.reduce((total: number, h: any) => total + (h.investmentAmount || 0), 0) : 0);
                return newState;
              });
              toast({ title: '💰 Income Added', description: `₹${amount.toLocaleString('en-IN')} added to monthly income` });
              setTimeout(() => saveGameState(true), 100);
            }}
            onAddExpense={async (amount) => {
              setGameState(prev => {
                const newExpense = (prev.monthlyExpensesThisMonth || prev.userProfile?.expenses || 0) + amount;
                const newCash = Math.max(0, (prev.userProfile?.salary || 0) - newExpense);
                const newState = {
                  ...prev,
                  monthlyExpensesThisMonth: newExpense,
                  cashBalance: newCash,
                };
                newState.netWorth = newState.cashBalance + Object.values(newState.portfolio).reduce((a: number, b: number) => a + b, 0) + (newState.stockHoldings && newState.stockHoldings.length > 0 ? newState.stockHoldings.reduce((total: number, h: any) => total + (h.investmentAmount || 0), 0) : 0);
                return newState;
              });
              toast({ title: '💸 Expense Added', description: `₹${amount.toLocaleString('en-IN')} added to monthly expenses` });
              setTimeout(() => saveGameState(true), 100);
            }}
            onInvest={() => setCurrentView('stocks')}
            quickActionsOpen={quickActionsOpen}
            onToggleQuickActions={() => setQuickActionsOpen(!quickActionsOpen)}
          />
        )}

        {/* Game View */}
        {currentView === 'game' && (
          <BreakTheRaceGame userId={userId} />
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
                  className={`flex gap-3 ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                  data-testid={`chat-message-${idx}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden border border-blue-400/50 flex items-center justify-center bg-blue-600/30">
                      <img src={auraTwinImage} alt="Aura Twin" className="w-full h-full object-cover" />
                    </div>
                  )}
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
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden border border-purple-400/50 flex items-center justify-center bg-purple-600/30">
                      {gameState.userProfile?.avatar && (
                        <img src={getAvatarUrl(gameState.userProfile.avatar)} alt={gameState.userProfile.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                </div>
              ))}
              {aiLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden border border-blue-400/50 flex items-center justify-center bg-blue-600/30">
                    <img src={auraTwinImage} alt="Aura Twin" className="w-full h-full object-cover" />
                  </div>
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

      {/* Profile Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="border-primary/30 glassmorphic modal-slide w-full max-w-md max-h-screen flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b border-primary/20">
            <DialogTitle className="text-primary">Your Profile</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-4 pr-2">
              <div className="text-center pt-4">
                {gameState.userProfile?.avatar && (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50 mx-auto mb-3">
                    <img src={getAvatarUrl(gameState.userProfile.avatar)} alt={gameState.userProfile.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-2xl font-bold text-primary">{gameState.userProfile?.name}</p>
                <p className="text-sm text-foreground/60 mt-1">{gameState.userProfile?.email}</p>
              </div>
              <Separator className="bg-primary/20" />
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 rounded-lg border border-primary/30 glassmorphic">
                  <span className="text-foreground/70 text-sm">Level</span>
                  <span className="font-bold text-primary text-sm">{gameState.level}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border border-primary/30 glassmorphic">
                  <span className="text-foreground/70 text-sm">Experience Points</span>
                  <span className="font-bold text-primary text-sm">{gameState.xp}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border border-primary/30 glassmorphic">
                  <span className="text-foreground/70 text-sm">Total Net Worth</span>
                  <span className="font-bold text-primary text-sm">₹{Math.round(gameState.cashBalance + Object.values(gameState.portfolio).reduce((a, b) => a + b, 0)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border border-primary/30 glassmorphic">
                  <span className="text-foreground/70 text-sm">Current Month</span>
                  <span className="font-bold text-primary text-sm">{gameState.currentMonth}</span>
                </div>
              </div>
              <Separator className="bg-primary/20" />
              <div className="space-y-2 pb-4">
                <Button
                  data-testid="button-export-chat"
                  onClick={exportChat}
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/50 text-primary hover:bg-primary/20 interactive-hover text-xs"
                >
                  <Download className="mr-2 h-3 w-3" />
                  Export Chat
                </Button>
                <Button
                  data-testid="button-set-goal"
                  onClick={() => {
                    setShowProfile(false);
                    setShowGoals(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/50 text-primary hover:bg-primary/20 interactive-hover text-xs"
                >
                  <Target className="mr-2 h-3 w-3" />
                  Set Goal
                </Button>
                <Button
                  data-testid="button-reset-game"
                  onClick={resetGame}
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/50 text-primary hover:bg-primary/20 interactive-hover text-xs"
                >
                  <RotateCcw className="mr-2 h-3 w-3" />
                  Reset Game
                </Button>
                {userId && userId !== 'guest' && (
                  <Button
                    data-testid="button-save-game"
                    onClick={() => saveGameState(false)}
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/50 text-primary hover:bg-primary/20 interactive-hover text-xs"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Save Now
                  </Button>
                )}
                <Button
                  data-testid="button-logout"
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20 interactive-hover text-xs"
                >
                  <X className="mr-2 h-3 w-3" />
                  Logout
                </Button>
              </div>
            </div>
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
