'use client'

import Link from 'next/link'
import {
  Home,
  LayoutDashboard,
  PlusCircle,
  Building2,
  LogOut,
} from 'lucide-react'

import Badge from '@/components/ui/Badge'

interface AgencySidebarProps {
  profile: {
    full_name?: string | null
    avatar_url?: string | null
    plan?: string | null
  } | null

  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export default function AgencySidebar({
  profile,
  isOpen,
  onClose,
  onLogout,
}: AgencySidebarProps) {
  const nom = profile?.full_name ?? ''
  const initiale = nom.charAt(0).toUpperCase() || 'A'

  const planVariant =
    profile?.plan === 'premium'
      ? 'premium'
      : profile?.plan === 'pro'
      ? 'pro'
      : 'start'

  const planLabel =
    profile?.plan === 'premium'
      ? 'AURAX PREMIUM'
      : profile?.plan === 'pro'
      ? 'AURAX PRO'
      : 'AURAX START'

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-200 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Glow */}

        <div className="absolute -left-24 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex h-full flex-col p-6">

          {/* Logo */}

          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex flex-col"
            >
              <span className="text-3xl font-black tracking-tight text-white">
                AU
                <span className="text-emerald-400">
                  RAX
                </span>
              </span>

              <span className="mt-1 text-[11px] uppercase tracking-[0.35em] text-slate-500">
                Cockpit
              </span>
            </Link>
          </div>

          {/* Carte agence */}

          <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

            <div className="flex items-center gap-4">

              <div className="h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 shadow-lg">

                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={nom}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-lg font-black text-slate-950">
                    {initiale}
                  </div>
                )}

              </div>

              <div className="min-w-0 flex-1">

                <h3 className="truncate text-sm font-bold text-white">
                  {nom}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Agence partenaire
                </p>

              </div>

            </div>

            <div className="mt-5">
              <Badge variant={planVariant}>
                {planLabel}
              </Badge>
            </div>

          </div>

          {/* Navigation */}

          <nav className="space-y-2">

            <Link
              href="/"
              onClick={onClose}
              className="group flex items-center gap-4 rounded-2xl px-4 py-3 text-slate-400 transition-all duration-300 hover:bg-white/5 hover:text-white"
            >
              <Home
                size={19}
                className="transition group-hover:text-amber-400"
              />

              <span>Accueil</span>

            </Link>

            <Link
              href="/dashboard-agence"
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-semibold text-white transition-all duration-300 hover:border-amber-400/30 hover:bg-white/15"
            >
              <LayoutDashboard
                size={19}
                className="text-amber-400"
              />

              <span>Tableau de bord</span>

            </Link>

            <Link
              href="/deposer"
              onClick={onClose}
              className="group flex items-center gap-4 rounded-2xl px-4 py-3 text-slate-400 transition-all duration-300 hover:bg-white/5 hover:text-white"
            >
              <PlusCircle
                size={19}
                className="transition group-hover:text-amber-400"
              />

              <span>Nouvelle annonce</span>

            </Link>

            <Link
              href="/dashboard-agence/profil"
              onClick={onClose}
              className="group flex items-center gap-4 rounded-2xl px-4 py-3 text-slate-400 transition-all duration-300 hover:bg-white/5 hover:text-white"
            >
              <Building2
                size={19}
                className="transition group-hover:text-amber-400"
              />

              <span>Mon profil</span>

            </Link>

          </nav>

          {/* Déconnexion */}

          <div className="mt-auto border-t border-white/10 pt-6">

            <button
              onClick={onLogout}
              className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-slate-500 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={19} />

              <span>Déconnexion</span>

            </button>

          </div>

        </div>

      </aside>

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  )
}