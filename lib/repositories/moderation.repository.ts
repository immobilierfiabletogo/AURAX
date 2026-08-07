import { createClient } from "@/lib/supabase/server";

export class ModerationRepository {
  static async getPendingAgencies() {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .select("*")
      .eq("user_type", "agence")
      .eq("verification_status", "pending")
      .order("created_at", {
        ascending: false,
      });
  }

  static async approveAgency(
    agencyId: string,
    adminId: string
  ) {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .update({
        verification_status: "approved",
        verified: true,
        verified_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
        verified_by: adminId,
      })
      .eq("id", agencyId)
      .select()
      .single();
  }

  static async rejectAgency(
    agencyId: string
  ) {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .update({
        verification_status: "rejected",
        verified: false,
      })
      .eq("id", agencyId)
      .select()
      .single();
  }

  static async getAgency(
    agencyId: string
  ) {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .select("*")
      .eq("id", agencyId)
      .single();
  }
}