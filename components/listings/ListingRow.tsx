'use client'

import { Home, MapPin, Calendar, Tag } from 'lucide-react'

import ListingStatus from './ListingStatus'
import ListingActions from './ListingActions'

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

type Status = 'actif' | 'expire' | 'en_attente'

interface Props {
  listing: Listing
  status: Status
  onDelete: (id: string) => void
}

const formatPrix = (value: number) =>
  new Intl.NumberFormat('fr-TG', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

export default function ListingRow({
  listing,
  status,
  onDelete,
}: Props) {
  return (
    <div className="group flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 transition hover:border-amber-300 hover:shadow-lg lg:flex-row lg:items-center lg:justify-between">

      <div className="flex items-center gap-5">

        <div className="h-24 w-32 overflow-hidden rounded-2xl bg-slate-100">

          {listing.images_urls?.length ? (
            <img
              src={listing.images_urls[0]}
              alt={listing.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Home size={28} className="text-slate-400" />
            </div>
          )}

        </div>

        <div>

          <div className="mb-2 flex items-center gap-3">

            <h3 className="text-lg font-black">
              {listing.title}
            </h3>

            {listing.is_boosted && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
                Boost
              </span>
            )}

          </div>

          <div className="mb-3 text-2xl font-black">
            {formatPrix(listing.price)}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-500">

            <span className="flex items-center gap-1">
              <MapPin size={15} />
              {listing.zone_saisie}
            </span>

            <span className="flex items-center gap-1">
              <Tag size={15} />
              {listing.property_type}
            </span>

            <span className="flex items-center gap-1">
              <Calendar size={15} />
              {new Date(listing.created_at).toLocaleDateString('fr-FR')}
            </span>

          </div>

        </div>

      </div>

      <div className="flex items-center gap-8">

        <div className="text-center">

          <div className="text-3xl font-black">
            {listing.views}
          </div>

          <div className="text-xs uppercase text-slate-400">
            Vues
          </div>

        </div>

        <div className="text-center">

          <div className="text-3xl font-black">
            {listing.whatsapp_clicks}
          </div>

          <div className="text-xs uppercase text-slate-400">
            WhatsApp
          </div>

        </div>

        <ListingStatus status={status} />

        <ListingActions
          id={listing.id}
          onDelete={onDelete}
        />

      </div>

    </div>
  )
}