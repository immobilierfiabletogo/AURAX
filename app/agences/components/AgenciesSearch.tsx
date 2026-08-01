'use client'

import { Search, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function AgenciesSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative">

      <Search
        className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nom de l'agence, ville ou quartier..."
        className="
          h-16
          w-full
          rounded-3xl
          border
          border-slate-200
          bg-white
          pl-16
          pr-16
          text-base
          outline-none
          transition
          focus:border-emerald-500
          focus:ring-4
          focus:ring-emerald-100
        "
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="
            absolute
            right-5
            top-1/2
            -translate-y-1/2
            rounded-full
            p-2
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
          "
        >
          <X className="h-5 w-5" />
        </button>
      )}

    </div>
  )
}