'use client'

import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">

      {/* Glow */}

      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,.12),transparent_60%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col px-6 py-24 lg:px-8 lg:py-32">

        <span className="inline-flex w-fit rounded-full border border-emerald-400/20 bg-emerald-500/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-300">
          Service de recherche AURAX
        </span>

        <div className="mt-8 grid gap-16 lg:grid-cols-[1.3fr_0.8fr] lg:items-center">

          {/* Texte */}

          <div>

            <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-6xl xl:text-7xl">

              Confiez votre
              <span className="block bg-gradient-to-r from-amber-300 via-white to-emerald-300 bg-clip-text text-transparent">
                recherche immobilière
              </span>

              à AURAX.

            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-300">

              Plus besoin de contacter plusieurs agences.

              Décrivez simplement le bien recherché.

              Notre équipe analyse votre demande puis la transmet
              uniquement aux agences les plus adaptées à votre projet.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <a
                href="#request-form"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-emerald-700
                  via-emerald-600
                  to-emerald-500
                  px-8
                  py-4
                  text-base
                  font-bold
                  text-white
                  shadow-xl
                  shadow-emerald-900/30
                  transition-all
                  hover:-translate-y-1
                "
              >
                <Search className="h-5 w-5" />
                Confier ma recherche
              </a>

              <Link
                href="/biens"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-8
                  py-4
                  text-base
                  font-semibold
                  text-white
                  backdrop-blur
                  transition
                  hover:bg-white/10
                "
              >
                Explorer les biens

                <ArrowRight className="h-5 w-5" />

              </Link>

            </div>

          </div>

          {/* Carte premium */}

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15">

                <Sparkles className="h-6 w-6 text-emerald-300" />

              </div>

              <div>

                <div className="text-lg font-black text-white">

                  Pourquoi passer par AURAX ?

                </div>

                <div className="text-sm text-slate-400">

                  Nous faisons le travail de recherche pour vous.

                </div>

              </div>

            </div>

            <div className="mt-8 space-y-5">

              <div className="flex items-start gap-3">

                <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />

                <div>

                  <div className="font-semibold text-white">

                    Une seule demande

                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-400">

                    Vous décrivez votre besoin une seule fois.

                  </p>

                </div>

              </div>

              <div className="flex items-start gap-3">

                <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />

                <div>

                  <div className="font-semibold text-white">

                    Analyse par notre équipe

                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-400">

                    Nous sélectionnons uniquement les agences pertinentes.

                  </p>

                </div>

              </div>

              <div className="flex items-start gap-3">

                <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />

                <div>

                  <div className="font-semibold text-white">

                    Des propositions ciblées

                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-400">

                    Vous êtes contacté uniquement lorsque votre projet correspond à une opportunité.

                  </p>

                </div>

              </div>

            </div>

            <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">

              <div className="flex items-center gap-3">

                <ShieldCheck className="h-6 w-6 text-emerald-300" />

                <div>

                  <div className="font-bold text-white">

                    Service entièrement gratuit

                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-300">

                    Votre demande est étudiée par AURAX avant toute transmission aux agences.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}