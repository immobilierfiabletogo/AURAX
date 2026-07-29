'use client'

interface FilterTabsProps<T extends string> {
  value: T
  onChange: (value: T) => void
  items: {
    value: T
    label: string
    count?: number
  }[]
}

export default function FilterTabs<T extends string>({
  value,
  onChange,
  items,
}: FilterTabsProps<T>) {
  return (
    <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl overflow-x-auto">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
            value === item.value
              ? 'bg-white shadow text-slate-900'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {item.label}

          {item.count !== undefined && (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-900/5 text-[9px] font-mono font-bold">
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}