'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

interface Props {
  logo: ReactNode
  profile: ReactNode
  items: NavItem[]
  footer?: ReactNode
}

export default function Sidebar({
  logo,
  profile,
  items,
  footer,
}: Props) {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">

      <div className="border-b border-slate-100 p-6">
        {logo}
      </div>

      <div className="p-5">
        {profile}
      </div>

      <nav className="flex-1 space-y-2 px-4">

        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

      </nav>

      {footer && (
        <div className="border-t border-slate-100 p-5">
          {footer}
        </div>
      )}

    </aside>
  )
}