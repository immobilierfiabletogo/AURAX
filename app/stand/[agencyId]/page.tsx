import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import AgencyHero from "@/components/profile/AgencyHero";
import AgencyListings from "@/components/profile/AgencyListings";
import AgencyStats from "@/components/profile/AgencyStats";

import type { Listing, Profile } from "@/types";

interface Props {
  params: Promise<{
    agencyId: string;
  }>;
}

export default async function StandPage({ params }: Props) {
  const { agencyId } = await params;

  const supabase = await createClient();

  const { data: agency, error } = await supabase
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
      created_at,
      verified,
      response_rate,
      response_time,
      stand_score
    `)
    .eq("id", agencyId)
    .single();

  if (error || !agency) {
    notFound();
  }

  const { data: listings } = await supabase
    .from("listings")
    .select(`
      id,
      title,
      price,
      zone_saisie,
      property_type,
      transaction_type,
      images_urls,
      is_boosted,
      views,
      whatsapp_clicks,
      created_at
    `)
    .eq("agent_id", agency.id)
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  const agencyListings = (listings ?? []) as Listing[];

  const totalViews = agencyListings.reduce(
    (sum, listing) => sum + (listing.views ?? 0),
    0
  );

  const totalWhatsappClicks = agencyListings.reduce(
    (sum, listing) => sum + (listing.whatsapp_clicks ?? 0),
    0
  );

  const boostedListings = agencyListings.filter(
    (listing) => listing.is_boosted
  ).length;

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-10">
      <AgencyHero agency={agency as Profile} />

      <AgencyStats
        listings={agencyListings.length}
        totalViews={totalViews}
        totalWhatsappClicks={totalWhatsappClicks}
        boostedListings={boostedListings}
        responseRate={agency.response_rate}
        responseTime={agency.response_time}
        standScore={agency.stand_score}
        verified={agency.verified}
      />

      <AgencyListings listings={agencyListings} />
    </main>
  );
}