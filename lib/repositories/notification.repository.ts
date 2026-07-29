import { createClient } from "@/lib/supabase/server";

export class NotificationRepository {
  static async create(data: {
    agency_id: string;
    type: string;
    message: string;
    listing_id?: string | null;
  }) {
    const supabase = await createClient();

    return supabase
      .from("notifications")
      .insert({
        agency_id: data.agency_id,
        type: data.type,
        message: data.message,
        listing_id: data.listing_id ?? null,
        is_read: false,
      });
  }

  static async findByUser(agencyId: string) {
    const supabase = await createClient();

    return supabase
      .from("notifications")
      .select("*")
      .eq("agency_id", agencyId)
      .order("created_at", {
        ascending: false,
      });
  }

  static async markAsRead(id: string) {
    const supabase = await createClient();

    return supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("id", id);
  }

  static async markAllAsRead(agencyId: string) {
    const supabase = await createClient();

    return supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("agency_id", agencyId)
      .eq("is_read", false);
  }
}