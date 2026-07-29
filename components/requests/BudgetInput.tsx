'use client'

interface BudgetInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  min?: number
}

export default function BudgetInput({
  value,
  onChange,
  label = 'Budget maximum',
  placeholder = 'Ex : 35 000 000',
  required = false,
  min = 0,
}: BudgetInputProps) {
  return (
    <div className="space-y-2">

      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <input
          type="number"
          value={value}
          required={required}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
          FCFA
        </span>

      </div>

      <p className="text-xs text-slate-500">
        Indiquez votre budget maximal.
      </p>

    </div>
  )
}