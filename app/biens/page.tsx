'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { useCatalogue } from '@/hooks/useCatalogue'

import SearchFilters from '@/components/catalogue/SearchFilters'
import PropertyGrid from '@/components/catalogue/PropertyGrid'
import Pagination from '@/components/catalogue/Pagination'

function CatalogueContent() {
  const router = useRouter()

  const {
    listings,
    total,
    totalPages,
    loading,
    page,

    type,
    transaction,
    budget,
    sort,

    zoneInput,
    setZoneInput,

    hasActiveFilters,

    setParam,
    clearAll,
  } = useCatalogue()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-900 antialiased">

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

        <div
          className="
            relative
            overflow-hidden
            rounded-[36px]
            border
            border-slate-200
            bg-white
            shadow-[0_20px_60px_rgba(15,23,42,0.05)]
          "
        >

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative p-8 sm:p-10 lg:p-14">

            <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">

              <div>

                <span className="inline-flex rounded-full bg-slate-950 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.30em] text-white">
                  Catalogue AURAX
                </span>

                <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">

                  Trouvez le bien idéal

                  <span className="mt-2 block bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                    pour votre prochain projet.
                  </span>

                </h1>

                <p className="mt-7 max-w-2xl text-lg leading-9 text-slate-500">

                  Explorez des biens sélectionnés auprès
                  d'agences professionnelles et de propriétaires.
                  Acheter, louer ou investir devient enfin une
                  expérience simple, moderne et sécurisée.

                </p>

                <div className="mt-10 flex flex-wrap gap-4">

                  <Link
                    href="/deposer"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-r
                      from-emerald-700
                      via-emerald-600
                      to-emerald-500
                      px-7
                      py-4
                      text-sm
                      font-bold
                      text-white
                      shadow-lg
                      shadow-emerald-600/20
                      transition-all
                      hover:-translate-y-0.5
                      hover:shadow-xl
                    "
                  >
                    Déposer une annonce
                  </Link>

                  <button
                    onClick={handleBack}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      px-7
                      py-4
                      text-sm
                      font-semibold
                      text-slate-700
                      transition-all
                      hover:border-emerald-500
                      hover:bg-emerald-50
                      hover:text-emerald-700
                    "
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                  </button>

                </div>

              </div>

              <div className="grid gap-5">

                <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                      <Building2 className="h-6 w-6" />
                    </div>

                    <div>

                      <div className="text-3xl font-black text-slate-950">
                        {total.toLocaleString()}
                      </div>

                      <div className="text-sm text-slate-500">
                        biens disponibles
                      </div>

                    </div>

                  </div>

                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <ShieldCheck className="h-6 w-6" />
                    </div>

                    <div>

                      <div className="text-xl font-black text-slate-950">
                        Plateforme sécurisée
                      </div>

                      <div className="text-sm text-slate-500">
                        Agences vérifiées et annonces contrôlées.
                      </div>

                    </div>

                  </div>

                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Sparkles className="h-6 w-6 text-amber-300" />
                    </div>

                    <div>

                      <div className="text-xl font-black">
                        L'immobilier nouvelle génération
                      </div>

                      <div className="mt-1 text-sm leading-6 text-slate-300">
                        Une plateforme pensée pour offrir une expérience premium à chaque recherche.
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

            <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">

        <SearchFilters
          zoneInput={zoneInput}
          setZoneInput={setZoneInput}
          transaction={transaction}
          type={type}
          budget={budget}
          sort={sort}
          total={total}
          hasActiveFilters={hasActiveFilters}
          onSetParam={setParam}
          onClearAll={clearAll}
        />

      </section>

      <main
        className="
          mx-auto
          max-w-7xl
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >

        <PropertyGrid
          listings={listings}
          loading={loading}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAll}
        />

        {!loading && totalPages > 1 && (

          <div className="mt-14 flex justify-center">

            <Pagination
              currentPage={page}
              totalPages={totalPages}
            />

          </div>

        )}

      </main>

    </div>
  )
}

export default function BiensPage() {
  return (
    <Suspense
      fallback={
        <div
          className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-[#f7f7f5]
          "
        >

          <div className="flex flex-col items-center gap-4">

            <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-slate-200 border-t-emerald-600" />

            <div
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.35em]
                text-slate-400
              "
            >
              Chargement du catalogue...
            </div>

          </div>

        </div>
      }
    >
      <CatalogueContent />
    </Suspense>
  )
}