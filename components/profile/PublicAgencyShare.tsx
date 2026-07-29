'use client'

import { Copy, Link2, Share2 } from 'lucide-react'
import { useState } from 'react'

interface Props {
  agencyName: string
}

export default function PublicAgencyShare({
  agencyName,
}: Props) {
  const [copied, setCopied] = useState(false)

  const currentUrl =
    typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = async () => {
    await navigator.clipboard.writeText(currentUrl)

    setCopied(true)

    setTimeout(() => setCopied(false), 2000)
  }

  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: agencyName,
        text: `Découvrez tous les biens proposés par ${agencyName} sur AURAX.`,
        url: currentUrl,
      })

      return
    }

    copyLink()
  }

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">
            Partager cette vitrine
          </span>

          <h2 className="mt-3 text-3xl font-black text-slate-900">
            Faites découvrir cette agence
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-500">
            Partagez cette page à vos proches. Ils pourront consulter
            l'ensemble des biens publiés par cette agence sur AURAX.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={share}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <Share2 className="h-5 w-5" />
            Partager
          </button>

          <button
            onClick={copyLink}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-semibold transition hover:bg-slate-100"
          >
            <Copy className="h-5 w-5" />
            {copied ? 'Lien copié' : 'Copier le lien'}
          </button>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-semibold transition hover:bg-slate-100"
          >
            <Share2 className="h-5 w-5" />
            Facebook
          </a>

          <div className="flex items-center rounded-2xl border border-slate-200 px-5">
            <Link2 className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>
    </section>
  )
}