'use client'

import type { Listing, Profile } from '@/types'

import AgencyHero from './AgencyHero'
import PublicAgencyStats from './PublicAgencyStats'
import PublicAgencyAbout from './PublicAgencyAbout'
import PublicAgencySpecialties from './PublicAgencySpecialties'
import PublicAgencyCoverage from './PublicAgencyCoverage'
import PublicAgencyAdvantages from './PublicAgencyAdvantages'
import PublicAgencyTrustBanner from './PublicAgencyTrustBanner'
import PublicAgencyCTA from './PublicAgencyCTA'
import PublicAgencyShare from './PublicAgencyShare'
import PublicAgencyContactCard from './PublicAgencyContactCard'
import PublicAgencyProperties from './PublicAgencyProperties'

interface Props {
  agency: Profile
  listings: Listing[]
}

export default function PublicAgencyLayout({
  agency,
  listings,
}: Props) {
  const zones = Object.entries(
    listings.reduce<Record<string, number>>((acc, listing) => {
      const zone = listing.zone_saisie ?? 'Non renseigné'

      acc[zone] = (acc[zone] ?? 0) + 1

      return acc
    }, {})
  )
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  const propertyTypes = [
    ...new Set(
      listings
        .map((listing) => listing.property_type)
        .filter(Boolean)
        .map((type) => type!.toLowerCase())
    ),
  ]

  const transactionTypes = [
    ...new Set(
      listings
        .map((listing) => listing.transaction_type)
        .filter(Boolean)
        .map((type) => type!.toLowerCase())
    ),
  ]

  const totalViews = listings.reduce(
    (sum, listing) => sum + (listing.views ?? 0),
    0
  )

  const totalWhatsapp = listings.reduce(
    (sum, listing) => sum + (listing.whatsapp_clicks ?? 0),
    0
  )

  const boostedCount = listings.filter(
    (listing) => listing.is_boosted
  ).length

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8">

      <AgencyHero agency={agency} />

      <PublicAgencyStats
        listings={listings.length}
        views={totalViews}
        whatsapp={totalWhatsapp}
        boosted={boostedCount}
      />

      <PublicAgencyAbout
        description={agency.description}
        createdAt={agency.created_at}
      />

      <PublicAgencySpecialties
        propertyTypes={propertyTypes}
        transactionTypes={transactionTypes}
      />

      <PublicAgencyCoverage
        zones={zones}
      />

      <PublicAgencyAdvantages />

      <PublicAgencyTrustBanner
        listingsCount={listings.length}
      />

      <PublicAgencyCTA
        agencyId={agency.id}
        listingsCount={listings.length}
      />

      <PublicAgencyContactCard
        name={agency.full_name}
        phone={agency.phone_number ?? ""}
        address={agency.adresse}
        website={agency.website}
        verified={agency.verified ?? false}
      />

      <PublicAgencyShare
        agencyName={agency.full_name}
      />

      <PublicAgencyProperties
        listings={listings}
      />

    </main>
  )
}