import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, Zap, Gift, BookOpen, Users, Building2, Star, Lock } from 'lucide-react';

export default function Premium() {
  const { toast } = useToast();

  const handleSubscribe = (tier: string) => {
    toast({ title: `✨ ${tier} Tier Selected`, description: 'Processing payment...' });
  };

  const handlePurchase = (item: string) => {
    toast({ title: `🎁 Purchase`, description: `₹${item} added to cart` });
  };

  return (
    <div className="space-y-8 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Finverse+ Premium</h1>
        <p className="text-blue-200/70">Unlock unlimited financial freedom</p>
      </div>

      {/* STREAM 1: SUBSCRIPTIONS */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <Zap className="h-6 w-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Revenue Stream 1: Subscriptions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* FREE TIER */}
          <Card className="border-blue-400/30 bg-blue-950/40 backdrop-blur-sm p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">Current</Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">FREE</h3>
            <p className="text-blue-200/70 text-sm mb-6">Perfect to start</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Unlimited BreakTheRace games</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">3 Aura Twin AI advice/day</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">Delayed stock data (15 mins)</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Your Current Plan
            </Button>
          </Card>

          {/* PRO TIER */}
          <Card className="border-cyan-400/40 bg-cyan-950/40 backdrop-blur-sm p-6 relative overflow-hidden ring-1 ring-cyan-400/30">
            <div className="absolute top-4 right-4">
              <Badge className="bg-cyan-500/30 text-cyan-200 border-cyan-400/40">Popular</Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">PRO</h3>
            <p className="text-cyan-200/70 text-sm mb-2">₹99/month</p>
            <p className="text-cyan-200/50 text-xs mb-6">Best for active traders</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-cyan-100">All FREE features</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-cyan-100">Unlimited Aura Twin advice</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-cyan-100">Real-time stock data</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-cyan-100">Financial reports export</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-cyan-100">Ad-free experience</span>
              </div>
            </div>
            <Button
              onClick={() => handleSubscribe('PRO')}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Upgrade to PRO
            </Button>
          </Card>

          {/* PREMIUM TIER */}
          <Card className="border-purple-400/40 bg-purple-950/40 backdrop-blur-sm p-6 relative overflow-hidden ring-1 ring-purple-400/30">
            <div className="absolute top-4 right-4">
              <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/40 flex items-center gap-1">
                <Star className="h-3 w-3" /> Elite
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">PREMIUM</h3>
            <p className="text-purple-200/70 text-sm mb-2">₹199/month</p>
            <p className="text-purple-200/50 text-xs mb-6">For serious investors</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-purple-100">All PRO features</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-purple-100">Advanced trading simulator</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-purple-100">Paid courses access</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-purple-100">Priority support</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-purple-100">Exclusive community</span>
              </div>
            </div>
            <Button
              onClick={() => handleSubscribe('PREMIUM')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white"
            >
              Upgrade to PREMIUM
            </Button>
          </Card>
        </div>
      </section>

      {/* STREAM 2: IN-APP PURCHASES */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <Gift className="h-6 w-6 text-pink-400" />
          <h2 className="text-2xl font-bold text-white">Revenue Stream 2: In-App Purchases</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Game Boosters */}
          <Card className="border-pink-400/30 bg-pink-950/40 backdrop-blur-sm p-4">
            <h3 className="text-lg font-bold text-white mb-3">Game Boosters</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-pink-100">Extra Dice Rolls (5x)</span>
                <Badge className="bg-pink-500/20 text-pink-300 border-pink-400/30">₹9</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-pink-100">Instant Wealth Boost</span>
                <Badge className="bg-pink-500/20 text-pink-300 border-pink-400/30">₹29</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-pink-100">Skip Move Bundle</span>
                <Badge className="bg-pink-500/20 text-pink-300 border-pink-400/30">₹49</Badge>
              </div>
            </div>
            <Button
              onClick={() => handlePurchase('Booster')}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white text-sm"
            >
              View Boosters
            </Button>
          </Card>

          {/* Cosmetic Skins */}
          <Card className="border-blue-400/30 bg-blue-950/40 backdrop-blur-sm p-4">
            <h3 className="text-lg font-bold text-white mb-3">Cosmetic Skins</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-100">Avatar Customizations</span>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">₹29</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-100">Board Themes</span>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">₹39</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-100">Premium Bundle</span>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">₹49</Badge>
              </div>
            </div>
            <Button
              onClick={() => handlePurchase('Skin')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Browse Skins
            </Button>
          </Card>

          {/* Special Modes */}
          <Card className="border-green-400/30 bg-green-950/40 backdrop-blur-sm p-4">
            <h3 className="text-lg font-bold text-white mb-3">Special Modes</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-100">Hardcore Mode</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-400/30">₹129</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-100">Tournament Mode</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-400/30">₹99</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-100">All Modes Bundle</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-400/30">₹199</Badge>
              </div>
            </div>
            <Button
              onClick={() => handlePurchase('Mode')}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              Unlock Modes
            </Button>
          </Card>
        </div>
      </section>

      {/* STREAM 3: COURSES */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-white">Revenue Stream 3: Educational Courses</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mini-Courses */}
          <Card className="border-amber-400/30 bg-amber-950/40 backdrop-blur-sm p-4">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Mini-Courses
            </h3>
            <div className="space-y-3">
              {['Tax Optimization Masterclass', 'Stock Market 101', 'Real Estate Investment Secrets', 'Passive Income Systems'].map((course, idx) => (
                <div key={idx} className="p-3 bg-amber-900/30 rounded-md border border-amber-400/20">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-100">{course}</p>
                      <p className="text-xs text-amber-200/60 mt-1">Certificate included</p>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30">₹299</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Course Bundles */}
          <Card className="border-orange-400/30 bg-orange-950/40 backdrop-blur-sm p-4">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Premium Bundles
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-orange-900/30 rounded-md border border-orange-400/20 relative">
                <div className="absolute top-2 right-2">
                  <Badge className="bg-red-500/30 text-red-200 border-red-400/40 text-xs">Save 25%</Badge>
                </div>
                <p className="text-sm font-semibold text-orange-100">Essential Bundle</p>
                <p className="text-xs text-orange-200/60 mt-1">4 courses + certificates</p>
                <p className="text-sm font-bold text-orange-300 mt-2">₹599</p>
              </div>
              <div className="p-3 bg-orange-900/30 rounded-md border border-orange-400/20 relative">
                <div className="absolute top-2 right-2">
                  <Badge className="bg-red-500/30 text-red-200 border-red-400/40 text-xs">Save 35%</Badge>
                </div>
                <p className="text-sm font-semibold text-orange-100">Complete Master</p>
                <p className="text-xs text-orange-200/60 mt-1">8 courses + lifetime access</p>
                <p className="text-sm font-bold text-orange-300 mt-2">₹999</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* STREAM 4: AFFILIATE PROGRAM */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <Users className="h-6 w-6 text-teal-400" />
          <h2 className="text-2xl font-bold text-white">Revenue Stream 4: Affiliate Program</h2>
        </div>

        <Card className="border-teal-400/30 bg-teal-950/40 backdrop-blur-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Partner With Us</h3>
              <div className="space-y-3">
                <div className="p-3 bg-teal-900/30 rounded-md border border-teal-400/20">
                  <p className="text-sm font-semibold text-teal-100">Stock Brokers</p>
                  <p className="text-xs text-teal-200/60 mt-1">Zerodha, Shoonya & more</p>
                  <Badge className="bg-teal-500/20 text-teal-300 border-teal-400/30 text-xs mt-2">0.5-1% Commission</Badge>
                </div>
                <div className="p-3 bg-teal-900/30 rounded-md border border-teal-400/20">
                  <p className="text-sm font-semibold text-teal-100">Investment Apps</p>
                  <p className="text-xs text-teal-200/60 mt-1">Digit, Bajaj Allianz</p>
                  <Badge className="bg-teal-500/20 text-teal-300 border-teal-400/30 text-xs mt-2">3-5% Per Referral</Badge>
                </div>
                <div className="p-3 bg-teal-900/30 rounded-md border border-teal-400/20">
                  <p className="text-sm font-semibold text-teal-100">Banking Platforms</p>
                  <p className="text-xs text-teal-200/60 mt-1">Multiple bank partners</p>
                  <Badge className="bg-teal-500/20 text-teal-300 border-teal-400/30 text-xs mt-2">1-2% Per Signup</Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Your Earnings</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center p-2 bg-teal-900/20 rounded">
                    <span className="text-sm text-teal-100">Active Referrals</span>
                    <span className="font-bold text-teal-300">₹0</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-teal-900/20 rounded">
                    <span className="text-sm text-teal-100">Total Earned</span>
                    <span className="font-bold text-teal-300">₹0</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-teal-900/20 rounded">
                    <span className="text-sm text-teal-100">This Month</span>
                    <span className="font-bold text-teal-300">₹0</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Join Affiliate Program
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* STREAM 5: B2B/ENTERPRISE */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <Building2 className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Revenue Stream 5: B2B/Enterprise Licensing</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Schools/Colleges */}
          <Card className="border-indigo-400/30 bg-indigo-950/40 backdrop-blur-sm p-4">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Schools & Colleges
            </h3>
            <p className="text-indigo-200/70 text-sm mb-4">Financial literacy for students</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-indigo-200/60 font-semibold">Starting at</p>
                <p className="text-2xl font-bold text-indigo-300">₹5,000/month</p>
                <p className="text-xs text-indigo-200/50 mt-1">Per institution</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 border-indigo-400/30 text-indigo-300 hover:bg-indigo-900/20"
            >
              Request Demo
            </Button>
          </Card>

          {/* Corporate Training */}
          <Card className="border-violet-400/30 bg-violet-950/40 backdrop-blur-sm p-4">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Corporate Training
            </h3>
            <p className="text-violet-200/70 text-sm mb-4">Employee financial wellness</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-violet-200/60 font-semibold">Custom pricing</p>
                <p className="text-2xl font-bold text-violet-300">Based on</p>
                <p className="text-xs text-violet-200/50 mt-1">Team size & features</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 border-violet-400/30 text-violet-300 hover:bg-violet-900/20"
            >
              Get Quote
            </Button>
          </Card>

          {/* Financial Literacy */}
          <Card className="border-fuchsia-400/30 bg-fuchsia-950/40 backdrop-blur-sm p-4">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Bulk Licenses
            </h3>
            <p className="text-fuchsia-200/70 text-sm mb-4">For financial education orgs</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-fuchsia-200/60 font-semibold">Volume pricing</p>
                <p className="text-2xl font-bold text-fuchsia-300">₹10K+</p>
                <p className="text-xs text-fuchsia-200/50 mt-1">With bulk discounts</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 border-fuchsia-400/30 text-fuchsia-300 hover:bg-fuchsia-900/20"
            >
              Learn More
            </Button>
          </Card>
        </div>
      </section>

      {/* Payment Methods */}
      <section>
        <Card className="border-green-400/30 bg-green-950/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-400" />
            Payment Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-900/30 rounded-md border border-green-400/20">
              <p className="text-sm font-semibold text-green-100 mb-2">UPI</p>
              <p className="text-xs text-green-200/60">Google Pay, PhonePe, Paytm</p>
            </div>
            <div className="p-4 bg-green-900/30 rounded-md border border-green-400/20">
              <p className="text-sm font-semibold text-green-100 mb-2">Credit/Debit Cards</p>
              <p className="text-xs text-green-200/60">Visa, Mastercard, RuPay</p>
            </div>
            <div className="p-4 bg-green-900/30 rounded-md border border-green-400/20">
              <p className="text-sm font-semibold text-green-100 mb-2">Wallets</p>
              <p className="text-xs text-green-200/60">Airtel, FreeCharge, Amazon Pay</p>
            </div>
            <div className="p-4 bg-green-900/30 rounded-md border border-green-400/20">
              <p className="text-sm font-semibold text-green-100 mb-2">Features</p>
              <p className="text-xs text-green-200/60">100 txns/mo free • 2% commission</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
