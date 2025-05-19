
import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

const platforms = [{
  name: "TikTok",
  icon: "https://orawin.fun/wp-content/uploads/2025/05/tik-tok4.png"
}, {
  name: "WhatsApp",
  icon: "https://orawin.fun/wp-content/uploads/2025/05/whatsapp1.png"
}, {
  name: "Telegram",
  icon: "https://orawin.fun/wp-content/uploads/2025/05/telegram1.png"
}, {
  name: "Facebook",
  icon: "https://orawin.fun/wp-content/uploads/2025/05/facebook2.png"
}];

export function PlatformsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;
    
    // Only apply animation if content is wider than container
    if (scrollWidth <= clientWidth) return;
    
    let startTime: number | null = null;
    let animationId: number;
    
    const scroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Complete cycle in 20 seconds
      const progress = (elapsed % 20000) / 20000;
      
      // Calculate scroll position - move from right to left
      const scrollPos = progress * (scrollWidth - clientWidth);
      
      if (scrollContainer) {
        scrollContainer.scrollLeft = scrollPos;
      }
      
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <div className="w-full mb-6 overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Double the platforms to create seamless loop effect */}
        {[...platforms, ...platforms].map((platform, index) => (
          <Card 
            key={index} 
            className="flex-shrink-0 px-4 py-2 flex items-center gap-2 bg-white border shadow-sm"
          >
            <img 
              src={platform.icon} 
              alt={platform.name} 
              className="w-5 h-5 object-contain" 
            />
            <span className="text-sm font-medium">{platform.name}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
