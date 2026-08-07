import { createClient } from "@/lib/supabase/server";
import type { ListingUpdate } from "@/types/listing";

export class ListingRepository {
  static async findAll() {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .select("*")
      .order("created_at", {
        ascending: false,
      });
  }

  static async findById(id: string) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();
  }

  static async findCatalog(
    page: number,
    search: string,
    pageSize = 12
  ) {
    const supabase = await createClient();

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("listings")
      .select(
        `
        *,
        profiles!listings_agent_id_fkey (
          id,
          full_name,
          avatar_url,
          plan
        )
        `,
        {
          count: "exact",
        }
      )
      .eq("is_active", true)
      .order("is_boosted", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    if (search.trim()) {
      const normalizedSearch = search
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      query = query.ilike(
        "zone_normalized",
        `%${normalizedSearch}%`
      );
    }

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    return {
      listings: data ?? [],
      total: count ?? 0,
      hasMore:
        from + (data?.length ?? 0) <
        (count ?? 0),
    };
  }

  static async findByAgent(agentId: string) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .select(
        `
        *,
        profiles!listings_agent_id_fkey (
          id,
          full_name,
          avatar_url,
          plan
        )
        `
      )
      .eq("agent_id", agentId)
      .order("created_at", {
        ascending: false,
      });
  }

  static async create(data: {
    title: string;
    description: string;
    price: number;
    property_type: string;
    transaction_type: string;
    zone_saisie: string;
    images_urls: string[];
    contact_phone: string | null;
    agent_id: string;
    is_active?: boolean;
  }) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .insert({
        title: data.title,
        description: data.description,
        price: data.price,
        property_type: data.property_type,
        transaction_type: data.transaction_type,
        zone_saisie: data.zone_saisie,
        images_urls: data.images_urls,
        contact_phone: data.contact_phone,
        agent_id: data.agent_id,

        // Les annonces sont publiées directement.
        is_active: true,
      })
      .select()
      .single();
  }

  static async update(
    id: string,
    data: ListingUpdate
  ) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .update(data)
      .eq("id", id)
      .select()
      .single();
  }

  static async delete(id: string) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .delete()
      .eq("id", id);
  }

  static async incrementViews(id: string) {
    const supabase = await createClient();

    return supabase.rpc("increment_views", {
      listing_id: id,
    });
  }

  static async incrementWhatsapp(id: string) {
    const supabase = await createClient();

    return supabase.rpc(
      "increment_whatsapp_clicks",
      {
        listing_id: id,
      }
    );
  }

  static async boostListing(
    listingId: string,
    expiresAt: string
  ) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .update({
        is_boosted: true,
        boosted_until: expiresAt,
      })
      .eq("id", listingId);
  }

  static async createBoost(data: {
    listing_id: string;
    profile_id: string;
    expires_at: string;
  }) {
    const supabase = await createClient();

    return supabase
      .from("listing_boosts")
      .insert({
        listing_id: data.listing_id,
        profile_id: data.profile_id,
        starts_at: new Date().toISOString(),
        expires_at: data.expires_at,
      })
      .select()
      .single();
  }

  static async unboostExpiredListings() {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .update({
        is_boosted: false,
        boosted_until: null,
      })
      .lt(
        "boosted_until",
        new Date().toISOString()
      )
      .eq("is_boosted", true);
  }

  static async findFeed() {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .select(
        `
        *,
        profiles!listings_agent_id_fkey (
          id,
          full_name,
          avatar_url,
          plan
        )
        `
      )
      .eq("is_active", true)
      .order("is_boosted", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });
  }

  static async findFeedPaginated(
    page: number,
    pageSize = 20
  ) {
    const supabase = await createClient();

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    return supabase
      .from("listings")
      .select(
        `
        *,
        profiles!listings_agent_id_fkey (
          id,
          full_name,
          avatar_url,
          plan
        )
        `,
        {
          count: "exact",
        }
      )
      .eq("is_active", true)
      .order("is_boosted", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);
  }

  static async findFeedByAgency(
    agentId: string
  ) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .select(
        `
        *,
        profiles!listings_agent_id_fkey (
          id,
          full_name,
          avatar_url,
          plan
        )
        `
      )
      .eq("agent_id", agentId)
      .eq("is_active", true)
      .order("is_boosted", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });
  }

  static async searchByAgency(
    agentId: string,
    search: string
  ) {
    const supabase = await createClient();

    let query = supabase
      .from("listings")
      .select("*")
      .eq("agent_id", agentId);

    if (search.trim()) {
      query = query.ilike(
        "title",
        `%${search.trim()}%`
      );
    }

    return query.order("created_at", {
      ascending: false,
    });
  }

  static async findAgent(agentId: string) {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        avatar_url,
        plan,
        phone_number,
        website,
        adresse,
        description
        `
      )
      .eq("id", agentId)
      .single();
  }

  static async findSimilar(
    transactionType: string,
    propertyType: string,
    listingId: string
  ) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .select("*")
      .eq(
        "transaction_type",
        transactionType
      )
      .eq(
        "property_type",
        propertyType
      )
      .eq("is_active", true)
      .neq("id", listingId)
      .order("is_boosted", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      })
      .limit(4);
  }

  static async findAgencyStats(
    agentId: string
  ) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .select(
        `
        id,
        views,
        whatsapp_clicks,
        is_boosted,
        created_at
        `
      )
      .eq("agent_id", agentId)
      .eq("is_active", true);
  }
}