'use client'

import {
  BadgeCheck,
  Building2,
  Clock3,
  Eye,
  MessageCircle,
  Zap,
  TrendingUp,
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
      bg: 'bg-gradient-to-br from-slate-100 to-slate-50',
      iconColor: 'text-slate-700',
    },
    {
      label: 'Vues cumulées',
      value: totalViews.toLocaleString(),
      icon: Eye,
      bg: 'bg-gradient-to-br from-blue-50 to-sky-50',
      iconColor: 'text-sky-600',
    },
    {
      label: 'Contacts WhatsApp',
      value: totalWhatsappClicks.toLocaleString(),
      icon: MessageCircle,
      bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Biens Premium',
      value: boostedListings.toLocaleString(),
      icon: Zap,
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Temps de réponse',
      value:
        responseTime != null
          ? `${responseTime} min`
          : '—',
      icon: Clock3,
      bg: 'bg-gradient-to-br from-violet-50 to-fuchsia-50',
      iconColor: 'text-violet-600',
    },
    {
      label: verified
        ? 'Agence certifiée'
        : 'Score du stand',
      value: verified
        ? 'Certifiée'
        : `${standScore ?? 0}/100`,
      icon: BadgeCheck,
      bg: verified
        ? 'bg-gradient-to-br from-emerald-50 to-green-50'
        : 'bg-gradient-to-br from-slate-100 to-slate-50',
      iconColor: verified
        ? 'text-emerald-600'
        : 'text-slate-700',
    },
  ]

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-slate-200/70
        bg-gradient-to-br
        from-white
        via-[#fbfbfa]
        to-[#f6f8f7]
        p-8
        shadow-[0_20px_60px_rgba(15,23,42,.05)]
      "
    >
      {/* Glow Emerald */}
      <div
        className="
          absolute
          -left-32
          top-0
          h-72
          w-72
          rounded-full
          bg-emerald-500/8
          blur-3xl
        "
      />

      {/* Glow Amber */}
      <div
        className="
          absolute
          -right-24
          bottom-0
          h-72
          w-72
          rounded-full
          bg-amber-400/10
          blur-3xl
        "
      />

      <div className="relative">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <span
              className="
                inline-flex
                rounded-full
                border
                border-emerald-200
                bg-emerald-50
                px-4
                py-2
                text-[11px]
                font-bold
                uppercase
                tracking-[0.30em]
                text-emerald-700
              "
            >
              Performance publique
            </span>

            <h2
              className="
                mt-5
                text-3xl
                font-black
                tracking-tight
                text-slate-950
              "
            >
              Les chiffres de cette agence
            </h2>

            <p
              className="
                mt-3
                max-w-2xl
                text-base
                leading-7
                text-slate-500
              "
            >
              Découvrez les indicateurs de visibilité,
              d'engagement et de réactivité qui reflètent
              la qualité de présence de cette agence sur AURAX.
            </p>

          </div>

          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-emerald-100
              bg-white/80
              px-5
              py-4
              shadow-sm
              backdrop-blur
            "
          >
            <TrendingUp className="h-6 w-6 text-emerald-600" />

            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Taux de réponse
              </div>

              <div className="mt-1 text-2xl font-black text-slate-950">
                {responseRate ?? 0}%
              </div>
            </div>

          </div>

        </div>

                {responseRate != null && (
          <div className="relative mt-10">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-semibold text-slate-600">
                Réactivité de l'agence
              </span>

              <span className="text-sm font-bold text-emerald-700">
                {responseRate}%
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">

              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-emerald-500
                  via-emerald-600
                  to-amber-500
                  transition-all
                  duration-700
                "
                style={{
                  width: `${Math.min(
                    responseRate,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {stats.map((item) => {

            const Icon = item.icon

            return (

              <article
                key={item.label}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-slate-200/80
                  bg-white/80
                  p-6
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1.5
                  hover:border-emerald-200
                  hover:shadow-[0_18px_45px_rgba(16,185,129,.08)]
                "
              >

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-transparent
                    via-transparent
                    to-emerald-50/40
                    opacity-0
                    transition
                    duration-500
                    group-hover:opacity-100
                  "
                />

                <div className="relative">

                  <div
                    className={`
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      ${item.bg}
                    `}
                  >
                    <Icon
                      className={`h-6 w-6 ${item.iconColor}`}
                    />
                  </div>

                  <div className="mt-8">

                    <div
                      className="
                        text-4xl
                        font-black
                        tracking-tight
                        text-slate-950
                      "
                    >
                      {item.value}
                    </div>

                    <p
                      className="
                        mt-3
                        text-sm
                        font-medium
                        text-slate-500
                      "
                    >
                      {item.label}
                    </p>

                  </div>

                </div>

              </article>

            )

          })}

        </div>

      </div>

    </section>
  )
}