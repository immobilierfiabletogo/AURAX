'use client'

import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function GlassPanel({
  children,
}: Props) {
  return (
    <div className="rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl shadow-xl">
      {children}
    </div>
  )
}