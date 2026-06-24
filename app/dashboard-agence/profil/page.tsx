'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react'

export default function ProfilAgencePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')
  const [adresse, setAdresse] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone_number, description, adresse, website, user_type')
        .eq('id', user.id)
        .single()

      if (profile?.user_type !== 'agence') { router.push('/mon-espace'); return }

      setFullName(profile.full_name ?? '')
      setPhone(profile.phone_number ?? '')
      setDescription(profile.description ?? '')
      setAdresse(profile.adresse ?? '')
      setWebsite(profile.website ?? '')
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone_number: phone,
        description,
        adresse,
        website,
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center text-sm text-slate-400 animate-pulse">
      Chargement...
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4 antialiased">
      <div className="max-w-xl mx-auto">

        <div className="mb-8">
          <Link href="/dashboard-agence" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour au tableau de bord
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-slate-950">Profil de l'agence</h1>
          <p className="text-sm text-slate-500 mt-1">Ces informations seront visibles par les prospects sur la plateforme.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        {saved && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm font-semibold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Profil mis à jour avec succès.
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/60 shadow-xl p-6 sm:p-8 space-y-6">

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Nom de l'agence *</label>
            <input
              type="text" required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Immo Lomé"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Numéro WhatsApp *</label>
            <input
              type="tel" required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+228 90 12 34 56"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Description de l'agence</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Présentez votre agence en quelques lignes..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Adresse (Lomé)</label>
            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Ex: Quartier Bè, Rue des Palmiers"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Site web (optionnel)</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://monagence.tg"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</> : <><Save className="w-4 h-4" /> Enregistrer le profil</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}