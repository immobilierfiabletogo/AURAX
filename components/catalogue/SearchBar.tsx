'use client'

import { Search, SlidersHorizontal } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onOpen: () => void
}

export default function SearchBar({
  value,
  onChange,
  onOpen,
}: SearchBarProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="
        group
        flex
        w-full
        items-center
        justify-between
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-5
        py-4
        shadow-sm
        transition-all
        hover:border-emerald-500
        hover:shadow-md
      "
    >
      <div className="flex items-center gap-4">
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-emerald-50
            transition
            group-hover:bg-emerald-100
          "
        >
          <Search className="h-5 w-5 text-emerald-600" />
        </div>

        <div className="text-left">
          <p className="font-bold text-slate-900">
            {value || 'Rechercher un bien'}
          </p>

          <p className="text-xs text-slate-500">
            {value || 'Ville • Quartier • Budget • Type • Transaction'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {value && (
          <span
            className="
              rounded-full
              bg-emerald-100
              px-3
              py-1
              text-xs
              font-semibold
              text-emerald-700
            "
          >
            {value}
          </span>
        )}

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            transition
            group-hover:bg-slate-100
          "
        >
          <SlidersHorizontal className="h-5 w-5 text-slate-600" />
        </div>
      </div>
    </button>
  )
}