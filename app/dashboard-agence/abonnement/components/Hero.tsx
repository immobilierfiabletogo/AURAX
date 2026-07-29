'use client'

import { Crown, Sparkles } from 'lucide-react'

interface HeroProps {
  agenceName: string
  currentPlan: string
}

export default function Hero({
  agenceName,
  currentPlan,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl">

      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">

            <Sparkles className="h-3.5 w-3.5" />

            Abonnement AURAX

          </div>

          <h1 className="text-4xl font-black">

            Développez votre agence

          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">

            Choisissez un abonnement adapté à votre activité,
            améliorez votre visibilité et obtenez davantage de
            contacts qualifiés grâce à la plateforme AURAX.

          </p>

        </div>

        <div className="rounded-3xl bg-white/5 p-6 backdrop-blur">

          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">

            Plan actuel

          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500">

              <Crown className="h-7 w-7 text-white" />

            </div>

            <div>

              <p className="text-2xl font-black">

                {currentPlan.toUpperCase()}

              </p>

              <p className="text-sm text-slate-400">

                {agenceName}

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}