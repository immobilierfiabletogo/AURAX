'use client'

import { useState } from 'react'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'
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
    <section className="overflow-hidden rounded-[36px] border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50 shadow-[0_30px_70px_rgba(15,23,42,.08)]">

      <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white p-10 lg:p-14">

        <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
          100% Gratuit • Sans engagement
        </span>

        <h2 className="mt-6 text-4xl font-black leading-tight text-slate-900">
          Trouvez le bien immobilier qui vous correspond.
        </h2>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Vous recherchez un terrain, une maison, un appartement, un local
          commercial ou une location ?
          <br />
          Décrivez simplement votre recherche en moins de 2 minutes.
          Nous analysons votre demande et vous accompagnons dans votre projet.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <CheckCircle2 className="text-emerald-600" size={22} />
            <span className="font-medium text-slate-700">
              Service entièrement gratuit
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <CheckCircle2 className="text-emerald-600" size={22} />
            <span className="font-medium text-slate-700">
              Réponse rapide sur WhatsApp
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <CheckCircle2 className="text-emerald-600" size={22} />
            <span className="font-medium text-slate-700">
              Partout au Togo
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <CheckCircle2 className="text-emerald-600" size={22} />
            <span className="font-medium text-slate-700">
              Annonces plus fiables
            </span>
          </div>

        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-10 p-10 lg:p-14"
      >

        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">

          <h3 className="text-xl font-bold text-slate-900">
            Marre des fausses annonces et des pertes de temps ?
          </h3>

          <p className="mt-3 leading-8 text-slate-600">
            Décrivez simplement le bien que vous recherchez.
            Nous analysons votre demande avant de vous recontacter afin de
            vous accompagner dans votre recherche.
          </p>

        </div>

        <div>

          <label className="mb-3 block text-lg font-bold text-slate-900">
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

          <label className="mb-3 block text-lg font-bold text-slate-900">
            Quel est votre budget ?
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

          <label className="mb-3 block text-lg font-bold text-slate-900">
            Précisez votre recherche (facultatif)
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
            <ShieldCheck size={20} />
          </div>

          <div>

            <h3 className="font-bold text-slate-900">
              Que se passe-t-il ensuite ?
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Après l'envoi de votre demande, une conversation WhatsApp
              s'ouvrira automatiquement afin que notre équipe puisse traiter
              votre recherche dans les meilleurs délais.
            </p>

          </div>

        </div>

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-emerald-600 py-5 text-lg font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? 'Envoi en cours...'
            : 'Envoyer'}
        </button>

        <p className="text-center text-sm leading-6 text-slate-500">
          Aucune inscription requise • Aucune obligation d'achat • Réponse rapide.
        </p>

      </form>

    </section>
  )
}