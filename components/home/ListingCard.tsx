'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Home, MapPin, Zap } from 'lucide-react'

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

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-TG', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price)
}

interface Props {
  listing: Listing
}

export default function ListingCard({ listing }: Props) {
  return (
    <Link
      href={`/biens/${listing.id}`}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        listing.is_boosted
          ? 'border-amber-300'
          : 'border-slate-100'
      }`}
    >
      <div
        className="relative overflow-hidden bg-slate-100"
        style={{ aspectRatio: '4 / 3' }}
      >
        {listing.images_urls?.length ? (
          <Image
            src={listing.images_urls[0]}
            alt={listing.title}
            fill
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Home className="h-10 w-10 text-slate-300" />
          </div>
        )}

        <div className="absolute left-2.5 top-2.5 flex gap-2">
          {listing.is_boosted && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow">
              <Zap className="h-2.5 w-2.5 fill-white" />
              TOP
            </span>
          )}
        </div>

        <span className="absolute right-2.5 top-2.5 rounded-lg bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase text-white backdrop-blur">
          {listing.transaction_type === 'location'
            ? 'Location'
            : 'Vente'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {listing.property_type}
        </span>

        <h3 className="mb-2 line-clamp-1 text-sm font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
          {listing.title}
        </h3>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-black text-slate-950">
            {formatPrice(listing.price)}
          </span>

          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <MapPin className="h-3 w-3 text-slate-400" />
            {listing.zone_saisie}
          </span>
        </div>
      </div>
    </Link>
  )
}