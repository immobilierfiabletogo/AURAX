'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  Building2,
  User,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import RegisterHero from './components/RegisterHero'
import RegisterForm from './components/RegisterForm'
import ProfileCard from './components/ProfileCard'


function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const supabase = createClient()

  const typeParam = searchParams.get('type')

  const initialType =
    typeParam === 'agence' || typeParam === 'particulier'
      ? typeParam
      : null


  const [step, setStep] = useState<'type' | 'form'>(
    initialType ? 'form' : 'type'
  )


  const [userType, setUserType] = useState<
    'agence' | 'particulier'
  >(
    initialType ?? 'agence'
  )


  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [acceptCGU, setAcceptCGU] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)



  function handleSelectProfile(
    type: 'agence' | 'particulier'
  ) {
    setUserType(type)
    setStep('form')
    setError(null)
  }



  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()


    if (loading) return


    if (!acceptCGU) {
      setError(
        "Veuillez accepter les conditions d'utilisation."
      )
      return
    }


    if (password !== confirmPassword) {
      setError(
        'Les mots de passe ne correspondent pas.'
      )
      return
    }


    if (password.length < 8) {
      setError(
        'Le mot de passe doit contenir au moins 8 caractères.'
      )
      return
    }


    setLoading(true)
    setError(null)



    const {
      error: signUpError
    } = await supabase.auth.signUp({

      email,

      password,

      options: {

        data: {

          full_name: fullName,

          phone_number: phone,

          user_type: userType,

        },

      },

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

      title: 'Agence immobilière',

      description:
        "Développez votre présence sur AURAX, publiez vos biens et gérez votre activité depuis un espace professionnel.",


      advantages: [

        'Catalogue professionnel',

        'Tableau de bord agence',

        'Gestion des annonces',

        'Visibilité renforcée',

      ],


      color: '#059669',

      background: '#ECFDF5',

      border: '#A7F3D0',


      buttonLabel:
        'Créer un espace agence',

    },


   

  }

    return (
    <main className="bg-slate-50">

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        <RegisterHero />


        {step === 'type' ? (

  <section className="-mt-10 relative z-20 mx-auto max-w-3xl lg:-mt-16">

    <ProfileCard
      {...profiles.agence}
      onClick={() =>
        handleSelectProfile('agence')
      }
    />

  </section>




        ) : (


          <section className="-mt-10 relative z-20 mx-auto max-w-3xl lg:-mt-16">


            <RegisterForm

              userType={userType}

              fullName={fullName}

              phone={phone}

              email={email}

              password={password}

              confirmPassword={confirmPassword}


              showPassword={showPassword}

              acceptCGU={acceptCGU}

              loading={loading}

              error={error}


              setFullName={setFullName}

              setPhone={setPhone}

              setEmail={setEmail}

              setPassword={setPassword}

              setConfirmPassword={
                setConfirmPassword
              }


              setShowPassword={
                setShowPassword
              }


              setAcceptCGU={
                setAcceptCGU
              }


              onSubmit={
                handleRegister
              }

            />



          

          </section>


        )}


      </section>

    </main>
  )

}



export default function RegisterPage() {

  return (

    <Suspense

      fallback={

        <div className="flex min-h-screen items-center justify-center bg-slate-50">

          <div
            className="
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-emerald-600
              border-t-transparent
            "
          />

        </div>

      }

    >

      <RegisterContent />

    </Suspense>

  )

}