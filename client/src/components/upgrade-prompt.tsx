import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Zap, X } from 'lucide-react';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  requiredTier: 'pro' | 'premium';
  description?: string;
}

export function UpgradePrompt({
  isOpen,
  onClose,
  featureName,
  requiredTier,
  description,
}: UpgradePromptProps) {
  const [, navigate] = useLocation();

  const handleUpgrade = () => {
    navigate('/pricing');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-blue-900/50 to-slate-900/50 border-blue-500/30 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-white">{featureName}</DialogTitle>
              <DialogDescription className="text-blue-200">
                Unlock with upgrade
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-slate-300">
            {description || `This feature is only available with ${requiredTier.toUpperCase()} plan.`}
          </p>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <p className="text-sm text-slate-400 mb-2">Upgrade to get:</p>
            <ul className="text-sm text-slate-300 space-y-1">
              {requiredTier === 'pro' && (
                <>
                  <li>✓ Unlimited AI advice</li>
                  <li>✓ Real-time stock data</li>
                  <li>✓ Export financial reports</li>
                  <li>✓ Ad-free experience</li>
                </>
              )}
              {requiredTier === 'premium' && (
                <>
                  <li>✓ All Pro features</li>
                  <li>✓ Access to all courses</li>
                  <li>✓ Advanced trading simulator</li>
                  <li>✓ Monthly mentorship calls</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleUpgrade}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              data-testid="button-upgrade-now"
            >
              Upgrade Now
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              data-testid="button-upgrade-dismiss"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
