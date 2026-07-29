'use client'

import { Fragment, type CSSProperties } from 'react'
import SubscriptionModal from './SubscriptionModal'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function joursRestants(expiresAt: string | null): number | null {
  if (!expiresAt) return null
  return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

const PLANS = [
  { value: 'starter', label: 'Starter', color: '#5a5e70' },
  { value: 'pro', label: 'Pro', color: '#60a5fa' },
  { value: 'premium', label: 'Premium', color: '#fbb03b' },
] as const

import type { Profile } from '@/types'

interface Props {
  users: Profile[]
  search: string
  onSearch: (v: string) => void
  editingSub: string | null
  subPlan: 'starter' | 'pro' | 'premium'
  subMonths: number
  onToggleUserType: (id: string, current: string) => void
  onSetEditingSub: (id: string | null) => void
  onSubPlanChange: (p: 'starter' | 'pro' | 'premium') => void
  onSubMonthsChange: (m: number) => void
  onActivateSub: (id: string) => void
  onCancelSub: (id: string) => void
}

export default function UsersTable({
  users, search, onSearch,
  editingSub, subPlan, subMonths,
  onToggleUserType, onSetEditingSub,
  onSubPlanChange, onSubMonthsChange,
  onActivateSub, onCancelSub,
}: Props) {
  const filtered = users.filter((u: Profile) =>
    search === '' ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone_number?.includes(search)
  )

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f0f2f8' }}>
          Utilisateurs <span style={{ color: '#5a5e70', fontFamily: 'monospace', fontSize: 12 }}>({filtered.length})</span>
        </h2>
        <input
          style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, fontSize: 12, fontFamily: 'inherit', color: '#e8eaf0', outline: 'none', width: 220 }}
          placeholder="Rechercher..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Utilisateur', 'Téléphone', 'Type', 'Plan', 'Expire le', 'Inscription', 'Actions'].map((h, i) => (
                <th key={i} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#3a3e50', fontFamily: 'monospace', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const jours = joursRestants(u.plan_expires_at)
              const planInfo =
                PLANS.find((p) => p.value === u.plan) ?? PLANS[0]
              return (
                <Fragment key={u.id}>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #fbb03b, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#1a1c22', flexShrink: 0 }}>
                          {u.full_name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0' }}>{u.full_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#5a5e70', fontSize: 12, fontFamily: 'monospace' }}>{u.phone_number}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, fontFamily: 'monospace', background: u.user_type === 'agence' ? 'rgba(168,85,247,0.12)' : 'rgba(96,165,250,0.12)', color: u.user_type === 'agence' ? '#a855f7' : '#60a5fa' }}>
                        {u.user_type === 'agence' ? '🏢 Agence' : '👤 Particulier'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, fontFamily: 'monospace', background: `${planInfo.color}22`, color: planInfo.color }}>
                        {planInfo.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 11, fontFamily: 'monospace' }}>
                      {u.plan_expires_at ? (
                        <span style={{ color: jours !== null && jours <= 3 ? '#ef4444' : '#5a5e70' }}>
                          {formatDate(u.plan_expires_at)}
                          {jours !== null && jours <= 3 && jours >= 0 && ' ⚠️'}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#5a5e70', fontSize: 11, fontFamily: 'monospace' }}>{formatDate(u.created_at)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        <button onClick={() => onToggleUserType(u.id, u.user_type)} style={btnStyle}>
                          {u.user_type === 'agence' ? 'Passer Particulier' : 'Passer Agence'}
                        </button>
                        {u.user_type === 'agence' && (
                          <>
                            <button onClick={() => onSetEditingSub(editingSub === u.id ? null : u.id)} style={btnStyle}>
                              {editingSub === u.id ? 'Fermer' : 'Gérer abonnement'}
                            </button>
                            {u.plan && u.plan !== 'starter' && (
                              <button onClick={() => onCancelSub(u.id)} style={{ ...btnStyle, color: '#ef4444' }}>
                                Repasser Starter
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {editingSub === u.id && (
                    <tr>
                      <td colSpan={7}>
                        <SubscriptionModal
                          subPlan={subPlan}
                          subMonths={subMonths}
                          onPlanChange={onSubPlanChange}
                          onMonthsChange={onSubMonthsChange}
                          onActivate={() => onActivateSub(u.id)}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

const btnStyle: CSSProperties = {
  padding: '5px 10px', borderRadius: 7,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: '#5a5e70', fontSize: 11, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit',
  whiteSpace: 'nowrap',
}