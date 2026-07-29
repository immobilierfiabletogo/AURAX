'use client'

import {
  X,
  MapPin,
  Phone,
  Banknote,
  Calendar,
  Search,
} from 'lucide-react'

import RequestStatusBadge from './RequestStatusBadge'
import type { Tables } from '@/types/database'

type Request = Tables<'requests'>

interface RequestDetailsModalProps {
  request: Request | null
  open: boolean
  onClose: () => void
}

export default function RequestDetailsModal({
  request,
  open,
  onClose,
}: RequestDetailsModalProps) {
  if (!open || !request) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl">

        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 transition hover:bg-slate-100"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b p-8">

          <div className="flex items-start justify-between gap-6">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">

                <Search className="h-4 w-4" />

                Demande immobilière

              </div>

              <h2 className="text-3xl font-black text-slate-900">
                {request.type}
              </h2>

            </div>

            <RequestStatusBadge
              isActive={request.is_active ?? false}
            />

          </div>

        </div>

        <div className="space-y-8 p-8">

          <section>

            <h3 className="mb-3 text-lg font-bold">
              Description
            </h3>

            <p className="leading-8 text-slate-600">
              {request.description || 'Aucune description fournie.'}
            </p>

          </section>

          <div className="grid gap-6 md:grid-cols-2">

            <div className="space-y-5">

              <div className="flex items-center gap-3">

                <MapPin className="h-5 w-5 text-emerald-600" />

                <span>
                  {request.quartier || 'Non renseigné'}
                </span>

              </div>

              <div className="flex items-center gap-3">

                <Phone className="h-5 w-5 text-emerald-600" />

                <span>{request.user_contact}</span>

              </div>

            </div>

            <div className="space-y-5">

              <div className="flex items-center gap-3">

                <Banknote className="h-5 w-5 text-emerald-600" />

                <span className="font-semibold">
                  {request.budget
                    ? `${new Intl.NumberFormat('fr-FR').format(
                        request.budget
                      )} FCFA`
                    : 'Budget non précisé'}
                </span>

              </div>

              <div className="flex items-center gap-3">

                <Calendar className="h-5 w-5 text-emerald-600" />

                <span>
                  {request.created_at
                    ? new Date(
                        request.created_at
                      ).toLocaleDateString('fr-FR')
                    : '-'}
                </span>

              </div>

            </div>

          </div>

        </div>

        <div className="flex justify-end border-t bg-slate-50 p-6">

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Fermer
          </button>

        </div>

      </div>

    </div>
  )
}