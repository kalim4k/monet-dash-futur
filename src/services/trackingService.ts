
import { supabase } from "@/integrations/supabase/client";

/**
 * Enregistre directement un clic sur un produit sans utiliser la table d'affiliation
 * @param productId Identifiant du produit
 * @param affiliateUserId Identifiant de l'utilisateur affilié (optionnel)
 * @param visitorUserId Identifiant de l'utilisateur qui visite la page (optionnel)
 * @returns Un objet indiquant le succès ou l'échec de l'opération
 */
export const recordProductClick = async (
  productId: string, 
  affiliateUserId?: string, 
  visitorUserId?: string
) => {
  try {
    if (!productId) {
      console.error("Erreur: ID de produit manquant");
      return { success: false, error: "ID de produit manquant" };
    }
    
    // Obtenir les informations du navigateur pour enrichir les données de clic
    const userAgent = navigator.userAgent;
    
    console.log(`Enregistrement direct d'un clic pour le produit ${productId}`);
    
    // Appeler la fonction RPC pour enregistrer le clic directement
    const { data, error } = await supabase.rpc('record_product_click', {
      _product_id: productId,
      _affiliate_user_id: affiliateUserId || null,
      _visitor_user_id: visitorUserId || null,
      _user_agent: userAgent
    });
    
    if (error) {
      console.error("Erreur lors de l'enregistrement du clic:", error);
      return { success: false, error };
    }
    
    console.log("Clic enregistré avec succès:", data);
    return { success: true, clickId: data };
  } catch (err) {
    console.error("Exception lors de l'enregistrement du clic:", err);
    return { success: false, error: err };
  }
};

/**
 * Extrait les paramètres de référencement d'une URL
 * @returns Objet contenant les paramètres d'affiliation
 */
export const getAffiliateParamsFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const refId = urlParams.get('ref');
  
  return {
    refId
  };
};
