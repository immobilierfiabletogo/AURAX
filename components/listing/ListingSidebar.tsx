'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  BadgeCheck,
  Building2,
  Heart,
  MessageCircle,
  Phone,
  Share2,
  ShieldCheck,
} from 'lucide-react'

import { ListingClientService } from '@/lib/services/listing.client'
import { useFavorites } from '@/contexts/FavoritesContext'

interface Props {
  listingId: string

  title: string

  phone: string

  price: number

  zone: string

  transactionType: string

  agencyId?: string

  agencyName?: string

  agencyAvatar?: string |null

  agencyPlan?: string | null

  agencyVerified?: boolean
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-TG', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ListingSidebar({
  listingId,
  title,
  phone,
  price,
  zone,
  transactionType,
  agencyId,
  agencyName,
  agencyAvatar,
  agencyPlan,
  agencyVerified,
}: Props) {
  const { isFavorite, toggleFavorite } = useFavorites()

  const favorite = isFavorite(listingId)

  const pageUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : ''

  const shareText = `${title}

Prix : ${formatPrice(price)}
Localisation : ${zone}
Transaction : ${
    transactionType === 'location'
      ? 'Location'
      : 'Vente'
  }

Découvrez cette annonce sur AURAX :

${pageUrl}`

  const whatsappUrl = `https://wa.me/${phone.replace(
    /\D/g,
    ''
  )}?text=${encodeURIComponent(shareText)}`

  async function openWhatsapp() {
    try {
      await ListingClientService.incrementWhatsapp(
        listingId
      )
    } catch {}

    window.open(whatsappUrl, '_blank')
  }

  async function shareListing() {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: pageUrl,
        })

        return
      } catch {}
    }

    await navigator.clipboard.writeText(pageUrl)

    alert('Lien copié.')
  }

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-xl">

        <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-white p-8">

          <div className="flex items-center gap-5">

            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-slate-100">

              {agencyAvatar ? (
                <Image
                  src={agencyAvatar}
                  alt={agencyName ?? 'Agence'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Building2 className="h-10 w-10 text-slate-500" />
                </div>
              )}

            </div>

            <div className="flex-1">

              <h3 className="text-xl font-black text-slate-900">
                {agencyName ?? 'Annonceur'}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Disponible pour répondre rapidement.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                {agencyPlan && (
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                      agencyPlan === 'premium'
                        ? 'bg-amber-100 text-amber-700'
                        : agencyPlan === 'pro'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <BadgeCheck className="h-4 w-4" />

                    {agencyPlan.toUpperCase()}
                  </span>
                )}

                {agencyVerified && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
                    <BadgeCheck className="h-4 w-4" />
                    Vérifiée
                  </span>
                )}

              </div>

            </div>

          </div>

        </div>

        <div className="space-y-4 p-8">

          {agencyId && (
            <Link
              href={`/stand/${agencyId}`}
              className="flex h-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              Voir le stand
            </Link>
          )}

          <button
            onClick={openWhatsapp}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 font-bold text-white transition hover:bg-emerald-700"
          >
            <MessageCircle className="h-5 w-5" />
            Discuter sur WhatsApp
          </button>

          <Link
            href={`tel:${phone}`}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white font-bold text-slate-800 transition hover:border-slate-300"
          >
            <Phone className="h-5 w-5" />
            Appeler
          </Link>

          <button
            onClick={() => toggleFavorite(listingId)}
            className={`flex h-14 w-full items-center justify-center gap-3 rounded-2xl border font-bold transition ${
              favorite
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50'
            }`}
          >
            <Heart
              className={`h-5 w-5 ${
                favorite ? 'fill-current' : ''
              }`}
            />

            {favorite
              ? 'Retirer des favoris'
              : 'Ajouter aux favoris'}
          </button>

          <button
            onClick={shareListing}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Share2 className="h-5 w-5" />
            Partager cette annonce
          </button>

        </div>
      </div>

      <div className="rounded-[30px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-7">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>

          <div>

            <h4 className="text-base font-black text-emerald-700">
              Achetez en toute sécurité
            </h4>

            <p className="mt-3 text-sm leading-7 text-emerald-700">
              Vérifiez toujours l'identité du propriétaire,
              visitez le bien avant tout paiement et exigez
              les documents officiels.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-emerald-700">
              <li>• Visitez le bien avant toute transaction.</li>
              <li>• Vérifiez les documents administratifs.</li>
              <li>• Ne versez jamais d'acompte sans preuve.</li>
              <li>• Signalez toute annonce suspecte.</li>
            </ul>

          </div>

        </div>

      </div>

    </aside>
  )
}