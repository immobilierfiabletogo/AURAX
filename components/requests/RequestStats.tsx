'use client'

import {
  Activity,
  Banknote,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import type { Tables } from '@/types/database'

type Request = Tables<'requests'>

interface RequestStatsProps {
  requests: Request[]
}

export default function RequestStats({
  requests,
}: RequestStatsProps) {
  const total = requests.length

  const active = requests.filter(
    (request) => request.is_active
  ).length

  const inactive = total - active

  const budgets = requests
    .map((request) => request.budget ?? 0)
    .filter((budget) => budget > 0)

  const averageBudget =
    budgets.length > 0
      ? Math.round(
          budgets.reduce(
            (sum, budget) => sum + budget,
            0
          ) / budgets.length
        )
      : 0

  const cards = [
    {
      title: 'Total',
      value: total,
      icon: Activity,
      color: 'bg-slate-100 text-slate-700',
    },
    {
      title: 'Actives',
      value: active,
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Inactives',
      value: inactive,
      icon: XCircle,
      color: 'bg-red-100 text-red-700',
    },
    {
      title: 'Budget moyen',
      value:
        averageBudget > 0
          ? `${new Intl.NumberFormat('fr-FR').format(
              averageBudget
            )} FCFA`
          : '-',
      icon: Banknote,
      color: 'bg-amber-100 text-amber-700',
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {
        const Icon = card.icon

        return (
          <article
            key={card.title}
            className="rounded-3xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h3 className="mt-2 text-3xl font-black text-slate-900">
                  {card.value}
                </h3>

              </div>

              <div
                className={`rounded-2xl p-3 ${card.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>

            </div>
          </article>
        )
      })}

    </div>
  )
}