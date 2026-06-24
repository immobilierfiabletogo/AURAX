
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  price: number
  zone_saisie: string
  property_type: string
  transaction_type: string
  images_urls: string[]
  is_boosted: boolean
  boosted_until: string | null
  created_at: string
  is_active: boolean
}

interface Profile {
  full_name: string | null
  user_type: string | null
}

function formatPrix(p: number) {
  return new Intl.NumberFormat('fr-TG', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(p)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

type StatutType = 'actif' | 'en_attente' | 'expire'

function getStatut(l: Listing): StatutType {
  if (!l.is_active) return 'en_attente'
  if (l.boosted_until && new Date(l.boosted_until) < new Date()) return 'expire'
  return 'actif'
}

const STATUT_CONFIG = {
  actif:      { label: 'Actif',       dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  en_attente: { label: 'En attente',  dot: 'bg-emerald-400',   badge: 'bg-emerald-50 text-amber-700 border border-amber-200' },
  expire:     { label: 'Expiré',      dot: 'bg-red-400',     badge: 'bg-red-50 text-red-600 border border-red-200' },
}

export default function MonEspacePage() {
  const router = useRouter()
  const supabase = createClient()
  const [listings, setListings] = useState<Listing[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [filter, setFilter] = useState<'tous' | StatutType>('tous')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserEmail(user.email ?? '')
      const [{ data: l }, { data: p }] = await Promise.all([
        supabase.from('listings').select('id, title, price, zone_saisie, property_type, transaction_type, images_urls, is_boosted, boosted_until, created_at, is_active').eq('agent_id', user.id).order('created_at', { ascending: false }),
        supabase.from('profiles').select('full_name, user_type').eq('id', user.id).single()
      ])
      setListings(l ?? [])
      setProfile(p)
      setLoading(false)
    }
    load()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement cette annonce ?')) return
    const { error } = await supabase.from('listings').delete().eq('id', id)
    if (!error) setListings(prev => prev.filter(l => l.id !== id))
  }

  const prenom = profile?.full_name?.split(' ')[0] ?? userEmail.split('@')[0]
  const filtered = filter === 'tous' ? listings : listings.filter(l => getStatut(l) === filter)
  const counts = {
    tous: listings.length,
    actif: listings.filter(l => getStatut(l) === 'actif').length,
    en_attente: listings.filter(l => getStatut(l) === 'en_attente').length,
    expire: listings.filter(l => getStatut(l) === 'expire').length,
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Chargement...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50/60">

      {/* ── HERO HEADER ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-emerald-500 font-mono mb-2">Espace Propriétaire</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                Bonjour, {prenom} 👋
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {counts.tous === 0 ? 'Aucune annonce publiée pour le moment.' : `${counts.tous} annonce${counts.tous > 1 ? 's' : ''} publiée${counts.tous > 1 ? 's' : ''}`}
              </p>
            </div>
            <Link
              href="/deposer"
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              <span className="hidden sm:inline">Nouvelle annonce</span>
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { val: counts.tous,    label: 'Total',     color: 'text-gray-900' },
              { val: counts.actif,   label: 'Actives',   color: 'text-emerald-500' },
              { val: listings.filter(l => l.is_boosted).length, label: 'Boostées', color: 'text-gray-900' },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${s.color}`}>{s.val}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">

        {/* ── FILTERS ── */}
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl p-1.5 mb-5 overflow-x-auto shadow-sm">
          {(['tous', 'actif', 'en_attente', 'expire'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                filter === f
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {f === 'tous' ? 'Toutes' : f === 'actif' ? 'Actives' : f === 'en_attente' ? 'En attente' : 'Expirées'}
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                filter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* ── LISTE ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl">
            <div className="text-5xl mb-4 opacity-20">🏠</div>
            <p className="text-base font-semibold text-gray-300 mb-1">Aucune annonce ici</p>
            <p className="text-sm text-gray-300 mb-6">
              {filter === 'tous' ? "Déposez votre première annonce gratuitement." : "Aucune annonce avec ce statut."}
            </p>
            {filter === 'tous' && (
              <Link href="/deposer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                Déposer une annonce
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((l, i) => {
              const s = getStatut(l)
              const cfg = STATUT_CONFIG[s]
              const hasImg = l.images_urls?.length > 0

              return (
                <div
                  key={l.id}
                  className={`group bg-white rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5 overflow-hidden ${
                    l.is_boosted ? 'border-l-4 border-l-emerald-400 border-gray-100' : 'border-gray-100'
                  }`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-center gap-4 p-4">

                    {/* IMAGE */}
                    <div className="hidden sm:block w-16 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                      {hasImg
                        ? <img src={l.images_urls[0]} alt={l.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl text-gray-200">🏠</div>
                      }
                    </div>

                    {/* BODY */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h2 className="text-sm font-bold text-gray-900 truncate">{l.title}</h2>
                        {l.is_boosted && (
                          <span className="flex-shrink-0 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded-full">
                            ⚡ Top
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-sm font-bold text-gray-900 font-mono">{formatPrix(l.price)}</span>
                        <span className="text-xs text-gray-400">📍 {l.zone_saisie}</span>
                        <span className="text-xs text-gray-400 hidden sm:inline capitalize">🏷 {l.property_type}</span>
                        <span className="text-xs text-gray-400 hidden sm:inline capitalize">🔄 {l.transaction_type}</span>
                        <span className="text-[11px] text-gray-300 font-mono hidden sm:inline">📅 {formatDate(l.created_at)}</span>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${cfg.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                      <div className="flex gap-1.5">
                        <Link
                          href={`/biens/${l.id}`}
                          className="w-8 h-8 rounded-lg border border-gray-100 bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 hover:text-gray-700 transition-colors"
                          title="Voir"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="w-8 h-8 rounded-lg border border-gray-100 bg-gray-50 text-gray-400 flex items-center justify-center hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
