'use client'

import Badge from '@/components/ui/Badge'

interface Props {
  name: string
  plan: string
  listings: number
}

export default function CockpitHero({
  name,
  plan,
  listings,
}: Props) {
  return (
    <section className="relative mb-10 overflow-hidden rounded-[36px] border border-slate-200 bg-white">

      {/* Glow */}
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative p-6 sm:p-8 lg:p-12">

        {/* Header */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

          <div className="max-w-3xl">

            <span className="inline-flex rounded-full bg-slate-950 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.30em] text-white">
              Cockpit AURAX
            </span>

            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              {name}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500">
              Votre cockpit centralise vos performances,
              votre visibilité, vos annonces et toutes les
              opportunités générées sur AURAX.
            </p>

          </div>

          <div className="self-start lg:self-center">

            <Badge
              variant={
                plan === 'premium'
                  ? 'premium'
                  : plan === 'pro'
                  ? 'pro'
                  : 'start'
              }
            >
              {plan === 'premium'
                ? 'AURAX PREMIUM'
                : plan === 'pro'
                ? 'AURAX PRO'
                : 'AURAX START'}
            </Badge>

          </div>

        </div>

        {/* Séparation */}

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* KPIs */}

        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">

          <div>

            <div className="text-3xl font-black text-slate-950 sm:text-4xl">
              {listings}
            </div>

            <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
              Annonces
            </div>

          </div>

          <div>

            <div className="text-3xl font-black text-slate-950 sm:text-4xl">
              {plan === 'premium'
                ? 'Premium'
                : plan === 'pro'
                ? 'Pro'
                : 'Start'}
            </div>

            <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
              Plan
            </div>

          </div>

          <div>

            <div className="text-3xl font-black text-slate-950 sm:text-4xl">
              Actif
            </div>

            <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
              Statut
            </div>

          </div>

        </div>

      </div>

    </section>
  )
}