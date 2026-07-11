'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'
import { MapPin, Zap, Home, Search, SlidersHorizontal, X } from 'lucide-react'

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

const normalize = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default function HomePage() {
  const supabase = createClient()

  const [listings, setListings] = useState<Listing[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [transaction, setTransaction] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = search || transaction || propertyType

  const load = useCallback(async (currentPage: number) => {
    if (currentPage === 1) setLoading(true)
    else setLoadingMore(true)

    const from = (currentPage - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    let query = supabase
      .from('listings')
      .select('id, title, price, zone_saisie, property_type, transaction_type, images_urls, is_boosted', { count: 'exact' })
      .eq('is_active', true)
      .eq('status', 'approved')
      .order('is_boosted', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (search) query = query.ilike('zone_normalized', `%${normalize(search)}%`)
    if (transaction) query = query.eq('transaction_type', transaction)
    if (propertyType) query = query.eq('property_type', propertyType)

    const { data, count } = await query

    if (currentPage === 1) {
      setListings(data ?? [])
    } else {
      setListings(prev => {
        const existingIds = new Set(prev.map(l => l.id))
        const newItems = (data ?? []).filter(l => !existingIds.has(l.id))
        return [...prev, ...newItems]
      })
    }

    setTotal(count ?? 0)
    setHasMore((data?.length ?? 0) === ITEMS_PER_PAGE)
    setLoading(false)
    setLoadingMore(false)
  }, [search, transaction, propertyType])

  useEffect(() => {
    setPage(1)
    load(1)
  }, [search, transaction, propertyType])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    load(next)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  const clearFilters = () => {
    setSearch('')
    setSearchInput('')
    setTransaction('')
    setPropertyType('')
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-900 antialiased pb-20 sm:pb-0">

      {/* BARRE DE RECHERCHE STICKY */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">

          {/* Ligne recherche + filtres */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="Quartier, zone... (ex: Agoè, Bè)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button type="button" onClick={() => { setSearchInput(''); setSearch('') }}>
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          </div>

          {/* Filtres rapides */}
          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {[
                { val: '', label: 'Tout' },
                { val: 'location', label: 'Location' },
                { val: 'vente', label: 'Vente' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setTransaction(val)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    transaction === val
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {label}
                </button>
              ))}
              <div className="w-px bg-slate-200 mx-1" />
              {[
                { val: '', label: 'Tous types' },
                { val: 'appartement', label: 'Appartement' },
                { val: 'chambre', label: 'Chambre' },
                { val: 'maison', label: 'Maison/Villa' },
                { val: 'terrain', label: 'Terrain' },
                { val: 'bureau', label: 'Bureau' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setPropertyType(val)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    propertyType === val
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {label}
                </button>
              ))}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 rounded-full text-xs font-bold border border-rose-200 text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all"
                >
                  Effacer tout
                </button>
              )}
            </div>
          )}

          {/* Compteur */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              <span className="text-slate-900 font-black">{total}</span> bien{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
              {hasActiveFilters && <span className="text-emerald-600"> · Filtres actifs</span>}
            </p>
          </div>

        </div>
      </div>

      {/* GRILLE DES BIENS */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden border border-slate-100">
                <div className="h-52 bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Home className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1">Aucun bien trouvé</h3>
            <p className="text-sm text-slate-400 max-w-xs">
              {hasActiveFilters ? 'Essayez de modifier vos filtres.' : 'Aucun bien disponible pour le moment.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.map((l) => (
                <Link
                  key={l.id}
                  href={`/biens/${l.id}`}
                  className={`group flex flex-col overflow-hidden rounded-2xl bg-white border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                    l.is_boosted ? 'border-amber-300' : 'border-slate-100'
                  }`}
                >
                  {/* Image */}
                  <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: '4/3' }}>
                    {l.images_urls?.length > 0 ? (
                      <img
                        src={l.images_urls[0]}
                        alt={l.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Home className="w-10 h-10 stroke-[1]" />
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      {l.is_boosted && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500 text-white text-[9px] font-black uppercase shadow-sm">
                          <Zap className="w-2.5 h-2.5 fill-white" /> TOP
                        </span>
                      )}
                    </div>
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase">
                      {l.transaction_type === 'location' ? 'Location' : 'Vente'}
                    </span>
                  </div>

                  {/* Infos */}
                  <div className="flex flex-col flex-1 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {l.property_type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-2 group-hover:text-emerald-600 transition-colors">
                      {l.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-black text-slate-950">{formatPrix(l.price)}</span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {l.zone_saisie}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* LOAD MORE */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50"
                >
                  {loadingMore ? 'Chargement...' : 'Voir plus de biens'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA FIXE EN BAS — MOBILE ONLY */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 sm:hidden">
        <Link
          href="/deposer"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all"
        >
          + Publier un bien gratuitement
        </Link>
      </div>

    </div>
  )
}
