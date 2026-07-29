'use client'

import { Home } from 'lucide-react'
import PropertyCard from './PropertyCard'
import type { Listing } from '@/types/listing'

interface Props {
  listings: Listing[]
  loading: boolean
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export default function PropertyGrid({ listings, loading, hasActiveFilters, onClearFilters }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden border border-slate-100">
            <div className="bg-slate-200" style={{ aspectRatio: '4/3' }} />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-200 rounded w-1/2 mt-2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Home className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-base font-bold text-slate-700 mb-1">Aucun bien trouvé</h3>
        <p className="text-sm text-slate-400 max-w-xs mb-2">
          Aucun bien ne correspond à vos critères.
        </p>
        {hasActiveFilters && (
          <>
            <ul className="text-xs text-slate-400 space-y-1 mb-4">
              <li>✓ Essayez une autre zone</li>
              <li>✓ Changez le type de bien</li>
              <li>✓ Supprimez un filtre</li>
            </ul>
            <button
              onClick={onClearFilters}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl cursor-pointer"
            >
              ↺ Réinitialiser les filtres
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((l) => (
        <PropertyCard key={l.id} listing={l} />
      ))}
    </div>
  )
}