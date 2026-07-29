'use client'

import type { ReactNode } from 'react'

interface FilterRowProps {
  title: string
  children: ReactNode
}

export default function FilterRow({
  title,
  children,
}: FilterRowProps) {
  return (
    <section className="space-y-3">

      <h3
        className="
          text-xs
          font-black
          uppercase
          tracking-widest
          text-slate-400
        "
      >
        {title}
      </h3>

      <div
        className="
          flex
          flex-wrap
          gap-2
        "
      >
        {children}
      </div>

    </section>
  )
}