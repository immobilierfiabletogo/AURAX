'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import { 
  Menu, X, Home, Building2, PlusCircle, 
  User, LogOut, LayoutDashboard, ChevronDown 
} from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type,avatar_url')
          .eq('id', user.id)
          .single()
        setUserType(profile?.user_type ?? null)
        setAvatarUrl(profile?.avatar_url ?? null)
      }
    }
    getUserData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
        setUserType(null)
        setMenuOpen(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // --- CORRECTION : Les Hooks sont tous appelés AVANT ce contrôle ---
  const hiddenRoutes = ['/dashboard-agence']
  if (hiddenRoutes.includes(pathname)) return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
    setMobileNavOpen(false)
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/', label: 'Accueil', icon: Home, exact: true },
    { href: '/biens', label: 'Catalogue', icon: Building2, exact: false },
    { href: '/deposer', label: 'Déposer une annonce', icon: PlusCircle, exact: true },
  ]

  const isLinkActive = (href: string, exact: boolean) => {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/85 backdrop-blur-md antialiased">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          <div className="flex items-center">
           <Link href="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300">
             <img
               src="/logo-aurax.png"
               alt="AURAX"
               className="h-10 w-10 object-cover"
             />
        </div>

        <div className="flex flex-col leading-none">
          <span className="text-xl font-black tracking-tight text-slate-950">
            AU<span className="text-emerald-600">RAX</span>
         </span>

         <span className="text-[10px] uppercase tracking-[2.5px] text-slate-400 font-bold">
           La plateforme immobilière
         </span>
       </div>
    </Link>
    </div>

          {/* Liens centrés et bien espacés */}
          <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href, link.exact)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold tracking-wide transition-colors ${
                  active
                    ? 'text-emerald-600'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative flex items-center">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-orange-700 flex items-center justify-center font-black text-xs text-slate-950 shadow-xs">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      user.email?.[0]?.toUpperCase()
                    )}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {menuOpen && (
                  <div className="absolute top-12 right-0 w-48 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl shadow-slate-200/60 z-50">
                    <Link
                      href={userType === 'agence' ? '/dashboard-agence' : '/mon-espace'}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      {userType === 'agence' ? 'Dashboard' : 'Mon espace'}
                    </Link>
                    <Link
                      href="/deposer"
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <PlusCircle className="w-4 h-4 text-slate-400" />
                      Nouvelle annonce
                    </Link>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/60 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link href="/login" className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-950 rounded-xl transition-colors">
                  Connexion
                </Link>
                <Link href="/register" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all">
                  S'inscrire
                </Link>
              </div>
            )}

            <div className="flex md:hidden">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-950 transition-colors cursor-pointer"
              >
                {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg shadow-slate-100/60">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isLinkActive(link.href, link.exact)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </Link>
            )
          })}
          {!user && (
            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileNavOpen(false)} className="w-full py-2.5 text-center text-sm font-bold text-slate-700 bg-slate-50 rounded-xl">Connexion</Link>
              <Link href="/register" onClick={() => setMobileNavOpen(false)} className="w-full py-2.5 text-center text-sm font-extrabold text-slate-950 bg-emerald-600 text-white rounded-xl shadow-xs">S'inscrire</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}