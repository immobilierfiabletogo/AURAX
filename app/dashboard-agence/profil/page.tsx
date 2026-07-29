'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createClient } from "@/lib/supabase/client";

import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  Camera,
  ShieldCheck,
  Crown,
  Building2,
  Globe,
  Phone,
  MapPin,
  FileText,
  Sparkles,
} from 'lucide-react'

export default function ProfilAgencePage() {
  const router = useRouter()
  const supabase = createClient()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [userId, setUserId] = useState('')

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')
  const [adresse, setAdresse] = useState('')
  const [website, setWebsite] = useState('')
  const [plan, setPlan] = useState('gratuit')

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          full_name,
          phone_number,
          description,
          adresse,
          website,
          avatar_url,
          user_type,
          plan
        `)
        .eq('id', user.id)
        .single()

      if (profile?.user_type !== 'agence') {
        router.push('/mon-espace')
        return
      }

      setUserId(user.id)

      setFullName(profile.full_name ?? '')
      setPhone(profile.phone_number ?? '')
      setDescription(profile.description ?? '')
      setAdresse(profile.adresse ?? '')
      setWebsite(profile.website ?? '')
      setAvatarUrl(profile.avatar_url ?? null)
      setPlan(profile.plan ?? 'gratuit')

      setLoading(false)
    }

    load()
  }, [])

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file || !userId) return

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo.")
      return
    }

    setUploadingAvatar(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()

      const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
        })
        .eq('id', userId)

      if (updateError) throw updateError

      setAvatarUrl(publicUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setSaving(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone_number: phone,
        description,
        adresse,
        website,
      })
      .eq('id', user.id)

    if (error) {
      setError(error.message)
    } else {
      setSaved(true)

      setTimeout(() => {
        setSaved(false)
      }, 3000)
    }

    setSaving(false)
  }

  const completion = [
    fullName,
    phone,
    description,
    adresse,
    website,
    avatarUrl,
  ].filter(Boolean).length

  const completionPercent = Math.round(
    (completion / 6) * 100
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

    <div className="mb-6">
      <Link
        href="/dashboard-agence"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au Cockpit
      </Link>
    </div>

    {/* HERO */}

    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl">

      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-6">

          <div className="relative">

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative"
            >

              {avatarUrl ? (

                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="h-28 w-28 rounded-3xl border-4 border-white/10 object-cover"
                />

              ) : (

                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-emerald-500 text-4xl font-black">

                  {fullName.charAt(0).toUpperCase()}

                </div>

              )}

              <div className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow-lg transition group-hover:scale-110">

                <Camera className="h-4 w-4" />

              </div>

            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />

          </div>

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-widest">

              <Sparkles className="h-3.5 w-3.5" />

              Profil Agence

            </div>

            <h1 className="text-4xl font-black">

              {fullName || 'Mon Agence'}

            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">

              Gérez votre identité professionnelle, améliorez votre visibilité
              et inspirez confiance à vos futurs clients.

            </p>

          </div>

        </div>

        <div className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl bg-white/5 p-5">

            <div className="mb-2 text-xs uppercase tracking-widest text-slate-400">

              Plan

            </div>

            <div className="flex items-center gap-2 text-xl font-black">

              <Crown className="h-5 w-5 text-yellow-400" />

              {plan.toUpperCase()}

            </div>

          </div>

          <div className="rounded-2xl bg-white/5 p-5">

            <div className="mb-2 text-xs uppercase tracking-widest text-slate-400">

              Complétude

            </div>

            <div className="text-3xl font-black">

              {completionPercent}%

            </div>

          </div>

          <div className="rounded-2xl bg-emerald-500 p-5 text-slate-950">

            <div className="mb-2 text-xs font-bold uppercase tracking-widest">

              Statut

            </div>

            <div className="flex items-center gap-2 text-xl font-black">

              <ShieldCheck className="h-5 w-5" />

              Actif

            </div>

          </div>

        </div>

      </div>

    </section>

    <div className="mt-8 grid gap-8 lg:grid-cols-3">

      <div className="lg:col-span-2">

        <form
          onSubmit={handleSave}
          className="space-y-6"
        >   

                  <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="mb-8">

              <h2 className="text-2xl font-black text-slate-900">
                Informations de l'agence
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Ces informations sont visibles sur votre profil public.
              </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Building2 className="h-4 w-4" />
                  Nom de l'agence
                </label>

                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                />

              </div>

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </label>

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                />

              </div>

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <MapPin className="h-4 w-4" />
                  Adresse
                </label>

                <input
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                />

              </div>

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Globe className="h-4 w-4" />
                  Site internet
                </label>

                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                />

              </div>

            </div>

            <div className="mt-6">

              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                <FileText className="h-4 w-4" />
                Description
              </label>

              <textarea
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="Présentez votre agence..."
              />

            </div>
                        {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {saved && (
              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                Modifications enregistrées avec succès.
              </div>
            )}

            <div className="mt-8 flex justify-end">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Enregistrer les modifications
                  </>
                )}
              </button>

            </div>

          </div>

        </form>

      </div>

      {/* SIDEBAR */}

      <div className="space-y-6">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-black text-slate-900">
            Aperçu public
          </h3>

          <div className="mt-6 text-center">

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="mx-auto h-24 w-24 rounded-3xl object-cover"
              />
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500 text-3xl font-black text-white">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}

            <h4 className="mt-4 text-lg font-black">
              {fullName || 'Mon Agence'}
            </h4>

            <p className="mt-2 text-sm text-slate-500">
              {description || 'Aucune description pour le moment.'}
            </p>

          </div>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-black">
            Complétude du profil
          </h3>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${completionPercent}%`,
              }}
            />

          </div>

          <p className="mt-4 text-sm text-slate-500">
            Votre profil est complété à
            <span className="ml-1 font-bold text-slate-900">
              {completionPercent}%
            </span>
          </p>

        </div>

        <div className="rounded-3xl bg-slate-950 p-6 text-white">

          <h3 className="text-lg font-black">
            Conseil AURAX
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            Les agences avec un logo, une description complète et un site
            internet reçoivent généralement davantage de contacts.
          </p>

        </div>

      </div>

    </div>

  </div>

</div>
)
}