'use client'

import FeedCard from './FeedCard'

interface FeedListing {
  id: string
  title: string
  image: string
  city: string
  price: string

  agencyId: string
  agencyName: string
  agencyLogo?: string
  agencyPlan?: string | null

  boosted?: boolean
}

interface Props {
  listings: FeedListing[]
}

export default function FeedGrid({ listings }: Props) {
  if (!listings.length) {
    return (
      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100">

        <div className="mx-auto flex max-w-2xl flex-col items-center px-10 py-24 text-center">

          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.30em] text-emerald-700">
            Catalogue
          </span>

          <h2 className="mt-8 text-4xl font-black tracking-tight text-slate-900">
            Aucun bien disponible
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-500">
            Cette agence n'a pas encore publié de biens immobiliers.
            Revenez prochainement pour découvrir ses nouvelles annonces.
          </p>

        </div>

      </section>
    )
  }

  return (
    <section className="space-y-10">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-600">
            Catalogue
          </p>

          <h2 className="mt-3 text-5xl font-black tracking-tight text-slate-900">
            Nos biens disponibles
          </h2>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
            Explorez les biens actuellement proposés par cette agence.
          </p>

        </div>

        <div className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm">
          {listings.length} annonce{listings.length > 1 ? 's' : ''}
        </div>

      </div>

      <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">

        {listings.map((listing) => (
          <FeedCard
            key={listing.id}
            {...listing}
          />
        ))}

      </div>

    </section>
  )
}