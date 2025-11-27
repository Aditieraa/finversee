import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PricingPlan {
  tier: 'free' | 'pro' | 'premium';
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    tier: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Unlimited BreakTheRace games (basic)',
      'Limited Aura Twin AI (3 per day)',
      'Basic stock data (15 min delay)',
      'Basic analytics',
      'Ad-supported experience',
    ],
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: 199,
    description: 'For serious learners',
    features: [
      'Unlimited games with advanced modes',
      'Unlimited Aura Twin AI advice',
      'Real-time stock data',
      'Financial reports export',
      'Ad-free experience',
      'Priority support',
    ],
    highlighted: true,
  },
  {
    tier: 'premium',
    name: 'Premium',
    price: 499,
    description: 'Ultimate financial toolkit',
    features: [
      'All Pro features',
      'Advanced trading simulator',
      'All paid courses access',
      'Priority support (24/7)',
      'Exclusive community access',
      'Monthly mentorship calls',
      'Custom goal planning',
      'CSV export & analytics',
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleUpgrade = async (tier: string) => {
    if (tier === 'free') {
      toast({
        title: 'Already on Free Plan',
        description: 'You are currently using the free plan.',
      });
      return;
    }

    setProcessing(true);

    try {
      // Get user ID from localStorage (from your auth system)
      const userId = localStorage.getItem('userId') || 'demo-user';
      const amount = pricingPlans.find((p) => p.tier === tier)?.price || 0;

      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tier,
          amount,
          type: 'subscription',
        }),
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');

      const orderData = await orderResponse.json();
      const { orderId } = orderData;

      // Simulate payment processing (dummy gateway)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Verify payment
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          orderId,
          paymentId: `pay_${Date.now()}`,
          signature: `sig_${orderId}_${Date.now()}`,
          tier,
          type: 'subscription',
        }),
      });

      if (!verifyResponse.ok) throw new Error('Payment verification failed');

      toast({
        title: '✅ Upgrade Successful!',
        description: `You're now on the ${tier.toUpperCase()} plan. Enjoy premium features!`,
      });

      // Reload subscription info
      window.location.reload();
    } catch (error) {
      toast({
        title: '❌ Upgrade Failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            Finverse+ Premium Plans
          </h1>
          <p className="text-lg text-blue-200">
            Choose the perfect plan to supercharge your financial journey
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.tier}
              className={`relative transition-all duration-300 hover:shadow-xl ${
                plan.highlighted
                  ? 'md:scale-105 border-blue-400 shadow-2xl'
                  : 'border-slate-700'
              } bg-slate-800/50 backdrop-blur`}
              data-testid={`card-pricing-${plan.tier}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white flex gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h2 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h2>
                <p className="text-slate-300 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-300">
                    ₹{plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-slate-400 ml-2">/month</span>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleUpgrade(plan.tier)}
                  disabled={processing}
                  className={`w-full mb-8 ${
                    plan.highlighted
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  data-testid={`button-upgrade-${plan.tier}`}
                >
                  {processing ? 'Processing...' : `Get ${plan.name}`}
                </Button>

                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-200 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">Can I upgrade anytime?</h4>
              <p className="text-slate-300 text-sm">
                Yes! Upgrade or downgrade your plan anytime. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">Is there a free trial?</h4>
              <p className="text-slate-300 text-sm">
                Start with our Free plan at no cost. Upgrade when ready!
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">What payment methods do you accept?</h4>
              <p className="text-slate-300 text-sm">
                We accept all major cards, UPI, netbanking, and digital wallets.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">Can I cancel anytime?</h4>
              <p className="text-slate-300 text-sm">
                Absolutely! Cancel your subscription without any hidden fees.
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm">
          <p>All prices in Indian Rupees. Billing happens monthly.</p>
        </div>
      </div>
    </div>
  );
}
