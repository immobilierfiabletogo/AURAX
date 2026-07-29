'use client'

import { Phone } from 'lucide-react'

interface ContactInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
}

export default function ContactInput({
  value,
  onChange,
  label = 'Téléphone / WhatsApp',
  placeholder = '+228 90 00 00 00',
  required = true,
}: ContactInputProps) {
  return (
    <div className="space-y-2">

      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          type="tel"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="tel"
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

      </div>

      <p className="text-xs text-slate-500">
        Les agences utiliseront ce numéro uniquement pour vous contacter au sujet de votre demande.
      </p>

    </div>
  )
}