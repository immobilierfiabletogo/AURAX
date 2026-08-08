import { createClient } from "@/lib/supabase/server";

export type PlanCode = "pro" | "premium";

export class SubscriptionRepository {
  /**
   * Retourne les plans disponibles.
   *
   * L'architecture actuelle possède :
   * - PRO
   * - PREMIUM
   */
  static async getPlans() {
    const supabase = await createClient();

    return supabase
      .from("subscription_plans")
      .select("*")
      .in("code", ["pro", "premium"])
      .order("monthly_price");
  }

  /**
   * Retourne un plan par son code.
   */
  static async getPlanByCode(code: PlanCode) {
    const supabase = await createClient();

    return supabase
      .from("subscription_plans")
      .select("*")
      .eq("code", code)
      .single();
  }

  /**
   * Retourne l'abonnement actuel d'une agence.
   */
  static async getCurrentPlan(userId: string) {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .select(`
        plan,
        subscription_status,
        subscription_started_at,
        plan_expires_at,
        approved_at,
        verification_status
      `)
      .eq("id", userId)
      .single();
  }

  /**
   * Met à jour l'abonnement d'une agence.
   *
   * Cette méthode est utilisée après validation
   * d'un paiement par l'administrateur.
   *
   * Important :
   * - PRO actif → renouvellement PRO possible
   * - PREMIUM actif → renouvellement PREMIUM possible
   * - PRO → PREMIUM possible
   * - PREMIUM → PRO possible
   * - abonnement expiré → réactivation possible
   *
   * On retourne explicitement la ligne mise à jour
   * afin de détecter correctement les erreurs Supabase/RLS.
   */
  static async updatePlan(
    userId: string,
    plan: PlanCode,
    expiresAt: string | null,
    startedAt?: string | null,
    approvedAt?: string | null
  ) {
    const supabase = await createClient();

    const updateData = {
      plan,

      subscription_status: expiresAt
        ? "active"
        : "expired",

      subscription_started_at:
        startedAt ?? new Date().toISOString(),

      approved_at:
        approvedAt ?? new Date().toISOString(),

      plan_expires_at: expiresAt,
    };

    const result = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select(`
        id,
        plan,
        subscription_status,
        subscription_started_at,
        plan_expires_at,
        approved_at,
        verification_status
      `)
      .single();

    if (result.error) {
      console.error(
        "Erreur mise à jour abonnement :",
        result.error
      );
    }

    return result;
  }

  /**
   * Marque un abonnement comme expiré.
   *
   * Cette méthode est conservée pour les traitements
   * spécifiques d'expiration.
   */
  static async markSubscriptionExpired(
    userId: string
  ) {
    const supabase = await createClient();

    const result = await supabase
      .from("profiles")
      .update({
        subscription_status: "expired",
        plan_expires_at: null,
      })
      .eq("id", userId)
      .select(`
        id,
        plan,
        subscription_status,
        subscription_started_at,
        plan_expires_at,
        approved_at,
        verification_status
      `)
      .single();

    if (result.error) {
      console.error(
        "Erreur expiration abonnement :",
        result.error
      );
    }

    return result;
  }

  /**
   * Retourne le profil complet d'une agence.
   */
  static async getProfile(userId: string) {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
  }

  /**
   * Compte les annonces d'une agence.
   */
  static async countListings(userId: string) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("agent_id", userId);
  }

  /**
   * Compte les boosts utilisés pendant le mois courant.
   */
  static async countBoostsThisMonth(
    userId: string
  ) {
    const supabase = await createClient();

    const start = new Date();

    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    return supabase
      .from("listing_boosts")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("profile_id", userId)
      .gte(
        "created_at",
        start.toISOString()
      );
  }

  /**
   * Compte les demandes Premier réclamées
   * pendant le mois courant.
   */
  static async countClaimedRequestsThisMonth(
    userId: string
  ) {
    const supabase = await createClient();

    const start = new Date();

    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    return supabase
      .from("requests")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("claimed_by", userId)
      .gte(
        "claimed_at",
        start.toISOString()
      );
  }

  /**
   * Retourne l'utilisateur actuellement authentifié.
   */
  static async getAuthenticatedUser() {
    const supabase = await createClient();

    return supabase.auth.getUser();
  }
}