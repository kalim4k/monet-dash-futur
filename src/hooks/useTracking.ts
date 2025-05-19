
import { useEffect, useState } from "react";
import { getAffiliateParamsFromUrl, recordProductClick } from "@/services/trackingService";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook pour gérer le suivi des clics sur les pages de produits
 * @param productId Identifiant du produit
 */
export const useTracking = (productId: string) => {
  const [isTracked, setIsTracked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const trackPageView = async () => {
      // Ne traquer qu'une seule fois par chargement de page
      if (isTracked || isProcessing) return;
      
      setIsProcessing(true);
      
      try {
        // Vérifier si l'utilisateur vient d'un lien d'affiliation
        const { refId } = getAffiliateParamsFromUrl();
        
        // Utiliser l'ID affilié de l'URL si présent
        const affiliateUserId = refId || null;
        console.log(`Traitement du clic pour le produit ${productId}${affiliateUserId ? ` référé par ${affiliateUserId}` : ' (visite directe)'}`);
        
        // Vérifier si le clic n'a pas déjà été traité dans cette session
        const trackingKey = `tracked_${productId}_${affiliateUserId || 'direct'}`;
        if (sessionStorage.getItem(trackingKey)) {
          console.log("Ce clic a déjà été comptabilisé dans cette session");
          setIsTracked(true);
          setIsProcessing(false);
          return;
        }
        
        // Ajouter plus de logs pour le débogage
        console.log("Données de tracking:", {
          productId,
          affiliateUserId,
          visitorUserId: user?.id
        });
        
        // Enregistrer directement le clic sur le produit
        const result = await recordProductClick(
          productId,
          affiliateUserId,
          user?.id
        );
        
        if (result.success) {
          console.log("Clic comptabilisé avec succès:", result);
          setIsTracked(true);
          
          // Stocker en session que ce clic a déjà été comptabilisé
          sessionStorage.setItem(trackingKey, 'true');
        } else {
          console.error("Échec de l'enregistrement du clic:", result.error);
        }
      } catch (error) {
        console.error("Erreur lors du suivi de la page:", error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    // Exécuter le tracking uniquement si productId est valide
    if (productId) {
      console.log("Initialisation du tracking pour le produit:", productId);
      trackPageView();
    } else {
      console.error("ID de produit invalide pour le tracking");
    }
  }, [productId, isTracked, isProcessing, user]);
  
  return { isTracked };
};
