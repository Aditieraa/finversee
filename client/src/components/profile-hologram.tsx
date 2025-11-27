import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfileHologramProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function ProfileHologram({ open, onOpenChange, children }: ProfileHologramProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-blue-400/50 bg-blue-950/40 backdrop-blur-xl shadow-2xl shadow-blue-500/30 animate-tabSlideIn max-w-md">
        {/* Holographic glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400/10 via-transparent to-purple-400/10 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
