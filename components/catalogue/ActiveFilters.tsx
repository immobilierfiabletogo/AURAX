'use client'

import type { LucideIcon } from 'lucide-react'
import { X } from 'lucide-react'

type FilterKey =
  | 'transaction'
  | 'type'
  | 'budget'
  | 'sort'
  | 'zone'

interface Badge {
  key: FilterKey
  label: string
  icon: LucideIcon
}

interface ActiveFiltersProps {
  total: number
  badges: Badge[]
  hasActiveFilters: boolean
  onRemove: (key: FilterKey) => void
  onClearAll: () => void
}

export default function ActiveFilters({
  total,
  badges,
  hasActiveFilters,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium text-slate-500">
          <span className="font-black text-slate-900">
            {total}
          </span>{' '}
          bien{total > 1 ? 's' : ''}
        </p>

        {badges.map(({ key, label, icon: Icon }) => (
          <span
            key={key}
            className="
              flex items-center gap-1.5
              rounded-full
              border border-emerald-200
              bg-emerald-50
              px-3
              py-1.5
              text-xs
              font-semibold
              text-emerald-700
            "
          >
            <Icon className="h-3.5 w-3.5" />

            <span>{label}</span>

            <button
              type="button"
              aria-label="Supprimer le filtre"
              onClick={() => onRemove(key)}
              className="
                rounded-full
                p-0.5
                transition
                hover:bg-emerald-100
              "
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="
            text-xs
            font-bold
            text-rose-500
            transition
            hover:text-rose-600
          "
        >
          Réinitialiser
        </button>
      )}
    </div>
  )
}