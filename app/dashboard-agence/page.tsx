'use client'

import NotificationBell from '@/components/NotificationBell'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'
import { 
  LayoutDashboard, PlusCircle, Building2, LogOut, 
  Search, List, Grid, Eye, Trash2, Home, CheckCircle2, 
  MessageSquare, Zap, Calendar, MapPin, Tag, AlertCircle
} from 'lucide-react'

interface Listing {
  id: string
  title: string
  price: number
  zone_saisie: string
  property_type: string
  images_urls: string[]
  is_boosted: boolean
  boosted_until: string | null
  created_at: string
  whatsapp_clicks: number
  views: number
  is_active?: boolean
}

function formatPrix(p: number) {
  return new Intl.NumberFormat('fr-TG', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(p)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getStatut(l: any): 'actif' | 'expire' | 'en_attente' {
  if (!l.boosted_until) return 'en_attente'
  return new Date(l.boosted_until) > new Date() ? 'actif' : 'expire'
}

const STATUT_CONFIG = {
  actif: { label: 'Actif', dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
  en_attente: { label: 'En attente', dot: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700 border-amber-200/60' },
  expire: { label: 'Expiré', dot: 'bg-rose-500', bg: 'bg-rose-50 text-rose-700 border-rose-200/60' },
}

export default function DashboardAgencePage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string>('')
  const [listings, setListings] = useState<Listing[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [filter, setFilter] = useState<'tous' | 'actif' | 'en_attente' | 'expire'>('tous')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'liste' | 'grille'>('liste')
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: p }, { data: l }] = await Promise.all([
        supabase.from('profiles').select('full_name, user_type, subscription_status, phone_number, avatar_url').eq('id', user.id).single(),
        supabase.from('listings').select('id, title, price, zone_saisie, property_type, images_urls, is_boosted, boosted_until, created_at, whatsapp_clicks, views, is_active').eq('agent_id', user.id).order('created_at', { ascending: false })
      ])

      if (p?.user_type !== 'agence') { router.push('/mon-espace'); return }

      setProfile(p)
      setListings((l as Listing[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette annonce ?')) return
    await supabase.from('listings').delete().eq('id', id)
    setListings(prev => prev.filter(l => l.id !== id))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const nom = profile?.full_name ?? ''
  const prenom = nom.split(' ')[0]
  const initiale = nom[0]?.toUpperCase() ?? 'A'

  const totalClics = listings.reduce((acc, l) => acc + (l.whatsapp_clicks ?? 0), 0)
  const totalVues = listings.reduce((acc, l) => acc + (l.views ?? 0), 0)
  const annoncesActives = listings.filter(l => l.is_active !== false).length
  const annoncesBoost = listings.filter(l => l.is_boosted).length

  const counts = {
    tous: listings.length,
    actif: listings.filter(l => getStatut(l) === 'actif').length,
    en_attente: listings.filter(l => getStatut(l) === 'en_attente').length,
    expire: listings.filter(l => getStatut(l) === 'expire').length,
  }

  const filtered = listings
    .filter(l => filter === 'tous' || getStatut(l) === filter)
    .filter(l => search === '' || l.title.toLowerCase().includes(search.toLowerCase()) || l.zone_saisie.toLowerCase().includes(search.toLowerCase()))

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-400 animate-pulse">
      Chargement du tableau de bord...
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-50/60 text-slate-900 antialiased">
      
      {/* SIDEBAR (Fixe sur Desktop, cachée sous 1024px) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 p-5 text-slate-200 border-r border-slate-800/40 transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 px-2">
          <Link href="/" className="text-xl font-black tracking-tight text-white group">
            AURA<span className="text-emerald-500 group-hover:text-emerald-400 transition-colors">X</span>
          </Link>
        </div>

        {/* Profil de l'agence */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800/60 rounded-2xl p-3 mb-6 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-sm shadow-xs">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={nom} className="w-full h-full object-cover" />
            ) : (
              initiale
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-100 truncate">{nom}</div>
            <div className="inline-flex mt-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-[9px] font-mono font-bold tracking-wider uppercase text-amber-400">
              {profile?.subscription_status === 'premium' ? 'Premium' : 'Gratuit'}
            </div>
          </div>
        </div>

        {/* Liens de Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold tracking-widest text-slate-600 uppercase font-mono mb-2">Navigation</p>
          <Link href="/dashboard-agence" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-xs border border-white/5 transition-all">
            <LayoutDashboard className="w-4 h-4 text-amber-500" />
            Tableau de bord
          </Link>
          <Link href="/deposer" 
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 transition-all">
            <PlusCircle className="w-4 h-4" />
            Nouvelle annonce
          </Link>
          <Link href="/dashboard-agence/profil"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 transition-all">
            <Building2 className="w-4 h-4" />
            Mon profil
          </Link>
          <Link href="/biens"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 transition-all">
            <Building2 className="w-4 h-4" />
            Catalogue public
          </Link>
        </div>

        {/* Footer Sidebar */}
        <div className="mt-auto pt-4 border-t border-slate-900">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* ZONE DE CONTENU PRINCIPALE */}
      <div className="flex flex-col flex-1 w-full lg:pl-64">
        
       {/* TOPBAR */}
       <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
         <div className="flex items-center gap-4">
           {/* Bouton Burger visible uniquement sur mobile */}
           <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600">
              ☰
           </button>
           <Link href="/" className="text-base font-black tracking-tight text-slate-950 lg:hidden">
             AU<span className="text-amber-500">RAX</span>
           </Link>
           <span className="hidden sm:inline-block text-xs font-bold text-slate-500 tracking-wide uppercase font-mono">
             Espace Partenaire
           </span>
         </div>
  
         {/* Le bloc propre avec la condition de chargement */}
         <div className="flex items-center gap-3">
           {userId && <NotificationBell agencyId={userId} />}
    
           <Link href="/deposer" className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all">
             <PlusCircle className="w-3.5 h-3.5" />
             Créer une annonce
           </Link>
         </div>
       </header>

        {/* ZONE DU DASHBOARD */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
          {/* EN-TÊTE D'ACCUEIL */}
          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-widest uppercase text-amber-500 font-mono mb-1">Vue d'ensemble</p>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Bonjour, {prenom} 👋
            </h1>
          </div>

          {/* COMPTEURS DE STATISTIQUES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-3">
                <Home className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-slate-950">{listings.length}</div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">Annonces publiées</div>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-500/10 text-slate-600 mb-3">
                <Eye className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-slate-950">{totalVues}</div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">Vues totales</div>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-emerald-600">{annoncesActives}</div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">Annonces en ligne</div>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 mb-3">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-slate-950">{totalClics}</div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">Clics WhatsApp</div>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-purple-600">{annoncesBoost}</div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">Annonces boostées</div>
            </div>
          </div>

          {/* BARRE D'OUTILS (RECHERCHE + FILTRES + VUES) */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-900 font-mono">
              Mes annonces
            </h2>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Recherche dynamique */}
              <div className="relative min-w-[180px] flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-hidden focus:border-amber-400 focus:ring-3 focus:ring-amber-400/5 transition-all" 
                />
              </div>

              {/* Filtres par statuts de boost */}
              <div className="flex items-center gap-0.5 bg-slate-200/60 p-0.5 rounded-xl overflow-x-auto max-w-full">
                {(['tous', 'actif', 'en_attente', 'expire'] as const).map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFilter(f)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                      filter === f 
                        ? 'bg-white text-slate-950 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {f === 'tous' ? 'Toutes' : f === 'actif' ? 'Actives' : f === 'en_attente' ? 'Attente' : 'Expirées'}
                    <span className="px-1.5 py-0.2 bg-slate-900/5 text-[9px] font-mono rounded-md text-slate-600 font-bold">
                      {counts[f]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sélecteur de vue (Liste / Grille) */}
              <div className="flex gap-0.5 bg-slate-200/60 p-0.5 rounded-xl hidden sm:flex">
                <button 
                  onClick={() => setView('liste')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${view === 'liste' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setView('grille')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${view === 'grille' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* AFFICHAGE DES BIENS IMMOBILIERS */}
          {filtered.length === 0 ? (
            /* ÉTAT VIDE */
            <div className="flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-200 rounded-2xl py-14 px-4 shadow-2xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 mb-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                {search ? `Aucun résultat pour "${search}"` : 'Aucune annonce dans cette catégorie'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {search ? 'Veuillez réajuster vos termes de recherche.' : 'Ajoutez votre tout premier bien immobilier dès maintenant.'}
              </p>
            </div>
          ) : view === 'liste' ? (
            /* RENDER VUE: LISTE */
            <div className="space-y-2.5">
              {filtered.map(l => {
                const s = getStatut(l)
                const cfg = STATUT_CONFIG[s]
                return (
                  <div 
                    key={l.id} 
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/70 p-3.5 rounded-2xl transition-all hover:border-amber-400/30 hover:shadow-sm ${
                      l.is_boosted ? 'border-l-4 border-l-amber-400' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Image de couverture */}
                      <div className="h-14 w-18 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-xl shrink-0">
                        {l.images_urls?.length > 0 ? (
                          <img src={l.images_urls[0]} alt={l.title} className="w-full h-full object-cover" />
                        ) : '🏠'}
                      </div>

                      {/* Données textuelles */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xs font-bold text-slate-950 truncate max-w-[240px] sm:max-w-[320px]">
                            {l.title}
                          </h3>
                          {l.is_boosted && (
                            <span className="inline-flex px-1.5 py-0.2 rounded-md bg-amber-400/10 text-[9px] font-extrabold text-amber-700 tracking-wide uppercase">
                              Top
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-medium">
                          <span className="font-bold text-slate-950 text-xs font-mono">{formatPrix(l.price)}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {l.zone_saisie}</span>
                          <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-slate-400" /> {l.property_type}</span>
                          <span className="flex items-center gap-1 hidden md:inline-flex"><Calendar className="w-3 h-3 text-slate-400" /> {formatDate(l.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions & Indicateurs à droite */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 border-t border-slate-100 pt-3 sm:pt-0 sm:border-0 shrink-0">

                    {/* NOUVEAU : Compteur de Vues */}
                    <div className="text-left sm:text-center">
                      <div className="text-base font-black font-mono text-slate-900 tracking-tight leading-none">
                        {l.views ?? 0}
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                        Vues
                      </span>
                    </div>

                      {/* Compteur WhatsApp Clics */}
                      <div className="text-left sm:text-center">
                        <div className="text-base font-black font-mono text-slate-900 tracking-tight leading-none">
                          {l.whatsapp_clicks ?? 0}
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          Clics WA
                        </span>
                      </div>

                      {/* Badge Statut & Boutons actions */}
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        
                        <Link 
                          href={`/biens/${l.id}`} 
                          title="Voir l'annonce"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        
                        <button 
                          onClick={() => handleDelete(l.id)} 
                          title="Supprimer définitivement"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* RENDER VUE: GRILLE */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(l => {
                const s = getStatut(l)
                const cfg = STATUT_CONFIG[s]
                return (
                  <div key={l.id} className="group bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-400/30 transition-all flex flex-col">
                    {/* Image Box */}
                    <div className="relative h-36 bg-slate-100 flex items-center justify-center text-3xl overflow-hidden shrink-0">
                      {l.images_urls?.length > 0 ? (
                        <img src={l.images_urls[0]} alt={l.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                      ) : '🏠'}
                      {l.is_boosted && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wide shadow-xs">
                          Top
                        </span>
                      )}
                    </div>

                    {/* Body Box */}
                    <div className="p-3.5 flex flex-col flex-1">
                      <h3 className="text-xs font-bold text-slate-950 truncate mb-1">{l.title}</h3>
                      <div className="text-sm font-black font-mono text-slate-950 mb-0.5">{formatPrix(l.price)}</div>
                      <div className="text-[11px] text-slate-400 font-medium truncate mb-4">📍 {l.zone_saisie} · {l.property_type}</div>
                      
                      {/* Footer Box */}
                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${cfg.bg}`}>
                          <span className={`h-1 w-1 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          <strong className="text-slate-950 font-black font-mono">{l.whatsapp_clicks ?? 0}</strong> clics
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}