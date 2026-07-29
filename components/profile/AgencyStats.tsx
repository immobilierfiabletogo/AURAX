'use client'

import {
  BadgeCheck,
  Building2,
  Clock3,
  Eye,
  MessageCircle,
  Zap,
} from 'lucide-react'

interface AgencyStatsProps {
  listings: number
  totalViews: number
  totalWhatsappClicks: number
  boostedListings: number
  responseRate?: number | null
  responseTime?: number | null
  standScore?: number | null
  verified?: boolean | null
}

export default function AgencyStats({
  listings,
  totalViews,
  totalWhatsappClicks,
  boostedListings,
  responseRate,
  responseTime,
  standScore,
  verified,
}: AgencyStatsProps) {
  const stats = [
    {
      label: 'Annonces actives',
      value: listings.toLocaleString(),
      icon: Building2,
      color: 'text-slate-700 bg-slate-100',
    },
    {
      label: 'Vues',
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Contacts WhatsApp',
      value: totalWhatsappClicks.toLocaleString(),
      icon: MessageCircle,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Biens boostés',
      value: boostedListings.toLocaleString(),
      icon: Zap,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Temps de réponse',
      value:
        responseTime != null
          ? `${responseTime} min`
          : '—',
      icon: Clock3,
      color: 'text-violet-600 bg-violet-50',
    },
    {
      label: verified
        ? 'Agence vérifiée'
        : 'Score du stand',
      value: verified
        ? 'Oui'
        : `${standScore ?? 0}/100`,
      icon: BadgeCheck,
      color: verified
        ? 'text-emerald-600 bg-emerald-50'
        : 'text-slate-700 bg-slate-100',
    },
  ]

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900">
          Performances de l'agence
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Quelques indicateurs publics concernant cette agence.
        </p>
      </div>

      {responseRate != null && (
        <div className="mb-6 overflow-hidden rounded-2xl bg-slate-100">
          <div
            className="h-2 rounded-2xl bg-emerald-600 transition-all"
            style={{
              width: `${Math.min(responseRate, 100)}%`,
            }}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 p-5 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="mt-4 text-3xl font-black text-slate-900">
                {item.value}
              </div>

              <div className="mt-1 text-sm text-slate-500">
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}