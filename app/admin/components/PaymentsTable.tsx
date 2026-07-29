'use client'

import { useState } from 'react'
import type { PaymentSubmission } from '@/types'

interface Props {
  payments: PaymentSubmission[]

  loading: boolean

  onApprove: (
    payment: PaymentSubmission
  ) => Promise<void>

  onReject: (
    payment: PaymentSubmission
  ) => Promise<void>
}

const badgeStyle = (status: string) => {
  switch (status) {
    case 'approved':
      return {
        background: '#16a34a22',
        color: '#22c55e',
      }

    case 'rejected':
      return {
        background: '#dc262622',
        color: '#ef4444',
      }

    default:
      return {
        background: '#f59e0b22',
        color: '#fbbf24',
      }
  }
}

export default function PaymentsTable({
  payments,
  loading,
  onApprove,
  onReject,
}: Props) {
  const [processingId, setProcessingId] =
    useState<string | null>(null)

  const approve = async (
    payment: PaymentSubmission
  ) => {
    setProcessingId(payment.id)

    try {
      await onApprove(payment)
    } finally {
      setProcessingId(null)
    }
  }

  const reject = async (
    payment: PaymentSubmission
  ) => {
    setProcessingId(payment.id)

    try {
      await onReject(payment)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: 'center',
          color: '#94a3b8',
        }}
      >
        Chargement...
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: 'center',
          color: '#94a3b8',
          background: '#141821',
          borderRadius: 16,
        }}
      >
        Aucune demande de paiement.
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
      }}
    >
      {payments.map((payment) => (
        <div
          key={payment.id}
          style={{
            background: '#141821',
            borderRadius: 18,
            padding: 22,
            border: '1px solid #202534',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 20,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  color: '#fff',
                  fontSize: 18,
                }}
              >
                {payment.profiles?.full_name ??
                  'Utilisateur'}
              </h3>

              <div
                style={{
                  color: '#94a3b8',
                  marginTop: 6,
                }}
              >
                {payment.profiles?.phone_number}
              </div>

              <div
                style={{
                  marginTop: 18,
                  display: 'grid',
                  gap: 8,
                  color: '#cbd5e1',
                }}
              >
                <div>
                  <strong>Plan :</strong>{' '}
                  {payment.plan_requested}
                </div>

                <div>
                  <strong>Mois :</strong>{' '}
                  {payment.months_requested}
                </div>

                <div>
                  <strong>Montant :</strong>{' '}
                  {payment.amount.toLocaleString()} FCFA
                </div>

                <div>
                  <strong>Réseau :</strong>{' '}
                  {payment.reseau_paiement}
                </div>

                <div>
                  <strong>Date :</strong>{' '}
                  {new Date(
                    payment.created_at
                  ).toLocaleString()}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 12,
              }}
            >
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 12,
                  ...badgeStyle(payment.status),
                }}
              >
                {payment.status.toUpperCase()}
              </span>

              {payment.screenshot_url && (
                <a
                  href={payment.screenshot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#60a5fa',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  📷 Voir la capture
                </a>
              )}
                            <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {payment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => approve(payment)}
                      disabled={processingId === payment.id}
                      style={{
                        padding: '10px 18px',
                        border: 'none',
                        borderRadius: 10,
                        cursor:
                          processingId === payment.id
                            ? 'not-allowed'
                            : 'pointer',
                        background: '#16a34a',
                        color: '#fff',
                        fontWeight: 700,
                        opacity:
                          processingId === payment.id
                            ? 0.6
                            : 1,
                      }}
                    >
                      {processingId === payment.id
                        ? '...'
                        : '✅ Valider'}
                    </button>

                    <button
                      onClick={() => reject(payment)}
                      disabled={processingId === payment.id}
                      style={{
                        padding: '10px 18px',
                        border: 'none',
                        borderRadius: 10,
                        cursor:
                          processingId === payment.id
                            ? 'not-allowed'
                            : 'pointer',
                        background: '#dc2626',
                        color: '#fff',
                        fontWeight: 700,
                        opacity:
                          processingId === payment.id
                            ? 0.6
                            : 1,
                      }}
                    >
                      {processingId === payment.id
                        ? '...'
                        : '❌ Refuser'}
                    </button>
                  </>
                )}

                {payment.status === 'approved' && (
                  <span
                    style={{
                      color: '#22c55e',
                      fontWeight: 700,
                    }}
                  >
                    ✔ Paiement validé
                  </span>
                )}

                {payment.status === 'rejected' && (
                  <span
                    style={{
                      color: '#ef4444',
                      fontWeight: 700,
                    }}
                  >
                    ✖ Paiement refusé
                  </span>
                )}
              </div>
            </div>
          </div>

          {payment.admin_note && (
            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 10,
                background: '#0f172a',
                color: '#cbd5e1',
                fontSize: 14,
              }}
            >
              <strong>Note admin :</strong>{' '}
              {payment.admin_note}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}