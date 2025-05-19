
import { useEffect, useState, useCallback } from "react";
import { getAffiliateParamsFromUrl, recordProductClick } from "@/services/trackingService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

/**
 * Hook pour gérer le suivi des clics sur les pages de produits
 * @param productId Identifiant du produit
 */
export const useTracking = (productId: string) => {
  const [isTracked, setIsTracked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Fonction pour tracer manuellement un clic (utile pour les boutons d'action)
  const trackClick = useCallback(async () => {
    if (isProcessing || !productId) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Vérifier si l'utilisateur vient d'un lien d'affiliation
      const { refId } = getAffiliateParamsFromUrl();
      
      // Utiliser l'ID affilié de l'URL si présent
      const affiliateUserId = refId || null;
      console.log(`Traitement manuel du clic pour le produit ${productId}${affiliateUserId ? ` référé par ${affiliateUserId}` : ' (visite directe)'}`);
      
      // Enregistrer directement le clic sur le produit
      const result = await recordProductClick(
        productId,
        affiliateUserId,
        user?.id
      );
      
      if (result.success) {
        console.log("Clic comptabilisé avec succès");
        setIsTracked(true);
        
        toast({
          title: "Merci de votre intérêt!",
          description: "Votre clic a été enregistré.",
          variant: "default"
        });
      } else {
        if (result.error === "Duplicate click") {
          console.log("Ce clic a déjà été comptabilisé récemment");
          setIsTracked(true);
        } else {
          console.error("Échec de l'enregistrement du clic:", result.error);
          setError(typeof result.error === 'string' ? result.error : 'Erreur lors de l\'enregistrement du clic');
          
          // Afficher une notification d'erreur seulement pour les erreurs techniques, pas pour les clics dupliqués
          if (result.error !== "Bot detected" && result.error !== "Duplicate click") {
            toast({
              title: "Erreur",
              description: "Impossible d'enregistrer votre interaction.",
              variant: "destructive"
            });
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors du suivi du clic:", error);
      setError(typeof error === 'string' ? error : 'Erreur inconnue');
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre interaction.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [productId, user, isProcessing]);
  
  useEffect(() => {
    const trackPageView = async () => {
      // Ne traquer qu'une seule fois par chargement de page et seulement si un ID de produit valide est fourni
      if (isTracked || isProcessing || !productId) return;
      
      setIsProcessing(true);
      
      try {
        // Vérifier si l'utilisateur vient d'un lien d'affiliation
        const { refId } = getAffiliateParamsFromUrl();
        
        // Utiliser l'ID affilié de l'URL si présent
        const affiliateUserId = refId || null;
        console.log(`Traitement automatique du clic pour le produit ${productId}${affiliateUserId ? ` référé par ${affiliateUserId}` : ' (visite directe)'}`);
        
        // Vérifier si le clic n'a pas déjà été traité dans cette session (par page vue)
        const trackingKey = `tracked_${productId}_${affiliateUserId || 'direct'}`;
        if (sessionStorage.getItem(trackingKey)) {
          console.log("Cette page vue a déjà été comptabilisée dans cette session");
          setIsTracked(true);
          setIsProcessing(false);
          return;
        }
        
        // Enregistrer directement le clic sur le produit
        const result = await recordProductClick(
          productId,
          affiliateUserId,
          user?.id
        );
        
        if (result.success) {
          console.log("Page vue comptabilisée avec succès");
          setIsTracked(true);
          
          // Stocker en session que cette page vue a déjà été comptabilisée
          sessionStorage.setItem(trackingKey, 'true');
        } else {
          if (result.error === "Duplicate click" || result.error === "Bot detected") {
            // Ne pas afficher d'erreur pour les cas normaux de filtrage
            console.log(`Page vue non comptabilisée: ${result.error}`);
            setIsTracked(true);
          } else {
            console.error("Échec de l'enregistrement de la page vue:", result.error);
            setError(typeof result.error === 'string' ? result.error : 'Erreur lors de l\'enregistrement de la page vue');
          }
        }
      } catch (error) {
        console.error("Erreur lors du suivi de la page:", error);
        setError(typeof error === 'string' ? error : 'Erreur inconnue');
      } finally {
        setIsProcessing(false);
      }
    };
    
    trackPageView();
  }, [productId, isTracked, isProcessing, user]);
  
  return { isTracked, isProcessing, error, trackClick };
};
