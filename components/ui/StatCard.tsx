'use client'

import { ReactNode } from 'react'
import Card from './Card'

interface Props {
  title: string
  value: string | number
  icon: ReactNode
  color?: string
  subtitle?: string
}

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  color = 'text-slate-950',
}: Props) {
  return (
    <Card className="p-6">

      <div className="flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          {icon}
        </div>

      </div>

      <div className={`mt-6 text-4xl font-black tracking-tight ${color}`}>
        {value}
      </div>

      <div className="mt-2 text-sm font-semibold text-slate-900">
        {title}
      </div>

      {subtitle && (
        <div className="mt-1 text-xs text-slate-500">
          {subtitle}
        </div>
      )}

    </Card>
  )
}