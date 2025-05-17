
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

export function UserProfileCard() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Card className={`
      backdrop-filter backdrop-blur-lg bg-opacity-30
      ${isMobile 
        ? "bg-gradient-to-r from-primary/20 to-secondary/10 border-0 p-2 flex items-center gap-3"
        : "bg-gradient-to-r from-primary/30 to-secondary/20 border-0 p-2 px-4 flex items-center gap-3"}
      hover:shadow-md transition-all duration-300
      rounded-xl relative overflow-hidden ml-auto
      fixed top-4 right-4 z-50
    `}>
      {/* Glowing effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse-slow"></div>
      
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger className="outline-none flex items-center gap-3 z-10">
          <div className="relative">
            <Avatar className={`
              ${isMobile ? "h-10 w-10" : "h-12 w-12"} 
              border-2 border-white/30 cursor-pointer
              transition-transform duration-300
              ${isMenuOpen ? "scale-105" : ""}
            `}>
              <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&h=200" />
              <AvatarFallback className="bg-primary/20 text-primary">
                <User size={isMobile ? 18 : 24} />
              </AvatarFallback>
            </Avatar>
            {/* Status indicator */}
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          
          <div className="z-10">
            <p className="font-medium text-sm">Emma Dupont</p>
            <p className="text-xs text-muted-foreground">Influenceur Premium</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-3 p-2 border-b mb-1">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&h=200" />
              <AvatarFallback className="bg-primary/20 text-primary">
                <User size={18} />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">Emma Dupont</p>
              <p className="text-xs text-primary">Influenceur Premium</p>
            </div>
          </div>
          <DropdownMenuItem className="cursor-pointer">Mon profil</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">Paramètres</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-red-500">Déconnexion</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
