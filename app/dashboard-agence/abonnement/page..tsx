'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import { Upload, CheckCircle2, Loader2 } from 'lucide-react'

// ⚠️ À REMPLACER : tes vrais numéros de dépôt
const RESEAUX = [
  { value: 'moov_money', label: 'Moov Money', numero: 'XX XX XX XX XX', couleur: '#f97316' },
  { value: 'mixx_by_yas', label: 'Mixx by Yas', numero: 'XX XX XX XX XX', couleur: '#facc15' },
] as const

const PLANS = [
  { value: 'pro', label: 'Pro', prixMois: 15000 },
  { value: 'premium', label: 'Premium', prixMois: 35000 },
] as const

const DUREES = [
  { label: '1 mois', months: 1, multiplicateur: 1 },
  { label: '3 mois', months: 3, multiplicateur: 3 },
  { label: '12 mois', months: 12, multiplicateur: 10 }, // 2 mois offerts, ajuste si besoin
] as const

export default function AbonnementPage() {
  const router = useRouter()
  const supabase = createClient()

  const [plan, setPlan] = useState<'pro' | 'premium'>('pro')
  const [months, setMonths] = useState<1 | 3 | 12>(1)
  const [reseau, setReseau] = useState<'moov_money' | 'mixx_by_yas'>('moov_money')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const planInfo = PLANS.find(p => p.value === plan)!
  const dureeInfo = DUREES.find(d => d.months === months)!
  const montant = planInfo.prixMois * dureeInfo.multiplicateur

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError(null)
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Ajoute une capture d\u2019écran de ta confirmation de dépôt avant de soumettre.')
      return
    }
    setSubmitting(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Tu dois être connecté pour soumettre un paiement.')

      // 1. Upload de la capture dans le bucket payment-proofs
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error: errUpload } = await supabase.storage
        .from('payment-proofs')
        .upload(path, file)
      if (errUpload) throw errUpload

      const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(path)

      // 2. Enregistrement de la soumission (statut "pending" par défaut)
      const { error: errInsert } = await supabase.from('payment_submissions').insert({
        agent_id: user.id,
        plan_requested: plan,
        months_requested: months,
        amount: montant,
        reseau_paiement: reseau,
        screenshot_url: urlData.publicUrl,
      })
      if (errInsert) throw errInsert

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue, réessaie.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 shadow-xs p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-slate-900 mb-2">Soumission envoyée</h1>
          <p className="text-sm text-slate-500 mb-6">
            Ta preuve de paiement a été transmise. Ton abonnement sera activé dès validation par l'équipe AURAX, généralement en moins de 24h.
          </p>
          <button
            onClick={() => router.push('/dashboard-agence')}
            className="w-full px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-6">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Activer un abonnement</h1>
        <p className="text-sm text-slate-500 mb-8">Choisis ton plan, effectue le dépôt, puis confirme avec une capture d'écran.</p>

        {/* Choix du plan */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 mb-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">1. Choisis ton plan</label>
          <div className="grid grid-cols-2 gap-3">
            {PLANS.map(p => (
              <button
                key={p.value}
                onClick={() => setPlan(p.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  plan === p.value ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-slate-900">{p.label}</div>
                <div className="text-xs text-slate-500 mt-1">{p.prixMois.toLocaleString('fr-FR')} FCFA/mois</div>
              </button>
            ))}
          </div>
        </div>

        {/* Choix de la durée */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 mb-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">2. Choisis la durée</label>
          <div className="grid grid-cols-3 gap-3">
            {DUREES.map(d => (
              <button
                key={d.months}
                onClick={() => setMonths(d.months)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  months === d.months ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm text-slate-900">{d.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Choix du réseau + numéro de dépôt */}
        <div className="bg-slate-900 rounded-2xl p-6 mb-4 text-white">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-sm text-slate-300">Montant à déposer</span>
            <span className="text-2xl font-black">{montant.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm text-slate-300 mb-3">3. Choisis ton réseau et effectue le dépôt :</p>
            <div className="grid grid-cols-2 gap-3">
              {RESEAUX.map(r => (
                <button
                  key={r.value}
                  onClick={() => setReseau(r.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    reseau === r.value ? 'border-white/40 bg-white/10' : 'border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: r.couleur }} />
                    <span className="text-sm font-bold">{r.label}</span>
                  </div>
                  <div className="text-base font-black tracking-wide">{r.numero}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload de la preuve */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 mb-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">4. Confirme avec une capture d'écran</label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-8 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all">
            {preview ? (
              <img src={preview} alt="Aperçu" className="h-32 rounded-lg object-cover" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-slate-400" />
                <span className="text-sm text-slate-500 font-medium">Clique pour ajouter ta capture d'écran</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || !file}
          className="w-full px-6 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xs hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {submitting ? 'Envoi en cours...' : 'Soumettre ma preuve de paiement'}
        </button>
      </div>
    </div>
  )
}
