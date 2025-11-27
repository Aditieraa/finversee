import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { AlertCircle } from 'lucide-react';

interface AILimitBannerProps {
  remaining: number;
  tier: string;
}

export function AILimitBanner({ remaining, tier }: AILimitBannerProps) {
  const [, navigate] = useLocation();

  if (tier !== 'free' || remaining > 0) {
    return null;
  }

  return (
    <Alert className="bg-orange-900/30 border-orange-500/50 mb-4">
      <AlertCircle className="h-4 w-4 text-orange-400" />
      <AlertDescription className="text-orange-200 flex items-center justify-between">
        <span>You've reached your daily AI request limit. Upgrade to get unlimited access.</span>
        <Button
          size="sm"
          className="ml-2 bg-orange-600 hover:bg-orange-700"
          onClick={() => navigate('/pricing')}
          data-testid="button-upgrade-from-banner"
        >
          Upgrade Now
        </Button>
      </AlertDescription>
    </Alert>
  );
}
