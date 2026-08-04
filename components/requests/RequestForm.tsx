'use client'

import { useState } from 'react'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

import BudgetInput from './BudgetInput'
import PropertyTypeSelect from './PropertyTypeSelect'
import LocationInput from './LocationInput'
import DescriptionTextarea from './DescriptionTextarea'

interface RequestFormData {
  type: string
  budget: string
  quartier: string
  description: string
}

const INITIAL_STATE: RequestFormData = {
  type: '',
  budget: '',
  quartier: '',
  description: '',
}

export default function RequestForm() {
  const [form, setForm] = useState(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          user_contact: '',
        })

      if (error) {
        throw new Error(error.message)
      }

      const whatsappMessage = encodeURIComponent(
`Bonjour AURAX,

Je viens de remplir le formulaire de demande sur votre site.

Voici les informations de ma recherche :

🔹 Type de bien :
${form.type}

🔹 Budget :
${form.budget || 'Non précisé'} FCFA

🔹 Zone recherchée :
${form.quartier || 'Non précisée'}

🔹 Description :
${form.description || 'Non précisée'}

Merci de m'accompagner dans ma recherche.`
      )

      window.location.href =
        `https://wa.me/22897630690?text=${whatsappMessage}`

      setForm(INITIAL_STATE)

    } catch (err) {
      console.error(
        'Erreur envoi demande :',
        err instanceof Error ? err.message : err
      )

      setError(
        "Impossible d'envoyer votre demande. Veuillez réessayer."
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-xl">

      <div className="border-b border-slate-100 p-8 lg:p-10">

        <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
          Gratuit • Sans engagement
        </span>

        <h2 className="mt-5 text-3xl font-black text-slate-900 lg:text-4xl">
          Trouvez le bien immobilier qui vous correspond
        </h2>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Décrivez simplement votre recherche.
          Notre équipe analysera votre demande avant de vous recontacter.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 p-8 lg:p-10"
      >

        <div>

          <label className="mb-3 block text-lg font-semibold text-slate-900">
            Quel bien recherchez-vous ?
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

          <label className="mb-3 block text-lg font-semibold text-slate-900">
            Budget
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

          <label className="mb-3 block text-lg font-semibold text-slate-900">
            Zone recherchée (facultatif)
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

          <label className="mb-3 block text-lg font-semibold text-slate-900">
            Décrivez votre recherche (facultatif)
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

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

                <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">

          <div className="flex items-start gap-4">

            <div className="rounded-2xl bg-emerald-600 p-3 text-white">
              <ShieldCheck size={20} />
            </div>

            <div>

              <h3 className="text-lg font-bold text-slate-900">
                Après l'envoi
              </h3>

              <div className="mt-4 space-y-3">

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-600"
                  />
                  <span className="text-slate-700">
                    Votre demande est enregistrée.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-600"
                  />
                  <span className="text-slate-700">
                    WhatsApp s'ouvrira automatiquement.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-600"
                  />
                  <span className="text-slate-700">
                    Notre équipe analysera votre recherche.
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

        <button
          disabled={loading}
          className="
            w-full
            rounded-2xl
            bg-emerald-600
            py-5
            text-lg
            font-bold
            text-white
            transition
            duration-300
            hover:bg-emerald-500
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? 'Envoi en cours...'
            : 'Trouver mon bien'}
        </button>

        <div className="rounded-3xl bg-slate-50 p-6">

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="flex items-center gap-3">
              <CheckCircle2
                size={18}
                className="text-emerald-600"
              />
              <span className="text-slate-700">
                Service entièrement gratuit
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2
                size={18}
                className="text-emerald-600"
              />
              <span className="text-slate-700">
                Réponse rapide
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2
                size={18}
                className="text-emerald-600"
              />
              <span className="text-slate-700">
                Partout au Togo
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2
                size={18}
                className="text-emerald-600"
              />
              <span className="text-slate-700">
                Accompagnement par AURAX
              </span>
            </div>

          </div>

        </div>

        <p className="text-center text-sm leading-6 text-slate-500">
          Aucune inscription requise • Sans engagement • Vous serez redirigé vers WhatsApp après l'envoi.
        </p>

      </form>

    </section>
  )
}