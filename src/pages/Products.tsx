
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";

const Products = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container max-w-7xl py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Produits Disponibles</h1>
            <p className="text-muted-foreground mt-1">
              Découvrez tous les produits que vous pouvez promouvoir
            </p>
          </header>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Product cards would go here */}
            <div className="border p-6 rounded-lg shadow-sm bg-white">
              <h3 className="font-semibold">Contenu à venir</h3>
              <p className="text-muted-foreground mt-2">
                Cette page est en cours de développement
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Products;
