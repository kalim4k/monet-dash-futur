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
  return;
}