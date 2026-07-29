'use client'

import {
  Home,
  Eye,
  MessageSquare,
  Crown,
} from 'lucide-react'

interface Props {
  listings: number
  views: number
  whatsapp: number
  plan?: string | null
}

export default function StandStats({
  listings,
  views,
  whatsapp,
  plan,
}: Props) {
  const stats = [
    {
      label: 'Biens',
      value: listings,
      icon: Home,
    },
    {
      label: 'Vues',
      value: views.toLocaleString('fr-FR'),
      icon: Eye,
    },
    {
      label: 'Contacts',
      value: whatsapp,
      icon: MessageSquare,
    },
    {
      label: 'Abonnement',
      value: (plan ?? 'Gratuit').toUpperCase(),
      icon: Crown,
    },
  ]

  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      <div className="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden p-8 transition duration-300 hover:bg-slate-50"
            >
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-10 translate-x-10 rounded-full bg-emerald-500/5 transition group-hover:scale-125" />

              <div className="relative">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">

                  <Icon className="h-5 w-5" />

                </div>

                <div className="mt-8 text-4xl font-black tracking-tight text-slate-900">

                  {stat.value}

                </div>

                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.30em] text-slate-500">

                  {stat.label}

                </div>

              </div>

            </div>
          )
        })}

      </div>

    </section>
  )
}