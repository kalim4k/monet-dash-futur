
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
    <div className="w-full overflow-hidden mb-6">
      <div 
        ref={carouselRef} 
        className="flex gap-3 overflow-x-auto scrollbar-hide py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {platforms.map((platform, index) => (
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
