'use client'

const PROPERTY_TYPES = [
  'Maison',
  'Appartement',
  'Terrain',
  'Villa',
  'Autre',
]

interface PropertyTypeSelectProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
  label?: string
}

export default function PropertyTypeSelect({
  value,
  onChange,
  required = true,
  label = 'Type de bien recherché',
}: PropertyTypeSelectProps) {
  return (
    <div className="space-y-2">

      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">
          Sélectionnez un type de bien
        </option>

        {PROPERTY_TYPES.map((type) => (
          <option
            key={type}
            value={type}
          >
            {type}
          </option>
        ))}

      </select>

      <p className="text-xs text-slate-500">
        Choisissez le type de bien que vous recherchez.
      </p>

    </div>
  )
}