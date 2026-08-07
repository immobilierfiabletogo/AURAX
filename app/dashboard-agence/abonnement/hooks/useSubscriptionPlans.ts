'use client'

import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

export type PlanCode = 'pro' | 'premium'

export interface SubscriptionFeature {
  feature: string
  display_order: number
}

export interface SubscriptionPlan {
  id: string
  code: PlanCode
  name: string
  description: string | null

  monthly_price: number

  max_listings: number | null
  max_images: number
  monthly_boosts: number

  analytics_enabled: boolean
  verified_badge: boolean
  featured_priority: boolean
  priority_support: boolean
  monthly_reports: boolean
  custom_branding: boolean

  display_order: number

  color: string
  bg: string
  border: string

  features: SubscriptionFeature[]
}

interface PlanStyle {
  color: string
  bg: string
  border: string
}

const PLAN_STYLES: Record<PlanCode, PlanStyle> = {
  pro: {
    color: '#2ECC71',
    bg: 'rgba(46,204,113,.08)',
    border: 'rgba(46,204,113,.20)',
  },

  premium: {
    color: '#F59E0B',
    bg: 'rgba(245,158,11,.08)',
    border: 'rgba(245,158,11,.20)',
  },
}

function isPlanCode(
  code: string
): code is PlanCode {
  return code === 'pro' || code === 'premium'
}

export function useSubscriptionPlans() {
  const supabase = createClient()

  const [plans, setPlans] = useState<
    SubscriptionPlan[]
  >([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    setLoading(true)

    const [
      { data: plansData, error: plansError },
      { data: featuresData, error: featuresError },
    ] = await Promise.all([
      supabase
        .from('subscription_plans')
        .select('*')
        .order('display_order'),

      supabase
        .from('subscription_plan_features')
        .select('*')
        .order('display_order'),
    ])

    if (plansError) {
      console.error(
        'Erreur chargement des abonnements:',
        plansError
      )

      setPlans([])
      setLoading(false)
      return
    }

    if (featuresError) {
      console.error(
        'Erreur chargement des fonctionnalités:',
        featuresError
      )
    }

    if (!plansData) {
      setPlans([])
      setLoading(false)
      return
    }

    const formatted: SubscriptionPlan[] =
      plansData
        .filter((plan) =>
          isPlanCode(plan.code)
        )
        .map((plan) => {
          const code =
            plan.code as PlanCode

          const style =
            PLAN_STYLES[code]

          const features =
            featuresData
              ?.filter(
                (feature) =>
                  feature.plan_code === code
              )
              .map((feature) => ({
                feature: feature.feature,
                display_order:
                  feature.display_order,
              })) ?? []

          return {
            id: plan.id,
            code,

            name: plan.name,
            description:
              plan.description ?? null,

            monthly_price:
              Number(plan.monthly_price ?? 0),

            max_listings:
              plan.max_listings === null
                ? null
                : Number(plan.max_listings),

            max_images:
              Number(plan.max_images ?? 0),

            monthly_boosts:
              Number(
                plan.monthly_boosts ?? 0
              ),

            analytics_enabled:
              plan.analytics_enabled ?? false,

            verified_badge:
              plan.verified_badge ?? false,

            featured_priority:
              plan.featured_priority ?? false,

            priority_support:
              plan.priority_support ?? false,

            monthly_reports:
              plan.monthly_reports ?? false,

            custom_branding:
              plan.custom_branding ?? false,

            display_order:
              Number(
                plan.display_order ?? 0
              ),

            color: style.color,
            bg: style.bg,
            border: style.border,

            features,
          }
        })

    setPlans(formatted)
    setLoading(false)
  }

  return {
    plans,
    loading,
    refresh: loadPlans,
  }
}