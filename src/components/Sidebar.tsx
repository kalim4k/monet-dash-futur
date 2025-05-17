
import { cn } from "@/lib/utils";
import { Home, Package, History, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function SidebarItem({ to, icon, label, isActive }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary/5 hover:text-foreground"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Don't render on mobile (we'll use BottomNavigation instead)
  if (isMobile) {
    return null;
  }

  return (
    <div className="h-screen sticky top-0 w-64 border-r p-4">
      <div className="flex items-center gap-2 pb-6 pt-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
        <h1 className="font-bold text-xl">SocialMonet</h1>
      </div>

      <div className="space-y-1">
        <SidebarItem
          to="/"
          icon={<Home size={20} />}
          label="Accueil"
          isActive={location.pathname === "/"}
        />
        <SidebarItem
          to="/products"
          icon={<Package size={20} />}
          label="Produits Disponibles"
          isActive={location.pathname === "/products"}
        />
        <SidebarItem
          to="/history"
          icon={<History size={20} />}
          label="Historique de paiement"
          isActive={location.pathname === "/history"}
        />
        <SidebarItem
          to="/profile"
          icon={<User size={20} />}
          label="Profile"
          isActive={location.pathname === "/profile"}
        />
      </div>
    </div>
  );
}
