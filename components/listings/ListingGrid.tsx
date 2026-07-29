'use client'

import Link from 'next/link'
import { MapPin, Trash2 } from 'lucide-react'

import ListingStatus from './ListingStatus'

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

type ListingStatusType =
  | 'actif'
  | 'expire'
  | 'en_attente'

interface Props {
  listing: Listing
  status: ListingStatusType
  onDelete: (id: string) => void
}

export default function ListingGrid({
  listing,
  status,
  onDelete,
}: Props) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-500 hover:-translate-y-1 hover:shadow-2xl">

      <div className="relative h-72 overflow-hidden">

        <img
          src={listing.images_urls?.[0] || '/placeholder.jpg'}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute left-5 top-5">
          <ListingStatus status={status} />
        </div>

      </div>

      <div className="space-y-5 p-6">

        <div>

          <h2 className="text-xl font-black">
            {listing.title}
          </h2>

          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={15} />
            {listing.zone_saisie}
          </p>

        </div>

        <div className="text-3xl font-black">
          {new Intl.NumberFormat('fr-TG', {
            style: 'currency',
            currency: 'XOF',
            maximumFractionDigits: 0,
          }).format(listing.price)}
        </div>

        <div className="flex items-center justify-between">

          <div>
            <div className="text-xs uppercase text-slate-400">
              Vues
            </div>

            <div className="text-2xl font-black">
              {listing.views}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase text-slate-400">
              WhatsApp
            </div>

            <div className="text-2xl font-black">
              {listing.whatsapp_clicks}
            </div>
          </div>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/biens/${listing.id}`}
            className="flex-1 rounded-2xl bg-slate-950 py-3 text-center font-bold text-white transition hover:bg-black"
          >
            Voir
          </Link>

          <button
            onClick={() => onDelete(listing.id)}
            className="rounded-2xl border border-slate-200 px-5 transition hover:border-red-200 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

    </div>
  )
}