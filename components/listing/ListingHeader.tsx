'use client'

import {
  Calendar,
  Eye,
  MapPin,
  Tag,
} from 'lucide-react'

interface Props {
  title: string
  price: number
  propertyType: string
  transactionType: string
  zone: string
  createdAt?: string
  views?: number
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-TG', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price)
}

function formatDate(date?: string) {
  if (!date) return ''

  const diff = Math.floor(
    (Date.now() - new Date(date).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  if (diff < 7) return `Il y a ${diff} jours`

  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ListingHeader({
  title,
  price,
  propertyType,
  transactionType,
  zone,
  createdAt,
  views,
}: Props) {
  return (
    <section className="space-y-4 sm:space-y-5 lg:space-y-6">

      <div className="flex flex-wrap items-center gap-2">

        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">

          <Tag className="h-3.5 w-3.5" />

          {propertyType}

        </span>

        <span
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-black shadow-sm ${
            transactionType === 'location'
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 text-white'
          }`}
        >
          {transactionType === 'location'
            ? 'LOCATION'
            : 'VENTE'}
        </span>

      </div>

      <div className="space-y-4">

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight break-words leading-tight text-slate-900 md:text-4xl xl:text-5xl">
          {title}
        </h1>

        <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:gap-6">

          <span className="text-3xl sm:text-4xl lg:text-5xl leading-none font-black tracking-tight text-emerald-600 md:text-5xl">
            {formatPrice(price)}
          </span>

          <span className="pb-1 text-sm font-semibold text-slate-400">
            Prix affiché
          </span>

        </div>

      </div>

      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">

            <MapPin className="h-5 w-5 shrink-0 text-emerald-600 font-medium" />

          </div>

          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Localisation
          </p>

          <p className="mt-1 font-semibold text-slate-900">
           <span className="truncate">
             {zone}
           </span> 
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

            <Calendar className="h-5 w-5 shrink-0 text-blue-600 font-medium" />

          </div>

          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Publication
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {formatDate(createdAt)}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">

            <Eye className="h-5 w-5 shrink-0 text-amber-600 font-medium " />

          </div>

          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Popularité
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {views ?? 0} vues
          </p>

        </div>

      </div>

    </section>
  )
}