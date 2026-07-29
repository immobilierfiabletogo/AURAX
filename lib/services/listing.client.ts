import { createClient } from "@/lib/supabase/client";

const PAGE_SIZE = 12;

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export class ListingClientService {
  static async getCatalog(
    page: number,
    search: string
  ) {
    const supabase = createClient();

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

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
      .eq("status", "approved")
      .order("is_boosted", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    if (search.trim()) {
      query = query.ilike(
        "zone_normalized",
        `%${normalize(search)}%`
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

  static async getListing(id: string) {
    const supabase = createClient();

    return supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();
  }

  static async getAgency(agentId: string) {
  const supabase = createClient();

  return supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      avatar_url,
      cover_url,
      description,
      phone_number,
      website,
      adresse,
      plan,
      verified,
      created_at
    `)
    .eq("id", agentId)
    .single();
}

  static async getSimilar(
    transactionType: string,
    propertyType: string,
    listingId: string
  ) {
    const supabase = createClient();

    return supabase
      .from("listings")
      .select("*")
      .eq("transaction_type", transactionType)
      .eq("property_type", propertyType)
      .eq("is_active", true)
      .neq("id", listingId)
      .limit(4);
  }

  static async getListingPage(id: string) {
    await this.incrementViews(id);

    const { data: listing, error } =
      await this.getListing(id);

    if (error || !listing) {
      return null;
    }

    const [{ data: agency }, { data: similar }] =
      await Promise.all([
        this.getAgency(listing.agent_id),
        this.getSimilar(
          listing.transaction_type,
          listing.property_type,
          listing.id
        ),
      ]);

    return {
      listing,
      agency,
      similarListings: similar ?? [],
      telephone:
        agency?.phone_number ??
        listing.contact_phone ??
        "+22879963708",
    };
  }

  static async incrementViews(id: string) {
    const supabase = createClient();

    return supabase.rpc("increment_views", {
      listing_id: id,
    });
  }

  static async incrementWhatsapp(id: string) {
    const supabase = createClient();

    return supabase.rpc(
      "increment_whatsapp_clicks",
      {
        listing_id: id,
      }
    );
  }
}