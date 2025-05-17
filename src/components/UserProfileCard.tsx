
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export function UserProfileCard() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  // Extract user information
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur';
  const avatarUrl = user?.user_metadata?.avatar_url;

  // On mobile, show just the avatar but with a larger size
  if (isMobile) {
    return (
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger className="outline-none">
          <div className="relative">
            <Avatar className="h-14 w-14 border-2 border-white/30 cursor-pointer shadow-md">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary/20 text-primary">
                <User size={24} />
              </AvatarFallback>
            </Avatar>
            {/* Status indicator */}
            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 p-2 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-3 p-2 border-b mb-1">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary/20 text-primary">
                <User size={20} />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{displayName}</p>
              <p className="text-xs text-primary">Influenceur Premium</p>
            </div>
          </div>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link to="/profile">Mon profil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">Paramètres</DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer text-red-500 flex items-center" 
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Desktop view remains unchanged
  return (
    <Card className="
      backdrop-filter backdrop-blur-lg bg-opacity-30
      bg-gradient-to-r from-primary/30 to-secondary/20 border-0 p-2 px-4 flex items-center gap-3
      hover:shadow-md transition-all duration-300
      rounded-xl relative overflow-hidden
    ">
      {/* Glowing effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse-slow"></div>
      
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger className="outline-none flex items-center gap-3 z-10">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white/30 cursor-pointer transition-transform duration-300 ${isMenuOpen ? 'scale-105' : ''}">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary/20 text-primary">
                <User size={24} />
              </AvatarFallback>
            </Avatar>
            {/* Status indicator */}
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          
          <div className="z-10">
            <p className="font-medium text-sm">{displayName}</p>
            <p className="text-xs text-muted-foreground">Influenceur Premium</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-3 p-2 border-b mb-1">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary/20 text-primary">
                <User size={18} />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{displayName}</p>
              <p className="text-xs text-primary">Influenceur Premium</p>
            </div>
          </div>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link to="/profile">Mon profil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">Paramètres</DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer text-red-500 flex items-center" 
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
