'use client'

import { useEffect, useState } from 'react'
import { createClient } from "@/lib/supabase/client";

export interface SubscriptionFeature {
  feature: string
  display_order: number
}

export interface SubscriptionPlan {
  id: string
  code: string
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

export function useSubscriptionPlans() {
  const supabase = createClient()

  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    setLoading(true)

    const { data: plansData } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('display_order')

    const { data: featuresData } = await supabase
      .from('subscription_plan_features')
      .select('*')
      .order('display_order')

    if (!plansData) {
      setLoading(false)
      return
    }

    const colors: Record<string, any> = {
      free: {
        color: '#94A3B8',
        bg: 'rgba(148,163,184,.08)',
        border: 'rgba(148,163,184,.20)',
      },

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

    const formatted = plansData.map((plan: any) => ({
      ...plan,

      ...colors[plan.code],

      features:
        featuresData?.filter(
          (f: any) => f.plan_code === plan.code
        ) ?? [],
    }))

    setPlans(formatted)

    setLoading(false)
  }

  return {
    plans,
    loading,
    refresh: loadPlans,
  }
}