'use client'

import { useState } from 'react'
import { createClient } from "@/lib/supabase/client";

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

const [successOpen, setSuccessOpen] = useState(false)

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
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          budget: form.budget
            ? Number(form.budget)
            : null,
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
      setError(
        "Impossible d'envoyer votre demande."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-3xl border bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-3xl font-black">
          Déposer une demande immobilière
        </h2>

        <p className="mt-3 text-slate-500">
          Décrivez le bien que vous recherchez.
          Les agences présentes sur AURAX pourront
          consulter votre demande.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div>

          <label className="mb-2 block font-semibold">
            Type de recherche
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

          <label className="mb-2 block font-semibold">
            Budget maximum
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

          <label className="mb-2 block font-semibold">
            Quartier / Ville
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

          <label className="mb-2 block font-semibold">
            Décrivez votre besoin
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

          <label className="mb-2 block font-semibold">
            Téléphone
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
          <div className="rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 py-4 font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {loading
            ? 'Publication...'
            : 'Publier ma demande'}
        </button>

      </form>

      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />

    </section>
  )
}