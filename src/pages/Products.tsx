
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ClipboardCopy, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  affiliate_link: string;
  clicks_count?: number;
  page_path: string;
}

const Products = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Charger les produits avec des liens d'affiliation prédéfinis
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Produits spécifiques avec leurs liens d'affiliation prédéfinis
        const ourProducts = [
          {
            id: "product",
            name: "50 Jeux à Faire en Couple",
            description: "Redécouvrez votre complicité grâce à ce guide de jeux à deux",
            image_url: "https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-18-mai-2025-16_07_08.png",
            active: true,
            affiliate_link: "https://monet-dash-futur.lovable.app/product",
            page_path: "/product"
          },
          {
            id: "paypal-account",
            name: "Comment créer un compte PayPal vérifié en Afrique",
            description: "Le guide complet pour sécuriser vos paiements en ligne",
            image_url: "https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-18-mai-2025-16_24_13.png",
            active: true,
            affiliate_link: "https://monet-dash-futur.lovable.app/paypal-account",
            page_path: "/paypal-account"
          },
          {
            id: "capcut-pro",
            name: "Capcut Pro à Vie",
            description: "Éditez vos vidéos comme un pro sans limites",
            image_url: "https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-22-avr.-2025-22_20_13.png",
            active: true,
            affiliate_link: "https://monet-dash-futur.lovable.app/capcut-pro",
            page_path: "/capcut-pro"
          },
          {
            id: "fantasmes-couple",
            name: "100 Fantasmes à Explorer à Deux",
            description: "Redécouvrez Votre Complicité et Pimentez Votre Vie de Couple !",
            image_url: "https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-18-mai-2025-16_40_05.png",
            active: true,
            affiliate_link: "https://monet-dash-futur.lovable.app/fantasmes-couple",
            page_path: "/fantasmes-couple"
          },
          {
            id: "penis-enlargement",
            name: "Comment Agrandir Son Penis Naturellement",
            description: "Méthodes naturelles qui fonctionnent réellement",
            image_url: "https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-18-mai-2025-16_13_58.png",
            active: true,
            affiliate_link: "https://monet-dash-futur.lovable.app/penis-enlargement",
            page_path: "/penis-enlargement"
          },
          {
            id: "tiktok-monetization",
            name: "Comment Monétiser ses Vidéos TikTok",
            description: "Gagnez de l'argent avec vos vidéos virales",
            image_url: "https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-18-mai-2025-16_20_20.png",
            active: true,
            affiliate_link: "https://monet-dash-futur.lovable.app/tiktok-monetization",
            page_path: "/tiktok-monetization"
          }
        ];
        
        if (!user) {
          setProducts(ourProducts);
          setLoading(false);
          return;
        }
        
        // Ajouter l'ID de l'utilisateur à chaque lien d'affiliation pour le tracking
        const productsWithUserLinks = ourProducts.map(product => {
          const separator = product.affiliate_link.includes('?') ? '&' : '?';
          const affiliateLink = `${product.affiliate_link}${separator}ref=${user.id}`;
          
          return {
            ...product,
            affiliate_link: affiliateLink
          };
        });
        
        const userClickStats: Product[] = [];
        
        // Parcourir chaque produit et récupérer ses statistiques de clics
        for (const product of productsWithUserLinks) {
          try {
            const { count, error } = await supabase
              .from('clicks')
              .select('*', { count: 'exact', head: true })
              .eq('affiliate_link_id', product.id)
              .eq('user_id', user.id);
            
            if (error) {
              console.error("Erreur lors du comptage des clics:", error);
              userClickStats.push({ ...product, clicks_count: 0 });
            } else {
              userClickStats.push({ ...product, clicks_count: count || 0 });
            }
          } catch (err) {
            console.error("Erreur:", err);
            userClickStats.push({ ...product, clicks_count: 0 });
          }
        }
        
        setProducts(userClickStats);
        
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [user, toast]);
  
  // Copier le lien d'affiliation dans le presse-papiers
  const copyToClipboard = (link: string, productId: string) => {
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopied(prev => ({ ...prev, [productId]: true }));
        toast({
          title: "Lien copié",
          description: "Le lien d'affiliation a été copié dans le presse-papiers"
        });
        setTimeout(() => {
          setCopied(prev => ({ ...prev, [productId]: false }));
        }, 2000);
      })
      .catch(err => {
        console.error("Erreur lors de la copie:", err);
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container max-w-7xl py-6 px-4 sm:px-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Produits à Promouvoir</h1>
            <p className="text-muted-foreground mt-1">
              Copiez votre lien d'affiliation unique pour les produits ci-dessous et gagnez 1 FCFA par clic
            </p>
          </header>
          
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardFooter className="flex justify-end">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.length > 0 ? (
                products.map((product) => (
                  <Card key={product.id} className="border overflow-hidden">
                    {product.image_url ? (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="h-full w-full object-cover transition-all hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            console.log(`Erreur de chargement pour l'image: ${product.image_url}`);
                            // Fallback à une image par défaut en cas d'erreur
                            e.currentTarget.src = "https://via.placeholder.com/600x400?text=Image+non+disponible";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                        <div className="text-primary font-semibold">
                          {product.name}
                        </div>
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{product.name}</CardTitle>
                        <Badge variant="outline" className="ml-2">Produit</Badge>
                      </div>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      {product.clicks_count !== undefined && user && (
                        <div className="text-sm text-muted-foreground mb-2">
                          Clics générés: <span className="font-semibold">{product.clicks_count}</span>
                          <span className="ml-2 text-primary font-medium">({product.clicks_count} FCFA)</span>
                        </div>
                      )}
                      
                      <div className="w-full flex flex-col gap-2">
                        <div className="flex w-full h-10 rounded-md border border-input bg-transparent text-sm ring-offset-background overflow-hidden">
                          <span className="px-3 py-2 truncate flex-1">
                            {product.affiliate_link}
                          </span>
                          <Button 
                            variant="ghost" 
                            className="h-full aspect-square border-l"
                            onClick={() => copyToClipboard(product.affiliate_link, product.id)}
                          >
                            {copied[product.id] ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <ClipboardCopy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        asChild
                      >
                        <Link to={product.page_path || "#"}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Voir le produit
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">Aucun produit disponible</h3>
                  <p className="text-muted-foreground">
                    De nouveaux produits à promouvoir seront disponibles prochainement.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Products;
