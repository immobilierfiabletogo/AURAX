import type { Metadata } from 'next'
import type { Listing, Profile } from '@/types'

interface Params {
  agency: Profile
  listings: Listing[]
}

export function buildAgencyMetadata({
  agency,
  listings,
}: Params): Metadata {
  const listingsCount = listings.length

  const description =
    agency.description?.trim() ||
    `${agency.full_name} propose ${listingsCount} bien${
      listingsCount > 1 ? 's' : ''
    } immobilier${
      listingsCount > 1 ? 's' : ''
    } sur AURAX.`

  const image =
    agency.avatar_url ||
    '/images/aurax-og.jpg'

  return {
    title: `${agency.full_name} | ${listingsCount} biens immobiliers sur AURAX`,

    description,

    keywords: [
      agency.full_name,
      'Agence immobilière',
      'Immobilier',
      'AURAX',
      ...new Set(listings.map((l) => l.zone_saisie)),
      ...new Set(listings.map((l) => l.property_type)),
    ],

    openGraph: {
      title: `${agency.full_name} • AURAX`,
      description,
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: agency.full_name,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${agency.full_name} • AURAX`,
      description,
      images: [image],
    },

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: `/agence/${agency.id}`,
    },
  }
}