
import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

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
    const duration = 15000; // 15 seconds for one full loop
    const scrollAmount = 1; // pixels to scroll per frame
    let position = 0;
    let animationFrameId: number | null = null;
    
    // Scroll animation function
    const scrollCarousel = () => {
      if (!carouselRef.current) return;
      
      position += scrollAmount;
      
      // Reset position when we've scrolled through half the content
      // This creates an infinite loop effect
      if (position >= scrollWidth / 2) {
        position = 0;
      }
      
      carouselRef.current.scrollLeft = position;
      animationFrameId = requestAnimationFrame(scrollCarousel);
    };
    
    // Start animation
    animationFrameId = requestAnimationFrame(scrollCarousel);
    
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
      
      <div 
        ref={carouselRef} 
        className="flex overflow-x-hidden whitespace-nowrap"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Double the platforms list to create seamless loop effect */}
        {[...platforms, ...platforms, ...platforms].map((platform, index) => (
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
