import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type RequestInsert =
  Database["public"]["Tables"]["requests"]["Insert"];

type RequestUpdate =
  Database["public"]["Tables"]["requests"]["Update"];

export class RequestRepository {
  static async findAll(
    search = "",
    type = ""
  ) {
    const supabase = await createClient();

    let query = supabase
      .from("requests")
      .select("*")
      .eq("is_active", true);

    if (search.trim()) {
      query = query.or(
        [
          `description.ilike.%${search}%`,
          `quartier.ilike.%${search}%`,
          `type.ilike.%${search}%`,
        ].join(",")
      );
    }

    if (type.trim()) {
      query = query.eq("type", type);
    }

    return query.order("created_at", {
      ascending: false,
    });
  }

  static async findById(id: string) {
    const supabase = await createClient();

    return supabase
      .from("requests")
      .select("*")
      .eq("id", id)
      .single();
  }

  static async create(data: RequestInsert) {
    const supabase = await createClient();

    return supabase
      .from("requests")
      .insert(data)
      .select()
      .single();
  }

  static async update(
    id: string,
    data: RequestUpdate
  ) {
    const supabase = await createClient();

    return supabase
      .from("requests")
      .update(data)
      .eq("id", id)
      .select()
      .single();
  }

  static async delete(id: string) {
    const supabase = await createClient();

    return supabase
      .from("requests")
      .delete()
      .eq("id", id);
  }
}