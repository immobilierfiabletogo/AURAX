'use client'

import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import type { PaymentSubmission } from '@/types'

import {
  approvePaymentAction,
  rejectPaymentAction,
} from "@/app/admin/actions/payments";

const ITEMS_PER_PAGE = 50

type PlanCode = 'pro' | 'premium'

export function usePayments(
  showToast: (
    text: string,
    type?: 'success' | 'error'
  ) => void
) {
  const supabase = createClient()

  const [payments, setPayments] =
    useState<PaymentSubmission[]>([])

  const [loading, setLoading] =
    useState(false)

  const loadPayments = async () => {
    setLoading(true)

    const { data, error } =
      await supabase
        .from('payment_submissions')
        .select(`
          *,
          profiles!payment_submissions_agent_id_fkey(
            full_name,
            phone_number
          )
        `)
        .order('created_at', {
          ascending: false,
        })
        .range(
          0,
          ITEMS_PER_PAGE - 1
        )

    if (error) {
      console.error(
        'Erreur chargement paiements :',
        error
      )

      showToast(
        error.message,
        'error'
      )

      setLoading(false)
      return
    }

    /*
     * Supabase peut retourner un type relationnel
     * différent du type généré PaymentSubmission.
     *
     * Le résultat est donc converti explicitement
     * ici afin de conserver un seul type dans le hook.
     */
    setPayments(
      (data ?? []) as unknown as PaymentSubmission[]
    )

    setLoading(false)
  }

  const approvePayment = async (
    payment: PaymentSubmission
  ) => {
    setLoading(true)

    const plan =
      payment.plan_requested as PlanCode

    if (
      plan !== 'pro' &&
      plan !== 'premium'
    ) {
      showToast(
        "Plan d'abonnement invalide.",
        'error'
      )

      setLoading(false)
      return
    }

    const result =
      await approvePaymentAction(
        payment.id,
        payment.agent_id,
        plan,
        payment.months_requested
      )

    if (result?.error) {
      showToast(
        result.error.message,
        'error'
      )
    } else {
      showToast(
        'Abonnement activé avec succès.',
        'success'
      )

      await loadPayments()
    }

    setLoading(false)
  }

  const rejectPayment = async (
    payment: PaymentSubmission
  ) => {
    setLoading(true)

    const result =
      await rejectPaymentAction(
        payment.id,
        payment.agent_id
      )

    if (result?.error) {
      showToast(
        result.error.message,
        'error'
      )
    } else {
      showToast(
        'Paiement refusé.',
        'success'
      )

      await loadPayments()
    }

    setLoading(false)
  }

  return {
    payments,
    setPayments,
    loading,
    loadPayments,
    approvePayment,
    rejectPayment,
  }
}
