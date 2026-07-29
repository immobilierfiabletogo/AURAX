'use client'

import {
  Home,
  Eye,
  MessageCircle,
  Zap,
} from 'lucide-react'

interface Props {
  listings: number
  views: number
  whatsapp: number
  boosted: number
}

const stats = [
  {
    key: 'listings',
    label: 'Biens publiés',
    icon: Home,
  },
  {
    key: 'views',
    label: 'Vues',
    icon: Eye,
  },
  {
    key: 'whatsapp',
    label: 'Contacts',
    icon: MessageCircle,
  },
  {
    key: 'boosted',
    label: 'Biens Premium',
    icon: Zap,
  },
]

export default function PublicAgencyStats({
  listings,
  views,
  whatsapp,
  boosted,
}: Props) {
  const values = {
    listings,
    views,
    whatsapp,
    boosted,
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {stats.map((item) => {
        const Icon = item.icon

        return (
          <div
            key={item.key}
            className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
              <Icon className="h-5 w-5 text-slate-700" />
            </div>

            <div className="text-3xl font-black text-slate-900">
              {values[item.key as keyof typeof values]}
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {item.label}
            </p>
          </div>
        )
      })}

    </section>
  )
}