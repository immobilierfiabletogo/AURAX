'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'
import { ArrowLeft, MapPin, Building2, Zap, Phone, MessageSquare, Calendar, ShieldCheck, Share2, Info } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  zone_saisie: string
  property_type: string
  transaction_type: string
  images_urls: string[]
  is_boosted: boolean
  created_at: string
  // Optionnel : ajouter un numéro si présent en base, sinon on met un fallback
  contact_phone?: string 
}

function formatPrix(prix: number) {
  return new Intl.NumberFormat('fr-TG', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(prix)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default function BienDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState<string>('')
  const [agence, setAgence] = useState<any>(null)
  const [isParticulier, setIsParticulier] = useState(false)


  const handleWhatsAppClick = async () => {
    if (listing?.id) {
      await supabase.rpc('increment_whatsapp_clicks', { listing_id: listing.id });
    }
  };
  useEffect(() => {
    // Si l'ID n'est pas présent, on arrête tout
    if (!params?.id) return;

    // Définition des fonctions
    const trackView = async () => {
      await supabase.rpc('increment_views', { listing_id: params.id as string });
    };

    const fetchDetail = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) {
        setListing(data);
        if (data.agent_id) {
          const { data: agenceData } = await supabase
            .from('profiles')
            .select('full_name, phone_number, avatar_url')
            .eq('id', data.agent_id)
            .single();
          setAgence(agenceData);
        }
        if (data?.agent_id) {
         const { data: profileData } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', data.agent_id)
            .single()
         setIsParticulier(profileData?.user_type === 'particulier')
        }
        if (data.images_urls && data.images_urls.length > 0) {
          setActiveImage(data.images_urls[0]);
        }
      } // C'est cette accolade qui manquait
      setLoading(false);
    };

    // Exécution des deux
    trackView();
    fetchDetail();
    
  }, [params?.id]); // Le tableau de dépendances surveille uniquement le changement d'ID

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-600" />
        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase animate-pulse">Chargement du bien...</span>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Info className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-bold text-slate-800">Annonce introuvable</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xs">Ce bien a peut-être été retiré ou n'existe plus.</p>
        <Link href="/biens" className="mt-6 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xs">
          Retour au catalogue
        </Link>
      </div>
    )
  }

  // Numéro par défaut : priorité à l'agent, sinon le listing, sinon le fixe AURAX
  const telephoneContact = listing.contact_phone || agence?.phone_number || '+22879963708'
  const messageWhatsapp = encodeURIComponent(`Bonjour, je suis très intéressé par votre annonce "${listing.title}" sur AURAX (${formatPrix(listing.price)} à ${listing.zone_saisie}). Est-elle toujours disponible ?`)
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 antialiased">
      
      {/* 1. BARRE DE NAVIGATION SUPÉRIEURE */}
      <div className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Retour
          </button>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Réf : {listing.id.slice(0, 8)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. CORPS DE LA PAGE (LAYOUT ASYMÉTRIQUE) */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          
          {/* COLONNE GAUCHE : VISUELS ET INFOS (70%) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* BLOC IMAGES PRESTIGE */}
            <div className="space-y-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-900 shadow-xs">
                {activeImage ? (
                  <img 
                    src={activeImage} 
                    alt={listing.title} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                    <Building2 className="w-16 h-16 stroke-[1]" />
                  </div>
                )}

                {/* Badges Flottants sur l'image principale */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {listing.is_boosted && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-sm">
                      <Zap className="w-3 h-3 fill-white" /> EXCLUSIF
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-md bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                    {listing.transaction_type === 'louer' || listing.transaction_type === 'location' ? 'À Louer' : 'À Vendre'}
                  </span>
                </div>
              </div>

              {/* Miniatures d'images de la galerie */}
              {listing.images_urls && listing.images_urls.length > 1 && (
                <div className="flex flex-wrap gap-2.5">
                  {listing.images_urls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(url)}
                      className={`relative h-20 w-28 overflow-hidden rounded-xl border-2 transition-all bg-slate-100 shrink-0 cursor-pointer ${
                        activeImage === url ? 'border-emerald-500 shadow-md scale-98' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* EN-TÊTE DU BIEN & CARACTÉRISTIQUES RAPIDES */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {listing.property_type}
                </span>
                <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {listing.title}
                </h1>
                
                <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" /> {listing.zone_saisie}
                  </span>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" /> Publié le {formatDate(listing.created_at)}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Prix demandé</span>
                <div className="text-3xl font-black text-slate-950 mt-1">{formatPrix(listing.price)}</div>
              </div>
            </div>

            {/* DESCRIPTION DU BIEN */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-extrabold text-slate-950 tracking-tight border-b border-slate-100 pb-4">
                Description du bien
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
                {listing.description || "Aucune description détaillée n'a été fournie pour ce bien. Veuillez contacter directement l'annonceur via le panneau latéral pour obtenir des renseignements complémentaires."}
              </p>
            </div>

            {/* GARANTIE SÉCURITÉ TECH */}
            <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100/60 p-5 flex items-start gap-4">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">Charte de confiance AURAX</h3>
                <p className="text-xs font-medium text-emerald-800/80 mt-0.5 leading-relaxed">
                  Cette annonce est soumise à notre protocole de vérification standard. Ne versez jamais d'acompte financier ou de frais de visite avant d'avoir inspecté physiquement le bien en présence d'un agent officiel.
                </p>
              </div>
            </div>

          </div>

          {/* COLONNE DROITE : CONTACT SIDEBAR COLLANTE (30%) */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-lg shadow-slate-100/80">
              <h3 className="text-sm font-black text-slate-950 tracking-tight mb-4">
                Contacter l'annonceur
              </h3>
              
              {/* Profil sommaire de l'agent / Prop */}
              <div className="flex items-center gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-6">
                <div className="h-10 w-10 rounded-full bg-slate-900 overflow-hidden flex items-center justify-center shadow-xs shrink-0">
                  {agence?.avatar_url ? (
                    <img src={agence.avatar_url} alt={agence.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-black text-xs">
                      {agence?.full_name?.[0]?.toUpperCase() ?? 'A'}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{agence?.full_name ?? 'Agence AURAX'}</div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Réponse rapide
                  </span>
                </div>
              </div>

              {/* Boutons de conversion immédiate */}
              <div className="space-y-2.5">
                {/* Bouton WhatsApp */}
                <a
                  href={`https://wa.me/${telephoneContact.replace(/\s+/g, '')}?text=${messageWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  Discuter sur WhatsApp
                </a>
                

                {/* Bouton Appel Direct */}
                <a
                  href={`tel:${telephoneContact}`}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  Appeler directement
                </a>
              </div>

              {/* Rappel des conditions locales */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400 text-center flex items-center justify-center gap-1">
                <span>📍 Service disponible sur Lomé et ses environs</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}