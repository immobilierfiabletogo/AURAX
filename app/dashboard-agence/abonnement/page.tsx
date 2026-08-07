'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Loader2, Crown, Zap } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import Hero from './components/Hero'
import Stepper from './components/Stepper'
import PlanCard from './components/PlanCard'
import CheckoutCard from './components/CheckoutCard'
import ConfirmationCard from './components/ConfirmationCard'

import { useSubscriptionPlans } from './hooks/useSubscriptionPlans'

const DUREES = [
  {
    months: 1,
    label: '1 mois',
    discount: null,
  },
  {
    months: 3,
    label: '3 mois',
    discount: '5% offerts',
  },
  {
    months: 12,
    label: '12 mois',
    discount: '2 mois offerts',
  },
]

const MOYENS_PAIEMENT = [
  {
    id: 'Moov',
    name: 'Moov Money',
    number: '+228 97 63 06 90',
    logo: 'M',
  },
  {
    id: 'Yas',
    name: 'Mix by Yas',
    number: '+228 73 06 32 83',
    logo: 'Y',
  },
]

type PlanCode = 'pro' | 'premium'

type Step = 'plans' | 'checkout' | 'confirm'

export default function AbonnementPage() {
  const router = useRouter()
  const supabase = createClient()

  const {
    plans,
    loading: loadingPlans,
  } = useSubscriptionPlans()

  const [loading, setLoading] = useState(true)

  const [agenceName, setAgenceName] = useState('')

  const [currentPlan, setCurrentPlan] =
    useState<PlanCode | null>(null)

  const [step, setStep] =
    useState<Step>('plans')

  const [selectedPlan, setSelectedPlan] =
    useState<any>(null)

  const [selectedDuree, setSelectedDuree] =
    useState(DUREES[0])

  const [selectedMoyen, setSelectedMoyen] =
    useState(MOYENS_PAIEMENT[0])

  const [copied, setCopied] =
    useState(false)

  const [sending, setSending] =
    useState(false)

  const [paymentProof, setPaymentProof] =
    useState<File | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile, error } =
      await supabase
        .from('profiles')
        .select(
          'full_name,user_type,plan,subscription_status'
        )
        .eq('id', user.id)
        .single()

    if (error || !profile) {
      setLoading(false)
      return
    }

    if (profile.user_type !== 'agence') {
      router.push('/mon-espace')
      return
    }

    setAgenceName(profile.full_name ?? '')

    if (
      profile.plan === 'pro' ||
      profile.plan === 'premium'
    ) {
      setCurrentPlan(profile.plan)
    } else {
      setCurrentPlan(null)
    }

    setLoading(false)
  }

  function getTotal() {
    if (!selectedPlan) {
      return 0
    }

    let total =
      selectedPlan.monthly_price *
      selectedDuree.months

    if (selectedDuree.months === 3) {
      total = Math.round(total * 0.95)
    }

    if (selectedDuree.months === 12) {
      total =
        selectedPlan.monthly_price * 10
    }

    return total
  }

  function copyNumber() {
    navigator.clipboard.writeText(
      selectedMoyen.number
    )

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  async function handleSendConfirmation() {
    if (!paymentProof || !selectedPlan) {
      return
    }

    if (
      selectedPlan.code !== 'pro' &&
      selectedPlan.code !== 'premium'
    ) {
      alert('Plan invalide.')
      return
    }

    setSending(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const fileName =
        `${user.id}-${Date.now()}-${paymentProof.name}`

      const {
        error: uploadError,
      } = await supabase.storage
        .from('payment-proofs')
        .upload(
          fileName,
          paymentProof,
          {
            cacheControl: '3600',
            upsert: false,
          }
        )

      if (uploadError) {
        console.error(
          'Erreur upload preuve :',
          uploadError
        )

        alert(
          "Impossible d'envoyer la preuve de paiement."
        )

        return
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName)

      const screenshotUrl =
        publicUrlData.publicUrl

      const {
        error: submissionError,
      } = await supabase
        .from('payment_submissions')
        .insert({
          agent_id: user.id,
          plan_requested: selectedPlan.code,
          months_requested:
            selectedDuree.months,
          amount: getTotal(),
          reseau_paiement:
            selectedMoyen.id,
          screenshot_url:
            screenshotUrl,
          status: 'pending',
        })

      if (submissionError) {
        console.error(
          'Erreur création paiement :',
          submissionError
        )

        alert(
          "La preuve a été envoyée, mais la demande de paiement n'a pas pu être enregistrée. Veuillez réessayer."
        )

        return
      }

      setStep('confirm')
    } catch (error) {
      console.error(
        alert(
          `Une erreur est survenue lors de l'envoi de votre preuve de paiement.`
        ),
        error
      )

      alert(
        "Une erreur est survenue lors de l'envoi de votre preuve de paiement."
      )
    } finally {
      setSending(false)
    }
  }

  if (loading || loadingPlans) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  if (step === 'plans') {
    const availablePlans = plans.filter(
      (plan) =>
        plan.code === 'pro' ||
        plan.code === 'premium'
    )

    return (
      <div className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Hero
            agenceName={agenceName}
            currentPlan={currentPlan}
          />

          <div className="mt-8">
            <Stepper step={step} />
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {availablePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={{
                  ...plan,

                  icon:
                    plan.code === 'premium'
                      ? Crown
                      : Zap,

                  badge:
                    plan.code === 'premium'
                      ? 'PREMIUM'
                      : null,

                  color:
                    plan.code === 'premium'
                      ? '#D4AF37'
                      : '#2ECC71',

                  bg:
                    plan.code === 'premium'
                      ? 'linear-gradient(180deg,#111827 0%,#1F2937 100%)'
                      : 'rgba(46,204,113,.06)',

                  border:
                    plan.code === 'premium'
                      ? 'rgba(212,175,55,.35)'
                      : 'rgba(46,204,113,.25)',
                }}
                onSelect={() => {
                  setSelectedPlan({
                    ...plan,

                    icon:
                      plan.code === 'premium'
                        ? Crown
                        : Zap,

                    badge:
                      plan.code === 'premium'
                        ? 'PREMIUM'
                        : null,

                    color:
                      plan.code === 'premium'
                        ? '#D4AF37'
                        : '#2ECC71',

                    bg:
                      plan.code === 'premium'
                        ? 'linear-gradient(180deg,#111827 0%,#1F2937 100%)'
                        : 'rgba(46,204,113,.06)',

                    border:
                      plan.code === 'premium'
                        ? 'rgba(212,175,55,.35)'
                        : 'rgba(46,204,113,.25)',
                  })

                  setStep('checkout')
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (
    step === 'checkout' &&
    selectedPlan
  ) {
    return (
      <div className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Hero
            agenceName={agenceName}
            currentPlan={currentPlan}
          />

          <div className="mt-8">
            <Stepper step={step} />
          </div>

          <div className="mt-10">
            <CheckoutCard
              plan={selectedPlan}

              durees={DUREES}
              selectedDuree={selectedDuree}
              setSelectedDuree={
                setSelectedDuree
              }

              moyens={MOYENS_PAIEMENT}
              selectedMoyen={selectedMoyen}
              setSelectedMoyen={
                setSelectedMoyen
              }

              copied={copied}
              onCopy={copyNumber}

              paymentProof={paymentProof}
              setPaymentProof={
                setPaymentProof
              }

              total={getTotal()}

              sending={sending}

              onBack={() => {
                setStep('plans')
              }}

              onConfirm={
                handleSendConfirmation
              }
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <ConfirmationCard
      plan={selectedPlan}
      duree={selectedDuree}
      moyen={selectedMoyen}
      total={getTotal()}
    />
  )
}