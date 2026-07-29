'use client'

import {
  ShieldCheck,
  Building2,
  Home,
  BadgeCheck,
} from 'lucide-react'

interface Props {
  listingsCount: number
  yearsOnAurax?: number
}

export default function PublicAgencyTrustBanner({
  listingsCount,
  yearsOnAurax = 1,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 p-8">

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Agence présente sur AURAX
          </div>

          <h2 className="mt-6 text-4xl font-black text-slate-900">
            Une vitrine immobilière unique.
          </h2>

          <p className="mt-4 max-w-2xl text-slate-600 leading-8">
            Toutes les annonces publiées par cette agence sont regroupées ici.
            Revenez sur cette page pour découvrir les nouveaux biens mis en ligne.
          </p>

        </div>

        <div className="grid gap-4">

          <div className="rounded-3xl bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <Home className="h-7 w-7 text-emerald-600" />

              <div>

                <div className="text-3xl font-black text-slate-900">
                  {listingsCount}
                </div>

                <div className="text-sm text-slate-500">
                  biens publiés
                </div>

              </div>

            </div>

          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <Building2 className="h-7 w-7 text-slate-900" />

              <div>

                <div className="text-3xl font-black text-slate-900">
                  {yearsOnAurax}+
                </div>

                <div className="text-sm text-slate-500">
                  an(s) sur AURAX
                </div>

              </div>

            </div>

          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <BadgeCheck className="h-7 w-7 text-amber-500" />

              <div>

                <div className="font-black text-slate-900">
                  Profil professionnel
                </div>

                <div className="text-sm text-slate-500">
                  informations centralisées
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}