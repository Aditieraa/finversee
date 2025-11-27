import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Zap, Palette, Unlock } from 'lucide-react';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'booster' | 'skin' | 'mode';
  icon: React.ReactNode;
  impact: string;
}

const storeItems: StoreItem[] = [
  // Boosters
  {
    id: 'booster_extra_dice',
    name: 'Extra Dice Roll',
    description: 'Get 2 extra dice rolls in your current game',
    price: 49,
    category: 'booster',
    icon: <Zap className="w-8 h-8" />,
    impact: '+2 Moves',
  },
  {
    id: 'booster_wealth_boost',
    name: 'Instant Wealth Boost',
    description: 'Get ₹50,000 instantly in your game',
    price: 99,
    category: 'booster',
    icon: <Zap className="w-8 h-8" />,
    impact: '+₹50K',
  },
  {
    id: 'booster_skip_doodad',
    name: 'Skip Doodad Card',
    description: 'Avoid your next Doodad (expense) card',
    price: 79,
    category: 'booster',
    icon: <Zap className="w-8 h-8" />,
    impact: 'Skip 1',
  },
  {
    id: 'booster_deal_multiplier',
    name: 'Deal Multiplier (2x)',
    description: 'Double passive income from your next deal',
    price: 149,
    category: 'booster',
    icon: <Zap className="w-8 h-8" />,
    impact: '2x Return',
  },

  // Cosmetic Skins
  {
    id: 'skin_dark_mode',
    name: 'Dark Knight Board Theme',
    description: 'Premium dark-themed board with neon accents',
    price: 29,
    category: 'skin',
    icon: <Palette className="w-8 h-8" />,
    impact: 'Visual',
  },
  {
    id: 'skin_gold_board',
    name: 'Golden Luxe Theme',
    description: 'Elegant gold and silver board design',
    price: 49,
    category: 'skin',
    icon: <Palette className="w-8 h-8" />,
    impact: 'Visual',
  },
  {
    id: 'skin_neon_avatar',
    name: 'Neon Avatar Pack',
    description: '5 unique glowing avatar customizations',
    price: 39,
    category: 'skin',
    icon: <Palette className="w-8 h-8" />,
    impact: 'Visual',
  },

  // Special Modes
  {
    id: 'mode_hardcore',
    name: 'Hardcore Mode Unlock',
    description: 'Unlock challenging variant with higher stakes',
    price: 149,
    category: 'mode',
    icon: <Unlock className="w-8 h-8" />,
    impact: 'New Mode',
  },
  {
    id: 'mode_speed_run',
    name: 'Speed Run Challenge',
    description: 'Complete the game in 30 mins for extra rewards',
    price: 99,
    category: 'mode',
    icon: <Unlock className="w-8 h-8" />,
    impact: 'New Mode',
  },
  {
    id: 'mode_multiplayer',
    name: 'Multiplayer Arena',
    description: 'Compete with other players in real-time',
    price: 199,
    category: 'mode',
    icon: <Unlock className="w-8 h-8" />,
    impact: 'New Mode',
  },
];

const categoryColors = {
  booster: 'bg-purple-900/30 border-purple-500/50',
  skin: 'bg-blue-900/30 border-blue-500/50',
  mode: 'bg-orange-900/30 border-orange-500/50',
};

const categoryBadges = {
  booster: 'bg-purple-600',
  skin: 'bg-blue-600',
  mode: 'bg-orange-600',
};

export default function Store() {
  const { toast } = useToast();
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'booster' | 'skin' | 'mode'>('all');

  const filteredItems =
    filter === 'all' ? storeItems : storeItems.filter((item) => item.category === filter);

  const handlePurchase = async (item: StoreItem) => {
    setProcessing(item.id);

    try {
      const userId = localStorage.getItem('userId') || 'demo-user';

      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: item.price,
          type: 'inapp',
          itemId: item.id,
        }),
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');

      const orderData = await orderResponse.json();
      const { orderId } = orderData;

      // Simulate payment
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Verify payment
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          orderId,
          paymentId: `pay_${Date.now()}`,
          signature: `sig_${orderId}_${Date.now()}`,
          type: 'inapp',
          itemId: item.id,
        }),
      });

      if (!verifyResponse.ok) throw new Error('Payment verification failed');

      toast({
        title: '✅ Purchase Successful!',
        description: `${item.name} added to your inventory!`,
      });
    } catch (error) {
      toast({
        title: '❌ Purchase Failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <ShoppingCart className="w-10 h-10 text-blue-400" />
            Finverse Store
          </h1>
          <p className="text-blue-200">Boost your game with exclusive items and modes</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {(['all', 'booster', 'skin', 'mode'] as const).map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? 'default' : 'outline'}
              onClick={() => setFilter(cat)}
              className="capitalize"
              data-testid={`button-filter-${cat}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`${categoryColors[item.category]} border transition-all hover:shadow-lg`}
              data-testid={`card-store-item-${item.id}`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl">{item.icon}</div>
                  <Badge className={categoryBadges[item.category]} data-testid={`badge-category-${item.category}`}>
                    {item.category}
                  </Badge>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                <p className="text-slate-300 text-sm mb-4">{item.description}</p>

                {/* Impact */}
                <div className="mb-4 p-2 bg-white/10 rounded text-center">
                  <p className="text-blue-300 font-semibold text-sm">{item.impact}</p>
                </div>

                {/* Price & Button */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Price</p>
                    <p className="text-2xl font-bold text-blue-300">₹{item.price}</p>
                  </div>
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={processing === item.id}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                    data-testid={`button-buy-${item.id}`}
                  >
                    {processing === item.id ? '...' : 'Buy'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 p-8 mt-12">
          <h3 className="text-xl font-bold text-white mb-4">💡 Store Info</h3>
          <div className="grid md:grid-cols-2 gap-6 text-slate-300 text-sm">
            <div>
              <p className="font-semibold text-blue-300 mb-2">Boosters</p>
              <p>Temporary power-ups to enhance your current game session</p>
            </div>
            <div>
              <p className="font-semibold text-blue-300 mb-2">Skins</p>
              <p>Cosmetic upgrades to personalize your gaming experience</p>
            </div>
            <div>
              <p className="font-semibold text-blue-300 mb-2">Special Modes</p>
              <p>Unlock new game variants with unique challenges and rewards</p>
            </div>
            <div>
              <p className="font-semibold text-blue-300 mb-2">One-time Purchase</p>
              <p>All store items are one-time purchases. No subscriptions!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
