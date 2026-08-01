'use client'

import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,.15),transparent_55%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8 lg:py-32">

        <span className="mb-6 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">
          AURAX
        </span>

        <h1 className="max-w-5xl text-5xl font-black leading-tight tracking-tight text-white md:text-6xl xl:text-7xl">
          Décrivez votre projet.
          <br />
          Les agences trouvent votre bien.
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-9 text-slate-300 md:text-xl">
          Déposez une seule demande et recevez des propositions
          personnalisées d'agences immobilières vérifiées partout au Togo.
          Gagnez du temps et comparez les meilleures opportunités.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">

          <a
            href="#request-form"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-bold text-white transition hover:bg-emerald-400"
          >
            <Search className="h-5 w-5" />
            Lancer ma recherche
          </a>

          <Link
            href="/biens"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            Explorer les biens
            <ArrowRight className="h-5 w-5" />
          </Link>

        </div>

      </div>
    </section>
  )
}