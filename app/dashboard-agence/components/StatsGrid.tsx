'use client'

import {
  Home,
  Eye,
  CheckCircle2,
  MessageSquare,
  Zap,
} from 'lucide-react'

interface Props {
  listings: number
  views: number
  active: number
  whatsapp: number
  boosted: number
}


const cards = [
  {
    key: 'listings',
    label: 'Annonces publiées',
    icon: Home,
    color: 'amber',
    featured: true,
  },
  {
    key: 'views',
    label: 'Vues totales',
    icon: Eye,
    color: 'slate',
    featured: false,
  },
  {
    key: 'active',
    label: 'En ligne',
    icon: CheckCircle2,
    color: 'emerald',
    featured: false,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageSquare,
    color: 'blue',
    featured: false,
  },
  {
    key: 'boosted',
    label: 'Boostées',
    icon: Zap,
    color: 'purple',
    featured: false,
  },
] as const

const colors = {
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    glow: 'from-amber-200/30',
  },
  slate: {
    bg: 'bg-slate-100',
    icon: 'text-slate-700',
    glow: 'from-slate-300/20',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    glow: 'from-emerald-200/30',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    glow: 'from-blue-200/30',
  },
  purple: {
    bg: 'bg-violet-50',
    icon: 'text-violet-600',
    glow: 'from-violet-200/30',
  },
} as const

export default function StatsGrid({
  listings,
  views,
  active,
  whatsapp,
  boosted,
}: Props) {
  const values = {
    listings,
    views,
    active,
    whatsapp,
    boosted,
  }

  return (
    <section className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon
        const color = colors[card.color]
        const value = values[card.key]

        return (
          <article
            key={card.key}
            className={`
              group
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-slate-200/70
              bg-white
              p-7
              shadow-[0_1px_3px_rgba(15,23,42,.04)]
              transition-all
              duration-300
              hover:scale-[1.015]
              hover:border-slate-300
              hover:shadow-2xl
              ${card.featured ? 'xl:col-span-2' : 'xl:col-span-1'}
            `}
          >
            <div
              className={`
                absolute
                inset-0
                bg-gradient-to-br
                ${color.glow}
                via-transparent
                to-transparent
                opacity-0
                transition-opacity
                duration-500
                group-hover:opacity-100
              `}
            />

            <div className="relative flex items-start justify-between">
              <div
                className={`
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  ${color.bg}
                `}
              >
                <Icon className={`h-5 w-5 ${color.icon}`} />
              </div>
            </div>

            <div className="relative mt-10">
              <div className="text-5xl font-extrabold leading-none tracking-tight text-slate-950">
                {new Intl.NumberFormat('fr-FR').format(value)}
              </div>

              <p className="mt-3 text-sm font-medium text-slate-500">
                {card.label}
              </p>
            </div>
          </article>
        )
      })}
    </section>
  )
}