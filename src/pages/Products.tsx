
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

type CopiedState = Record<string, boolean>;

const Products = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<CopiedState>({});

  useEffect(() => {
    // Charger les produits avec des liens d'affiliation prédéfinis
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Récupérer les produits depuis la base de données
        const { data: dbProducts, error } = await supabase
          .from('products')
          .select('*')
          .eq('active', true);
          
        if (error) {
          throw error;
        }
        
        if (!dbProducts || dbProducts.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }
        
        // Mapper les produits avec leurs liens et chemins
        const productsWithPaths = dbProducts.map(product => {
          // Déterminer le chemin de la page en fonction de l'ID du produit
          let pagePath = '';
          
          switch (product.id) {
            case '06abde70-7a00-4bf4-8628-0003b0a35f1d':
              pagePath = '/product';
              break;
            case '9d94b23d-b5b3-4537-b1fa-0a8ef8430856':
              pagePath = '/paypal-account';
              break;
            case 'f6a3cdb6-6fa5-4413-a431-2682d1a1003c':
              pagePath = '/capcut-pro';
              break;
            case 'a771934a-73f6-4c63-b3a9-2c63a8e59d9c':
              pagePath = '/fantasmes-couple';
              break;
            case '3d6a2f9b-a59d-4e23-9c1f-b9e2b5f88d1a':
              pagePath = '/penis-enlargement';
              break;
            case 'c1e7a9d3-8b4f-4c92-9a6e-5f1d2e3b4c5a':
              pagePath = '/tiktok-monetization';
              break;
            default:
              pagePath = '/product';
          }
          
          // Construire l'URL d'affiliation de base
          const baseUrl = `https://monet-dash-futur.lovable.app${pagePath}`;
          
          return {
            ...product,
            affiliate_link: baseUrl,
            page_path: pagePath
          };
        });
        
        if (!user) {
          setProducts(productsWithPaths);
          setLoading(false);
          return;
        }
        
        // Ajouter l'ID de l'utilisateur à chaque lien d'affiliation pour le tracking
        const productsWithUserLinks = productsWithPaths.map(product => {
          const separator = product.affiliate_link.includes('?') ? '&' : '?';
          const affiliateLink = `${product.affiliate_link}${separator}ref=${user.id}`;
          
          return {
            ...product,
            affiliate_link: affiliateLink
          };
        });
        
        // Méthode optimisée pour récupérer tous les compteurs de clics en une seule requête
        const fetchClickCounts = async () => {
          try {
            // 1. Récupérer tous les liens d'affiliation de l'utilisateur
            const { data: affiliateLinks, error: linksError } = await supabase
              .from('affiliate_links')
              .select('id, product_id')
              .eq('user_id', user.id);
              
            if (linksError) {
              console.error("Erreur lors de la récupération des liens d'affiliation:", linksError);
              return productsWithUserLinks.map(p => ({ ...p, clicks_count: 0 }));
            }
            
            if (!affiliateLinks || affiliateLinks.length === 0) {
              // Aucun lien n'existe encore, créer les liens pour chaque produit
              const createdLinks = [];
              for (const product of productsWithUserLinks) {
                const { data: newLink, error: createError } = await supabase
                  .from('affiliate_links')
                  .insert({
                    user_id: user.id,
                    product_id: product.id,
                    code: Math.random().toString(36).substring(2, 12)
                  })
                  .select('id, product_id')
                  .single();
                  
                if (!createError && newLink) {
                  createdLinks.push(newLink);
                }
              }
              
              if (createdLinks.length === 0) {
                return productsWithUserLinks.map(p => ({ ...p, clicks_count: 0 }));
              }
              
              // Utiliser les liens nouvellement créés
              const productToLinkMap = createdLinks.reduce((map, link) => {
                map[link.product_id] = link.id;
                return map;
              }, {});
              
              // Il n'y aura pas de clics pour les nouveaux liens
              return productsWithUserLinks.map(product => ({
                ...product,
                clicks_count: 0
              }));
            }
            
            // 2. Créer un mapping des IDs de produits vers leurs liens d'affiliation
            const productToLinkMap = affiliateLinks.reduce((map, link) => {
              map[link.product_id] = link.id;
              return map;
            }, {});
            
            // 3. Récupérer tous les clics pour tous les liens d'affiliation en une requête
            const linkIds = affiliateLinks.map(link => link.id);
            
            const { data: clicksData, error: clicksError } = await supabase
              .from('clicks')
              .select('affiliate_link_id, id')
              .in('affiliate_link_id', linkIds as string[])
              .eq('is_valid', true);
              
            if (clicksError) {
              console.error("Erreur lors de la récupération des compteurs de clics:", clicksError);
              return productsWithUserLinks.map(p => ({ ...p, clicks_count: 0 }));
            }
            
            // 4. Compter les clics par lien d'affiliation
            const clickCounts: Record<string, number> = {};
            if (clicksData && clicksData.length > 0) {
              clicksData.forEach(click => {
                if (!clickCounts[click.affiliate_link_id]) {
                  clickCounts[click.affiliate_link_id] = 0;
                }
                clickCounts[click.affiliate_link_id]++;
              });
            }
            
            // 5. Mettre à jour chaque produit avec son nombre de clics
            return productsWithUserLinks.map(product => {
              const affiliateLinkId = productToLinkMap[product.id];
              const clickCount = affiliateLinkId ? (clickCounts[affiliateLinkId] || 0) : 0;
              return {
                ...product,
                clicks_count: clickCount
              };
            });
          } catch (err) {
            console.error("Erreur lors du traitement des clics:", err);
            return productsWithUserLinks.map(p => ({ ...p, clicks_count: 0 }));
          }
        };
        
        // Exécuter la nouvelle méthode optimisée
        const productsWithClicks = await fetchClickCounts();
        setProducts(productsWithClicks);
        
        // Configurer un canal pour les mises à jour en temps réel
        const clicksChannel = supabase
          .channel('product-clicks')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public',
            table: 'clicks'
          }, payload => {
            console.log('Nouvelle mise à jour de clics détectée:', payload);
            // Actualiser les compteurs de clics
            fetchClickCounts().then(updatedProducts => {
              setProducts(updatedProducts);
            });
          })
          .subscribe();
        
        return () => {
          supabase.removeChannel(clicksChannel);
        };
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
