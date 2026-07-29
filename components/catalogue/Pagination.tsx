'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const getHref = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    return `/biens?${params.toString()}`
  }

  // Génère les numéros à afficher avec ellipsis
  const getPages = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="mt-12 flex items-center justify-center gap-1.5 flex-wrap">
      {/* Précédent */}
      {currentPage > 1 ? (
        <Link
          href={getHref(currentPage - 1)}
          className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Précédent
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-white border border-slate-100 text-xs font-bold text-slate-300 cursor-not-allowed">
          <ChevronLeft className="w-3.5 h-3.5" /> Précédent
        </span>
      )}

      {/* Pages */}
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="h-9 w-9 flex items-center justify-center text-xs text-slate-400">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={getHref(p as number)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${
              currentPage === p
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p}
          </Link>
        )
      )}

      {/* Suivant */}
      {currentPage < totalPages ? (
        <Link
          href={getHref(currentPage + 1)}
          className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
        >
          Suivant <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-white border border-slate-100 text-xs font-bold text-slate-300 cursor-not-allowed">
          Suivant <ChevronRight className="w-3.5 h-3.5" />
        </span>
      )}
    </div>
  )
}