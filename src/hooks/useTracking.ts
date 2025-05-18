
import { useEffect, useState } from "react";
import { getAffiliateParamsFromUrl, recordClick } from "@/services/trackingService";

/**
 * Hook pour gérer le suivi des clics sur les pages de produits
 * @param productId Identifiant du produit
 */
export const useTracking = (productId: string) => {
  const [isTracked, setIsTracked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const trackPageView = async () => {
      // Ne traquer qu'une seule fois par chargement de page
      if (isTracked || isProcessing) return;
      
      setIsProcessing(true);
      
      try {
        // Vérifier si l'utilisateur vient d'un lien d'affiliation
        const { refId } = getAffiliateParamsFromUrl();
        
        // Si un ID d'affilié est présent dans l'URL, enregistrer le clic
        if (refId) {
          const result = await recordClick(productId, refId);
          
          if (result.success) {
            setIsTracked(true);
            
            // Stocker en session que ce clic a déjà été comptabilisé
            sessionStorage.setItem(`tracked_${productId}_${refId}`, 'true');
          }
        }
      } catch (error) {
        console.error("Erreur lors du suivi de la page:", error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    trackPageView();
  }, [productId, isTracked, isProcessing]);
  
  return { isTracked };
};
