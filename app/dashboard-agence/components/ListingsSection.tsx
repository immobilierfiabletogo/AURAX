'use client'

import EmptyListings from './EmptyListings'
import ListingRow from '@/components/listings/ListingRow'
import ListingGrid from '@/components/listings/ListingGrid'

interface Listing {
  id: string
  title: string
  price: number
  zone_saisie: string
  property_type: string
  images_urls: string[]
  is_boosted: boolean
  boosted_until: string | null
  created_at: string
  whatsapp_clicks: number
  views: number
}

interface Props {
  listings: Listing[]
  view: 'liste' | 'grille'
  getStatus: (
    listing: Listing
  ) => 'actif' | 'expire' | 'en_attente'
  onDelete: (id: string) => void
}

export default function ListingsSection({
  listings,
  view,
  getStatus,
  onDelete,
}: Props) {
  if (!listings.length) {
    return <EmptyListings />
  }

  if (view === 'liste') {
    return (
      <div className="space-y-5">
        {listings.map((listing) => (
          <ListingRow
            key={listing.id}
            listing={listing}
            status={getStatus(listing)}
            onDelete={onDelete}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <ListingGrid
          key={listing.id}
          listing={listing}
          status={getStatus(listing)}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}