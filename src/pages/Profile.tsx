
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";

const Profile = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0 w-full">
        <div className="container px-4 sm:px-6 max-w-7xl py-6">
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Votre Profil</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos informations personnelles et paramètres
            </p>
          </header>
          
          <div className="border p-4 sm:p-6 rounded-lg shadow-sm bg-white">
            <h3 className="font-semibold">Contenu à venir</h3>
            <p className="text-muted-foreground mt-2">
              Cette page est en cours de développement
            </p>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
