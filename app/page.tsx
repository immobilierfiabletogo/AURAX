'use client'

import Link from 'next/link'

import SearchBar from '@/components/home/SearchBar'
import ListingsGrid from '@/components/home/ListingsGrid'
import InfiniteLoader from '@/components/home/InfiniteLoader'

import { useListings } from '@/hooks/useListings'

export default function HomePage() {
  const {
    listings,
    loading,
    loadingMore,
    total,
    search,
    setSearch,
    hasMore,
    observerRef,
  } = useListings()

  return (
    <main className="min-h-screen bg-[#f7f7f5] pb-20 text-slate-900 antialiased sm:pb-0">

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Catalogue
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              Les dernières opportunités
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
              Explorez des biens publiés récemment par des agences
              et des propriétaires partout au Togo.
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

              <div className="text-3xl font-black text-slate-900">
                {total}
              </div>

              <div className="text-sm text-slate-500">
                biens disponibles
              </div>

            </div>

            <Link
              href="/deposer"
              className="
                hidden
                rounded-2xl
                bg-emerald-600
                px-6
                py-4
                text-sm
                font-bold
                text-white
                transition
                hover:bg-emerald-700
                lg:inline-flex
              "
            >
              Déposer une annonce
            </Link>

          </div>

        </div>

      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">

        <ListingsGrid
          listings={listings}
          loading={loading}
        />

        <div
          ref={observerRef}
          className="h-8"
        />

        <InfiniteLoader
          loading={loadingMore}
          hasMore={hasMore}
        />

      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 p-4 backdrop-blur lg:hidden">

        <Link
          href="/deposer"
          className="
            flex
            w-full
            items-center
            justify-center
            rounded-2xl
            bg-emerald-600
            py-4
            text-sm
            font-bold
            text-white
            transition
            hover:bg-emerald-700
          "
        >
          Déposer une annonce
        </Link>

      </div>

    </main>
  )
}