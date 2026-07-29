'use client'

import PropertyCard from './PropertyCard'
import type { Listing } from '@/types/listing'

interface Props {
  listings: Listing[]
}

export default function SimilarProperties({
  listings,
}: Props) {

  if (listings.length === 0) return null

  return (

    <section className="mt-16">

      <div className="mb-6">

        <h2 className="text-2xl font-black text-slate-900">
          Vous pourriez aussi aimer
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Des biens similaires susceptibles de vous intéresser.
        </p>

      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {listings.map((listing) => (

          <PropertyCard
            key={listing.id}
            listing={listing}
          />

        ))}
      </div>

    </section>

  )
}