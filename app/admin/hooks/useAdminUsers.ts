'use client'

import { useCallback, useState } from 'react'

import { createClient } from "@/lib/supabase/client";
import type { Profile } from '@/types'

const supabase = createClient()

const ITEMS_PER_PAGE = 50

export const PLANS = [
  {
    value: 'starter',
    label: 'Starter',
    color: '#5a5e70',
  },
  {
    value: 'pro',
    label: 'Pro',
    color: '#60a5fa',
  },
  {
    value: 'premium',
    label: 'Premium',
    color: '#fbb03b',
  },
] as const

export type Plan = (typeof PLANS)[number]['value']

export function useAdminUsers(
  showToast: (text: string, type?: 'success' | 'error') => void
) {
  const [users, setUsers] = useState<Profile[]>([])

  const [editingSub, setEditingSub] =
    useState<string | null>(null)

  const [subPlan, setSubPlan] =
    useState<Plan>('pro')

  const [subMonths, setSubMonths] =
    useState(1)

  const loadUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', {
        ascending: false,
      })
      .range(0, ITEMS_PER_PAGE - 1)

    if (error) {
      showToast(
        "Impossible de charger les utilisateurs",
        'error'
      )
      return
    }

    setUsers(data ?? [])
  }, [showToast])

  const toggleUserType = useCallback(
    async (id: string, current: string) => {
      const next =
        current === 'agence'
          ? 'particulier'
          : 'agence'

      const { error } = await supabase
        .from('profiles')
        .update({
          user_type: next,
        })
        .eq('id', id)

      if (error) {
        showToast(
          'Erreur lors de la mise à jour',
          'error'
        )
        return
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                user_type: next,
              }
            : user
        )
      )

      showToast(`Passé en ${next}`)
    },
    [showToast]
  )

  const activateSubscription =
    useCallback(
      async (id: string) => {
        const expiresAt = new Date()

        expiresAt.setMonth(
          expiresAt.getMonth() + subMonths
        )

        const { error } = await supabase
          .from('profiles')
          .update({
            plan: subPlan,
            plan_expires_at:
              expiresAt.toISOString(),
            subscription_status: 'active',
          })
          .eq('id', id)

        if (error) {
          showToast(
            "Impossible d'activer l'abonnement",
            'error'
          )
          return
        }

        setUsers((prev) =>
          prev.map((user) =>
            user.id === id
              ? {
                  ...user,
                  plan: subPlan,
                  subscription_status: 'active',
                  plan_expires_at:
                    expiresAt.toISOString(),
                }
              : user
          )
        )

        setEditingSub(null)

        showToast(
          `Abonnement ${subPlan} activé (${subMonths} mois)`
        )
      },
      [subMonths, subPlan, showToast]
    )

  const cancelSubscription =
    useCallback(
      async (id: string) => {
        if (
          !window.confirm(
            'Repasser en Starter ?'
          )
        ) {
          return
        }

        const { error } = await supabase
          .from('profiles')
          .update({
            plan: 'starter',
            subscription_status: 'inactive',
            plan_expires_at: null,
          })
          .eq('id', id)

        if (error) {
          showToast(
            "Impossible d'annuler",
            'error'
          )
          return
        }

        setUsers((prev) =>
          prev.map((user) =>
            user.id === id
              ? {
                  ...user,
                  plan: 'starter',
                  subscription_status: 'inactive',
                  plan_expires_at: null,
                }
              : user
          )
        )

        showToast(
          'Utilisateur repassé en Starter'
        )
      },
      [showToast]
    )

  return {
    users,
    setUsers,

    loadUsers,

    editingSub,
    setEditingSub,

    subPlan,
    setSubPlan,

    subMonths,
    setSubMonths,

    toggleUserType,
    activateSubscription,
    cancelSubscription,
  }
}