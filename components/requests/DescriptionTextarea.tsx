'use client'

import { FileText } from 'lucide-react'

interface DescriptionTextareaProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  rows?: number
  maxLength?: number
}

export default function DescriptionTextarea({
  value,
  onChange,
  label = 'Décrivez votre besoin',
  placeholder = 'Ex : Je recherche...',
  required = true,
  rows = 6,
  maxLength = 800,
}: DescriptionTextareaProps) {
  return (
    <div className="space-y-2">

      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <FileText className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400" />

        <textarea
          required={required}
          rows={rows}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-none rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

      </div>

      <div className="flex items-center justify-between">

        <p className="text-xs text-slate-500">
          Donnez un maximum de détails afin que les agences puissent mieux vous accompagner.
        </p>

        <span className="text-xs text-slate-400">
          {value.length}/{maxLength}
        </span>

      </div>

    </div>
  )
}