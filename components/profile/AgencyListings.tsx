'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  BadgeCheck,
  Eye,
  MapPin,
  MessageCircle,
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
      <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <h2 className="text-xl font-black text-slate-900">
          Aucune annonce
        </h2>

        <p className="mt-3 text-slate-500">
          Cette agence n'a encore publié aucun bien.
        </p>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">
            Les biens disponibles
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {listings.length} biens actuellement publiés.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/biens/${listing.id}`}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              {listing.images_urls?.[0] ? (
                <Image
                  src={listing.images_urls[0]}
                  alt={listing.title}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Eye className="h-10 w-10 text-slate-300" />
                </div>
              )}

              {listing.is_boosted && (
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-900">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    TOP
                  </span>
                </div>
              )}

              {listing.transaction_type && (
                <span className="absolute right-4 top-4 rounded-xl bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                  {listing.transaction_type === 'location'
                    ? 'Location'
                    : 'Vente'}
                </span>
              )}
            </div>

            <div className="p-6">
              <div className="text-2xl font-black text-slate-900">
                {formatPrice(listing.price)}
              </div>

              <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {listing.property_type}
              </div>

              <h3 className="mt-3 line-clamp-2 text-lg font-black text-slate-900 transition-colors group-hover:text-emerald-600">
                {listing.title}
              </h3>

              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                Publié par cette agence
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {listing.zone_saisie}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-5 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {listing.views ?? 0}
                  </span>

                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {listing.whatsapp_clicks ?? 0}
                  </span>
                </div>

                <span className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition group-hover:bg-emerald-700">
                  Voir le bien
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}