'use client'

import ListingCard from '@/components/home/ListingCard'

interface Listing {
  id: string
  title: string
  price: number
  zone_saisie: string
  property_type: string
  transaction_type: string
  images_urls: string[]
  is_boosted: boolean
}

interface ListingsGridProps {
  listings: Listing[]
  loading: boolean
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 text-center">
      <h3 className="text-lg font-semibold text-slate-700">
        Aucun bien trouvé
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Essayez de modifier votre recherche.
      </p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border bg-white">
      <div className="aspect-[4/3] bg-slate-200" />

      <div className="space-y-3 p-4">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="h-5 rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />

        <div className="flex justify-between pt-3">
          <div className="h-5 w-24 rounded bg-slate-200" />
          <div className="h-4 w-16 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

export default function ListingsGrid({
  listings,
  loading,
}: ListingsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (!listings.length) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
        />
      ))}
    </div>
  )
}