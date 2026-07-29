'use client'

import Link from 'next/link'
import {
  Banknote,
  Calendar,
  ChevronRight,
  MapPin,
  Phone,
 Search,
} from 'lucide-react'

import type { Tables } from '@/types/database'

type Request = Tables<'requests'>

interface Props {
  request: Request
}

export default function RequestCard({
  request,
}: Props) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl">

      <div className="flex items-center justify-between border-b bg-emerald-50 px-6 py-4">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-emerald-600 p-3 text-white">

            <Search className="h-5 w-5" />

          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Demande immobilière
            </p>

            <h3 className="font-bold text-slate-900">
              {request.type}
            </h3>

          </div>

        </div>

      </div>

      <div className="space-y-5 p-6">

        {request.description && (
          <p className="line-clamp-4 leading-7 text-slate-600">
            {request.description}
          </p>
        )}

        <div className="grid gap-3">

          {request.quartier && (
            <div className="flex items-center gap-3">

              <MapPin className="h-5 w-5 text-emerald-600" />

              <span className="text-slate-700">
                {request.quartier}
              </span>

            </div>
          )}

          {request.budget && (
            <div className="flex items-center gap-3">

              <Banknote className="h-5 w-5 text-emerald-600" />

              <span className="font-semibold">
                {new Intl.NumberFormat('fr-FR').format(
                  request.budget
                )}{' '}
                FCFA
              </span>

            </div>
          )}

          <div className="flex items-center gap-3">

            <Phone className="h-5 w-5 text-emerald-600" />

            <span>{request.user_contact}</span>

          </div>

          {request.created_at && (
            <div className="flex items-center gap-3">

              <Calendar className="h-5 w-5 text-emerald-600" />

              <span>
                {new Date(
                  request.created_at
                ).toLocaleDateString('fr-FR')}
              </span>

            </div>
          )}

        </div>

      </div>

      <div className="border-t bg-slate-50 p-5">

        <Link
          href={`/demandes/${request.id}`}
          className="flex items-center justify-between rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Voir la demande

          <ChevronRight className="h-5 w-5" />

        </Link>

      </div>

    </article>
  )
}