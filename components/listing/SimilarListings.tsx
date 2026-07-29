'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { Listing } from '@/types/listing'
import PropertyCard from '@/components/catalogue/PropertyCard'

interface Props {
  listings: Listing[]
}

export default function SimilarListings({
  listings,
}: Props) {
  if (listings.length === 0) {
    return (
      <section
        className="
          rounded-[32px]
          border
          border-slate-200
          bg-white
          p-10
          text-center
        "
      >
        <h2
          className="
            text-2xl
            font-black
            text-slate-900
          "
        >
          Aucun bien similaire
        </h2>

        <p
          className="
            mt-3
            text-slate-500
          "
        >
          D'autres annonces seront bientôt disponibles.
        </p>

        <Link
          href="/biens"
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            rounded-2xl
            bg-slate-900
            px-6
            py-3
            font-bold
            text-white
            transition
            hover:bg-black
          "
        >
          Explorer le catalogue

          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    )
  }

  return (
    <section
      className="
        space-y-8
        rounded-[36px]
        bg-slate-50
        p-2
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-slate-200
          pb-6
          md:flex-row
          md:items-end
          md:justify-between
        "
      >
        <div className="space-y-2">
          <span
            className="
              inline-flex
              rounded-full
              bg-emerald-100
              px-3
              py-1
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-emerald-700
            "
          >
            Recommandations
          </span>

          <h2
            className="
              text-3xl
              font-black
              tracking-tight
              text-slate-900
            "
          >
            Biens similaires
          </h2>

          <p
            className="
              max-w-2xl
              text-slate-500
            "
          >
            Nous avons sélectionné des biens ayant les mêmes
            caractéristiques afin de vous aider à comparer les
            meilleures opportunités.
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <span
            className="
              rounded-full
              bg-white
              px-4
              py-2
              text-sm
              font-bold
              text-slate-600
              shadow-sm
            "
          >
            {listings.length} annonce{listings.length > 1 ? 's' : ''}
          </span>

          <Link
            href="/biens"
            className="
              hidden
              items-center
              gap-2
              rounded-2xl
              bg-slate-900
              px-5
              py-3
              font-bold
              text-white
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-xl
              md:inline-flex
            "
          >
            Voir tout

            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {listings.map(listing => (
          <PropertyCard
            key={listing.id}
            listing={listing}
          />
        ))}
      </div>

      <div className="flex justify-center md:hidden">
        <Link
          href="/biens"
          className="
            inline-flex
            items-center
            gap-2
            rounded-2xl
            bg-slate-900
            px-6
            py-3
            font-bold
            text-white
            transition
            hover:bg-black
          "
        >
          Voir toutes les annonces

          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}