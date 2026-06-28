'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'
import { Suspense } from 'react'
// 💡 Importation des icônes minimalistes modernes
import { MapPin, Building2, Bed, Home, Ruler, Briefcase, Key, Coins, Zap, Search, X, ChevronRight } from 'lucide-react'

interface Listing {
  id: string
  title: string
  price: number
  zone_saisie: string
  property_type: string
  transaction_type: string
  images_urls: string[]
  is_boosted: boolean
}

function formatPrix(prix: number) {
  return new Intl.NumberFormat('fr-TG', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(prix)
}

const ITEMS_PER_PAGE = 12

const normalize = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

function CatalogueContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const [listings, setListings] = useState<Listing[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const zone = searchParams.get('zone') ?? ''
  const type = searchParams.get('type') ?? ''
  const transaction = searchParams.get('transaction') ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  const [zoneInput, setZoneInput] = useState(zone)
  const [typeInput, setTypeInput] = useState(type)
  const [transactionInput, setTransactionInput] = useState(transaction)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const from = (page - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      let query = supabase
        .from('listings')
        .select('id, title, price, zone_saisie, property_type, transaction_type, images_urls, is_boosted', { count: 'exact' })
        .eq('is_active', true)
        .order('is_boosted', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (zone) query = query.ilike('zone_normalized', `%${normalize(zone)}%`)
      if (type) query = query.eq('property_type', type)
      if (transaction) query = query.eq('transaction_type', transaction)

      const { data, count } = await query
      setListings(data ?? [])
      setTotal(count ?? 0)
      setLoading(false)
    }
    load()
  }, [zone, type, transaction, page])

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (zoneInput) params.set('zone', zoneInput)
    if (typeInput) params.set('type', typeInput)
    if (transactionInput) params.set('transaction', transactionInput)
    router.push(`/biens?${params.toString()}`)
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 antialiased selection:bg-emerald-500/20">
      {/* 1. EN-TÊTE DE PAGE */}
      <div className="border-b border-slate-200/60 bg-white py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Découvrir</span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl font-sans">
            Catalogue des biens
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {total} offre{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
            </span>
          </p>
        </div>
      </div>

      {/* 2. BARRE DE FILTRES FLOTTANTE (STICKY) */}
      <div className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/75 backdrop-blur-lg shadow-xs">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <form className="flex flex-wrap items-center gap-3" onSubmit={handleFilter}>
            
            {/* Zone / Quartier */}
            <div className="relative flex-1 min-w-[260px]">
              <MapPin className="absolute inset-y-0 left-3.5 h-full w-4 text-slate-400 pointer-events-none" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium"
                type="text"
                placeholder="Où cherchez-vous ? (ex: Agoè)"
                value={zoneInput}
                onChange={(e) => setZoneInput(e.target.value)}
              />
            </div>

            {/* Type de bien */}
            <div className="relative min-w-[160px] flex-1 sm:flex-none">
              <select 
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white cursor-pointer transition-all"
                value={typeInput} 
                onChange={(e) => setTypeInput(e.target.value)}
              >
                <option value="">Tous les types</option>
                <option value="appartement">Appartement</option>
                <option value="chambre">Chambre</option>
                <option value="maison">Maison / Villa</option>
                {/*<option value="terrain">Terrain</option>*/}
                <option value="bureau">Bureau</option>
              </select>
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400 text-xs">▼</div>
            </div>

            {/* Type de transaction */}
            <div className="relative min-w-[160px] flex-1 sm:flex-none">
              <select 
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white cursor-pointer transition-all"
                value={transactionInput} 
                onChange={(e) => setTransactionInput(e.target.value)}
              >
                <option value="">Toutes transactions</option>
                <option value="location">Louer</option>
                <option value="vente">Acheter</option>
              </select>
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400 text-xs">▼</div>
            </div>

            {/* Boutons d'actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
              <button 
                type="submit" 
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Rechercher
              </button>

              {(zone || type || transaction) && (
                <Link 
                  href="/biens" 
                  className="px-4 py-2.5 bg-white text-slate-500 border border-slate-200 rounded-xl text-sm font-semibold hover:text-slate-800 hover:bg-slate-50 transition-all text-center flex items-center justify-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Effacer
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* 3. GRILLE DES BIENS */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs">
                <div className="h-48 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-4 bg-slate-200 rounded w-1/3 pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-xs max-w-md mx-auto mt-8 p-6">
            <Home className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-700">Aucun résultat trouvé</h3>
            <p className="text-xs text-slate-400 mt-1">Essayez de modifier vos critères de recherche ou d'élargir votre zone géographique.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((l) => (
                <Link 
                  key={l.id} 
                  href={`/biens/${l.id}`} 
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
                    l.is_boosted ? 'border-amber-400 ring-1 ring-amber-400/20' : 'border-slate-100'
                  }`}
                >
                  {/* Zone Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 h-48">
                    {l.images_urls?.length > 0 ? (
                      <img 
                        src={l.images_urls[0]} 
                        alt={l.title} 
                        className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                        <Home className="w-8 h-8 stroke-[1.5]" />
                      </div>
                    )}
                    
                    {/* Badges Premium */}
                    {l.is_boosted && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-[9px] font-black tracking-wider text-white shadow-xs uppercase">
                        <Zap className="w-2.5 h-2.5 fill-white" /> TOP
                      </span>
                    )}
                    <span className="absolute top-3 right-3 inline-flex items-center rounded-md bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
                      {l.transaction_type === 'louer' || l.transaction_type === 'location' ? 'Location' : 'Vente'}
                    </span>
                  </div>

                  {/* Contenu textuel */}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {l.property_type}
                    </span>
                    <h3 className="mt-1.5 text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {l.title}
                    </h3>
                    
                    {/* Pied de la carte */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-black text-slate-950 font-sans">{formatPrix(l.price)}</span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" /> 
                        {l.zone_saisie}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1
                  const params = new URLSearchParams(searchParams.toString())
                  params.set('page', String(p))
                  return (
                    <Link
                      key={p}
                      href={`/biens?${params.toString()}`}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        page === p 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function BiensPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold tracking-widest text-slate-400 uppercase animate-pulse">
        Chargement d'AURAX...
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  )
}