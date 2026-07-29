'use client'

import { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  children: ReactNode
  className?: string
}

export default function Card({
  children,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl',
        className
      )}
    >
      {children}
    </div>
  )
}