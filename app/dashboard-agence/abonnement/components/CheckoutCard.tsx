'use client'

import {
  Phone,
  Copy,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  LucideIcon,
  ImagePlus,
} from 'lucide-react'



interface Duree {
  months: number
  label: string
  discount: string | null
}

interface MoyenPaiement {
  id: string
  name: string
  number: string
  logo: string
}

interface Plan {
  id: string
  code: string

  name: string
  description: string | null

  monthly_price: number

  color: string
  bg: string
  border: string

  icon: LucideIcon

  badge?: string | null
}

interface Props {
  plan: Plan

  durees: Duree[]
  selectedDuree: Duree
  setSelectedDuree: (duree: Duree) => void

  moyens: MoyenPaiement[]
  selectedMoyen: MoyenPaiement
  setSelectedMoyen: (
    moyen: MoyenPaiement
  ) => void

  copied: boolean
  onCopy: () => void

  onBack: () => void

  paymentProof: File | null

  setPaymentProof: (
    file: File | null
  ) => void

  total: number

  sending: boolean

  onConfirm: () => void
}

export default function CheckoutCard({
  plan,

  durees,
  selectedDuree,
  setSelectedDuree,

  moyens,
  selectedMoyen,
  setSelectedMoyen,

  copied,
  onCopy,

  onBack,

  paymentProof,
  setPaymentProof,

  total,

  sending,

  onConfirm,
}: Props) {
  const Icon = plan.icon

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux abonnements
      </button>

  

    {/* PLAN */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xs font-black uppercase tracking-widest text-slate-400">
          Plan choisi
        </h2>

        <div className="flex items-center gap-4">

          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: plan.bg,
            }}
          >
            <Icon
              className="h-7 w-7"
              style={{
                color: plan.color,
              }}
            />
          </div>

          <div>

            <h3 className="text-xl font-black text-slate-900">
              {plan.name}
            </h3>

            {plan.description && (
              <p className="mt-1 text-sm text-slate-500">
                {plan.description}
              </p>
            )}

            <p className="mt-2 text-lg font-black text-slate-900">
              {plan.monthly_price.toLocaleString()} FCFA
              <span className="ml-2 text-sm font-medium text-slate-400">
                / mois
              </span>
            </p>

          </div>

        </div>

      </div>

      {/* DURÉE */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xs font-black uppercase tracking-widest text-slate-400">
          Durée
        </h2>

        <div className="grid grid-cols-3 gap-3">

          {durees.map((duree) => (

            <button
              key={duree.months}
              type="button"
              onClick={() => setSelectedDuree(duree)}
              className="rounded-2xl border-2 p-4 transition"
              style={{
                borderColor:
                  selectedDuree.months === duree.months
                    ? '#D4AF37'
                    : '#E2E8F0',

                background:
                  selectedDuree.months === duree.months
                    ? 'rgba(212,175,55,0.08)'
                    : 'white',
              }}
            >

              <div className="font-black">
                {duree.label}
              </div>

              {duree.discount && (
                <div
                  className="mt-1 text-[10px] font-bold"
                  style={{
                    color: '#D4AF37',
                  }}
                >
                  {duree.discount}
                </div>
              )}

            </button>

          ))}

        </div>

      </div>

            {/* PAIEMENT */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xs font-black uppercase tracking-widest text-slate-400">
          Paiement
        </h2>

        <div className="mb-5 grid grid-cols-2 gap-3">

          {moyens.map((moyen) => (

            <button
              key={moyen.id}
              type="button"
              onClick={() => setSelectedMoyen(moyen)}
              className="rounded-2xl border-2 p-4 text-left transition"
              style={{
                borderColor:
                  selectedMoyen.id === moyen.id
                    ? '#D4AF37'
                    : '#E2E8F0',

                background:
                  selectedMoyen.id === moyen.id
                    ? 'rgba(212,175,55,0.08)'
                    : 'white',
              }}
            >

              <div
                className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl font-black"
                style={{
                  background: plan.bg,
                  color: plan.color,
                }}
              >
                {moyen.logo}
              </div>

              <div className="text-sm font-black text-slate-900">
                {moyen.name}
              </div>

            </button>

          ))}

        </div>

        <div className="rounded-2xl bg-slate-50 p-4">

          <p className="mb-3 text-xs font-bold text-slate-700">
           Effectuez votre paiement Mobile Money puis téléversez la capture d'écran du SMS ou du reçu de paiement.
          </p>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">

            <Phone className="h-4 w-4 text-slate-400" />

            <span className="flex-1 font-black text-slate-900">
              {selectedMoyen.number}
            </span>

            <button
              type="button"
              onClick={onCopy}
            >
              {copied ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <Copy className="h-5 w-5 text-slate-500" />
              )}
            </button>

          </div>

        </div>

      </div>

      {/* PREUVE DE PAIEMENT */}

<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

  <label className="mb-3 block text-xs font-black uppercase tracking-widest text-slate-400">
    Preuve de paiement
  </label>

  <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition hover:border-emerald-500 hover:bg-white">

    <ImagePlus className="h-6 w-6 text-slate-500" />

    <span className="font-bold text-slate-700">
      {paymentProof
        ? paymentProof.name
        : 'Choisir une capture d’écran'}
    </span>

    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) =>
        setPaymentProof(
          e.target.files?.[0] ?? null
        )
      }
    />

  </label>

  <p className="mt-3 text-xs text-slate-500">
    Formats acceptés : JPG, PNG ou WEBP (10 Mo maximum).
  </p>

</div>

            {/* TOTAL */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center justify-between">

          <span className="font-bold text-slate-500">
            Total à payer
          </span>

          <span className="text-3xl font-black text-slate-900">
            {total.toLocaleString()} FCFA
          </span>

        </div>

        <button
          type="button"
          disabled={!paymentProof || sending}
          onClick={onConfirm}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-black text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: plan.color,
          }}
        >
          {sending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Confirmer le paiement'
          )}
        </button>

      </div>
        </div>
  )
}
         
