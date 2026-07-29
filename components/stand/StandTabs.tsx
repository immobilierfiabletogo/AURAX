'use client'

interface Props {
  value: string
  onChange: (value: string) => void
}

const tabs = [
  'Feed',
  'Biens',
  'Avis',
  'À propos',
]

export default function StandTabs({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex gap-3 overflow-auto">

      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`rounded-full px-5 py-3 text-sm font-bold transition ${
            value === tab
              ? 'bg-slate-950 text-white'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          {tab}
        </button>
      ))}

    </div>
  )
}