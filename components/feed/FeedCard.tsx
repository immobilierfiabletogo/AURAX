'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  Building2,
  Crown,
  Heart,
  MapPin,
  Share2,
} from 'lucide-react'

import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Props {
  id: string
  title: string
  price: string
  image: string
  city: string

  agencyId: string
  agencyName: string
  agencyLogo?: string | null
  agencyPlan?: string | null

  boosted?: boolean
}

export default function FeedCard({
  id,
  title,
  price,
  image,
  city,
  agencyId,
  agencyName,
  agencyLogo,
  agencyPlan,
  boosted,
}: Props) {
  return (
    <Card className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

      <Link href={`/biens/${id}`}>

        <div className="relative aspect-[4/3] overflow-hidden">

          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {boosted && (
            <div className="absolute left-5 top-5">
              <Badge>TOP</Badge>
            </div>
          )}

          <div className="absolute bottom-5 left-5 right-5">

            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur-xl">

              <MapPin className="mr-2 h-3.5 w-3.5" />

              {city}

            </div>

          </div>

        </div>

      </Link>

      <div className="space-y-6 p-6">

        <div>

          <div className="text-3xl font-black tracking-tight text-emerald-600">

            {price}

          </div>

          <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight text-slate-900">

            {title}

          </h3>

        </div>

        <Link
          href={`/stand/${agencyId}`}
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
        >

          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">

            {agencyLogo ? (
              <Image
                src={agencyLogo}
                alt={agencyName}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 text-slate-400" />
            )}

          </div>

          <div className="min-w-0 flex-1">

            <div className="truncate text-base font-bold text-slate-900">

              {agencyName}

            </div>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">

              <Crown className="h-3 w-3" />

              {agencyPlan ?? 'Gratuit'}

            </div>

          </div>

          <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:text-emerald-600" />

        </Link>

        <div className="flex gap-3">

          <Link
            href={`/biens/${id}`}
            className="flex-1"
          >
            <Button className="w-full rounded-2xl">
              Voir le bien
            </Button>
          </Link>

          <Button
            variant="secondary"
            className="rounded-2xl"
          >
            <Heart className="h-5 w-5" />
          </Button>

          <Button
            variant="secondary"
            className="rounded-2xl"
          >
            <Share2 className="h-5 w-5" />
          </Button>

        </div>

      </div>

    </Card>
  )
}