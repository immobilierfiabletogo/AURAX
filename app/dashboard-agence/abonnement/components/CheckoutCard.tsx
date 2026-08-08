'use client'

import {
  Phone,
  Copy,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  LucideIcon,
  ImagePlus,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

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
  setSelectedMoyen: (moyen: MoyenPaiement) => void

  copied: boolean
  onCopy: () => void

  onBack: () => void

  paymentProof: File | null
  setPaymentProof: (file: File | null) => void

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

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null)

  /*
   * Création automatique de l'aperçu
   * dès qu'une image est sélectionnée.
   */
  useEffect(() => {
    if (!paymentProof) {
      setPreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(paymentProof)

    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [paymentProof])

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    /*
     * Sécurité / UX :
     * uniquement les images.
     */
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image.')
      event.target.value = ''
      return
    }

    /*
     * 10 Mo maximum.
     */
    if (file.size > 10 * 1024 * 1024) {
      alert(
        "L'image ne doit pas dépasser 10 Mo."
      )
      event.target.value = ''
      return
    }

    setPaymentProof(file)
  }

  function removeProof() {
    setPaymentProof(null)
  }

  return (
    <div className="space-y-6">

      {/* RETOUR */}

      <button
        type="button"
        onClick={onBack}
        disabled={sending}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
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

          <div className="min-w-0">

            <h3 className="text-xl font-black text-slate-900">
              {plan.name}
            </h3>

            {plan.description && (
              <p className="mt-1 text-sm text-slate-500">
                {plan.description}
              </p>
            )}

            <p className="mt-2 text-lg font-black text-slate-900">
              {plan.monthly_price.toLocaleString('fr-FR')} FCFA

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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

          {durees.map((duree) => {

            const selected =
              selectedDuree.months === duree.months

            return (
              <button
                key={duree.months}
                type="button"
                onClick={() =>
                  setSelectedDuree(duree)
                }
                disabled={sending}
                className="rounded-2xl border-2 p-4 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed"
                style={{
                  borderColor: selected
                    ? '#D4AF37'
                    : '#E2E8F0',

                  background: selected
                    ? 'rgba(212,175,55,0.08)'
                    : 'white',
                }}
              >

                <div className="font-black text-slate-900">
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
            )
          })}

        </div>

      </div>

      {/* PAIEMENT */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xs font-black uppercase tracking-widest text-slate-400">
          Paiement
        </h2>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

          {moyens.map((moyen) => {

            const selected =
              selectedMoyen.id === moyen.id

            return (
              <button
                key={moyen.id}
                type="button"
                onClick={() =>
                  setSelectedMoyen(moyen)
                }
                disabled={sending}
                className="rounded-2xl border-2 p-4 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed"
                style={{
                  borderColor: selected
                    ? '#D4AF37'
                    : '#E2E8F0',

                  background: selected
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
            )
          })}

        </div>

        <div className="rounded-2xl bg-slate-50 p-4">

          <p className="mb-3 text-xs font-bold leading-5 text-slate-700">
            Effectuez votre paiement Mobile Money puis
            téléversez la capture d'écran du SMS ou du
            reçu de paiement.
          </p>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">

            <Phone className="h-4 w-4 shrink-0 text-slate-400" />

            <span className="min-w-0 flex-1 truncate font-black text-slate-900">
              {selectedMoyen.number}
            </span>

            <button
              type="button"
              onClick={onCopy}
              disabled={sending}
              className="shrink-0 rounded-lg p-1 transition hover:bg-slate-100 disabled:opacity-50"
              aria-label="Copier le numéro"
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

        <div className="mb-5">

          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Preuve de paiement
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Ajoutez une capture du SMS ou du reçu
            confirmant votre paiement.
          </p>

        </div>

        <label
          htmlFor="payment-proof"
          className={[
            'relative block overflow-hidden rounded-3xl border-2 border-dashed transition',
            sending
              ? 'cursor-not-allowed opacity-70'
              : 'cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30',
          ].join(' ')}
          style={{
            borderColor: paymentProof
              ? plan.color
              : '#CBD5E1',
          }}
        >

          {previewUrl && paymentProof ? (
            <div className="relative">

              {/* IMAGE */}

              <div className="flex min-h-[260px] items-center justify-center bg-slate-100 p-3 sm:min-h-[360px]">

                <img
                  src={previewUrl}
                  alt="Aperçu de la preuve de paiement"
                  className="max-h-[520px] w-full rounded-2xl object-contain shadow-sm"
                />

              </div>

              {/* OVERLAY */}

              <div className="border-t border-slate-200 bg-white p-4">

                <div className="flex items-center justify-between gap-3">

                  <div className="min-w-0">

                    <p className="truncate text-sm font-black text-slate-900">
                      {paymentProof?.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {(paymentProof.size / 1024 / 1024).toFixed(2)} Mo
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      removeProof()
                    }}
                    disabled={sending}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed"
                    aria-label="Supprimer la preuve"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>

                <div
                  className="mt-3 text-center text-xs font-bold"
                  style={{
                    color: plan.color,
                  }}
                >
                  Cliquer pour remplacer l'image
                </div>

              </div>

            </div>
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[320px]">

              <div
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  background: plan.bg,
                }}
              >
                <ImagePlus
                  className="h-8 w-8"
                  style={{
                    color: plan.color,
                  }}
                />
              </div>

              <p className="text-base font-black text-slate-800">
                Ajouter votre preuve de paiement
              </p>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Cliquez ici pour sélectionner une
                capture d'écran ou une photo de votre
                reçu.
              </p>

              <span
                className="mt-5 rounded-xl px-4 py-2 text-xs font-black text-white"
                style={{
                  background: plan.color,
                }}
              >
                Choisir une image
              </span>

              <p className="mt-4 text-[11px] font-medium text-slate-400">
                JPG, PNG ou WEBP · 10 Mo maximum
              </p>

            </div>
          )}

          <input
            id="payment-proof"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={sending}
            className="sr-only"
            onChange={handleFileChange}
          />

        </label>

      </div>

      {/* TOTAL */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <span className="font-bold text-slate-500">
            Total à payer
          </span>

          <span className="text-3xl font-black text-slate-900 sm:text-4xl">
            {total.toLocaleString('fr-FR')} FCFA
          </span>

        </div>

        <button
          type="button"
          disabled={!paymentProof || sending}
          onClick={onConfirm}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-black text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
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
            <>
              <CheckCircle2 className="h-5 w-5" />
              Confirmer le paiement
            </>
          )}
        </button>

        {!paymentProof && (
          <p className="mt-3 text-center text-xs font-medium text-slate-400">
            Ajoutez votre preuve de paiement pour
            continuer.
          </p>
        )}

      </div>

    </div>
  )
}