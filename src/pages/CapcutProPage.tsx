
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTracking } from "@/hooks/useTracking";
import ProductProgressBar from "@/components/ProductProgressBar";
import EarningsCallToAction from "@/components/EarningsCallToAction";

const CapcutProPage = () => {
  const [clickCount, setClickCount] = useState(() => {
    const savedCount = localStorage.getItem("capcutProClickCount");
    return savedCount ? parseInt(savedCount) : 0;
  });
  const { toast } = useToast();
  const requiredClicks = 10;
  
  // Utiliser le hook de tracking pour enregistrer la visite via le lien d'affiliation
  // ID correspondant à "Capcut Pro à Vie" dans la base de données (format UUID)
  useTracking("f6a3cdb6-6fa5-4413-a431-2682d1a1003c");
  
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
    localStorage.setItem("capcutProClickCount", clickCount.toString());
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
        description: "Vous pouvez maintenant télécharger votre APK Capcut Pro.",
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
              <div className="relative flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg">
                <img 
                  src="https://orawin.fun/wp-content/uploads/2025/05/ChatGPT-Image-22-avr.-2025-22_20_13.png" 
                  alt="Capcut Pro à Vie" 
                  className="max-h-[500px] w-auto object-contain rounded-md shadow-md"
                />
              </div>
              
              {/* Détails du produit */}
              <div className="flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-purple-500 hover:bg-purple-600">APK</Badge>
                  </div>
                  
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                    Capcut Pro à Vie – Éditez vos vidéos comme un pro sans limites
                  </CardTitle>
                  
                  <CardDescription className="text-gray-700 text-base space-y-4">
                    <p>
                      Vous souhaitez créer des vidéos de qualité professionnelle directement sur votre smartphone ? 
                      Vous en avez assez des limitations de la version gratuite de Capcut ? Accédez dès maintenant 
                      à la version Capcut Pro avec notre fichier APK à télécharger.
                    </p>
                    
                    <div className="mt-4">
                      <p className="text-purple-600 font-semibold mb-2">🎥 Ce que vous obtiendrez :</p>
                      <ul className="space-y-2">
                        <li className="flex">
                          <span className="text-green-600 mr-2">✅</span> 
                          <span>Capcut Pro avec toutes les fonctionnalités premium débloquées.</span>
                        </li>
                        <li className="flex">
                          <span className="text-green-600 mr-2">✅</span> 
                          <span>Une installation facile et rapide sur votre appareil.</span>
                        </li>
                        <li className="flex">
                          <span className="text-green-600 mr-2">✅</span> 
                          <span>Aucune limite de durée ou de filigrane.</span>
                        </li>
                        <li className="flex">
                          <span className="text-green-600 mr-2">✅</span> 
                          <span>Des outils avancés pour éditer vos vidéos comme un professionnel.</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mt-4 p-4 bg-indigo-50 rounded-md border border-indigo-200">
                      <p className="font-semibold text-indigo-800">🚀 Bonus Exclusif</p>
                      <p className="text-indigo-700">
                        Une section sur les idées de contenu viral pour maximiser votre succès sur TikTok, Instagram et YouTube.
                      </p>
                    </div>
                    
                    <p className="mt-4">
                      Ne laissez plus les abonnements mensuels vous freiner. Prenez le contrôle de votre créativité avec Capcut Pro !
                    </p>
                  </CardDescription>
                </div>
                
                <div className="mt-8 space-y-4">
                  <ProductProgressBar currentCount={clickCount} requiredCount={requiredClicks} />
                  
                  <Button 
                    onClick={handleButtonClick}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-lg py-6"
                  >
                    {clickCount < requiredClicks 
                      ? "OBTENIR MAINTENANT" 
                      : (
                        <>
                          <Download className="mr-2" />
                          TÉLÉCHARGER L'APK
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

export default CapcutProPage;
