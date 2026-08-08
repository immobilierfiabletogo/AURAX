'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Loader2, Crown, Zap } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import Hero from './components/Hero'
import Stepper from './components/Stepper'
import PlanCard from './components/PlanCard'
import CheckoutCard from './components/CheckoutCard'
import ConfirmationCard from './components/ConfirmationCard'

import { useSubscriptionPlans } from './hooks/useSubscriptionPlans'

type PlanCode = 'pro' | 'premium'

type Step = 'plans' | 'checkout' | 'confirm'

type Duree = {
  months: number
  label: string
  discount: string | null
}

type MoyenPaiement = {
  id: string
  name: string
  number: string
  logo: string
}

const DUREES: Duree[] = [
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

const MOYENS_PAIEMENT: MoyenPaiement[] = [
  {
    id: 'moov_money',
    name: 'Moov Money',
    number: '+228 97 63 06 90',
    logo: 'M',
  },
  {
    id: 'mixx_by_yas',
    name: 'Mixx by Yas',
    number: '+228 73 06 32 83',
    logo: 'Y',
  },
]

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

  /*
   * IMPORTANT :
   * On donne explicitement les types aux states.
   */
  const [selectedDuree, setSelectedDuree] =
    useState<Duree>(DUREES[0])

  const [selectedMoyen, setSelectedMoyen] =
    useState<MoyenPaiement>(
      MOYENS_PAIEMENT[0]
    )

  const [copied, setCopied] =
    useState(false)

  const [sending, setSending] =
    useState(false)

  const [paymentProof, setPaymentProof] =
    useState<File | null>(null)

  // ... reste de ton fichier

  /**
   * Plans disponibles.
   */
  const availablePlans = useMemo(() => {
    return plans.filter(
      (plan) =>
        plan.code === 'pro' ||
        plan.code === 'premium'
    )
  }, [plans])

  /**
   * ============================================================
   * CHARGEMENT DU PROFIL
   * ============================================================
   */
  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        setLoading(true)

        /**
         * On récupère d'abord la session locale.
         *
         * getSession() permet de vérifier si le navigateur
         * possède réellement une session Supabase.
         */
        const {
          data: sessionData,
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error(
            'Erreur récupération session :',
            sessionError
          )

          if (mounted) {
            setLoading(false)
          }

          router.replace('/login')
          return
        }

        const session =
          sessionData.session

        /**
         * Pas de session = utilisateur non connecté.
         */
        if (!session?.user) {
          console.warn(
            'Aucune session Supabase active.'
          )

          if (mounted) {
            setLoading(false)
          }

          router.replace('/login')
          return
        }

        const user =
          session.user

        /**
         * On récupère ensuite le profil.
         */
        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from('profiles')
          .select(
            `
              full_name,
              user_type,
              plan,
              subscription_status,
              plan_expires_at
            `
          )
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error(
            'Erreur récupération profil :',
            profileError
          )

          if (mounted) {
            setLoading(false)
          }

          return
        }

        if (!profile) {
          console.error(
            'Profil introuvable pour :',
            user.id
          )

          if (mounted) {
            setLoading(false)
          }

          return
        }

        /**
         * Cette page est réservée aux agences.
         */
        if (
          profile.user_type !== 'agence'
        ) {
          if (mounted) {
            setLoading(false)
          }

          router.replace('/mon-espace')
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
      } catch (error) {
        console.error(
          'Erreur inattendue chargement abonnement :',
          error
        )

        if (mounted) {
          setLoading(false)
        }

        /**
         * On ne redirige vers login que si l'erreur
         * correspond réellement à une absence de session.
         */
        const message =
          error instanceof Error
            ? error.message.toLowerCase()
            : ''

        if (
          message.includes(
            'auth session missing'
          ) ||
          message.includes(
            'session missing'
          )
        ) {
          router.replace('/login')
        }
      }
    }

    loadProfile()

    /**
     * Écoute des changements d'authentification.
     *
     * Si Supabase déconnecte l'utilisateur,
     * on le renvoie vers login.
     */
    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (
            !session?.user &&
            mounted
          ) {
            router.replace('/login')
          }
        }
      )

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [router])

  /**
   * ============================================================
   * CALCUL DU TOTAL
   * ============================================================
   */
  function getTotal() {
    if (!selectedPlan) {
      return 0
    }

    let total =
      selectedPlan.monthly_price *
      selectedDuree.months

    /**
     * 3 mois = 5% de réduction.
     */
    if (
      selectedDuree.months === 3
    ) {
      total = Math.round(
        total * 0.95
      )
    }

    /**
     * 12 mois = 10 mois payés.
     */
    if (
      selectedDuree.months === 12
    ) {
      total =
        selectedPlan.monthly_price * 10
    }

    return total
  }

  /**
   * ============================================================
   * COPIER LE NUMÉRO
   * ============================================================
   */
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

  /**
   * ============================================================
   * ENVOI DE LA PREUVE
   * ============================================================
   */
  async function handleSendConfirmation() {
    if (sending) {
      return
    }

    /**
     * Vérifications frontend.
     */
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
      /**
       * ========================================================
       * 1. VÉRIFIER LA SESSION
       * ========================================================
       */
      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession()

      if (sessionError) {
        console.error(
          'Erreur récupération session :',
          sessionError
        )

        alert(
          "Impossible de vérifier votre session. Veuillez vous reconnecter."
        )

        router.replace('/login')
        return
      }

      const session =
        sessionData.session

      if (!session?.user) {
        alert(
          'Votre session a expiré. Veuillez vous reconnecter.'
        )

        router.replace('/login')
        return
      }

      const user =
        session.user

      /**
       * ========================================================
       * 2. NOM DE FICHIER SÉCURISÉ
       * ========================================================
       *
       * payment-proofs/
       *   USER_ID/
       *     UUID.extension
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

      /**
       * ========================================================
       * 3. UPLOAD
       * ========================================================
       */
      const {
        error: uploadError,
      } =
        await supabase.storage
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
          uploadError.message
            ?.toLowerCase() ?? ''

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
            "L'envoi de la preuve est bloqué par les permissions du bucket payment-proofs."
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

      /**
       * ========================================================
       * 4. GÉNÉRER L'URL PUBLIQUE
       * ========================================================
       */
      const {
        data: publicUrlData,
      } =
        supabase.storage
          .from('payment-proofs')
          .getPublicUrl(
            fileName
          )

      const screenshotUrl =
        publicUrlData.publicUrl

      if (!screenshotUrl) {
        console.error(
          'URL publique introuvable :',
          fileName
        )

        /**
         * Nettoyage du fichier uploadé.
         */
        await supabase.storage
          .from('payment-proofs')
          .remove([
            fileName,
          ])

        alert(
          "La preuve a été envoyée mais son URL n'a pas pu être générée."
        )

        return
      }

      /**
       * ========================================================
       * 5. ENREGISTRER LA DEMANDE DE PAIEMENT
       * ========================================================
       */
      const {
        error: submissionError,
      } =
        await supabase
          .from(
            'payment_submissions'
          )
          .insert({
            agent_id:
              user.id,

            plan_requested:
              selectedPlan.code,

            months_requested:
              selectedDuree.months,

            amount:
              getTotal(),

            reseau_paiement:
              selectedMoyen.id,

            screenshot_url:
              screenshotUrl,

            status:
              'pending',
          })

      /**
       * Si l'enregistrement échoue,
       * on supprime la preuve orpheline.
       */
      if (submissionError) {
        console.error(
          'Erreur création payment_submissions :',
          submissionError
        )

        await supabase.storage
          .from('payment-proofs')
          .remove([
            fileName,
          ])

        alert(
          `La preuve a été envoyée, mais la demande de paiement n'a pas pu être enregistrée : ${submissionError.message}`
        )

        return
      }

      /**
       * ========================================================
       * 6. SUCCÈS
       * ========================================================
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

  /**
   * ============================================================
   * LOADING
   * ============================================================
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

  /**
   * ============================================================
   * ÉTAPE 1 — PLANS
   * ============================================================
   */
  if (step === 'plans') {
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

  /**
   * ============================================================
   * ÉTAPE 2 — CHECKOUT
   * ============================================================
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

  /**
   * ============================================================
   * ÉTAPE 3 — CONFIRMATION
   * ============================================================
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

  /**
   * ============================================================
   * ÉTAT INCOHÉRENT
   * ============================================================
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