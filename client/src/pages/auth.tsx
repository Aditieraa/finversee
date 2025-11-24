import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, LogIn, UserPlus } from 'lucide-react';

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
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: '#0A0F1F' }}>
      <Card className="w-full max-w-md border-neon-cyan/30 bg-black/40 backdrop-blur-xl shadow-neon-cyan">
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

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-neon-purple">Email</Label>
              <Input
                id="email"
                data-testid="input-auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-2 bg-black/60 border-neon-cyan/50 text-white placeholder:text-gray-500 focus:border-neon-cyan focus:shadow-neon-cyan"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-neon-purple">Password</Label>
              <Input
                id="password"
                data-testid="input-auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="mt-2 bg-black/60 border-neon-cyan/50 text-white placeholder:text-gray-500 focus:border-neon-cyan focus:shadow-neon-cyan"
              />
            </div>

            <Button
              data-testid="button-auth-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-neon-cyan text-black hover:bg-neon-cyan/90 shadow-neon-cyan font-bold text-lg py-6"
            >
              {loading ? (
                'Processing...'
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

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-neon-purple hover:text-neon-purple/80 text-sm"
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
              className="w-full border-neon-purple/50 text-neon-purple hover:bg-neon-purple/20"
            >
              Continue as Guest
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
