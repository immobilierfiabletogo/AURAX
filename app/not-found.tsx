import Link from 'next/link'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f7f5] px-6 py-16">

      {/* Décor */}

      <div className="absolute -top-40 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-500/10 via-amber-300/10 to-transparent blur-3xl" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

      <section
        className="
          relative
          w-full
          max-w-2xl
          overflow-hidden
          rounded-[32px]
          border
          border-slate-200/70
          bg-white/95
          p-10
          text-center
          shadow-[0_30px_80px_rgba(15,23,42,.08)]
          backdrop-blur
        "
      >

        {/* Barre décorative */}

        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

        {/* Badge */}

        <div className="mb-8 flex justify-center">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-amber-700">
            Erreur 404
          </span>
        </div>

        {/* Icône */}

        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-emerald-200 bg-gradient-to-br from-emerald-50 to-amber-50">

          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-400/10" />

          <Compass className="relative h-10 w-10 text-emerald-700" />

        </div>

        {/* Titre */}

        <h1 className="text-5xl font-black tracking-tight text-slate-950">
          Page introuvable
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-500">
          La page que vous recherchez n'existe plus, a été déplacée
          ou l'adresse saisie est incorrecte.
        </p>

        {/* Carte */}

        <div className="mt-10 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-emerald-50 p-6">

          <p className="text-slate-600 leading-7">
            Continuez votre recherche immobilière ou retournez
            à l'accueil pour découvrir les dernières opportunités
            disponibles sur AURAX.
          </p>

        </div>

        {/* Boutons */}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

          <Link
            href="/"
            className="
              rounded-2xl
              bg-gradient-to-r
              from-emerald-600
              via-emerald-500
              to-emerald-600
              px-8
              py-4
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-emerald-500/20
              transition
              hover:-translate-y-0.5
            "
          >
            Retour à l'accueil
          </Link>

          <Link
            href="/catalogue"
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-8
              py-4
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:border-emerald-300
              hover:text-emerald-700
            "
          >
            Parcourir les annonces
          </Link>

        </div>

      </section>

    </main>
  )
}