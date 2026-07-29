'use client'

import Link from 'next/link'
import { Share2, Phone, Globe, MessageCircle } from 'lucide-react'

interface PublicProfileActionsProps {
  phone?: string | null
  website?: string | null
  profileUrl: string
}

export default function PublicProfileActions({
  phone,
  website,
  profileUrl,
}: PublicProfileActionsProps) {
  const whatsapp = phone
    ? `https://wa.me/${phone.replace(/\D/g, '')}`
    : null

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Profil AURAX',
          url: profileUrl,
        })
      } catch {}
      return
    }

    await navigator.clipboard.writeText(profileUrl)
    alert('Lien copié.')
  }

  return (
    <div className="flex flex-wrap gap-3">

      {whatsapp && (
        <Link
          href={whatsapp}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Link>
      )}

      {phone && (
        <Link
          href={`tel:${phone}`}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition"
        >
          <Phone className="h-4 w-4" />
          Appeler
        </Link>
      )}

      {website && (
        <Link
          href={website}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition"
        >
          <Globe className="h-4 w-4" />
          Site web
        </Link>
      )}

      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition"
      >
        <Share2 className="h-4 w-4" />
        Partager
      </button>

    </div>
  )
}