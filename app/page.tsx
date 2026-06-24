'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'
import { Search, MapPin, Building2, Zap, ArrowRight, Sparkles, Home } from 'lucide-react'

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

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()
  const [zone, setZone] = useState('')
  const [type, setType] = useState('')
  const [boosted, setBoosted] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('listings')
        .select('id, title, price, zone_saisie, property_type, transaction_type, images_urls, is_boosted')
        .eq('is_boosted', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6)
      setBoosted(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (zone) params.set('zone', zone)
    if (type) params.set('type', type)
    router.push(`/biens?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased selection:bg-emerald-500/20">
      
      {/* 1. HERO SECTION MODIFIÉE (Image en fond) */}
      <div className="relative w-full overflow-hidden">
  
        {/* L'image en background absolu */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-image.jpg" 
            alt="Fond" 
            className="w-full h-full object-cover"
          />
          {/* Voile sombre pour que ton texte reste lisible */}
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>

        {/* Le contenu (Texte + Formulaire) qui vient par-dessus */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-32 flex flex-col items-center text-center">
    
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-6">
            L'Immo <span className="text-emerald-400">Autrement</span>
          </h1>
    
          <p className="text-slate-200 text-lg mb-10 max-w-lg">
            AURAX : Votre futur chez-vous au Togo. Simple, rapide et vérifié.
          </p>

          {/* Ton formulaire de recherche actuel */}
          <form onSubmit={handleSearch} className="w-full max-w-lg bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2">
            <input 
              className="w-full px-5 py-4 bg-transparent outline-none text-sm font-semibold text-slate-900"
              placeholder="Quel quartier recherchez-vous ?"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            />
            <button type="submit" className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition">
              Rechercher
            </button>
          </form>

        </div>
      </div>
            {/* 2. SECTION DES BIENS EXCLUSIFS (BOOSTED) */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Exclusivités</span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Sélection Premium à la une
            </h2>
          </div>
          <Link 
            href="/biens" 
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group"
          >
            Voir tout le catalogue 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          /* SQUELETTES */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-72 border border-slate-100" />
            ))}
          </div>
        ) : boosted.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 max-w-md mx-auto p-6">
            <Home className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="text-sm font-bold text-slate-600">Aucune annonce vedette</div>
            <p className="text-xs text-slate-400 mt-1">Revenez un peu plus tard pour voir les biens à la une.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boosted.map((l) => (
              <Link 
                key={l.id} 
                href={`/biens/${l.id}`} 
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-amber-400 bg-white shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ring-1 ring-amber-400/10"
              >
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-50 h-52">
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
                  
                  {/* Badges d'image */}
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-white shadow-xs uppercase">
                    <Zap className="w-2.5 h-2.5 fill-white" /> TOP
                  </span>
                  <span className="absolute top-3 right-3 inline-flex items-center rounded-md bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
                    {l.transaction_type === 'louer' || l.transaction_type === 'location' ? 'Location' : 'Vente'}
                  </span>
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{l.property_type}</span>
                  <h3 className="mt-1.5 text-base font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {l.title}
                  </h3>
                  
                  {/* Footer de la carte */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-base font-black text-slate-950">{formatPrix(l.price)}</span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" /> 
                      {l.zone_saisie}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 3. SECTION CTA PREMIUM (PROPRIÉTAIRES) */}
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 py-16 px-6 shadow-xl sm:px-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Formes en arrière-plan decoratives */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-72 w-72 rounded-full bg-emerald-500/5 blur-2xl" />

          <div className="relative max-w-xl text-center md:text-left">
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Vous êtes propriétaire d'un bien ?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400 font-medium">
              Publiez votre annonce gratuitement en moins de 2 minutes. Mettez en valeur votre maison ou appartement et trouvez rapidement votre locataire ou acheteur.
            </p>
          </div>
          
          <div className="relative shrink-0 w-full sm:w-auto">
            <Link 
              href="/deposer" 
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              Déposer une annonce gratuitement
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}