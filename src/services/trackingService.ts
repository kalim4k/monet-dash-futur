
import { supabase } from "@/integrations/supabase/client";

/**
 * Obtient ou crée un lien d'affiliation pour un utilisateur et un produit
 * @param productId Identifiant du produit
 * @param userId Identifiant de l'utilisateur affilié (optionnel)
 * @returns L'identifiant du lien d'affiliation ou null en cas d'erreur
 */
export const getOrCreateAffiliateLink = async (productId: string, userId?: string): Promise<string | null> => {
  try {
    // Si aucun ID utilisateur n'est fourni, utiliser un ID système par défaut
    const affiliateUserId = userId || "00000000-0000-0000-0000-000000000000"; // ID spécial pour le système
    
    console.log(`Création/récupération du lien d'affiliation pour le produit ${productId} et l'utilisateur ${affiliateUserId}`);
    
    // Appeler la fonction RPC pour obtenir ou créer un lien d'affiliation
    const { data: affiliateLinkId, error } = await supabase.rpc('get_or_create_affiliate_link', {
      _user_id: affiliateUserId,
      _product_id: productId
    });
    
    if (error) {
      console.error("Erreur lors de la récupération du lien d'affiliation:", error);
      return null;
    }
    
    console.log(`Lien d'affiliation obtenu: ${affiliateLinkId}`);
    return affiliateLinkId;
  } catch (err) {
    console.error("Exception lors de la récupération du lien d'affiliation:", err);
    return null;
  }
};

/**
 * Enregistre un clic sur un lien d'affiliation
 * @param affiliateLinkId Identifiant du lien d'affiliation
 * @param userId Identifiant de l'utilisateur qui a cliqué (optionnel)
 */
export const recordClick = async (affiliateLinkId: string, userId?: string) => {
  try {
    // Vérifier que l'ID du lien d'affiliation est fourni
    if (!affiliateLinkId) {
      console.error("Erreur: ID de lien d'affiliation manquant");
      return { success: false, error: "ID de lien d'affiliation manquant" };
    }
    
    // Obtenir les informations du navigateur pour enrichir les données de clic
    const userAgent = navigator.userAgent;
    
    console.log(`Enregistrement d'un clic pour le lien d'affiliation ${affiliateLinkId}`);

    // Appeler la fonction RPC pour enregistrer le clic
    const { data, error } = await supabase.rpc('record_affiliate_click', {
      _affiliate_link_id: affiliateLinkId,
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
