
import { supabase } from "@/integrations/supabase/client";

/**
 * Enregistre directement un clic sur un produit
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
    
    // Obtenir les informations du navigateur et adresse IP pour enrichir les données de clic
    const userAgent = navigator.userAgent;
    
    console.log(`Enregistrement direct d'un clic pour le produit ${productId}`, {
      affiliateUserId,
      visitorUserId,
      userAgent
    });
    
    // Appeler la fonction RPC améliorée pour enregistrer le clic directement
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

/**
 * Récupère les statistiques de clics pour un utilisateur affilié
 * @param userId ID de l'utilisateur affilié
 * @returns Objet contenant les statistiques (total des clics, gains, etc.)
 */
export const getAffiliateStats = async (userId: string) => {
  try {
    if (!userId) {
      return { success: false, error: "ID d'utilisateur manquant" };
    }
    
    // Récupérer les liens d'affiliation de l'utilisateur
    const { data: affiliateLinks, error: linksError } = await supabase
      .from('affiliate_links')
      .select('id, product_id, total_clicks, earnings, products(name, image_url, payout_per_click)')
      .eq('user_id', userId);
      
    if (linksError) {
      console.error("Erreur lors de la récupération des liens d'affiliation:", linksError);
      return { success: false, error: linksError };
    }
    
    // Calculer les statistiques globales
    const totalClicks = affiliateLinks?.reduce((sum, link) => sum + (link.total_clicks || 0), 0) || 0;
    const totalEarnings = affiliateLinks?.reduce((sum, link) => sum + (link.earnings || 0), 0) || 0;
    
    // Obtenir les clics récents pour analyse
    const { data: recentClicks, error: clicksError } = await supabase
      .from('clicks')
      .select('id, clicked_at, is_valid, is_reviewed, affiliate_link_id, product_id')
      .in('affiliate_link_id', affiliateLinks?.map(link => link.id) || [])
      .order('clicked_at', { ascending: false })
      .limit(20);
      
    if (clicksError) {
      console.error("Erreur lors de la récupération des clics récents:", clicksError);
      return { 
        success: true, 
        affiliateLinks, 
        totalClicks, 
        totalEarnings,
        recentClicks: []
      };
    }
    
    return {
      success: true,
      affiliateLinks,
      totalClicks,
      totalEarnings,
      recentClicks
    };
  } catch (err) {
    console.error("Exception lors de la récupération des statistiques:", err);
    return { success: false, error: err };
  }
};

/**
 * Fonction pour réviser un clic (admin seulement)
 * @param clickId ID du clic à réviser
 * @param isValid Statut de validité à définir
 * @returns Un objet indiquant le succès ou l'échec de l'opération
 */
export const reviewClick = async (clickId: string, isValid: boolean) => {
  try {
    const { data, error } = await supabase
      .from('clicks')
      .update({ 
        is_valid: isValid,
        is_reviewed: true
      })
      .eq('id', clickId);
      
    if (error) {
      console.error("Erreur lors de la révision du clic:", error);
      return { success: false, error };
    }
    
    // Si le clic est invalidé et lié à un lien d'affiliation, ajuster les statistiques
    if (!isValid) {
      // Récupérer les informations du clic
      const { data: clickData } = await supabase
        .from('clicks')
        .select('affiliate_link_id, product_id')
        .eq('id', clickId)
        .single();
        
      if (clickData?.affiliate_link_id) {
        // Récupérer le produit pour obtenir le payout
        const { data: productData } = await supabase
          .from('products')
          .select('payout_per_click')
          .eq('id', clickData.product_id)
          .single();
          
        const payout = productData?.payout_per_click || 1;
        
        // Utiliser une approche mathématique directe au lieu de supabase.sql
        // Récupérer d'abord les valeurs actuelles
        const { data: currentLink } = await supabase
          .from('affiliate_links')
          .select('total_clicks, earnings')
          .eq('id', clickData.affiliate_link_id)
          .single();
        
        if (currentLink) {
          // Calculer les nouvelles valeurs
          const newTotalClicks = Math.max(0, (currentLink.total_clicks || 1) - 1);
          const newEarnings = Math.max(0, (currentLink.earnings || payout) - payout);
          
          // Mettre à jour avec les nouvelles valeurs
          await supabase
            .from('affiliate_links')
            .update({
              total_clicks: newTotalClicks,
              earnings: newEarnings
            })
            .eq('id', clickData.affiliate_link_id);
        }
      }
    }
    
    return { success: true };
  } catch (err) {
    console.error("Exception lors de la révision du clic:", err);
    return { success: false, error: err };
  }
};
