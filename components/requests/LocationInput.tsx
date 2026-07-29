'use client'

import { MapPin } from 'lucide-react'

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
}

export default function LocationInput({
  value,
  onChange,
  label = 'Quartier / Ville',
  placeholder = 'Ex : Agoè, Adidogomé, Baguida...',
  required = false,
}: LocationInputProps) {
  return (
    <div className="space-y-2">

      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

      </div>

      <p className="text-xs text-slate-500">
        Indiquez la ville ou le quartier où vous souhaitez trouver un bien.
      </p>

    </div>
  )
}