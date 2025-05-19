
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
  return (
    <div className="w-full mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
