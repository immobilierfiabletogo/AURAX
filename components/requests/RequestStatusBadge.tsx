'use client'

import {
  CheckCircle2,
  Clock3,
  XCircle,
} from 'lucide-react'

interface RequestStatusBadgeProps {
  isActive: boolean
}

export default function RequestStatusBadge({
  isActive,
}: RequestStatusBadgeProps) {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-4 w-4" />
        Active
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      <XCircle className="h-4 w-4" />
      Inactive
    </span>
  )
}

export function PendingRequestBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
      <Clock3 className="h-4 w-4" />
      En attente
    </span>
  )
}