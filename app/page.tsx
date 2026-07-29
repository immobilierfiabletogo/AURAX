'use client'

import Link from 'next/link'

import SearchBar from '@/components/home/SearchBar'
import ListingsGrid from '@/components/home/ListingsGrid'
import InfiniteLoader from '@/components/home/InfiniteLoader'
import { createClient } from "@/lib/supabase/client";

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


      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between px-4">
        <p className="text-xs font-bold text-slate-500">
          <span className="font-black text-slate-900">
            {total}
          </span>{' '}
          biens disponibles
        </p>

        <Link
          href="/deposer"
          className="hidden rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 sm:inline-flex"
        >
          + Publier gratuitement
        </Link>
      </div>

    

      <div className="mx-auto mt-6 max-w-7xl px-4">
        <ListingsGrid
          listings={listings}
          loading={loading}
        />

        <div ref={observerRef} />

        <InfiniteLoader
          loading={loadingMore}
          hasMore={hasMore}
        />
      </div>

    

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-100 bg-white/90 p-4 backdrop-blur sm:hidden">
        <Link
          href="/deposer"
          className="flex w-full items-center justify-center rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          + Publier une annonce gratuitement
        </Link>
      </div>
    </main>
  )
}