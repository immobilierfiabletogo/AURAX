'use client'

import { Building2 } from 'lucide-react'

export default function EmptyListings() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-24">

      <div className="mb-6 rounded-3xl bg-slate-100 p-6">
        <Building2 className="h-8 w-8 text-slate-500" />
      </div>

      <h2 className="text-xl font-black">
        Aucune annonce
      </h2>

      <p className="mt-2 max-w-md text-center text-slate-500">
        Votre portefeuille est vide.
        Commencez par publier votre première annonce.
      </p>

    </div>
  )
}