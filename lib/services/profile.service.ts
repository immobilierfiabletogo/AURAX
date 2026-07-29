import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesUpdate } from "@/types/database";

export class ProfileService {
  static async getProfile(
    supabase: SupabaseClient<Database>,
    userId: string
  ) {
    return supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
  }

  static async updateProfile(
    supabase: SupabaseClient<Database>,
    userId: string,
    values: TablesUpdate<"profiles">
  ) {
    return supabase
      .from("profiles")
      .update(values)
      .eq("id", userId);
  }

  static async getPublicAgency(
    supabase: SupabaseClient<Database>,
    id: string
  ) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !profile || profile.user_type !== "agence") {
      return null;
    }

    const { data: listings } = await supabase
      .from("listings")
      .select("*")
      .eq("agent_id", profile.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    return {
      agency: profile,
      listings: listings ?? [],
    };
  }
}