
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, ExternalLink, ClipboardCopy, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  affiliate_link?: string | null;
  clicks_count?: number;
  page_path?: string; // Chemin vers la page du produit
};

const Products = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingLink, setGeneratingLink] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Simuler le chargement des produits
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Produits spécifiques que nous avons créés
        const ourProducts = [
          {
            id: "paypal-account",
            name: "Comment créer un compte PayPal vérifié en Afrique",
            description: "Le guide complet pour sécuriser vos paiements en ligne",
            image_url: "https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-18-mai-2025-16_24_13.png",
            active: true,
            page_path: "/paypal-account"
          },
          {
            id: "capcut-pro",
            name: "Capcut Pro à Vie",
            description: "Éditez vos vidéos comme un pro sans limites",
            image_url: "https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-22-avr.-2025-22_20_13.png",
            active: true,
            page_path: "/capcut-pro"
          },
          {
            id: "fantasmes-couple",
            name: "100 Fantasmes à Explorer à Deux",
            description: "Redécouvrez Votre Complicité et Pimentez Votre Vie de Couple !",
            image_url: "https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-18-mai-2025-16_40_05.png",
            active: true,
            page_path: "/fantasmes-couple"
          },
          {
            id: "penis-enlargement",
            name: "Comment Agrandir Son Penis Naturellement",
            description: "Méthodes naturelles qui fonctionnent réellement",
            image_url: "https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-18-mai-2025-16_30_41.png",
            active: true,
            page_path: "/penis-enlargement"
          },
          {
            id: "tiktok-monetization",
            name: "Comment Monétiser ses Vidéos TikTok",
            description: "Gagnez de l'argent avec vos vidéos virales",
            image_url: "https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-22-avr.-2025-22_19_23.png",
            active: true,
            page_path: "/tiktok-monetization"
          }
        ];
        
        if (!user) {
          setProducts(ourProducts);
          setLoading(false);
          return;
        }
        
        // Charger les liens d'affiliation de l'utilisateur
        const { data: linksData, error: linksError } = await supabase
          .from('affiliate_links')
          .select('product_id, code, id')
          .eq('user_id', user.id);
          
        if (linksError) throw linksError;
        
        // Pour chaque lien, récupérer le nombre de clics
        const linksWithClicks = await Promise.all((linksData || []).map(async (link) => {
          const { count, error: clicksError } = await supabase
            .from('clicks')
            .select('*', { count: 'exact', head: true })
            .eq('affiliate_link_id', link.id);
            
          if (clicksError) console.error("Erreur lors du comptage des clics:", clicksError);
          
          return {
            ...link,
            clicks_count: count || 0
          };
        }));
        
        // Associer les liens d'affiliation aux produits
        const productsWithLinks = ourProducts.map((product) => {
          const link = linksWithClicks.find(l => l.product_id === product.id);
          return {
            ...product,
            affiliate_link: link ? link.code : null,
            clicks_count: link ? link.clicks_count : 0
          };
        });
        
        setProducts(productsWithLinks);
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
  
  // Générer un lien d'affiliation pour un produit
  const generateAffiliateLink = async (productId: string) => {
    if (!user) return;
    
    try {
      setGeneratingLink(prev => ({ ...prev, [productId]: true }));
      
      // Générer un code unique pour le lien d'affiliation
      const code = `${user.id.slice(0, 6)}-${productId.slice(0, 6)}-${Date.now().toString(36)}`;
      
      const { data, error } = await supabase
        .from('affiliate_links')
        .insert([
          { user_id: user.id, product_id: productId, code }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      // Mettre à jour le produit avec le nouveau lien d'affiliation
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, affiliate_link: code, clicks_count: 0 } : p
      ));
      
      toast({
        title: "Lien généré",
        description: "Votre lien d'affiliation a été créé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la génération du lien:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le lien d'affiliation",
        variant: "destructive"
      });
    } finally {
      setGeneratingLink(prev => ({ ...prev, [productId]: false }));
    }
  };
  
  // Copier le lien d'affiliation dans le presse-papiers
  const copyToClipboard = (code: string, productId: string) => {
    const affiliateUrl = `${window.location.origin}/aff/${code}`;
    navigator.clipboard.writeText(affiliateUrl)
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
              Générez des liens d'affiliation pour les produits ci-dessous et gagnez 1 FCFA par clic
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
                      {product.affiliate_link && (
                        <div className="text-sm text-muted-foreground mb-2">
                          Clics générés: <span className="font-semibold">{product.clicks_count}</span>
                          <span className="ml-2 text-primary font-medium">({product.clicks_count} FCFA)</span>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex flex-col gap-2">
                      {!product.affiliate_link ? (
                        <Button 
                          onClick={() => generateAffiliateLink(product.id)}
                          disabled={generatingLink[product.id]}
                          className="w-full"
                        >
                          {generatingLink[product.id] ? (
                            <span className="flex items-center">
                              <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                              Génération...
                            </span>
                          ) : (
                            <>
                              <Share2 className="mr-2 h-4 w-4" />
                              Générer un lien d'affiliation
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="w-full flex flex-col gap-2">
                          <div className="flex w-full h-10 rounded-md border border-input bg-transparent text-sm ring-offset-background overflow-hidden">
                            <span className="px-3 py-2 truncate flex-1">
                              {`${window.location.origin}/aff/${product.affiliate_link}`}
                            </span>
                            <Button 
                              variant="ghost" 
                              className="h-full aspect-square border-l"
                              onClick={() => copyToClipboard(product.affiliate_link!, product.id)}
                            >
                              {copied[product.id] ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <ClipboardCopy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                      
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
