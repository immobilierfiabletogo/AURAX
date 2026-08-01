'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  BadgeCheck,
  Building2,
  Heart,
  MapPin,
  Zap,
} from 'lucide-react'

export interface Listing {
  id: string
  title: string
  price: number
  zone_saisie: string
  property_type: string
  transaction_type: string
  images_urls: string[]
  is_boosted: boolean
}

interface Props {
  listing: Listing
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-TG', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ListingCard({
  listing,
}: Props) {
  return (
    <Link
      href={`/biens/${listing.id}`}
      className="
        group
        overflow-hidden
        rounded-[32px]
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-emerald-200
        hover:shadow-2xl
      "
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

        {listing.images_urls?.[0] ? (
          <Image
            src={listing.images_urls[0]}
            alt={listing.title}
            fill
            sizes="(max-width:768px)100vw,(max-width:1280px)50vw,33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building2 className="h-14 w-14 text-slate-300" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        <div className="absolute left-5 top-5 flex gap-2">

          {listing.is_boosted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black text-slate-900 shadow-lg">
              <Zap className="h-3.5 w-3.5" />
              PREMIUM
            </span>
          )}

        </div>

        <span
          className={`
            absolute
            right-5
            top-5
            rounded-full
            px-3
            py-1
            text-[11px]
            font-bold

            ${
              listing.transaction_type === 'location'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-white'
            }
          `}
        >
          {listing.transaction_type === 'location'
            ? 'Location'
            : 'Vente'}
        </span>

        <button
          className="
            absolute
            bottom-5
            right-5
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-white/90
            backdrop-blur
            transition
            hover:scale-110
            hover:bg-white
          "
        >
          <Heart className="h-5 w-5 text-slate-500" />
        </button>

      </div>

      <div className="space-y-5 p-6">

        <div className="flex items-center justify-between">

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
            {listing.property_type}
          </span>

          {listing.is_boosted && (
            <BadgeCheck className="h-5 w-5 text-amber-500" />
          )}

        </div>

        <div>

          <div className="text-3xl font-black text-emerald-700">
            {formatPrice(listing.price)}
          </div>

          <h3 className="mt-3 line-clamp-2 text-xl font-black leading-snug text-slate-900 transition-colors group-hover:text-emerald-600">
            {listing.title}
          </h3>

        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <MapPin className="h-4 w-4 shrink-0" />

          <span className="line-clamp-1">
            {listing.zone_saisie}
          </span>

        </div>

      </div>

    </Link>
  )
}