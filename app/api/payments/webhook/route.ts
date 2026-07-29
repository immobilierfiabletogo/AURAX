import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    const {
      providerReference,
      status,
      transactionId,
      paidAt,
    } = payload

    if (!providerReference) {
      return NextResponse.json(
        {
          success: false,
          message: 'providerReference manquant.',
        },
        {
          status: 400,
        }
      )
    }

    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from('subscription_orders')
      .select('*')
      .eq(
        'provider_reference',
        providerReference
      )
      .single()

    if (error || !order) {
      return NextResponse.json(
        {
          success: false,
          message: 'Commande introuvable.',
        },
        {
          status: 404,
        }
      )
    }

    if (status !== 'paid') {
      await supabase
        .from('subscription_orders')
        .update({
          status,
        })
        .eq('id', order.id)

      return NextResponse.json({
        success: true,
      })
    }

    // Mise à jour de la commande

    await supabase
      .from('subscription_orders')
      .update({
        status: 'paid',
        transaction_id: transactionId,
        paid_at:
          paidAt ??
          new Date().toISOString(),
      })
      .eq('id', order.id)

    // Désactiver les anciens abonnements

    await supabase
      .from('subscriptions')
      .update({
        status: 'expired',
      })
      .eq('user_id', order.user_id)
      .eq('status', 'active')

    const start = new Date()

    const end = new Date()

    end.setMonth(end.getMonth() + 1)

    // Création du nouvel abonnement

    await supabase
      .from('subscriptions')
      .insert({
        user_id: order.user_id,
        plan: order.plan,
        status: 'active',
        starts_at: start.toISOString(),
        expires_at: end.toISOString(),
      })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    )
  }
}