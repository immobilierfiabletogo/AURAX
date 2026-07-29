'use client'

import { Building2, BadgeCheck, Calendar } from 'lucide-react'

interface Props {
  description?: string | null
  createdAt?: string | null
  verified?: boolean
}

function formatDate(date?: string | null) {
  if (!date) return null

  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
  })
}

export default function PublicAgencyAbout({
  description,
  createdAt,
  verified = false,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="flex items-center gap-3">

        <Building2 className="h-6 w-6 text-slate-900" />

        <h2 className="text-2xl font-black text-slate-900">
          À propos de cette agence
        </h2>

      </div>

      <div className="mt-6 space-y-6">

        <p className="leading-8 text-slate-600">
          {description ??
            "Cette agence est présente sur AURAX afin de proposer l'ensemble de ses biens immobiliers dans une vitrine unique, moderne et régulièrement mise à jour."}
        </p>

        <div className="grid gap-4 md:grid-cols-2">

          <div className="rounded-2xl bg-slate-50 p-5">

            <div className="flex items-center gap-2">

              <BadgeCheck className="h-5 w-5 text-emerald-500" />

              <span className="font-bold text-slate-900">
                Vérification
              </span>

            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {verified
                ? "Cette agence possède un profil vérifié sur AURAX."
                : "Profil enregistré sur AURAX."}
            </p>

          </div>

          <div className="rounded-2xl bg-slate-50 p-5">

            <div className="flex items-center gap-2">

              <Calendar className="h-5 w-5 text-slate-900" />

              <span className="font-bold text-slate-900">
                Présente depuis
              </span>

            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {formatDate(createdAt) ?? "Date indisponible"}
            </p>

          </div>

        </div>

      </div>

    </section>
  )
}