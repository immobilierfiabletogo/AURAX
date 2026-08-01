'use client'

import AgenciesHero from './components/AgenciesHero'
import AgenciesGrid from './components/AgenciesGrid'
import AgenciesSearch from './components/AgenciesSearch'

import { useAgencies } from './hooks/useAgencies'

export default function AgenciesPage() {
  const {
    agencies,
    loading,
    search,
    setSearch,
    total,
  } = useAgencies()

  return (
    <main className="min-h-screen bg-[#f7f7f5] pb-20 text-slate-900">

      <AgenciesHero />

      <div className="mx-auto mt-8 max-w-7xl px-4">

        <AgenciesSearch
          value={search}
          onChange={setSearch}
        />

        <div className="mt-6 flex items-center justify-between">

          <h2 className="text-lg font-black text-slate-900">
            {total} agences
          </h2>

        </div>

        <div className="mt-8">

          <AgenciesGrid
            agencies={agencies}
            loading={loading}
          />

        </div>

      </div>

    </main>
  )
}