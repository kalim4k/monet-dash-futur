
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductProgressBar from "@/components/ProductProgressBar";
import EarningsCallToAction from "@/components/EarningsCallToAction";

const TikTokMonetizationPage = () => {
  const [clickCount, setClickCount] = useState(() => {
    const savedCount = localStorage.getItem("tikTokClickCount");
    return savedCount ? parseInt(savedCount) : 0;
  });
  const { toast } = useToast();
  const requiredClicks = 10;
  
  // Liste des liens publicitaires dans l'ordre à suivre
  const adLinks = [
    "https://www.profitableratecpm.com/t7bwwufze?key=a6ddcb1a7d4c7d75c656937f3e87c741",
    "https://www.profitableratecpm.com/t9jb9smf?key=40443693c17abb2135e9b6e3738db2dd",
    "https://www.profitableratecpm.com/jbk2360sj?key=7fc034a14e94a1e760dfc819dc5eb505",
    "https://www.profitableratecpm.com/a5g3pzk5?key=13957d2a449284399821dbab142c2ec6",
    "https://www.profitableratecpm.com/f9wpvhtsp?key=c7f3c20856996296cad1ee564734ea79",
    "https://www.profitableratecpm.com/fju15epic?key=75c497855d00aad75ef1f883692e31fd",
    "https://airplaneprosperretreat.com/d1scx5uu50?key=e770636e59915c4077c34f1b2268f21f",
    "https://airplaneprosperretreat.com/mcfstgd3?key=ed327ddb2a8bda88f677ba69834be848",
    "https://www.profitableratecpm.com/wdzkexsc?key=5550131a782dd3cee62c7df164b486b6",
    "https://www.profitableratecpm.com/ba9iyq1q0?key=10129c444eaf02bdd8fa0e2316eac45a"
  ];

  // Lien final de téléchargement (à remplacer avec le vrai lien plus tard)
  const downloadLink = "#";
  
  useEffect(() => {
    // Sauvegarder le compteur dans le localStorage
    localStorage.setItem("tikTokClickCount", clickCount.toString());
  }, [clickCount]);
  
  const handleButtonClick = () => {
    // Si l'utilisateur n'a pas encore cliqué 10 fois
    if (clickCount < requiredClicks) {
      // Utiliser le lien correspondant à l'index actuel du compteur
      const selectedLink = adLinks[clickCount];
      
      // Augmenter le compteur
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      // Afficher un message indiquant le nombre de clics restants
      toast({
        title: "Accès en cours...",
        description: `Encore ${requiredClicks - newCount} clics pour accéder au téléchargement.`,
      });
      
      // Ouvrir le lien publicitaire dans un nouvel onglet
      window.open(selectedLink, "_blank");
    } else {
      // Si l'utilisateur a cliqué 10 fois, rediriger vers le lien de téléchargement
      window.open(downloadLink, "_blank");
      toast({
        title: "Félicitations !",
        description: "Vous pouvez maintenant télécharger votre ebook.",
      });
    }
  };
  
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container max-w-6xl py-6 px-4 sm:px-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image du produit */}
              <div className="relative flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg">
                <img 
                  src="https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-18-mai-2025-16_20_20.png" 
                  alt="Comment créer un compte TikTok monétisé" 
                  className="max-h-[500px] w-auto object-contain rounded-md shadow-md"
                />
              </div>
              
              {/* Détails du produit */}
              <div className="flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-red-500 hover:bg-red-600">Ebook</Badge>
                  </div>
                  
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                    Comment créer un compte TikTok monétisé en Afrique et gagner 300 000 FCFA par mois
                  </CardTitle>
                  
                  <CardDescription className="text-gray-700 text-base space-y-4">
                    <p>
                      Vous rêvez de gagner de l'argent avec TikTok en Afrique ? Vous souhaitez savoir comment créer un compte 
                      TikTok monétisé et toucher vos premiers revenus rapidement ? Cet ebook est fait pour vous !
                    </p>
                    
                    <div className="mt-4">
                      <p className="text-red-600 font-semibold mb-2">🚀 Ce que vous trouverez dans cet ebook :</p>
                      <ul className="space-y-2">
                        <li className="flex">
                          <span className="text-green-600 mr-2">✅</span> 
                          <span>Les étapes précises pour créer un compte TikTok monétisé depuis n'importe quel pays d'Afrique.</span>
                        </li>
                        <li className="flex">
                          <span className="text-green-600 mr-2">✅</span> 
                          <span>Les meilleures stratégies pour atteindre 300 000 FCFA par mois.</span>
                        </li>
                        <li className="flex">
                          <span className="text-green-600 mr-2">✅</span> 
                          <span>Les secrets des créateurs africains qui réussissent.</span>
                        </li>
                        <li className="flex">
                          <span className="text-green-600 mr-2">✅</span> 
                          <span>Comment configurer votre compte pour la monétisation et les astuces pour contourner les restrictions.</span>
                        </li>
                        <li className="flex">
                          <span className="text-green-600 mr-2">✅</span> 
                          <span>Des idées de contenu viral pour maximiser vos revenus.</span>
                        </li>
                        <li className="flex">
                          <span className="text-green-600 mr-2">✅</span> 
                          <span>Un guide pour optimiser vos vidéos et obtenir plus de vues.</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mt-4 p-4 bg-orange-50 rounded-md border border-orange-200">
                      <p className="font-semibold text-orange-800">💰 Bonus Exclusif</p>
                      <p className="text-orange-700">
                        Une section sur les partenariats, les collaborations et comment obtenir des sponsors sur TikTok.
                      </p>
                    </div>
                    
                    <p className="mt-4">
                      Ne laissez plus les autres gagner de l'argent pendant que vous regardez. Prenez le contrôle de votre avenir financier avec notre 
                      guide "Comment créer un compte TikTok monétisé en Afrique et gagner 300 000 FCFA par mois".
                    </p>
                  </CardDescription>
                </div>
                
                <div className="mt-8 space-y-4">
                  <ProductProgressBar currentCount={clickCount} requiredCount={requiredClicks} />
                  
                  <Button 
                    onClick={handleButtonClick}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-lg py-6"
                  >
                    {clickCount < requiredClicks 
                      ? "OBTENIR MAINTENANT" 
                      : (
                        <>
                          <Download className="mr-2" />
                          TÉLÉCHARGER L'EBOOK
                        </>
                      )
                    }
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Publicité pour inciter à l'inscription */}
          <EarningsCallToAction />
        </div>
      </main>
    </div>
  );
};

export default TikTokMonetizationPage;
