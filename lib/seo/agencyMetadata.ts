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
    `Découvrez les biens immobiliers proposés par ${agency.full_name} sur AURAX. ${listingsCount} annonce${
      listingsCount > 1 ? 's' : ''
    } actuellement disponible${
      listingsCount > 1 ? 's' : ''
    }.`

  const image =
    agency.cover_url ||
    agency.avatar_url ||
    '/images/aurax-og.jpg'

  return {
    title: `${agency.full_name} | Agence immobilière au Togo • AURAX`,

    description,

    keywords: [
      agency.full_name,
      'AURAX',
      'Immobilier',
      'Immobilier Togo',
      'Agence immobilière',
      'Agence immobilière Togo',
      'Maison à vendre',
      'Appartement',
      'Terrain',
      'Villa',
      'Location',
      'Vente',
      ...new Set(listings.map((listing) => listing.zone_saisie)),
      ...new Set(listings.map((listing) => listing.property_type)),
    ],

    openGraph: {
      title: `${agency.full_name} • AURAX`,
      description,
      url: `https://aurax.tg/stand/${agency.id}`,
      siteName: 'AURAX',
      locale: 'fr_FR',
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
      canonical: `https://aurax.tg/stand/${agency.id}`,
    },
  }
}