import { cn } from "@/lib/utils";
import { Home, Package, History, User, LogOut, Shield } from "lucide-react";
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
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive
          ? "bg-white/10 text-white"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      <span className="font-bold">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [hasAdminRole, setHasAdminRole] = useState(false);

  // Don't render on mobile (we'll use BottomNavigation instead)
  if (isMobile) {
    return null;
  }

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        
        if (!error && data === true) {
          setHasAdminRole(true);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle:", error);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  return (
    <div className="h-screen sticky top-0 w-64 bg-black border-r border-white/10 p-4 flex flex-col">
      <div className="flex items-center gap-2 pb-6 pt-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
        <h1 className="font-bold text-xl text-white">SocialMonet</h1>
      </div>

      <div className="space-y-1 flex-grow">
        <SidebarItem
          to="/"
          icon={<Home size={20} className="text-white" />}
          label="Accueil"
          isActive={location.pathname === "/"}
        />
        <SidebarItem
          to="/products"
          icon={<Package size={20} className="text-white" />}
          label="Produits Disponibles"
          isActive={location.pathname === "/products"}
        />
        <SidebarItem
          to="/history"
          icon={<History size={20} className="text-white" />}
          label="Historique de paiement"
          isActive={location.pathname === "/history"}
        />
        <SidebarItem
          to="/profile"
          icon={<User size={20} className="text-white" />}
          label="Profile"
          isActive={location.pathname === "/profile"}
        />
        {hasAdminRole && (
          <SidebarItem
            to="/click-review"
            icon={<Shield size={20} className="text-white" />}
            label="Revue des Clics"
            isActive={location.pathname === "/click-review"}
          />
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-white/10">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5"
        >
          <LogOut size={20} className="mr-2" />
          <span className="font-bold">Déconnexion</span>
        </Button>
      </div>
    </div>
  );
}
