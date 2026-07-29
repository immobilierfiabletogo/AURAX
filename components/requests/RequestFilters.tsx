'use client'

import { Search, MapPin } from 'lucide-react'

interface RequestFiltersProps {
  search: string
  onSearchChange: (value: string) => void

  type: string
  onTypeChange: (value: string) => void

  onlyActive?: boolean
  onOnlyActiveChange?: (value: boolean) => void
}

const PROPERTY_TYPES = [
  '',
  'Maison',
  'Appartement',
  'Villa',
  'Terrain',
  'Studio',
  'Bureau',
  'Local commercial',
  'Immeuble',
  'Ferme',
  'Entrepôt',
  'Autre',
]

export default function RequestFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  onlyActive,
  onOnlyActiveChange,
}: RequestFiltersProps) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <div className="grid gap-4 lg:grid-cols-3">

        <div className="relative">

          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher une demande..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

        </div>

        <div className="relative">

          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">
              Tous les types
            </option>

            {PROPERTY_TYPES.filter(Boolean).map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

        </div>

        {onOnlyActiveChange && (
          <label className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">

            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) =>
                onOnlyActiveChange(e.target.checked)
              }
            />

            <span className="font-medium text-slate-700">
              Afficher uniquement les demandes actives
            </span>

          </label>
        )}

      </div>

    </div>
  )
}