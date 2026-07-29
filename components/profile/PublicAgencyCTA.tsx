'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Home,
} from 'lucide-react'

interface Props {
  agencyId: string
  listingsCount: number
}

export default function PublicAgencyCTA({
  agencyId,
  listingsCount,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[32px] bg-slate-950 px-8 py-10 text-white">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div className="max-w-2xl">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em]">
            <Building2 className="h-4 w-4" />
            AURAX
          </div>

          <h2 className="text-4xl font-black leading-tight">
            Découvrez tous les biens de cette agence.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            Cette page est la vitrine officielle de cette agence sur AURAX.
            Retrouvez ici l'ensemble de ses annonces immobilières mises à jour
            régulièrement.
          </p>

        </div>

        <div className="flex flex-col gap-4">

          <div className="rounded-3xl bg-white/10 p-6">

            <div className="text-sm uppercase tracking-widest text-slate-400">
              Disponible actuellement
            </div>

            <div className="mt-2 flex items-center gap-3">

              <Home className="h-7 w-7 text-amber-400" />

              <span className="text-4xl font-black">
                {listingsCount}
              </span>

            </div>

            <div className="mt-2 text-sm text-slate-400">
              biens publiés sur AURAX
            </div>

          </div>

          <Link
            href={`/agence/${agencyId}`}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-amber-500 px-6 py-4 font-bold text-slate-950 transition hover:bg-amber-400"
          >
            Voir toute la vitrine

            <ArrowRight className="h-5 w-5" />

          </Link>

        </div>

      </div>

    </section>
  )
}