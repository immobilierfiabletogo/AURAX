'use client'

import Link from 'next/link'
import {
  Eye,
  EyeOff,
  ExternalLink,
  Trash2,
} from 'lucide-react'

interface RequestActionsProps {
  request: string
  isActive: boolean
  onToggle: (
    id: string,
    current: boolean
  ) => void
  onDelete: (
    id: string
  ) => void
}

export default function RequestActions({
  request,
  isActive,
  onToggle,
  onDelete,
}: RequestActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">

      <Link
        href={`/demandes/${request}`}
        target="_blank"
        className="rounded-xl border p-2 transition hover:bg-slate-100"
        title="Voir la demande"
      >
        <Eye  className="h-5 w-5" />
      </Link>

      <button
        onClick={() =>
          onToggle(request, isActive)
        }
        className="rounded-xl border p-2 transition hover:bg-slate-100"
        title={
          isActive
            ? 'Désactiver'
            : 'Activer'
        }
      >
        {isActive ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>

      <button
        onClick={() =>
          onDelete(request)
        }
        className="rounded-xl border p-2 text-red-600 transition hover:bg-red-50"
        title="Supprimer"
      >
        <Trash2 className="h-5 w-5" />
      </button>

    </div>
  )
}