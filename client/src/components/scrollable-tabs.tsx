import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

interface ScrollableTabsProps {
  tabs: Tab[];
}

export function ScrollableTabs({ tabs }: ScrollableTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollContainerRef.current.scrollLeft < 
        scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
      );
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [tabs]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      {canScrollLeft && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => scroll('left')}
          className="flex-shrink-0 text-primary hover:bg-primary/20"
          data-testid="button-scroll-tabs-left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto flex-1 pb-2 -mx-2 px-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={tab.active ? 'default' : 'outline'}
            size="sm"
            onClick={tab.onClick}
            className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            data-testid={`button-tab-${tab.id}`}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {canScrollRight && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => scroll('right')}
          className="flex-shrink-0 text-primary hover:bg-primary/20"
          data-testid="button-scroll-tabs-right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
