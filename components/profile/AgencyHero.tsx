'use client'

import Link from 'next/link'
import {
  BadgeCheck,
  Building2,
  Globe,
  MapPin,
  Phone,
} from 'lucide-react'

import type { Profile } from '@/types'

interface AgencyHeroProps {
  agency: Profile
}

export default function AgencyHero({
  agency,
}: AgencyHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      {/* Cover */}
      {agency.cover_url && (
        <div className="relative h-56 w-full">
          <img
            src={agency.cover_url}
            alt={agency.full_name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>
      )}

      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          {/* Avatar */}
          <div
            className={`relative z-10 shrink-0 ${
              agency.cover_url ? '-mt-20' : ''
            }`}
          >
            {agency.avatar_url ? (
              <img
                src={agency.avatar_url}
                alt={agency.full_name}
                className="h-32 w-32 rounded-3xl border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-white bg-slate-100 shadow-lg">
                <Building2 className="h-14 w-14 text-slate-500" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-950">
              {agency.full_name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {agency.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Agence vérifiée
                </span>
              )}

              {agency.plan === 'premium' && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  Premium
                </span>
              )}
            </div>

            {agency.description && (
              <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-600">
                {agency.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-600">
              {agency.adresse && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {agency.adresse}
                </div>
              )}

              {agency.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {agency.phone_number}
                </div>
              )}

              {agency.website && (
                <Link
                  href={agency.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-slate-900"
                >
                  <Globe className="h-4 w-4 text-slate-400" />
                  Site web
                </Link>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {agency.phone_number && (
                <a
                  href={`tel:${agency.phone_number}`}
                  className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Contacter l'agence
                </a>
              )}

              {agency.website && (
                <Link
                  href={agency.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Visiter le site
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}