'use client'

import ListingCard from '@/components/home/ListingCard'
import { Building2 } from 'lucide-react'

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
    <section className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <Building2 className="h-10 w-10 text-slate-400" />
      </div>

      <h3 className="mt-6 text-2xl font-black text-slate-900">
        Aucun bien trouvé
      </h3>

      <p className="mx-auto mt-3 max-w-md text-slate-500">
        Aucun bien ne correspond à votre recherche.
        Essayez un autre quartier, une autre ville ou
        supprimez les filtres.
      </p>

    </section>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

      <div className="aspect-[4/3] animate-pulse bg-slate-200" />

      <div className="space-y-4 p-5">

        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

        <div className="h-6 w-full animate-pulse rounded bg-slate-200" />

        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

        <div className="flex justify-between pt-4">

          <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />

          <div className="h-5 w-16 animate-pulse rounded bg-slate-200" />

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
      <section>

        <div className="mb-8 flex items-end justify-between">

          <div>

            <h2 className="text-3xl font-black text-slate-900">
              Les dernières annonces
            </h2>

            <p className="mt-2 text-slate-500">
              Chargement des biens...
            </p>

          </div>

        </div>

        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}

        </div>

      </section>
    )
  }

  if (!listings.length) {
    return <EmptyState />
  }

  return (
    <section>

      <div className="mb-8 flex items-end justify-between">

        <div>

          <h2 className="text-3xl font-black text-slate-900">
            Dernières annonces
          </h2>

          <p className="mt-2 text-slate-500">
            Découvrez les biens les plus récents publiés sur AURAX.
          </p>

        </div>

      </div>

      <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
          />
        ))}

      </div>

    </section>
  )
}