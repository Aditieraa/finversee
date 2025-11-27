import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Calendar, CreditCard, Download, RefreshCw, AlertCircle } from 'lucide-react';

interface Subscription {
  id: string;
  userId: string;
  tier: string;
  status: string;
  startDate: string;
  endDate: string | null;
  renewalDate: string | null;
  createdAt: string;
}

interface Transaction {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  type: string;
  itemId: string | null;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const tierFeatures: Record<string, string[]> = {
  free: [
    'Unlimited BreakTheRace games (basic)',
    'Limited Aura Twin AI (3 per day)',
    'Basic stock data (15 min delay)',
    'Basic analytics',
  ],
  pro: [
    'Unlimited games with advanced modes',
    'Unlimited Aura Twin AI advice',
    'Real-time stock data',
    'Financial reports export',
    'Ad-free experience',
    'Priority support',
  ],
  premium: [
    'All Pro features',
    'Advanced trading simulator',
    'All paid courses access',
    'Priority support (24/7)',
    'Exclusive community access',
    'Monthly mentorship calls',
  ],
};

export default function SubscriptionDashboard() {
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  const userId = localStorage.getItem('userId') || 'demo-user';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subscription
        const subRes = await fetch(`/api/subscription/${userId}`);
        if (!subRes.ok) throw new Error('Failed to fetch subscription');
        const subData = await subRes.json();
        setSubscription(subData);

        // Fetch transactions
        const txRes = await fetch(`/api/transactions/${userId}`);
        if (!txRes.ok) throw new Error('Failed to fetch transactions');
        const txData = await txRes.json();
        setTransactions(txData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load subscription data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, toast]);

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'bg-slate-600';
      case 'pro':
        return 'bg-blue-600';
      case 'premium':
        return 'bg-purple-600';
      default:
        return 'bg-slate-600';
    }
  };

  const daysUntilRenewal = () => {
    if (!subscription?.renewalDate) return null;
    const renewal = new Date(subscription.renewalDate);
    const today = new Date();
    const diff = Math.ceil((renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading subscription data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Subscription Dashboard</h1>
          <p className="text-blue-200">Manage your Finverse+ subscription and billing</p>
        </div>

        {/* Current Plan Card */}
        {subscription && (
          <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50 mb-8 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-300 text-sm mb-2">Current Plan</p>
                <h2 className="text-4xl font-bold text-white mb-2 capitalize">
                  {subscription.tier}
                </h2>
                <Badge className={`${getTierColor(subscription.tier)}`}>
                  {subscription.status.toUpperCase()}
                </Badge>
              </div>
              <Button onClick={() => navigate('/pricing')} className="bg-blue-600 hover:bg-blue-700">
                Upgrade Plan
              </Button>
            </div>

            {/* Plan Details */}
            <div className="grid md:grid-cols-3 gap-6 mb-8 pt-8 border-t border-blue-500/20">
              <div>
                <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </p>
                <p className="text-white font-semibold">{formatDate(subscription.startDate)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Renewal Date
                </p>
                <p className="text-white font-semibold">
                  {subscription.tier === 'free' ? 'No renewal' : formatDate(subscription.renewalDate)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Days Remaining
                </p>
                <p className="text-white font-semibold">
                  {subscription.tier === 'free' ? '∞ Unlimited' : `${daysUntilRenewal()} days`}
                </p>
              </div>
            </div>

            {/* Plan Features */}
            <div>
              <p className="text-slate-300 text-sm mb-4 uppercase tracking-wide">Your Benefits</p>
              <div className="grid md:grid-cols-2 gap-3">
                {(tierFeatures[subscription.tier] || []).map((feature, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-slate-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Usage Card */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Usage & Limits</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
              <p className="text-slate-400 text-sm mb-2">AI Requests Today</p>
              <p className="text-3xl font-bold text-blue-300">
                {subscription?.tier === 'free' ? '3/3' : 'Unlimited'}
              </p>
              <p className="text-slate-500 text-xs mt-2">
                {subscription?.tier === 'free'
                  ? 'Reset at midnight'
                  : 'No limits with Pro/Premium'}
              </p>
            </div>
            <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <p className="text-slate-400 text-sm mb-2">Courses Enrolled</p>
              <p className="text-3xl font-bold text-purple-300">0</p>
              <p className="text-slate-500 text-xs mt-2">Upgrade to access all courses</p>
            </div>
            <div className="p-4 bg-orange-900/30 rounded-lg border border-orange-500/30">
              <p className="text-slate-400 text-sm mb-2">In-App Purchases</p>
              <p className="text-3xl font-bold text-orange-300">0</p>
              <p className="text-slate-500 text-xs mt-2">Start shopping in the store</p>
            </div>
          </div>
        </Card>

        {/* Billing History */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-400" />
              Billing History
            </h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400">Date</th>
                    <th className="text-left py-3 px-4 text-slate-400">Type</th>
                    <th className="text-left py-3 px-4 text-slate-400">Amount</th>
                    <th className="text-left py-3 px-4 text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-white">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-slate-300 capitalize">
                        {tx.type}
                      </td>
                      <td className="py-3 px-4 text-blue-300 font-semibold">
                        {formatAmount(tx.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            tx.status === 'success'
                              ? 'bg-green-600'
                              : 'bg-red-600'
                          }
                        >
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">No transactions yet</p>
            </div>
          )}
        </Card>

        {/* Help Section */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-8 mt-8">
          <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
          <div className="text-slate-300 space-y-3">
            <p>For subscription issues or questions, please contact our support team.</p>
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
              <Button variant="outline" size="sm">
                View FAQ
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
