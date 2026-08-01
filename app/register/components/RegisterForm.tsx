'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import {
  Building2,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react'


interface RegisterFormProps {

  userType: 'agence' | 'particulier'

  fullName: string
  phone: string
  email: string
  password: string
  confirmPassword: string

  showPassword: boolean
  acceptCGU: boolean
  loading: boolean
  error: string | null


  setFullName: (value: string) => void
  setPhone: (value: string) => void
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  setConfirmPassword: (value: string) => void
  setShowPassword: (value: boolean) => void
  setAcceptCGU: (value: boolean) => void


  onSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => void

}


function calculatePasswordStrength(password: string) {

  let score = 0

  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  return score

}



export default function RegisterForm({

  userType,

  fullName,
  phone,
  email,
  password,
  confirmPassword,

  showPassword,
  acceptCGU,
  loading,
  error,

  setFullName,
  setPhone,
  setEmail,
  setPassword,
  setConfirmPassword,
  setShowPassword,
  setAcceptCGU,

  onSubmit,

}: RegisterFormProps) {


  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  )


  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword



  const accountTitle =
    userType === 'agence'
      ? 'Créer votre compte agence'
      : 'Créer votre compte propriétaire'


  const accountDescription =
    userType === 'agence'
      ? 'Publiez vos biens et développez votre activité depuis votre espace professionnel.'
      : 'Publiez directement votre bien et échangez avec les personnes intéressées.'


  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[28px] border border-slate-200 bg-white p-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
    >
            <header className="mb-10 space-y-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">

          {userType === 'agence' ? (
            <Building2 className="h-6 w-6 text-emerald-700" />
          ) : (
            <User className="h-6 w-6 text-emerald-700" />
          )}

        </div>


        <div className="space-y-2">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            AURAX
          </p>


          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {accountTitle}
          </h1>


          <p className="max-w-md text-sm leading-7 text-slate-500">
            {accountDescription}
          </p>

        </div>

      </header>



      {error && (

        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">

          {error}

        </div>

      )}



      <div className="space-y-6">


        {/* Nom agence / propriétaire */}

        <div className="space-y-2">

          <label
            htmlFor="fullName"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >

            {userType === 'agence'
              ? "Nom de l'agence"
              : 'Nom complet'}

          </label>



          <div className="relative">

            {userType === 'agence' ? (

              <Building2 className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            ) : (

              <User className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            )}



            <input

              id="fullName"

              name="fullName"

              type="text"

              autoComplete="name"

              required

              value={fullName}

              onChange={(e) =>
                setFullName(e.target.value)
              }

              placeholder={
                userType === 'agence'
                  ? 'Ex. AURAX Immobilier'
                  : 'Ex. Koffi Mensah'
              }

              className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"

            />

          </div>

        </div>




        {/* WhatsApp */}

        <div className="space-y-2">


          <label
            htmlFor="phone"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >

            WhatsApp

          </label>



          <div className="relative">

            <Phone className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />


            <input

              id="phone"

              name="phone"

              type="tel"

              autoComplete="tel"

              required

              value={phone}

              onChange={(e) =>
                setPhone(e.target.value)
              }

              placeholder="+228 90 00 00 00"

              className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"

            />


          </div>



          <p className="text-xs leading-6 text-slate-400">

            Ce numéro sera utilisé pour recevoir les contacts liés à vos annonces.

          </p>


        </div>




        {/* Email */}

        <div className="space-y-2">


          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >

            Adresse e-mail

          </label>



          <div className="relative">


            <Mail className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />



            <input

              id="email"

              name="email"

              type="email"

              autoComplete="email"

              required

              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

              placeholder="contact@email.com"

              className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"

            />


          </div>


        </div>

                {/* Mot de passe */}

        <div className="space-y-3">

          <label
            htmlFor="password"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Mot de passe
          </label>


          <div className="relative">

            <Lock className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />


            <input

              id="password"

              name="password"

              type={showPassword ? 'text' : 'password'}

              autoComplete="new-password"

              required

              value={password}

              onChange={(e) =>
                setPassword(e.target.value)
              }

              placeholder="Minimum 8 caractères"

              className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-16 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"

            />



            <button

              type="button"

              onClick={() =>
                setShowPassword(!showPassword)
              }

              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"

            >

              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}

            </button>


          </div>



          <div className="space-y-2">

            <div className="flex gap-2">

              {[1, 2, 3, 4, 5].map((level) => (

                <div

                  key={level}

                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    strength >= level
                      ? 'bg-emerald-600'
                      : 'bg-slate-200'
                  }`}

                />

              ))}


            </div>


            <p className="text-xs text-slate-400">

              Utilisez au moins 8 caractères avec lettres,
              chiffres et symbole.

            </p>


          </div>


        </div>




        {/* Confirmation mot de passe */}

        <div className="space-y-2">


          <label

            htmlFor="confirmPassword"

            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"

          >

            Confirmer le mot de passe

          </label>



          <div className="relative">


            <Lock className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />


            <input

              id="confirmPassword"

              name="confirmPassword"

              type={showPassword ? 'text' : 'password'}

              autoComplete="new-password"

              required

              value={confirmPassword}

              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }

              placeholder="Retapez votre mot de passe"


              className={`h-16 w-full rounded-2xl border bg-white pl-14 pr-14 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-4 ${
                passwordsMatch
                  ? 'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-50'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-50'
              }`}

            />


            {passwordsMatch && (

              <Check className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />

            )}


          </div>


        </div>




        {/* Conditions */}

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-200">


          <input

            type="checkbox"

            checked={acceptCGU}

            onChange={(e) =>
              setAcceptCGU(e.target.checked)
            }

            className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"

          />



          <span className="text-sm leading-7 text-slate-600">

            J'accepte les{' '}

            <Link
              href="/cgu"
              className="font-medium text-emerald-700 hover:text-emerald-800"
            >

              Conditions d'utilisation

            </Link>

            {' '}et la{' '}

            <Link
              href="/confidentialite"
              className="font-medium text-emerald-700 hover:text-emerald-800"
            >

              Politique de confidentialité

            </Link>

            .


          </span>


        </label>





        <div className="space-y-6 pt-2">


          <button

            type="submit"

            disabled={
              loading ||
              !acceptCGU ||
              !passwordsMatch ||
              password.length < 8
            }


            className="flex h-16 w-full items-center justify-center rounded-2xl bg-emerald-700 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"

          >


            {loading ? (

              <>

                <Loader2 className="mr-2 h-5 w-5 animate-spin" />

                Création du compte...

              </>


            ) : (

              userType === 'agence'

                ? 'Créer mon compte agence'

                : 'Créer mon compte propriétaire'


            )}


          </button>





          <p className="text-center text-xs leading-6 text-slate-400">

            AURAX vous permet de publier vos biens simplement
            et de recevoir des contacts qualifiés.

          </p>





          {/* Changement de type */}

          <div className="relative py-2">


            <div className="absolute inset-0 flex items-center">

              <div className="w-full border-t border-slate-200" />

            </div>


            <div className="relative flex justify-center">

              <span className="bg-white px-4 text-xs uppercase tracking-[0.2em] text-slate-400">

                ou

              </span>


            </div>


          </div>





          {userType === 'agence' ? (


            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">


              <h3 className="text-sm font-semibold text-slate-900">

                Vous êtes propriétaire ?

              </h3>



              <p className="mt-2 text-sm leading-6 text-slate-500">

                Publiez directement votre bien à vendre ou à louer
                sans créer d'espace professionnel.

              </p>



              <Link

                href="/register?type=particulier"

                className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"

              >

                Créer un compte propriétaire →

              </Link>


            </div>



          ) : (



            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">


              <h3 className="text-sm font-semibold text-slate-900">

                Vous représentez une agence ?

              </h3>



              <p className="mt-2 text-sm leading-6 text-slate-500">

                Accédez à un espace professionnel pour gérer
                vos annonces immobilières.

              </p>



              <Link

                href="/register?type=agence"

                className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"

              >

                Créer un compte agence →

              </Link>


            </div>


          )}






          <div className="border-t border-slate-200 pt-6 text-center">


            <p className="text-sm text-slate-500">

              Déjà membre ?{' '}

              <Link

                href="/login"

                className="font-semibold text-emerald-700 transition hover:text-emerald-800"

              >

                Se connecter

              </Link>


            </p>


          </div>


        </div>


      </div>


    </form>

  )

}