'use client'

import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
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

Je viens de déposer une demande depuis votre site.

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
        "Erreur envoi demande :",
        err instanceof Error ? err.message : err
      )

      setError(
        "Impossible d'envoyer votre demande."
      )

    } finally {
      setLoading(false)
    }
  }


  return (
    <section className="overflow-hidden rounded-[36px] border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/40 shadow-[0_30px_70px_rgba(15,23,42,.08)]">

      <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white p-10 lg:p-14">

        <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">
          AURAX MATCH
        </span>

        <h2 className="mt-6 text-4xl font-black text-slate-900">
          Confiez votre recherche à AURAX
        </h2>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Décrivez le bien que vous recherchez. Après l'envoi de votre demande,
          vous serez redirigé vers WhatsApp pour échanger directement avec notre
          équipe AURAX et préciser votre recherche.
        </p>

      </div>


      <form
        onSubmit={handleSubmit}
        className="space-y-10 p-10 lg:p-14"
      >

        <div>
          <label className="mb-3 block text-lg font-bold text-slate-900">
            Quel bien souhaitez-vous trouver ?
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
            Quel budget souhaitez-vous consacrer ?
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
            Dans quelle zone recherchez-vous ?
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
            Parlez-nous de votre recherche
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


        <div className="flex items-start gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white p-6">

          <div className="rounded-2xl bg-emerald-600 p-3 text-white">
            <ShieldCheck size={20}/>
          </div>

          <div>

            <h3 className="font-bold text-slate-900">
              Votre demande est traitée par AURAX
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Notre équipe analyse votre recherche et vous accompagne directement
              pour trouver les meilleures opportunités immobilières.
            </p>

          </div>

        </div>


        <button
          disabled={loading}
          className="w-full rounded-2xl bg-emerald-600 py-5 text-lg font-bold text-white transition duration-300 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? 'Envoi en cours...'
            : 'Confier ma recherche'}
        </button>


        <p className="mt-4 text-center text-sm leading-6 text-slate-500">
          Vous serez redirigé vers WhatsApp après l'envoi afin d'échanger
          directement avec notre équipe.
        </p>

      </form>

    </section>
  )
}