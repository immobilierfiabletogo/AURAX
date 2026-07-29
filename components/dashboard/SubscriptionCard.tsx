'use client'

import Link from 'next/link'
import { Crown, CalendarDays, ArrowUpRight } from 'lucide-react'

interface SubscriptionCardProps {
  plan: string | null
  expiresAt: string | null
}

const PLAN_COLORS: Record<string, string> = {
  gratuit: 'bg-slate-100 text-slate-700',
  pro: 'bg-blue-100 text-blue-700',
  premium: 'bg-amber-100 text-amber-700',
}

function formatDate(date: string | null) {
  if (!date) return 'Illimité'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function remainingDays(date: string | null) {
  if (!date) return null

  const diff =
    new Date(date).getTime() - new Date().getTime()

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function SubscriptionCard({
  plan,
  expiresAt,
}: SubscriptionCardProps) {
  const currentPlan = (plan ?? 'gratuit').toLowerCase()

  const days = remainingDays(expiresAt)

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">

      <div className="flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
          <Crown className="h-6 w-6 text-amber-600" />
        </div>

        <div>

          <h2 className="text-xl font-black text-slate-900">
            Votre abonnement
          </h2>

          <p className="text-sm text-slate-500">
            Gérez votre formule AURAX.
          </p>

        </div>

      </div>

      <div className="mt-8">

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${
            PLAN_COLORS[currentPlan] ??
            PLAN_COLORS.gratuit
          }`}
        >
          {currentPlan}
        </span>

        <div className="mt-6 flex items-center gap-3 text-slate-600">

          <CalendarDays className="h-5 w-5" />

          <span className="text-sm">
            Expiration :{' '}
            <strong>{formatDate(expiresAt)}</strong>
          </span>

        </div>

        {days !== null && (

          <div className="mt-4 rounded-xl bg-slate-50 p-4">

            <div className="text-xs uppercase tracking-wider text-slate-400">
              Temps restant
            </div>

            <div className="mt-1 text-3xl font-black text-slate-900">
              {days}
              <span className="ml-1 text-base font-bold">
                jours
              </span>
            </div>

          </div>

        )}

      </div>

      <Link
        href="/dashboard-agence/abonnement"
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
      >
        Gérer mon abonnement

        <ArrowUpRight className="h-4 w-4" />

      </Link>

    </section>
  )
}