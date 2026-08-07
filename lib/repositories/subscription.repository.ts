import { createClient } from "@/lib/supabase/server";

export type PlanCode = "pro" | "premium";

export class SubscriptionRepository {
  static async getPlans() {
    const supabase = await createClient();

    return supabase
      .from("subscription_plans")
      .select("*")
      .in("code", ["pro", "premium"])
      .order("monthly_price");
  }

  static async getPlanByCode(code: PlanCode) {
    const supabase = await createClient();

    return supabase
      .from("subscription_plans")
      .select("*")
      .eq("code", code)
      .single();
  }

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

  static async updatePlan(
    userId: string,
    plan: PlanCode,
    expiresAt: string | null,
    startedAt?: string | null,
    approvedAt?: string | null
  ) {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .update({
        plan,
        subscription_status: expiresAt
          ? "active"
          : "expired",
        subscription_started_at:
          startedAt ?? new Date().toISOString(),
        approved_at:
          approvedAt ?? new Date().toISOString(),
        plan_expires_at: expiresAt,
      })
      .eq("id", userId);
  }

  static async markSubscriptionExpired(
    userId: string
  ) {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .update({
        subscription_status: "expired",
        plan_expires_at: null,
      })
      .eq("id", userId);
  }

  static async getProfile(userId: string) {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
  }

  static async countListings(userId: string) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("agent_id", userId)
      .eq("status", "approved");
  }

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

  static async getAuthenticatedUser() {
    const supabase = await createClient();

    return supabase.auth.getUser();
  }
}
