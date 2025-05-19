
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, CreditCard, Bell, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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
            <Avatar className="h-14 w-14 border-2 border-white/30 cursor-pointer shadow-md rounded-full">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <User size={24} />
              </AvatarFallback>
            </Avatar>
            {/* Status indicator */}
            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-0 rounded-xl overflow-hidden bg-white/90 backdrop-blur-md border-0 shadow-lg">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <Avatar className="h-12 w-12 rounded-xl border-2 border-white">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl">
                <User size={20} />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{displayName}</p>
              <p className="text-xs text-indigo-600">Influenceur Premium</p>
            </div>
          </div>
          <div className="p-1">
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2.5 px-3 rounded-lg" asChild>
              <Link to="/profile">
                <User className="h-4 w-4 text-indigo-600" />
                <span>Mon profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2.5 px-3 rounded-lg">
              <Settings className="h-4 w-4 text-slate-600" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2.5 px-3 rounded-lg">
              <CreditCard className="h-4 w-4 text-slate-600" />
              <span>Paiements</span>
              <Badge variant="outline" className="ml-auto text-xs px-1.5 py-0 bg-indigo-50 text-indigo-600 border-indigo-200">Nouveau</Badge>
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator />
          <div className="p-1">
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 flex items-center gap-2 py-2.5 px-3 rounded-lg" 
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Desktop view with modern design
  return (
    <div className="flex items-center gap-4">
      <div className="relative cursor-pointer">
        <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
          <Bell size={18} />
        </div>
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white text-[10px] text-white flex items-center justify-center font-medium">
          2
        </div>
      </div>
      
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger className="outline-none">
          <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Avatar className="h-9 w-9 rounded-full border-2 border-white/30 shadow-sm">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <User size={18} />
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs text-muted-foreground">Influenceur Premium</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-0.5" />
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64 p-0 rounded-xl overflow-hidden bg-white/90 backdrop-blur-md border-0 shadow-lg">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <Avatar className="h-12 w-12 rounded-xl border-2 border-white">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl">
                <User size={20} />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{displayName}</p>
              <p className="text-xs text-indigo-600">Influenceur Premium</p>
            </div>
          </div>
          <div className="p-1">
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2.5 px-3 rounded-lg" asChild>
              <Link to="/profile">
                <User className="h-4 w-4 text-indigo-600" />
                <span>Mon profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2.5 px-3 rounded-lg">
              <Settings className="h-4 w-4 text-slate-600" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2.5 px-3 rounded-lg">
              <CreditCard className="h-4 w-4 text-slate-600" />
              <span>Paiements</span>
              <Badge variant="outline" className="ml-auto text-xs px-1.5 py-0 bg-indigo-50 text-indigo-600 border-indigo-200">Nouveau</Badge>
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator />
          <div className="p-1">
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 flex items-center gap-2 py-2.5 px-3 rounded-lg" 
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
