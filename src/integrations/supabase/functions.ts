
// Ce fichier contient les signatures et descriptions des fonctions RPC Supabase

export interface SupabaseFunctions {
  /**
   * Enregistre un clic sur un lien d'affiliation
   * @param _affiliate_link_id ID du produit affilié
   * @param _user_id ID de l'utilisateur affilié (facultatif)
   * @param _ip_address Adresse IP du visiteur (facultatif)
   * @param _user_agent Agent utilisateur du navigateur (facultatif)
   * @returns UUID du clic enregistré
   */
  record_affiliate_click: (_affiliate_link_id: string, _user_id: string | null, _ip_address: string | null, _user_agent: string | null) => Promise<string>;
  
  /**
   * Obtient les gains totaux d'un utilisateur affilié
   * @param user_id ID de l'utilisateur
   * @returns Montant total des gains en FCFA
   */
  get_affiliate_earnings: (user_id: string) => Promise<number>;
  
  /**
   * Obtient les gains hebdomadaires d'un utilisateur affilié
   * @param user_id ID de l'utilisateur
   * @returns Montant des gains hebdomadaires en FCFA
   */
  get_affiliate_weekly_earnings: (user_id: string) => Promise<number>;
}
