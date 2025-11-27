import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ShoppingCart, BookOpen, CreditCard, Zap, Home, BarChart3 } from 'lucide-react';

export function MonetizationNav() {
  const [location, navigate] = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/pricing', label: 'Pricing', icon: Zap },
    { path: '/store', label: 'Store', icon: ShoppingCart },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/subscription', label: 'Subscription', icon: CreditCard },
    { path: '/business', label: 'Business', icon: BarChart3 },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {navItems.map((item) => {
        const isActive = location === item.path;
        return (
          <Button
            key={item.path}
            onClick={() => navigate(item.path)}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            className="text-xs px-2.5 py-1 h-7 flex items-center gap-1.5 whitespace-nowrap"
            data-testid={`button-nav-${item.path.slice(1) || 'home'}`}
          >
            <item.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
