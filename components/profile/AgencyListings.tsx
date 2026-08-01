'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowRight,
  BadgeCheck,
  Eye,
  MapPin,
  MessageCircle,
  Sparkles,
} from 'lucide-react'

import type { Listing } from '@/types'

interface AgencyListingsProps {
  listings: Listing[]
}

function formatPrice(price: number | null) {
  if (price === null) {
    return 'Prix sur demande'
  }

  return new Intl.NumberFormat('fr-TG', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function AgencyListings({
  listings,
}: AgencyListingsProps) {
  if (listings.length === 0) {
    return (
      <section
        className="
          relative
          overflow-hidden
          rounded-[34px]
          border
          border-slate-200/70
          bg-gradient-to-br
          from-white
          via-[#fbfbfa]
          to-[#f6f8f7]
          p-14
          text-center
          shadow-[0_18px_50px_rgba(15,23,42,.05)]
        "
      >
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative">

          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-gradient-to-br
              from-emerald-500
              to-emerald-700
              text-white
              shadow-lg
            "
          >
            <Sparkles className="h-9 w-9" />
          </div>

          <h2
            className="
              mt-8
              text-3xl
              font-black
              tracking-tight
              text-slate-950
            "
          >
            Aucun bien disponible
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-base
              leading-8
              text-slate-500
            "
          >
            Cette agence n'a pas encore publié de biens.
            Revenez prochainement pour découvrir ses
            nouvelles opportunités immobilières.
          </p>

        </div>

      </section>
    )
  }

  return (
    <section>

      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <span
            className="
              inline-flex
              rounded-full
              border
              border-emerald-200
              bg-emerald-50
              px-4
              py-2
              text-[11px]
              font-bold
              uppercase
              tracking-[0.30em]
              text-emerald-700
            "
          >
            Collection
          </span>

          <h2
            className="
              mt-5
              text-4xl
              font-black
              tracking-tight
              text-slate-950
            "
          >
            Les biens de cette agence
          </h2>

          <p
            className="
              mt-3
              max-w-2xl
              text-base
              leading-8
              text-slate-500
            "
          >
            Une sélection de biens soigneusement présentés,
            disponibles à la vente ou à la location partout
            au Togo.
          </p>

        </div>

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            px-8
            py-6
            shadow-sm
          "
        >

          <div className="text-5xl font-black tracking-tight text-slate-950">
            {listings.length}
          </div>

          <div className="mt-2 text-sm font-medium text-slate-500">
            biens disponibles
          </div>

        </div>

      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/biens/${listing.id}`}
            className="
              group
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-slate-200/70
              bg-white
              shadow-[0_12px_40px_rgba(15,23,42,.05)]
              transition-all
              duration-500
              hover:-translate-y-2
              hover:border-emerald-200
              hover:shadow-[0_30px_70px_rgba(16,185,129,.10)]
            "
          >
            {/* Glow */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-transparent
                via-transparent
                to-emerald-50/50
                opacity-0
                transition
                duration-500
                group-hover:opacity-100
              "
            />

            {/* Image */}

            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

              {listing.images_urls?.[0] ? (
                <Image
                  src={listing.images_urls[0]}
                  alt={listing.title}
                  fill
                  sizes="(max-width:768px)100vw,(max-width:1280px)50vw,33vw"
                  className="
                    object-cover
                    transition
                    duration-700
                    group-hover:scale-110
                  "
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Eye className="h-10 w-10 text-slate-300" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

              {listing.is_boosted && (
                <div className="absolute left-5 top-5">

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-gradient-to-r
                      from-amber-400
                      to-amber-500
                      px-4
                      py-2
                      text-[11px]
                      font-black
                      uppercase
                      tracking-wider
                      text-slate-950
                      shadow-lg
                    "
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Premium
                  </span>

                </div>
              )}

              {listing.transaction_type && (
                <span
                  className="
                    absolute
                    right-5
                    top-5
                    rounded-full
                    bg-white/90
                    px-4
                    py-2
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-900
                    backdrop-blur-xl
                  "
                >
                  {listing.transaction_type === 'location'
                    ? 'Location'
                    : 'Vente'}
                </span>
              )}

            </div>

            {/* Content */}

            <div className="relative p-7">

              <div className="text-3xl font-black tracking-tight text-slate-950">
                {formatPrice(listing.price)}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">

                <span
                  className="
                    rounded-full
                    bg-slate-100
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-slate-600
                  "
                >
                  {listing.property_type}
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-emerald-50
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-emerald-700
                  "
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Vérifié
                </span>

              </div>

              <h3
                className="
                  mt-5
                  line-clamp-2
                  text-xl
                  font-black
                  leading-snug
                  tracking-tight
                  text-slate-900
                  transition-colors
                  duration-300
                  group-hover:text-emerald-700
                "
              >
                {listing.title}
              </h3>

              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-slate-500
                "
              >
                <MapPin className="h-4 w-4 text-emerald-600" />

                <span>{listing.zone_saisie}</span>

              </div>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-6 text-sm text-slate-500">

                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-slate-400" />
                    {listing.views ?? 0}
                  </span>

                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    {listing.whatsapp_clicks ?? 0}
                  </span>

                </div>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-emerald-600
                    to-emerald-700
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:shadow-xl
                  "
                >
                  Voir le bien

                  <ArrowRight className="h-4 w-4" />

                </span>

              </div>

            </div>

          </Link>
        ))}

      </div>

    </section>
  )
}