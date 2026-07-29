'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from "@/lib/supabase/client";
import Link from 'next/link'
import { Eye, EyeOff, Building2, User, ChevronRight, Loader2 } from 'lucide-react'

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const typeParam = searchParams.get('type')
  const [step, setStep] = useState<'type' | 'form'>(typeParam ? 'form' : 'type')
  const [userType, setUserType] = useState<'agence' | 'particulier'>(
    typeParam === 'agence' ? 'agence' : typeParam === 'particulier' ? 'particulier' : 'agence'
  )
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptCGU, setAcceptCGU] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectType = (type: 'agence' | 'particulier') => {
    setUserType(type)
    setStep('form')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptCGU) { setError("Veuillez accepter les conditions d'utilisation."); return }
    if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); return }
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return }

    setLoading(true)
    setError(null)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone_number: phone, user_type: userType }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    router.push('/confirmation-email')
  }

  const profiles = {
    agence: {
      icon: Building2,
      title: 'Agence / Promoteur',
      desc: 'Vous êtes une agence immobilière, un promoteur ou un professionnel de l\'immobilier.',
      perks: ['Tableau de bord professionnel', 'Annonces illimitées', 'Statistiques détaillées', 'Contacts directs avec les prospects'],
      color: '#2ECC71',
      bg: 'rgba(46,204,113,0.06)',
      border: 'rgba(46,204,113,0.2)',
    },
    particulier: {
      icon: User,
      title: 'Propriétaire',
      desc: 'Vous avez un bien à louer ou à vendre et souhaitez le publier directement.',
      perks: ['Publication gratuite', '1 annonce en ligne', 'Contact direct avec les acheteurs', 'Suivi des visites'],
      color: '#3B82F6',
      bg: 'rgba(59,130,246,0.06)',
      border: 'rgba(59,130,246,0.2)',
    }
  }

  if (step === 'type') {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">

          {/* Logo */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-2xl font-black tracking-tight">
                AU<span className="text-emerald-500">RAX</span>
              </span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Créer un compte
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Choisissez votre profil pour commencer
            </p>
          </div>

          {/* Cards de sélection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {(Object.entries(profiles) as [keyof typeof profiles, typeof profiles['agence']][]).map(([key, profile]) => {
              const Icon = profile.icon
              return (
                <button
                  key={key}
                  onClick={() => handleSelectType(key)}
                  className="group text-left p-6 rounded-2xl border-2 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                  style={{ borderColor: profile.border }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: profile.bg }}>
                      <Icon className="w-6 h-6" style={{ color: profile.color }} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors mt-1" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-1">{profile.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{profile.desc}</p>
                  <ul className="space-y-1.5">
                    {profile.perks.map((perk, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0" style={{ background: profile.color }}>✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </button>
              )
            })}
          </div>

          <p className="text-center text-xs text-slate-400">
            Déjà un compte ?{' '}
            <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    )
  }

  const profile = profiles[userType]
  const Icon = profile.icon

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl font-black tracking-tight">
              AU<span className="text-emerald-500">RAX</span>
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: profile.bg }}>
              <Icon className="w-4 h-4" style={{ color: profile.color }} />
            </div>
            <span className="text-sm font-bold" style={{ color: profile.color }}>{profile.title}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Créer votre compte</h1>
          <button
            onClick={() => setStep('type')}
            className="text-xs text-slate-400 hover:text-slate-600 mt-1 cursor-pointer"
          >
            ← Changer de profil
          </button>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                {userType === 'agence' ? "Nom de l'agence *" : 'Nom complet *'}
              </label>
              <input
                type="text" required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder={userType === 'agence' ? 'Ex: Immo Lomé' : 'Ex: Kofi Mensah'}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Numéro WhatsApp *</label>
              <input
                type="tel" required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+228 90 00 00 00"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Adresse e-mail *</label>
              <input
                type="email" required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Mot de passe *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Confirmer le mot de passe *</label>
              <input
                type={showPassword ? 'text' : 'password'} required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Répétez votre mot de passe"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox" required
                checked={acceptCGU}
                onChange={e => setAcceptCGU(e.target.checked)}
                className="mt-0.5 cursor-pointer"
              />
              <label className="text-xs text-slate-500 leading-relaxed">
                J'accepte les{' '}
                <Link href="/cgu" target="_blank" className="font-bold text-emerald-600 hover:underline">
                  Conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link href="/confidentialite" target="_blank" className="font-bold text-emerald-600 hover:underline">
                  Politique de confidentialité
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-white font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              style={{ background: loading ? '#94a3b8' : profile.color }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Création en cours...</>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Déjà un compte ?{' '}
            <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  )
}