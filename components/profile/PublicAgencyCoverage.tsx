'use client'

import { MapPin } from 'lucide-react'

interface Zone {
  name: string
  count: number
}

interface Props {
  zones: Zone[]
}

export default function PublicAgencyCoverage({
  zones,
}: Props) {
  if (!zones.length) return null

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">
          Zones couvertes
        </span>

        <h2 className="mt-3 text-3xl font-black text-slate-900">
          Où intervient cette agence ?
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-slate-500">
          Retrouvez les secteurs dans lesquels cette agence publie
          régulièrement des biens immobiliers.
        </p>

      </div>

      <div className="flex flex-wrap gap-4">

        {zones.map((zone) => (
          <div
            key={zone.name}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            <MapPin className="h-5 w-5 text-emerald-600" />

            <span className="font-semibold text-slate-900">
              {zone.name}
            </span>

            <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-600">
              {zone.count}
            </span>
          </div>
        ))}

      </div>

    </section>
  )
}