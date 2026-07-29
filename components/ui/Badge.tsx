'use client'

interface Props {
  children: React.ReactNode
  variant?: 'premium' | 'pro' | 'start' | 'default'
}

const variants = {
  premium:
    'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 shadow-lg shadow-amber-400/20',

  pro:
    'bg-slate-950 text-white',

  start:
    'border border-slate-200 bg-slate-100 text-slate-700',

  default:
    'bg-slate-100 text-slate-700',
}

export default function Badge({
  children,
  variant = 'default',
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] ${variants[variant]}`}
    >
      <span className="text-[13px] leading-none">◈</span>
      {children}
    </span>
  )
}