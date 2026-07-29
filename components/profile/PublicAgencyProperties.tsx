'use client'

import Link from 'next/link'
import {
  MapPin,
  Eye,
  MessageCircle,
  Zap,
} from 'lucide-react'

interface Listing {
  id: string
  title: string
  price: number
  zone_saisie: string
  property_type: string
  images_urls: string[]
  is_boosted: boolean
  views: number | null
  whatsapp_clicks: number | null
}

interface Props {
  listings: Listing[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

export default function PublicAgencyProperties({
  listings,
}: Props) {
  if (listings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <h3 className="text-lg font-bold text-slate-900">
          Aucune annonce disponible
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Cette agence n'a actuellement aucun bien publié.
        </p>
      </div>
    )
  }

  return (
    <section>

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-black text-slate-900">
            Tous les biens
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {listings.length} bien(s) actuellement disponibles.
          </p>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {listings.map((listing) => (

          <Link
            key={listing.id}
            href={`/biens/${listing.id}`}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

              {listing.images_urls?.length > 0 ? (
                <img
                  src={listing.images_urls[0]}
                  alt={listing.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  Aucun visuel
                </div>
              )}

              {listing.is_boosted && (
                <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                  <Zap className="h-3 w-3" />
                  Premium
                </div>
              )}

            </div>

            <div className="p-5">

              <div className="text-2xl font-black text-slate-900">
                {formatPrice(listing.price)}
              </div>

              <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">
                {listing.title}
              </h3>

              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {listing.zone_saisie}
              </div>

              <div className="mt-1 text-sm text-slate-400">
                {listing.property_type}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                <div className="flex items-center gap-5 text-sm text-slate-500">

                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {listing.views ?? 0}
                  </div>

                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {listing.whatsapp_clicks ?? 0}
                  </div>

                </div>

                <span className="font-semibold text-emerald-600">
                  Voir →
                </span>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </section>
  )
}