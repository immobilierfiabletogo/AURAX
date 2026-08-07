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

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("profiles")
      .update({
        verification_status: "approved",
        verified: true,
        verified_at: now,
        approved_at: now,
        verified_by: adminId,
      })
      .eq("id", agencyId)
      .eq("user_type", "agence")
      .select("id, full_name, verification_status")
      .maybeSingle();

    if (error) {
      console.error(
        "[ModerationRepository] approveAgency:",
        error
      );

      return {
        data: null,
        error,
      };
    }

    if (!data) {
      return {
        data: null,
        error: {
          message:
            "Impossible d'approuver cette agence. Aucune ligne n'a été modifiée. Vérifiez les permissions RLS de la table profiles.",
          code: "AGENCY_NOT_UPDATED",
        },
      };
    }

    return {
      data,
      error: null,
    };
  }

  static async rejectAgency(
    agencyId: string
  ) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .update({
        verification_status: "rejected",
        verified: false,
      })
      .eq("id", agencyId)
      .eq("user_type", "agence")
      .select("id, full_name, verification_status")
      .maybeSingle();

    if (error) {
      console.error(
        "[ModerationRepository] rejectAgency:",
        error
      );

      return {
        data: null,
        error,
      };
    }

    if (!data) {
      return {
        data: null,
        error: {
          message:
            "Impossible de refuser cette agence. Aucune ligne n'a été modifiée. Vérifiez les permissions RLS de la table profiles.",
          code: "AGENCY_NOT_UPDATED",
        },
      };
    }

    return {
      data,
      error: null,
    };
  }

  static async getAgency(
    agencyId: string
  ) {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .select("*")
      .eq("id", agencyId)
      .maybeSingle();
  }
}