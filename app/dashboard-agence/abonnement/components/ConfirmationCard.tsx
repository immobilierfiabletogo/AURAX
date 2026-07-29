'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

interface Plan {
  name: string
  color: string
  bg: string
}

interface MoyenPaiement {
  name: string
}

interface Duree {
  label: string
}

interface Props {
  plan: Plan
  duree: Duree
  moyen: MoyenPaiement
  total: number
}

export default function ConfirmationCard({
  plan,
  duree,
  moyen,
  total,
}: Props) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-4">

      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">

        <div
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl"
          style={{
            background: plan.bg,
          }}
        >
          <CheckCircle2
            className="h-10 w-10"
            style={{
              color: plan.color,
            }}
          />
        </div>

        <h1 className="text-center text-3xl font-black text-slate-900">
          Paiement envoyé
        </h1>

        <p className="mt-4 text-center text-sm leading-7 text-slate-500">

          Votre demande d'abonnement a bien été enregistrée.

          <br />

          Notre équipe va vérifier la preuve de paiement que vous avez envoyée.
          Une fois validée, votre abonnement sera activé automatiquement dans un délai maximum de <strong>24 heures.</strong>

        </p>

        <div className="mt-8 rounded-2xl bg-slate-50 p-5">

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-slate-500">Plan</span>
              <span className="font-bold">
                {plan.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Durée</span>
              <span className="font-bold">
                {duree.label}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Montant</span>
              <span className="font-bold">
                {total.toLocaleString()} FCFA
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Paiement</span>
              <span className="font-bold">
                {moyen.name}
              </span>
            </div>

          </div>

        </div>

        <Link
          href="/dashboard-agence"
          className="mt-8 flex w-full items-center justify-center rounded-2xl py-4 text-sm font-black text-white transition hover:opacity-90"
          style={{
            background: plan.color,
          }}
        >
          Retour au Cockpit
        </Link>

        <p className="mt-5 text-center text-xs text-slate-400">
          Vous recevrez une notification dès que votre abonnement sera activé.
        </p>

      </div>

    </div>
  )
}