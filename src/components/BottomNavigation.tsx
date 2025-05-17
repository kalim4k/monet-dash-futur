
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Home, Package, History, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ to, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-1 flex-col items-center justify-center py-2 text-xs gap-1",
        isActive 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function BottomNavigation() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Only show on mobile devices
  if (!isMobile) {
    return null;
  }
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <NavItem 
        to="/" 
        icon={<Home size={20} />}
        label="Accueil"
        isActive={location.pathname === "/"}
      />
      <NavItem 
        to="/products" 
        icon={<Package size={20} />}
        label="Produits"
        isActive={location.pathname === "/products"}
      />
      <NavItem 
        to="/history" 
        icon={<History size={20} />}
        label="Historique"
        isActive={location.pathname === "/history"}
      />
      <NavItem 
        to="/profile" 
        icon={<User size={20} />}
        label="Profile"
        isActive={location.pathname === "/profile"}
      />
    </nav>
  );
}
