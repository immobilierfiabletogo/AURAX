'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import {
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import type {
  AuthChangeEvent,
  Session,
  User,
} from '@supabase/supabase-js'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const supabase = useMemo(() => createClient(), [])

  const [user, setUser] = useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] =
    useState<string | null>(null)

  const [menuOpen, setMenuOpen] =
    useState(false)

  const [mobileOpen, setMobileOpen] =
    useState(false)

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setUser(null)
        return
      }

      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single()

      setAvatarUrl(profile?.avatar_url ?? null)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (
        _event: AuthChangeEvent,
        session: Session | null
      ) => {
        if (!session?.user) {
          setUser(null)
          setAvatarUrl(null)
          setMenuOpen(false)
          return
        }

        setUser(session.user)
        loadUser()
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const hiddenRoutes = [
    '/dashboard-agence',
  ]

  if (hiddenRoutes.includes(pathname)) {
    return null
  }

  async function handleLogout() {
    await supabase.auth.signOut()

    setMenuOpen(false)
    setMobileOpen(false)

    router.push('/')
    router.refresh()
  }

  const navLinks = [
   {
     href: '/',
     label: 'Accueil',
     exact: true,
   },
   {
     href: '/biens',
     label: 'Catalogue',
     exact: false,
   },
   {
     href: '/agences',
     label: 'Agences',
     exact: false,
   },
   {
    href: '/demandes',
    label: 'Demandes',
    exact: false,
  },

  ]

  const isActive = (
    href: string,
    exact: boolean
  ) => {
    return exact
      ? pathname === href
      : pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="overflow-hidden rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-lg">

            <Image
              src="/logo-aurax.png"
              alt="AURAX"
              width={40}
              height={40}
              className="h-10 w-10 object-cover"
            />

          </div>

          <div className="leading-none">

            <h2 className="text-xl font-black tracking-tight text-slate-950">
              AU
              <span className="text-emerald-600">
                RAX
              </span>
            </h2>

            <p className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">
              Le réseau immobilier du Togo
            </p>

          </div>
        </Link>

        <div className="hidden items-center gap-10 md:flex">

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-bold transition ${
                isActive(
                  link.href,
                  link.exact
                )
                  ? 'text-emerald-600'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {link.label}
            </Link>
          ))}

        </div>

                <div className="flex items-center gap-2">

          {user ? (
            <div className="relative">

              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:border-slate-300 hover:bg-white"
              >
                <div
  className="
    relative
    flex
    h-10
    w-10
    items-center
    justify-center
    overflow-hidden
    rounded-full
    bg-gradient-to-br
    from-emerald-500
    via-emerald-600
    to-emerald-800
    ring-2
    ring-white
    shadow-[0_8px_24px_rgba(16,185,129,.35)]
    transition-all
    duration-300
    group-hover:scale-105
  "
>
  {avatarUrl ? (
    <Image
      src={avatarUrl}
      alt="Profil"
      fill
      className="object-cover"
    />
  ) : (
    <>
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.45),transparent_45%)]
        "
      />

      <span
        className="
          relative
          text-sm
          font-black
          tracking-wide
          text-white
          drop-shadow-md
        "
      >
        {user.email?.charAt(0).toUpperCase()}
      </span>
    </>
  )}
</div>

                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {menuOpen && (

                <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                  <Link
                    href="/dashboard-agence"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                    Espace agence
                  </Link>

                  <div className="border-t border-slate-100" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>

                </div>

              )}

            </div>
          ) : (

            <div className="hidden items-center gap-3 sm:flex">

              <Link
                href="/login"
                className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
              >
                Se connecter
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Rejoindre AURAX
              </Link>

            </div>

          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

        </div>

      </div>

      {mobileOpen && (
  <>
    <div
      onClick={() => setMobileOpen(false)}
      className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm md:hidden"
    />

    <div className="fixed inset-x-4 top-20 z-50 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl md:hidden">
      <div className="space-y-1 p-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              isActive(link.href, link.exact)
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="border-t border-slate-100 p-4">
        {user ? (
          <div className="space-y-3">
            <Link
              href="/dashboard-agence"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LayoutDashboard className="mr-2 h-4 w-4 text-emerald-600" />
              Espace agence
            </Link>

            <button
              onClick={handleLogout}
              className="w-full rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="block rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Ouvrir un espace agence
            </Link>

            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </div>
  </>
)}
    </nav>
  )
}