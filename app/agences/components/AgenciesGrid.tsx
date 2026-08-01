'use client'

import AgencyCard from './AgencyCard'
import type { Agency } from '../hooks/useAgencies'

interface Props {
  agencies: Agency[]
  loading: boolean
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white animate-pulse">
      <div className="h-40 bg-slate-200" />

      <div className="px-6 pb-6">

        <div className="-mt-10 flex justify-center">
          <div className="h-20 w-20 rounded-full border-4 border-white bg-slate-200" />
        </div>

        <div className="mt-6 space-y-4">
          <div className="mx-auto h-5 w-40 rounded bg-slate-200" />
          <div className="mx-auto h-4 w-24 rounded bg-slate-200" />
          <div className="h-4 rounded bg-slate-200" />
          <div className="h-4 rounded bg-slate-200" />
          <div className="h-12 rounded-2xl bg-slate-200" />
        </div>

      </div>

    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">

      <h2 className="text-2xl font-black text-slate-900">
        Aucune agence trouvée
      </h2>

      <p className="mt-3 text-slate-500">
        Essayez une autre recherche.
      </p>

    </div>
  )
}

export default function AgenciesGrid({
  agencies,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (!agencies.length) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

      {agencies.map((agency) => (
        <AgencyCard
          key={agency.id}
          agency={agency}
        />
      ))}

    </div>
  )
}