'use client'

import type { Tables } from '@/types/database'

import RequestCard from './RequestCard'

type Request = Tables<'requests'>

interface Props {
  requests: Request[]
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export default function RequestGrid({
  requests,
  loading = false,
  emptyTitle = 'Aucune demande disponible',
  emptyDescription = 'Les nouvelles demandes immobilières apparaîtront ici.',
}: Props) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    )
  }

  if (!requests.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">

        <h3 className="text-2xl font-black text-slate-900">
          {emptyTitle}
        </h3>

        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">
          {emptyDescription}
        </p>

      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
        />
      ))}

    </div>
  )
}