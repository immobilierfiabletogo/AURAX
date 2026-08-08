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

type SubscriptionPlan = ReturnType<
  typeof useSubscriptionPlans
>['plans'][number]

type SelectedPlan = SubscriptionPlan & {
  icon: typeof Crown
  badge: string | null
  color: string
  bg: string
  border: string
}

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
    useState<SelectedPlan | null>(null)

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
    let mounted = true

    async function loadProfile() {
      setLoading(true)

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error(
          'Erreur récupération utilisateur :',
          authError
        )

        if (mounted) {
          setLoading(false)
        }

        router.push('/login')
        return
      }

      if (!user) {
        if (mounted) {
          setLoading(false)
        }

        router.push('/login')
        return
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select(
          'full_name,user_type,plan,subscription_status'
        )
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        console.error(
          'Erreur récupération profil :',
          profileError
        )

        if (mounted) {
          setLoading(false)
        }

        return
      }

      if (profile.user_type !== 'agence') {
        if (mounted) {
          setLoading(false)
        }

        router.push('/mon-espace')
        return
      }

      if (!mounted) {
        return
      }

      setAgenceName(
        profile.full_name ?? ''
      )

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

    loadProfile()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  function getTotal() {
    if (!selectedPlan) {
      return 0
    }

    let total =
      selectedPlan.monthly_price *
      selectedDuree.months

    if (selectedDuree.months === 3) {
      total = Math.round(
        total * 0.95
      )
    }

    if (selectedDuree.months === 12) {
      total =
        selectedPlan.monthly_price * 10
    }

    return total
  }

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(
        selectedMoyen.number
      )

      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error(
        'Impossible de copier le numéro :',
        error
      )
    }
  }

  async function handleSendConfirmation() {
    if (sending) {
      return
    }

    if (!paymentProof) {
      alert(
        'Veuillez sélectionner la capture de votre paiement.'
      )
      return
    }

    if (!selectedPlan) {
      alert(
        'Veuillez sélectionner un abonnement.'
      )
      return
    }

    if (
      selectedPlan.code !== 'pro' &&
      selectedPlan.code !== 'premium'
    ) {
      alert('Plan invalide.')
      return
    }

    if (
      !paymentProof.type.startsWith(
        'image/'
      )
    ) {
      alert(
        'Veuillez sélectionner une image valide.'
      )
      return
    }

    const MAX_FILE_SIZE =
      10 * 1024 * 1024

    if (
      paymentProof.size >
      MAX_FILE_SIZE
    ) {
      alert(
        'La capture est trop volumineuse. Taille maximale : 10 Mo.'
      )
      return
    }

    setSending(true)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error(
          'Erreur authentification :',
          authError
        )

        alert(
          "Votre session n'est plus valide. Veuillez vous reconnecter."
        )

        router.push('/login')
        return
      }

      if (!user) {
        alert(
          'Votre session a expiré. Veuillez vous reconnecter.'
        )

        router.push('/login')
        return
      }

      /*
       * Nom de fichier sécurisé.
       *
       * Structure :
       * payment-proofs/
       *   user-id/
       *     uuid.extension
       */
      const extension =
        paymentProof.name
          .split('.')
          .pop()
          ?.toLowerCase() || 'jpg'

      const allowedExtensions = [
        'jpg',
        'jpeg',
        'png',
        'webp',
        'gif',
      ]

      const safeExtension =
        allowedExtensions.includes(
          extension
        )
          ? extension
          : 'jpg'

      const fileName =
        `${user.id}/${crypto.randomUUID()}.${safeExtension}`

      /*
       * UPLOAD DE LA PREUVE
       */
      const {
        error: uploadError,
      } = await supabase.storage
        .from('payment-proofs')
        .upload(
          fileName,
          paymentProof,
          {
            cacheControl: '3600',
            contentType:
              paymentProof.type,
            upsert: false,
          }
        )

      if (uploadError) {
        console.error(
          'Erreur upload preuve de paiement :',
          uploadError
        )

        const message =
          uploadError.message?.toLowerCase() ??
          ''

        if (
          message.includes(
            'row-level security'
          ) ||
          message.includes(
            'not authorized'
          ) ||
          message.includes(
            'unauthorized'
          )
        ) {
          alert(
            "L'envoi de la preuve est bloqué par les permissions de stockage. Vérifiez les policies du bucket payment-proofs."
          )
        } else if (
          message.includes(
            'already exists'
          )
        ) {
          alert(
            'Cette preuve existe déjà. Veuillez sélectionner à nouveau votre capture.'
          )
        } else if (
          message.includes(
            'payload too large'
          ) ||
          message.includes(
            'file size'
          )
        ) {
          alert(
            'La capture est trop volumineuse.'
          )
        } else {
          alert(
            `Impossible d'envoyer la preuve de paiement : ${uploadError.message}`
          )
        }

        return
      }

      /*
       * URL publique de la preuve
       */
      const {
        data: publicUrlData,
      } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName)

      const screenshotUrl =
        publicUrlData.publicUrl

      if (!screenshotUrl) {
        console.error(
          'URL publique introuvable :',
          fileName
        )

        alert(
          "La preuve a été envoyée mais son URL n'a pas pu être générée."
        )

        return
      }

      /*
       * ENREGISTREMENT DE LA DEMANDE
       */
      const {
        error: submissionError,
      } = await supabase
        .from('payment_submissions')
        .insert({
          agent_id: user.id,
          plan_requested:
            selectedPlan.code,
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
          'Erreur création payment_submissions :',
          submissionError
        )

        alert(
          `La preuve a été envoyée, mais la demande de paiement n'a pas pu être enregistrée : ${submissionError.message}`
        )

        return
      }

      /*
       * Succès
       */
      setPaymentProof(null)
      setStep('confirm')
    } catch (error) {
      console.error(
        "Erreur inattendue lors de l'envoi :",
        error
      )

      if (
        error instanceof Error
      ) {
        alert(
          `Une erreur est survenue : ${error.message}`
        )
      } else {
        alert(
          "Une erreur est survenue lors de l'envoi de votre preuve de paiement."
        )
      }
    } finally {
      setSending(false)
    }
  }

  /*
   * LOADING
   */
  if (
    loading ||
    loadingPlans
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  /*
   * ÉTAPE 1 — PLANS
   */
  if (step === 'plans') {
    const availablePlans =
      plans.filter(
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

            {availablePlans.map(
              (plan) => {

                const planWithStyle: SelectedPlan =
                  {
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
                  }

                return (
                  <PlanCard
                    key={plan.id}
                    plan={
                      planWithStyle
                    }
                    onSelect={() => {
                      setSelectedPlan(
                        planWithStyle
                      )

                      setPaymentProof(
                        null
                      )

                      setStep(
                        'checkout'
                      )
                    }}
                  />
                )
              }
            )}

          </div>
        </div>
      </div>
    )
  }

  /*
   * ÉTAPE 2 — CHECKOUT
   */
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
              selectedDuree={
                selectedDuree
              }
              setSelectedDuree={
                setSelectedDuree
              }

              moyens={
                MOYENS_PAIEMENT
              }
              selectedMoyen={
                selectedMoyen
              }
              setSelectedMoyen={
                setSelectedMoyen
              }

              copied={copied}
              onCopy={copyNumber}

              paymentProof={
                paymentProof
              }
              setPaymentProof={
                setPaymentProof
              }

              total={getTotal()}

              sending={sending}

              onBack={() => {
                setStep('plans')
                setPaymentProof(
                  null
                )
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

  /*
   * ÉTAPE 3 — CONFIRMATION
   *
   * selectedPlan est vérifié avant
   * d'être transmis à ConfirmationCard.
   */
  if (
    step === 'confirm' &&
    selectedPlan
  ) {
    return (
      <ConfirmationCard
        plan={selectedPlan}
        duree={selectedDuree}
        moyen={selectedMoyen}
        total={getTotal()}
      />
    )
  }

  /*
   * Sécurité :
   * aucun état incohérent ne doit
   * afficher une page vide.
   */
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
      <div className="text-center">

        <p className="text-sm font-bold text-slate-600">
          Une erreur est survenue.
        </p>

        <button
          type="button"
          onClick={() => {
            setSelectedPlan(null)
            setStep('plans')
          }}
          className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Retour aux abonnements
        </button>

      </div>
    </div>
  )
}