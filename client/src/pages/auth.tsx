import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, LogIn, UserPlus, Mail, Lock, ArrowRight } from 'lucide-react';
// @ts-ignore
import logoPath from '@assets/WhatsApp Image 2025-11-22 at 20.10.06_10cdf760_1764008354697.jpg';
// @ts-ignore
import chartIcon from '@assets/generated_images/financial_market_simulation_chart_icon.png';
// @ts-ignore
import aiIcon from '@assets/generated_images/ai_mentor_assistant_icon.png';
// @ts-ignore
import trophyIcon from '@assets/generated_images/trophy_leaderboard_competition_icon.png';

interface AuthProps {
  onAuthSuccess: (userId: string) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          console.log('User created with ID:', data.user.id);
          
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                email: data.user.email,
                name: '',
                career: null,
              });
            
            console.log('Profile upsert result:', { profileData, profileError });
            
            if (profileError) {
              console.error('❌ Profile creation failed:', {
                code: profileError.code,
                message: profileError.message,
                details: profileError.details,
                hint: profileError.hint,
              });
            } else {
              console.log('✅ Profile created successfully');
            }
          } catch (profileErr) {
            console.error('❌ Exception during profile creation:', profileErr);
          }

          toast({
            title: 'Account Created!',
            description: 'Welcome to Finverse. Starting your financial journey...',
          });
          onAuthSuccess(data.user.id);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: 'Welcome Back!',
            description: 'Loading your saved progress...',
          });
          onAuthSuccess(data.user.id);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Authentication Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    toast({
      title: 'Guest Mode',
      description: 'Playing as guest. Progress will not be saved.',
    });
    onAuthSuccess('guest');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1B263B 0%, #2E4057 50%, #4A90E2 100%)',
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className="hidden lg:flex flex-col space-y-8 text-white animate-fadeInUp">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-400/20 border border-blue-400/30">
                  <Sparkles className="h-8 w-8 text-blue-400 glow" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Finverse
                </h1>
              </div>
              <p className="text-xl text-blue-100 font-light mb-4">Financial Intelligence Platform</p>
              <p className="text-blue-200/70">Master your money, build your wealth, achieve financial freedom through intelligent gameplay and real-world learning.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-green-400/20 to-blue-400/20 flex items-center justify-center border border-green-400/30 group-hover:border-green-400/60 transition-colors p-2">
                  <img src={chartIcon} alt="Market Simulation" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-100 mb-1">Real Market Simulation</h3>
                  <p className="text-blue-200/60 text-sm">Experience authentic market dynamics with AI-driven scenarios</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-400/20 flex items-center justify-center border border-purple-400/30 group-hover:border-purple-400/60 transition-colors p-2">
                  <img src={aiIcon} alt="AI Mentor" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-100 mb-1">AI Mentor - Aura Twin</h3>
                  <p className="text-blue-200/60 text-sm">Get personalized financial guidance in your preferred language</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-400/20 flex items-center justify-center border border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors p-2">
                  <img src={trophyIcon} alt="Leaderboard" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-100 mb-1">Compete & Learn</h3>
                  <p className="text-blue-200/60 text-sm">Join global leaderboards and master financial strategies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <Card className="border-blue-400/30 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8">
                {/* Logo/Title - Mobile */}
                <div className="lg:hidden text-center mb-8">
                  <div className="inline-flex items-center justify-center mb-4">
                    <img 
                      src={logoPath} 
                      alt="Finverse Logo" 
                      className="h-20 w-20 drop-shadow-lg"
                      style={{
                        filter: 'drop-shadow(0 0 15px rgba(100, 180, 255, 0.3))',
                      }}
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Finverse</h1>
                  <p className="text-blue-200/60 text-sm">Play. Learn. Conquer Financial Freedom.</p>
                </div>

                {/* Form Title */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-blue-200/60 text-sm">
                    {isSignUp 
                      ? 'Start your journey to financial freedom today'
                      : 'Sign in to continue your financial journey'
                    }
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2 group">
                    <Label htmlFor="email" className="text-blue-100 font-semibold text-sm">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-400/50 pointer-events-none" />
                      <Input
                        id="email"
                        data-testid="input-auth-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="pl-10 bg-blue-950/30 border border-blue-400/20 text-white placeholder:text-blue-300/30 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 group-hover:border-blue-400/40 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2 group">
                    <Label htmlFor="password" className="text-blue-100 font-semibold text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400/50 pointer-events-none" />
                      <Input
                        id="password"
                        data-testid="input-auth-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="pl-10 bg-blue-950/30 border border-blue-400/20 text-white placeholder:text-blue-300/30 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 group-hover:border-blue-400/40 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    data-testid="button-auth-submit"
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="inline-block animate-spin">⏳</span>
                        Processing...
                      </>
                    ) : isSignUp ? (
                      <>
                        <UserPlus className="h-5 w-5" />
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        Sign In
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-blue-400/10" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-slate-900 text-blue-300/50">OR</span>
                    </div>
                  </div>

                  {/* Guest Button */}
                  <Button
                    data-testid="button-guest-mode"
                    type="button"
                    onClick={handleGuestMode}
                    disabled={loading}
                    className="w-full border border-blue-400/30 bg-transparent hover:bg-blue-400/10 text-blue-200 font-semibold py-3 rounded-lg transition-all duration-300 hover:border-blue-400/60"
                  >
                    Continue as Guest
                  </Button>

                  {/* Toggle Auth Mode */}
                  <div className="text-center pt-4">
                    <p className="text-blue-200/60 text-sm">
                      {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setEmail('');
                          setPassword('');
                        }}
                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors underline"
                        data-testid="button-toggle-auth-mode"
                      >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                      </button>
                    </p>
                  </div>
                </form>

                {/* Footer Note */}
                <p className="text-xs text-blue-300/40 text-center mt-8">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </Card>

            {/* Additional Info Cards - Mobile */}
            <div className="lg:hidden grid grid-cols-3 gap-3 mt-6">
              <div className="bg-blue-950/40 backdrop-blur border border-blue-400/20 rounded-lg p-3 text-center hover:border-blue-400/40 transition-colors">
                <div className="flex justify-center mb-2">
                  <img src={chartIcon} alt="Simulate" className="w-6 h-6 object-contain" />
                </div>
                <p className="text-xs text-blue-200/60">Simulate</p>
              </div>
              <div className="bg-purple-950/40 backdrop-blur border border-purple-400/20 rounded-lg p-3 text-center hover:border-purple-400/40 transition-colors">
                <div className="flex justify-center mb-2">
                  <img src={aiIcon} alt="Learn" className="w-6 h-6 object-contain" />
                </div>
                <p className="text-xs text-purple-200/60">Learn</p>
              </div>
              <div className="bg-cyan-950/40 backdrop-blur border border-cyan-400/20 rounded-lg p-3 text-center hover:border-cyan-400/40 transition-colors">
                <div className="flex justify-center mb-2">
                  <img src={trophyIcon} alt="Compete" className="w-6 h-6 object-contain" />
                </div>
                <p className="text-xs text-cyan-200/60">Compete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
