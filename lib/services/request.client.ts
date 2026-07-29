import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";

type Request = Tables<"requests">;

export class RequestClientService {
  static async getRequests(): Promise<Request[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("is_active", true)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return data ?? [];
  }
}