import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Zap, Crown } from 'lucide-react';

interface UpgradeCTACardProps {
  title: string;
  description: string;
  tier?: 'pro' | 'premium';
}

export function UpgradeCTACard({ title, description, tier = 'pro' }: UpgradeCTACardProps) {
  const [, navigate] = useLocation();

  const tierInfo = {
    pro: { price: '₹199/mo', color: 'from-blue-600 to-blue-500' },
    premium: { price: '₹499/mo', color: 'from-purple-600 to-purple-500' },
  };

  return (
    <Card className={`bg-gradient-to-r ${tierInfo[tier].color} border-0 p-6 text-white`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5" />
            {title}
          </h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
        <Zap className="w-6 h-6 opacity-60" />
      </div>

      <div className="flex items-center justify-between">
        <span className="font-semibold">{tierInfo[tier].price}</span>
        <Button
          onClick={() => navigate('/pricing')}
          className="bg-white text-blue-600 hover:bg-white/90 font-semibold"
          size="sm"
          data-testid={`button-upgrade-cta-${tier}`}
        >
          Upgrade Now
        </Button>
      </div>
    </Card>
  );
}
