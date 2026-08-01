'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  BadgeCheck,
  Building2,
  Globe,
  MapPin,
} from 'lucide-react'

import type { Agency } from '../hooks/useAgencies'

interface Props {
  agency: Agency
}

export default function AgencyCard({
  agency,
}: Props) {
  return (
    <Link
      href={`/stand/${agency.id}`}
      className="
        group
        overflow-hidden
        rounded-[30px]
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
      "
    >
      <div className="relative h-40 bg-slate-100">

        {agency.cover_url ? (
          <Image
            src={agency.cover_url}
            alt={agency.full_name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building2 className="h-12 w-12 text-slate-300" />
          </div>
        )}

        {agency.plan &&
          agency.plan !== 'starter' && (
            <span className="absolute right-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black uppercase text-white">
              {agency.plan}
            </span>
          )}

      </div>

      <div className="relative px-6 pb-6">

        <div className="-mt-10 flex justify-center">

          <div className="overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">

            {agency.avatar_url ? (
              <Image
                src={agency.avatar_url}
                alt={agency.full_name}
                width={80}
                height={80}
                className="h-20 w-20 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center bg-slate-100">
                <Building2 className="h-8 w-8 text-slate-400" />
              </div>
            )}

          </div>

        </div>

        <div className="mt-5 text-center">

          <div className="flex items-center justify-center gap-2">

            <h3 className="text-xl font-black text-slate-900">
              {agency.full_name}
            </h3>

            {agency.verified && (
              <BadgeCheck className="h-5 w-5 text-emerald-600" />
            )}

          </div>

          {agency.adresse && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">

              <MapPin className="h-4 w-4" />

              <span>{agency.adresse}</span>

            </div>
          )}

          <p className="mt-5 line-clamp-3 text-sm leading-7 text-slate-600">
            {agency.description ??
              'Professionnel de l’immobilier présent sur AURAX.'}
          </p>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">

            <div>

              <div className="text-2xl font-black text-slate-900">
                {agency.listings_count}
              </div>

              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Annonces
              </div>

            </div>

            {agency.website && (
              <Globe className="h-5 w-5 text-slate-400" />
            )}

          </div>

          <div className="mt-6">

            <span className="
              inline-flex
              w-full
              items-center
              justify-center
              rounded-2xl
              bg-emerald-600
              py-3
              text-sm
              font-bold
              text-white
              transition
              group-hover:bg-emerald-700
            ">
              Voir le stand
            </span>

          </div>

        </div>

      </div>

    </Link>
  )
}