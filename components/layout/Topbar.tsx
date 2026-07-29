'use client'

import { ReactNode } from 'react'

interface Props {
  left: ReactNode
  right: ReactNode
}

export default function Topbar({
  left,
  right,
}: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {left}

        {right}

      </div>

    </header>
  )
}
