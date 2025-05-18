
import { supabase } from "@/integrations/supabase/client";

/**
 * Enregistre un clic sur un lien d'affiliation
 * @param affiliateId Identifiant du lien d'affiliation
 * @param userId Identifiant de l'utilisateur affilié (optionnel)
 */
export const recordClick = async (affiliateId: string, userId?: string) => {
  try {
    // Obtenir les informations du navigateur pour enrichir les données de clic
    const userAgent = navigator.userAgent;
    
    console.log(`Enregistrement d'un clic pour le produit ${affiliateId} par l'utilisateur ${userId || 'anonyme'}`);

    // Appeler la fonction RPC pour enregistrer le clic
    const { data, error } = await supabase.rpc('record_affiliate_click', {
      _affiliate_link_id: affiliateId,
      _user_id: userId || null,
      _ip_address: null, // Pour des raisons de confidentialité, ne pas stocker l'IP côté client
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
