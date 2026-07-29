'use client'

import Link from 'next/link'
import { Menu, PlusCircle } from 'lucide-react'
import NotificationBell from '@/components/NotificationBell'

interface AgencyTopbarProps {
  agencyId: string
  onMenu: () => void
}

export default function AgencyTopbar({
  agencyId,
  onMenu,
}: AgencyTopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">

      <div className="flex items-center gap-4">

        <button
          onClick={onMenu}
          className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
            Cockpit AURAX
          </p>

          <h2 className="text-sm font-bold text-slate-900">
            Tableau de bord
          </h2>
        </div>

      </div>

      <div className="flex items-center gap-3">

        {agencyId && (
          <NotificationBell agencyId={agencyId} />
        )}

        <Link
          href="/deposer"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
        >
          <PlusCircle size={16} />
          Nouvelle annonce
        </Link>

      </div>

    </header>
  )
}