import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, LogIn, UserPlus } from 'lucide-react';
// @ts-ignore
import logoPath from '@assets/WhatsApp Image 2025-11-22 at 20.10.06_10cdf760_1764008354697.jpg';

interface AuthProps {
  onAuthSuccess: (userId: string) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

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
          await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: email,
                name: '',
                career: null,
              },
            ])
            .single();

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

  if (showLanding) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: '#0d2e47' }}>
        <div className="text-center space-y-8 animate-fadeInUp">
          <div>
            <img 
              src={logoPath} 
              alt="Finverse Logo" 
              className="h-48 w-48 mx-auto mb-8"
            />
            <h1 className="text-6xl font-bold text-white mb-4">Welcome to<br /><span style={{ color: '#00d4aa' }}>Finverse Play</span></h1>
            <p className="text-xl text-gray-300">Learn. Conquer Financial Freedom.</p>
          </div>
          <Button
            onClick={() => setShowLanding(false)}
            className="mx-auto px-16 py-8 text-2xl font-bold rounded-full"
            style={{ background: '#ffd700', color: '#0d2e47' }}
          >
            Start Playing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0d2e47 0%, #0f3d52 50%, #0d2e47 100%)',
    }}>
      <Card className="w-full max-w-md border-primary/40 bg-black/50 backdrop-blur-2xl shadow-2xl relative z-10 animate-fadeInUp">
        <div className="p-8">
          <div className="text-center mb-8 space-y-3">
            <div className="inline-block mb-4">
              <img 
                src={logoPath} 
                alt="Finverse Logo" 
                className="h-32 w-32 mx-auto drop-shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(100, 180, 255, 0.4))',
                  animation: 'glow 2s ease-in-out infinite'
                }}
              />
            </div>
            <p className="text-lg text-gray-300 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              Play. Learn. Conquer Financial Freedom.
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <Label htmlFor="email" className="text-gray-200 font-semibold">Email</Label>
              <Input
                id="email"
                data-testid="input-auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-2 bg-black/40 border-primary/30 text-white placeholder:text-gray-500 focus:border-primary/70 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </div>

            <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <Label htmlFor="password" className="text-gray-200 font-semibold">Password</Label>
              <Input
                id="password"
                data-testid="input-auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="mt-2 bg-black/40 border-primary/30 text-white placeholder:text-gray-500 focus:border-primary/70 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </div>

            <Button
              data-testid="button-auth-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 font-bold text-lg py-6 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fadeIn shadow-lg"
              style={{ animationDelay: '0.5s' }}
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Processing...
                </span>
              ) : isSignUp ? (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>

            <div className="text-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-gray-300 hover:text-primary/80 text-sm transition-colors duration-300"
                data-testid="button-toggle-auth-mode"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-500">Or</span>
              </div>
            </div>

            <Button
              data-testid="button-guest-mode"
              type="button"
              onClick={handleGuestMode}
              variant="outline"
              className="w-full border-primary/50 text-gray-300 hover:bg-primary/20 animate-fadeIn"
              style={{ animationDelay: '0.7s' }}
              disabled={loading}
            >
              Continue as Guest
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
