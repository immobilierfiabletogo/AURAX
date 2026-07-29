'use client'

import Link from 'next/link'
import { CheckCircle2, X } from 'lucide-react'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
}

export default function SuccessModal({
  open,
  onClose,
}: SuccessModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 transition hover:bg-slate-100"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">

          <div className="mb-6 rounded-full bg-emerald-100 p-4">

            <CheckCircle2 className="h-14 w-14 text-emerald-600" />

          </div>

          <h2 className="text-3xl font-black text-slate-900">
            Demande publiée
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Votre demande immobilière est maintenant visible sur AURAX.
            Les agences pourront la consulter et vous contacter si elles
            disposent d'un bien correspondant à vos critères.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">

            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-slate-900 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              Continuer
            </button>

            <Link
              href="/demandes"
              className="flex-1 rounded-xl border border-slate-300 py-3 text-center font-bold transition hover:bg-slate-100"
            >
              Voir les demandes
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}