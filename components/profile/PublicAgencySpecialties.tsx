'use client'

import {
  Building2,
  Home,
  KeyRound,
  Landmark,
  Warehouse,
  Trees,
} from 'lucide-react'

interface Props {
  transactionTypes?: string[]
  propertyTypes?: string[]
}

export default function PublicAgencySpecialties({
  transactionTypes = [],
  propertyTypes = [],
}: Props) {
  const cards = [
    {
      title: 'Vente',
      icon: Landmark,
      active: transactionTypes.includes('vente'),
    },
    {
      title: 'Location',
      icon: KeyRound,
      active: transactionTypes.includes('location'),
    },
    {
      title: 'Maisons',
      icon: Home,
      active: propertyTypes.includes('maison'),
    },
    {
      title: 'Appartements',
      icon: Building2,
      active: propertyTypes.includes('appartement'),
    },
    {
      title: 'Terrains',
      icon: Trees,
      active: propertyTypes.includes('terrain'),
    },
    {
      title: 'Locaux',
      icon: Warehouse,
      active:
        propertyTypes.includes('local') ||
        propertyTypes.includes('bureau'),
    },
  ]

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-black text-slate-900">
          Domaines d'expertise
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Découvrez les catégories de biens proposées par cette agence.
        </p>

      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {cards
          .filter((item) => item.active)
          .map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Icon className="h-6 w-6 text-emerald-600" />
                </div>

                <h3 className="font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Cette agence publie régulièrement ce type de biens.
                </p>

              </div>
            )
          })}

      </div>

    </section>
  )
}