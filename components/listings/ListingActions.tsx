'use client'

import Link from 'next/link'
import { Eye, Trash2 } from 'lucide-react'

interface Props {
  id: string
  onDelete: (id: string) => void
}

export default function ListingActions({
  id,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center gap-2">

      <Link
        href={`/biens/${id}`}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 transition"
      >
        <Eye className="h-4 w-4" />
      </Link>

      <button
        onClick={() => onDelete(id)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
      >
        <Trash2 className="h-4 w-4" />
      </button>

    </div>
  )
}