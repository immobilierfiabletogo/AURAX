'use client'

import {
  Eye,
  MessageCircle,
  Home,
  TrendingUp,
} from 'lucide-react'

interface PerformanceOverviewProps {
  totalViews: number
  totalWhatsappClicks: number
  totalListings: number
  activeListings: number
}

export default function PerformanceOverview({
  totalViews,
  totalWhatsappClicks,
  totalListings,
  activeListings,
}: PerformanceOverviewProps) {
  const stats = [
    {
      title: 'Vues',
      value: totalViews,
      icon: Eye,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Clics WhatsApp',
      value: totalWhatsappClicks,
      icon: MessageCircle,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Annonces',
      value: totalListings,
      icon: Home,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'En ligne',
      value: activeListings,
      icon: TrendingUp,
      color: 'text-violet-600 bg-violet-50',
    },
  ]

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">

      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-900">
          Performance
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Vue d'ensemble de votre activité sur AURAX.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 p-5 transition hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="mt-5 text-3xl font-black text-slate-900">
                {stat.value.toLocaleString()}
              </div>

              <div className="mt-1 text-sm font-medium text-slate-500">
                {stat.title}
              </div>
            </div>
          )
        })}

      </div>

    </section>
  )
}