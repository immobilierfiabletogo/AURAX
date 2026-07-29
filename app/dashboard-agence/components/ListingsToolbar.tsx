'use client'

import { Search, Grid, List } from 'lucide-react'

interface Props {
  search: string
  setSearch: (value: string) => void

  filter: 'tous' | 'actif' | 'en_attente' | 'expire'

  setFilter: (
    value: 'tous' | 'actif' | 'en_attente' | 'expire'
  ) => void

  counts: {
    tous: number
    actif: number
    en_attente: number
    expire: number
  }

  view: 'liste' | 'grille'

  setView: (v: 'liste' | 'grille') => void
}

export default function ListingsToolbar({
  search,
  setSearch,
  filter,
  setFilter,
  counts,
  view,
  setView,
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4 mb-6">

      <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-900 font-mono">
        Mes annonces
      </h2>

      <div className="flex flex-wrap items-center gap-3">

        {/* Recherche */}

        <div className="relative min-w-[190px]">

          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-medium outline-none transition focus:border-amber-400"
          />

        </div>

        {/* Filtres */}

        <div className="flex rounded-xl bg-slate-100 p-1">

          {(
            [
              'tous',
              'actif',
              'en_attente',
              'expire',
            ] as const
          ).map((item) => (

            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-lg px-3 py-2 text-[11px] font-bold transition ${
                filter === item
                  ? 'bg-white shadow text-slate-900'
                  : 'text-slate-500'
              }`}
            >
              {item === 'tous'
                ? 'Toutes'
                : item === 'actif'
                ? 'Actives'
                : item === 'en_attente'
                ? 'Attente'
                : 'Expirées'}

              <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">
                {counts[item]}
              </span>

            </button>

          ))}

        </div>

        {/* Vue */}

        <div className="hidden rounded-xl bg-slate-100 p-1 sm:flex">

          <button
            onClick={() => setView('liste')}
            className={`rounded-lg p-2 ${
              view === 'liste'
                ? 'bg-white shadow'
                : ''
            }`}
          >
            <List size={16} />
          </button>

          <button
            onClick={() => setView('grille')}
            className={`rounded-lg p-2 ${
              view === 'grille'
                ? 'bg-white shadow'
                : ''
            }`}
          >
            <Grid size={16} />
          </button>

        </div>

      </div>

    </div>
  )
}