import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function createAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL est manquante."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY est manquante."
    );
  }

  return createClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export class NotificationRepository {
  /**
   * Crée une notification système.
   *
   * Cette opération est exécutée côté serveur
   * avec la clé service_role.
   *
   * IMPORTANT :
   * SUPABASE_SERVICE_ROLE_KEY ne doit JAMAIS
   * être utilisée côté client.
   */
  static async create(data: {
    agency_id: string;
    type: string;
    message: string;
    listing_id?: string | null;
  }) {
    const supabase = createAdminClient();

    return supabase
      .from("notifications")
      .insert({
        agency_id: data.agency_id,
        type: data.type,
        message: data.message,
        listing_id:
          data.listing_id ?? null,
        is_read: false,
      })
      .select()
      .single();
  }

  /**
   * Récupère les notifications d'une agence.
   *
   * Cette méthode peut utiliser le client serveur
   * normal puisqu'elle est appelée pour une agence.
   */
  static async findByUser(
    agencyId: string
  ) {
    const supabase = createAdminClient();

    return supabase
      .from("notifications")
      .select("*")
      .eq("agency_id", agencyId)
      .order("created_at", {
        ascending: false,
      });
  }

  /**
   * Marque une notification comme lue.
   */
  static async markAsRead(id: string) {
    const supabase = createAdminClient();

    return supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("id", id);
  }

  /**
   * Marque toutes les notifications
   * d'une agence comme lues.
   */
  static async markAllAsRead(
    agencyId: string
  ) {
    const supabase = createAdminClient();

    return supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("agency_id", agencyId)
      .eq("is_read", false);
  }
}