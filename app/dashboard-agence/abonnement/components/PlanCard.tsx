'use client'

import { Check, ChevronRight, Crown, LucideIcon } from 'lucide-react'

interface Feature {
  feature: string
  display_order: number
}

interface Plan {
  id: string
  code: string
  name: string
  description: string | null

  monthly_price: number

  color: string
  bg: string
  border: string

  icon: LucideIcon

  badge?: string |null

  features: Feature[]
}

interface Props {
  plan: Plan
  onSelect: () => void
}

export default function PlanCard({
  plan,
  onSelect,
}: Props) {
  const Icon = plan.icon

  const isPremium = plan.code === 'premium'

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
        isPremium
          ? 'bg-[#FFFCF5] shadow-xl'
          : 'bg-white shadow-sm'
      }`}
      style={{
        borderColor: isPremium
          ? 'rgba(212,175,55,.45)'
          : plan.border,
      }}
    >
      {isPremium && (
        <>
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />

          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                'linear-gradient(115deg,transparent 20%,rgba(255,255,255,.55) 50%,transparent 80%)',
            }}
          />
        </>
      )}

      {plan.badge && (
        <div
          className="absolute right-5 top-5 flex items-center gap-1 rounded-full px-4 py-1 text-[11px] font-black uppercase tracking-[0.15em] shadow-xl"
          style={{
            background: isPremium
              ? 'linear-gradient(135deg,#FFF7C2,#F8E08E,#D4AF37,#B8860B)'
              : plan.color,
            color: isPremium ? '#3F2D00' : '#fff',
          }}
        >
          {isPremium && <Crown className="h-3 w-3" />}
          {plan.badge}
        </div>
      )}

      <div className="relative p-7">

        <div className="mb-6 flex items-center gap-4">

          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-md"
            style={{
              background: isPremium
                ? 'linear-gradient(135deg,#FFF8DC 0%,#F8E08E 30%,#D4AF37 70%,#B8860B 100%)'
                : plan.bg,
            }}
          >
            <Icon
              className="h-9 w-9"
              style={{
                color: isPremium
                  ? '#6F5200'
                  : plan.color,
              }}
            />
          </div>

          <div>

            <h3 className="text-2xl font-black text-slate-900">
              {plan.name}
            </h3>

            {plan.description && (
              <p className="mt-1 text-sm text-slate-500">
                {plan.description}
              </p>
            )}

          </div>

        </div>

        <div className="mb-7">

          <span className="text-4xl font-black tracking-tight text-slate-900">
            {plan.monthly_price.toLocaleString()} FCFA
          </span>

          <span className="ml-2 text-slate-400">
            / mois
          </span>

          {isPremium && (
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.20em] text-[#B8860B]">
              Expérience Premium
            </p>
          )}

        </div>

        <div className="space-y-3">

          {plan.features
            .sort((a, b) => a.display_order - b.display_order)
            .map((item) => (
              <div
                key={item.feature}
                className="flex items-center gap-3"
              >
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{
                    background: isPremium
                      ? 'rgba(212,175,55,.15)'
                      : plan.bg,
                  }}
                >
                  <Check
                    className="h-3.5 w-3.5"
                    style={{
                      color: isPremium
                        ? '#B8860B'
                        : plan.color,
                    }}
                  />
                </div>

                <span className="text-sm text-slate-700">
                  {item.feature}
                </span>

              </div>
            ))}

        </div>

        <button
          onClick={onSelect}
          className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black transition duration-300 hover:scale-[1.02] ${
            isPremium
              ? 'shadow-lg hover:shadow-yellow-500/30'
              : ''
          }`}
          style={{
            background: isPremium
              ? 'linear-gradient(135deg,#FFF8DC 0%,#F8E08E 20%,#D4AF37 50%,#B8860B 80%,#7A5C00 100%)'
              : plan.color,
            color: isPremium
              ? '#1A1A1A'
              : '#fff',
          }}
        >
          Choisir ce plan

          <ChevronRight className="h-5 w-5" />
        </button>

      </div>
    </div>
  )
}