
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Liste des user-agents connus pour être des bots
 */
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'googlebot', 'bingbot', 'slurp',
  'duckduckbot', 'baiduspider', 'yandexbot', 'sogou', 'exabot',
  'facebookexternalhit', 'ia_archiver'
];

/**
 * Vérifie si l'utilisateur est probablement un bot basé sur son user agent
 * @param userAgent Le user agent du navigateur
 * @returns True si c'est probablement un bot, false sinon
 */
export const isLikelyBot = (userAgent: string): boolean => {
  const lowerCaseUA = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(botUA => lowerCaseUA.includes(botUA));
};

/**
 * Enregistre un clic sur un produit avec des mécanismes anti-fraude
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
    
    // Vérifier que l'ID du produit est un UUID valide
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      console.error(`Erreur: ID de produit invalide (${productId})`);
      return { success: false, error: "ID de produit invalide" };
    }
    
    // Obtenir les informations du navigateur pour enrichir les données de clic
    const userAgent = navigator.userAgent;
    
    // Vérifier si c'est un bot
    if (isLikelyBot(userAgent)) {
      console.warn("Clic détecté comme provenant d'un bot, ignoré");
      return { success: false, error: "Bot detected" };
    }
    
    console.log(`Enregistrement d'un clic pour le produit ${productId}${affiliateUserId ? ` via l'affilié ${affiliateUserId}` : ''}`);
    
    // Vérifier si ce visiteur a déjà cliqué sur ce produit récemment (dans la session)
    const sessionKey = `click_${productId}_${affiliateUserId || 'direct'}_time`;
    const lastClickTime = sessionStorage.getItem(sessionKey);
    
    if (lastClickTime) {
      const hoursSinceLastClick = (Date.now() - parseInt(lastClickTime)) / (1000 * 60 * 60);
      
      // Si le dernier clic date de moins de 24h, ne pas enregistrer un nouveau clic
      if (hoursSinceLastClick < 24) {
        console.log(`Clic ignoré: ce visiteur a déjà cliqué sur ce produit il y a ${hoursSinceLastClick.toFixed(2)} heures`);
        return { success: false, error: "Duplicate click" };
      }
    }
    
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
    
    // Enregistrer le timestamp du clic dans sessionStorage pour éviter les clics dupliqués
    sessionStorage.setItem(sessionKey, Date.now().toString());
    
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

/**
 * Récupère l'historique des clics pour un utilisateur donné
 * @param userId ID de l'utilisateur
 * @returns Un objet contenant les clics ou une erreur
 */
export const getUserClicksHistory = async (userId: string) => {
  try {
    if (!userId) {
      return { success: false, error: "ID utilisateur manquant" };
    }
    
    // Récupérer les clics où cet utilisateur est l'affilié
    const { data, error } = await supabase
      .from('clicks')
      .select(`
        id,
        clicked_at,
        is_valid,
        product:product_id (name, image_url)
      `)
      .eq('affiliate_link_id', userId)
      .order('clicked_at', { ascending: false });
      
    if (error) {
      console.error("Erreur lors de la récupération de l'historique des clics:", error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error("Exception lors de la récupération de l'historique des clics:", err);
    return { success: false, error: err };
  }
};
