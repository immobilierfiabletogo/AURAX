'use client'

interface Props {
  value: string | number
  label: string
}

export default function Metric({
  value,
  label,
}: Props) {
  return (
    <div>

      <div className="text-3xl font-black tracking-tight">

        {value}

      </div>

      <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">

        {label}

      </div>

    </div>
  )
}