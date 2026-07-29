import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase'

const PLANS = {
  starter: {
    amount: 9900,
    name: 'Starter',
  },
  pro: {
    amount: 24900,
    name: 'Pro',
  },
  premium: {
    amount: 49900,
    name: 'Premium',
  },
} as const

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Non authentifié.',
        },
        {
          status: 401,
        }
      )
    }

    const body = await request.json()

    const plan = body.plan as keyof typeof PLANS

    if (!plan || !(plan in PLANS)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Plan invalide.',
        },
        {
          status: 400,
        }
      )
    }

    const selectedPlan = PLANS[plan]

    const { data: order, error } = await supabase
      .from('subscription_orders')
      .insert({
        user_id: user.id,
        plan,
        amount: selectedPlan.amount,
        currency: 'XOF',
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    /*
      Ici sera branché le fournisseur :

      Stripe
      CinetPay
      FedaPay
      PayDunya
    */

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentProvider: null,
      paymentUrl: null,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message:
          "Impossible d'initialiser le paiement.",
      },
      {
        status: 500,
      }
    )
  }
}