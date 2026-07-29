'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Building2,
  Crown,
  Globe,
  MapPin,
  Phone,
} from 'lucide-react'

interface Props {
  name: string
  logo?: string | null
  address?: string | null
  description?: string | null
  phone: string
  website?: string | null
  plan?: string | null
  listings: number
}

export default function StandHero({
  name,
  logo,
  address,
  description,
  phone,
  website,
  plan,
  listings,
}: Props) {
  const badge =
    plan === 'premium'
      ? 'Premium'
      : plan === 'pro'
      ? 'Pro'
      : 'Gratuit'

  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      <div className="relative h-80 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,.28),transparent_40%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,.06),transparent_45%)]" />

      </div>

      <div className="relative px-10 pb-10">

        <div className="-mt-20 flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">

          <div className="flex flex-col gap-8 lg:flex-row">

            <div className="relative h-40 w-40 overflow-hidden rounded-[32px] border border-white/20 bg-white shadow-2xl">

              {logo ? (
                <Image
                  src={logo}
                  alt={name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-100">
                  <Building2 className="h-14 w-14 text-slate-400" />
                </div>
              )}

            </div>

            <div className="pt-4">

              <div className="inline-flex items-center rounded-full border border-amber-300/40 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-700">

                <Crown className="mr-2 h-4 w-4" />

                {badge}

              </div>

              <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-900">

                {name}

              </h1>

              {description && (

                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">

                  {description}

                </p>

              )}

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">

                {address && (

                  <div className="flex items-center gap-2">

                    <MapPin className="h-4 w-4" />

                    {address}

                  </div>

                )}

                <div className="font-semibold">

                  {listings} biens publiés

                </div>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-4">

            <Link
              href={`tel:${phone}`}
              className="rounded-full bg-slate-950 px-8 py-4 font-semibold text-white transition hover:bg-slate-800"
            >
              <Phone className="mr-2 inline h-4 w-4" />
              Appeler
            </Link>

            {website && (

              <Link
                href={website}
                target="_blank"
                className="rounded-full border border-slate-200 bg-white px-8 py-4 font-semibold transition hover:bg-slate-50"
              >
                <Globe className="mr-2 inline h-4 w-4" />
                Site web
              </Link>

            )}

          </div>

        </div>

      </div>

    </section>
  )
}