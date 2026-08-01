'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  Lock,
  Loader2,
  Mail,
  Building2,
  User,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'


function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const supabase = createClient()

  const confirmed = searchParams.get('confirmed')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)


  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setLoading(true)
    setError(null)


    const {
      data,
      error: signInError,
    } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })


    if (signInError) {

      if (
        signInError.message
          .toLowerCase()
          .includes('email not confirmed')
      ) {
        setError(
          "Votre adresse e-mail n'est pas encore confirmée."
        )
      } else {
        setError(
          "Adresse e-mail ou mot de passe incorrect."
        )
      }

      setLoading(false)
      return
    }


    if (!data.user) {
      setError(
        "Impossible de récupérer votre compte."
      )

      setLoading(false)
      return
    }


    const {
      data: profile,
    } =
      await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', data.user.id)
        .single()


    if (!profile) {

      setError(
        "Votre profil n'est pas encore configuré."
      )

      setLoading(false)
      return
    }


    if (profile.user_type === 'agence') {
      router.push('/dashboard-agence')
    } else {
      router.push('/dashboard-agence')
    }


    router.refresh()
  }



  return (

    <main className="min-h-screen bg-slate-50 px-4 py-10">

      <section className="mx-auto flex max-w-md items-center justify-center">

        <div
          className="
          w-full
          rounded-[28px]
          border
          border-slate-200
          bg-white
          p-8
          shadow-[0_24px_80px_rgba(15,23,42,0.08)]
          sm:p-10
          "
        >

          {/* Logo */}

          <header className="mb-10 text-center">

            <div
              className="
              mx-auto mb-5
              flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-emerald-50
              text-emerald-700
              "
            >
              <Building2 className="h-7 w-7" />
            </div>


            <p
              className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.25em]
              text-slate-400
              "
            >
              AURAX
            </p>


            <h1
              className="
              mt-3
              text-3xl
              font-bold
              tracking-tight
              text-slate-900
              "
            >
              Connexion
            </h1>


            <p
              className="
              mt-3
              text-sm
              leading-6
              text-slate-500
              "
            >
              Accédez à votre espace immobilier.
            </p>

          </header>



          {confirmed && (

            <div
              className="
              mb-6
              rounded-2xl
              border
              border-emerald-200
              bg-emerald-50
              px-5
              py-4
              text-sm
              font-medium
              text-emerald-700
              "
            >
              ✅ Email confirmé avec succès.
              Connectez-vous maintenant.
            </div>

          )}



          {error && (

            <div
              className="
              mb-6
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              text-red-700
              "
            >
              {error}
            </div>

          )}



          <form
            onSubmit={handleLogin}
            className="space-y-6"
          >


            {/* Email */}

            <div className="space-y-2">

              <label
                className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-slate-500
                "
              >
                Adresse e-mail
              </label>


              <div className="relative">

                <Mail
                  className="
                  pointer-events-none
                  absolute
                  left-5
                  top-1/2
                  h-5
                  w-5
                  -translate-y-1/2
                  text-slate-400
                  "
                />


                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e)=>
                    setEmail(e.target.value)
                  }
                  placeholder="contact@agence.com"
                  className="
                  h-16
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  pl-14
                  pr-5
                  text-sm
                  outline-none
                  transition
                  focus:border-emerald-600
                  focus:ring-4
                  focus:ring-emerald-50
                  "
                />

              </div>

            </div>



            {/* Password */}

            <div className="space-y-2">

              <label
                className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-slate-500
                "
              >
                Mot de passe
              </label>


              <div className="relative">

                <Lock
                  className="
                  pointer-events-none
                  absolute
                  left-5
                  top-1/2
                  h-5
                  w-5
                  -translate-y-1/2
                  text-slate-400
                  "
                />


                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={password}
                  onChange={(e)=>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  className="
                  h-16
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  pl-14
                  pr-14
                  text-sm
                  outline-none
                  transition
                  focus:border-emerald-600
                  focus:ring-4
                  focus:ring-emerald-50
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  hover:text-slate-700
                  "
                >

                  {
                    showPassword
                      ? <EyeOff className="h-5 w-5"/>
                      : <Eye className="h-5 w-5"/>
                  }

                </button>

              </div>

            </div>




            <button
              type="submit"
              disabled={loading}
              className="
              flex
              h-16
              w-full
              items-center
              justify-center
              rounded-2xl
              bg-emerald-700
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-emerald-800
              disabled:cursor-not-allowed
              disabled:bg-slate-300
              "
            >

              {
                loading ? (

                  <>
                    <Loader2
                      className="
                      mr-2
                      h-5
                      w-5
                      animate-spin
                      "
                    />

                    Connexion...

                  </>

                ) : (

                  'Se connecter'

                )

              }

            </button>


          </form>



          <div
            className="
            mt-8
            border-t
            border-slate-200
            pt-6
            text-center
            text-sm
            text-slate-500
            "
          >

            Pas encore membre ?{' '}

            <Link
              href="/register"
              className="
              font-semibold
              text-emerald-700
              hover:text-emerald-800
              "
            >
              Créer un compte
            </Link>


          </div>


        </div>

      </section>

    </main>

  )
}



export default function LoginPage() {

  return (

    <Suspense fallback={null}>

      <LoginContent />

    </Suspense>

  )
}