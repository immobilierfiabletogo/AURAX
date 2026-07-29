import { createClient } from "@/lib/supabase/server";

interface ListingStatRow {
  views: number | null;
  whatsapp_clicks: number | null;
  is_boosted: boolean | null;
}

interface StandListing {
  id: string;
  title: string;
  price: number;
  zone_saisie: string;
  images_urls: string[];
  is_boosted: boolean | null;
}

export class StandService {
  static async getStand(agencyId: string) {
    const supabase = await createClient();

    return supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        avatar_url,
        description,
        adresse,
        phone_number,
        website,
        plan
      `)
      .eq("id", agencyId)
      .single();
  }

  static async getListings(agencyId: string) {
    const supabase = await createClient();

    return supabase
      .from("listings")
      .select(`
        id,
        title,
        price,
        zone_saisie,
        property_type,
        images_urls,
        agent_id,
        views,
        whatsapp_clicks,
        is_boosted,
        created_at
      `)
      .eq("agent_id", agencyId)
      .eq("is_active", true)
      .order("created_at", {
        ascending: false,
      });
  }

  static async getStats(agencyId: string) {
    const supabase = await createClient();

    const { data } = await supabase
      .from("listings")
      .select("views, whatsapp_clicks, is_boosted")
      .eq("agent_id", agencyId)
      .eq("is_active", true);

    const listings: ListingStatRow[] = data ?? [];

    return {
      listings: listings.length,

      views: listings.reduce(
        (total, listing) => total + (listing.views ?? 0),
        0
      ),

      whatsapp: listings.reduce(
        (total, listing) => total + (listing.whatsapp_clicks ?? 0),
        0
      ),

      boosted: listings.filter(
        (listing) => listing.is_boosted
      ).length,
    };
  }

  static async getStandData(agencyId: string) {
    const [agencyResult, listingsResult, stats] = await Promise.all([
      this.getStand(agencyId),
      this.getListings(agencyId),
      this.getStats(agencyId),
    ]);

    if (agencyResult.error || !agencyResult.data) {
      return {
        agency: null,
        listings: [],
        stats: {
          ...stats,
          plan: "Gratuit",
        },
      };
    }

    const agencyData = agencyResult.data;
    const listingsData = listingsResult.data ?? [];

    const feed = (listingsData as StandListing[]).map((listing) => ({
      id: listing.id,
      title: listing.title,
      image: listing.images_urls?.[0] ?? "/images/placeholder.jpg",
      city: listing.zone_saisie,
      price: new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        maximumFractionDigits: 0,
      }).format(listing.price),

      agencyId: agencyData.id,
      agencyName: agencyData.full_name,
      agencyLogo: agencyData.avatar_url ?? undefined,
      agencyPlan: agencyData.plan ?? "Gratuit",

      boosted: listing.is_boosted ?? false,
    }));

    return {
      agency: agencyData,
      listings: feed,
      stats: {
        ...stats,
        plan: agencyData.plan ?? "Gratuit",
      },
    };
  }
}