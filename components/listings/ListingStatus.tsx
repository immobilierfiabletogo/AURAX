'use client'

interface Props {
  status: 'actif' | 'expire' | 'en_attente'
}

const CONFIG = {
  actif: {
    label: 'Actif',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  en_attente: {
    label: 'En attente',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  expire: {
    label: 'Expiré',
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
}

export default function ListingStatus({
  status,
}: Props) {
  const s = CONFIG[status]

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold ${s.badge}`}
    >
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}