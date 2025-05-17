
import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const platforms = [
  {
    name: "TikTok",
    icon: "https://orawin.fun/wp-content/uploads/2025/05/tik-tok4.png"
  },
  {
    name: "WhatsApp",
    icon: "https://orawin.fun/wp-content/uploads/2025/05/whatsapp1.png"
  },
  {
    name: "Telegram",
    icon: "https://orawin.fun/wp-content/uploads/2025/05/telegram1.png"
  },
  {
    name: "Facebook",
    icon: "https://orawin.fun/wp-content/uploads/2025/05/facebook2.png"
  }
];

export function PlatformsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollWidth = carouselRef.current?.scrollWidth || 0;
    const clientWidth = carouselRef.current?.clientWidth || 0;
    
    if (scrollWidth <= clientWidth) return;
    
    // Animation params
    const duration = 20000; // 20 seconds for one full loop
    const scrollDistance = scrollWidth;
    let startTime: number | null = null;
    let animationFrameId: number | null = null;
    
    // Scroll animation function
    const scroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Calculate position based on elapsed time
      const position = (elapsed % duration) / duration * scrollDistance;
      
      if (carouselRef.current) {
        carouselRef.current.scrollLeft = position;
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    // Start animation
    animationFrameId = requestAnimationFrame(scroll);
    
    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <Card className="p-3 bg-gradient-to-r from-primary/10 to-secondary/5 border-0 overflow-hidden">
      <p className="text-sm font-medium mb-2">Plateformes de monétisation</p>
      
      <div ref={carouselRef} className="flex overflow-x-hidden whitespace-nowrap">
        {/* Double the platforms list to create seamless loop effect */}
        {[...platforms, ...platforms].map((platform, index) => (
          <div 
            key={`${platform.name}-${index}`} 
            className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg mr-4 inline-block"
          >
            <img src={platform.icon} alt={platform.name} className="w-6 h-6" />
            <span className="text-xs font-medium">{platform.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
