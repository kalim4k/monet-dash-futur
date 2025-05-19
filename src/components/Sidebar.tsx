
import { cn } from "@/lib/utils";
import { Home, Package, History, User, LogOut, Layers, Settings, CreditCard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

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
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
        isActive
          ? "bg-primary text-white shadow-md shadow-primary/20"
          : "text-gray-500 hover:bg-primary/10 hover:text-primary"
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
    <div className="h-screen sticky top-0 w-64 bg-white border-r border-slate-100 p-4 flex flex-col">
      <div className="flex items-center gap-3 pb-8 pt-4 px-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md">
          <Layers size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-xs text-slate-500">v1.0.0</p>
        </div>
      </div>

      <div className="space-y-1.5 flex-grow">
        <SidebarItem
          to="/"
          icon={<Home size={18} strokeWidth={2.5} />}
          label="Accueil"
          isActive={location.pathname === "/"}
        />
        <SidebarItem
          to="/products"
          icon={<Package size={18} strokeWidth={2.5} />}
          label="Produits"
          isActive={location.pathname === "/products"}
        />
        <SidebarItem
          to="/history"
          icon={<History size={18} strokeWidth={2.5} />}
          label="Historique"
          isActive={location.pathname === "/history"}
        />
        <SidebarItem
          to="/profile"
          icon={<User size={18} strokeWidth={2.5} />}
          label="Profile"
          isActive={location.pathname === "/profile"}
        />
        
        <div className="pt-4 mt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 px-4 mb-2 uppercase font-medium">Paramètres</p>
          <SidebarItem
            to="/settings"
            icon={<Settings size={18} strokeWidth={2.5} />}
            label="Configuration"
            isActive={location.pathname === "/settings"}
          />
          <SidebarItem
            to="/payments"
            icon={<CreditCard size={18} strokeWidth={2.5} />}
            label="Paiements"
            isActive={location.pathname === "/payments"}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} className="mr-2" strokeWidth={2.5} />
          <span className="font-medium">Déconnexion</span>
        </Button>
      </div>
    </div>
  );
}
