'use client'

import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

import BudgetInput from './BudgetInput'
import PropertyTypeSelect from './PropertyTypeSelect'
import LocationInput from './LocationInput'
import DescriptionTextarea from './DescriptionTextarea'
import ContactInput from './ContactInput'
import SuccessModal from './SuccessModal'

interface RequestFormData {
  type: string
  budget: string
  quartier: string
  description: string
  user_contact: string
}

const INITIAL_STATE: RequestFormData = {
  type: '',
  budget: '',
  quartier: '',
  description: '',
  user_contact: '',
}

export default function RequestForm() {
  const [form, setForm] = useState(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successOpen, setSuccessOpen] = useState(false)

  const update =
    (field: keyof RequestFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      const supabase = await createClient()

      const { error } = await supabase
        .from('requests')
        .insert({
          type: form.type,
          budget: form.budget ? Number(form.budget) : null,
          quartier: form.quartier || null,
          description: form.description || null,
          user_contact: form.user_contact,
          is_active: true,
        })

      if (error) throw error

      setSuccessOpen(true)
      setForm(INITIAL_STATE)
    } catch (err) {
      console.error(err)
      setError("Impossible d'envoyer votre demande.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-2xl">

        <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white p-10 lg:p-14">

          <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">
            AURAX MATCH
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-900">
            Déposez votre recherche
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Décrivez votre projet une seule fois.
            Les agences immobilières concernées pourront vous proposer
            des biens adaptés à vos besoins.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-10 p-10 lg:p-14"
        >

          <div>

            <label className="mb-3 block text-lg font-bold text-slate-900">
              Quel type de bien recherchez-vous ?
            </label>

            <PropertyTypeSelect
              value={form.type}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  type: value,
                }))
              }
            />

          </div>

          <div>

            <label className="mb-3 block text-lg font-bold text-slate-900">
              Quel est votre budget maximum ?
            </label>

            <BudgetInput
              value={form.budget}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  budget: value,
                }))
              }
            />

          </div>

          <div>

            <label className="mb-3 block text-lg font-bold text-slate-900">
              Où souhaitez-vous habiter ?
            </label>

            <LocationInput
              value={form.quartier}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  quartier: value,
                }))
              }
            />

          </div>

          <div>

            <label className="mb-3 block text-lg font-bold text-slate-900">
              Décrivez votre projet
            </label>

            <DescriptionTextarea
              value={form.description}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  description: value,
                }))
              }
            />

          </div>

          <div>

            <label className="mb-3 block text-lg font-bold text-slate-900">
              Comment les agences peuvent-elles vous contacter ?
            </label>

            <ContactInput
              value={form.user_contact}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  user_contact: value,
                }))
              }
            />

          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-6">

            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
              <ShieldCheck size={20} />
            </div>

            <div>

              <h3 className="font-bold text-slate-900">
                Vos informations restent privées
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                Votre demande sera uniquement visible par les agences
                capables de répondre à votre recherche.
              </p>

            </div>

          </div>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 py-5 text-lg font-bold text-white transition duration-300 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Envoi en cours...'
              : 'Recevoir des propositions d’agences'}
          </button>

        </form>

      </section>

      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  )
}