'use client'

import type { ReactNode } from 'react'

interface FilterButtonProps {
  active: boolean
  children: ReactNode
  onClick: () => void
  color?: 'dark' | 'emerald' | 'blue'
}

export default function FilterButton({
  active,
  children,
  onClick,
  color = 'dark',
}: FilterButtonProps) {
  const activeClass = {
    dark: 'bg-slate-900 text-white border-slate-900',
    emerald: 'bg-emerald-600 text-white border-emerald-600',
    blue: 'bg-blue-600 text-white border-blue-600',
  }[color]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-2
        px-4 py-2
        rounded-full
        text-xs
        font-semibold
        border
        whitespace-nowrap
        transition-all
        duration-200

        ${
          active
            ? activeClass
            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
        }
      `}
    >
      {children}
    </button>
  )
}