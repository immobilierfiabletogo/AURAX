'use client'

const PLANS = [
  { value: 'starter', label: 'Starter', color: '#5a5e70' },
  { value: 'pro', label: 'Pro', color: '#60a5fa' },
  { value: 'premium', label: 'Premium', color: '#fbb03b' },
] as const

const DUREES = [
  { label: '1 mois', months: 1 },
  { label: '3 mois', months: 3 },
  { label: '12 mois', months: 12 },
] as const

interface Props {
  subPlan: 'starter' | 'pro' | 'premium'
  subMonths: number
  onPlanChange: (p: 'starter' | 'pro' | 'premium') => void
  onMonthsChange: (m: number) => void
  onActivate: () => void
}

export default function SubscriptionModal({ subPlan, subMonths, onPlanChange, onMonthsChange, onActivate }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '14px', background: 'rgba(255,255,255,0.02)' }}>
      <span style={{ fontSize: 11, color: '#5a5e70', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Plan :</span>
      {PLANS.map(p => (
        <button
          key={p.value}
          onClick={() => onPlanChange(p.value)}
          style={{
            padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
            border: `1px solid ${subPlan === p.value ? p.color + '55' : 'rgba(255,255,255,0.08)'}`,
            background: subPlan === p.value ? p.color + '15' : 'rgba(255,255,255,0.04)',
            color: subPlan === p.value ? p.color : '#5a5e70',
            fontSize: 11, fontWeight: 600,
          }}
        >
          {p.label}
        </button>
      ))}
      <span style={{ fontSize: 11, color: '#5a5e70', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginLeft: 10 }}>Durée :</span>
      {DUREES.map(d => (
        <button
          key={d.months}
          onClick={() => onMonthsChange(d.months)}
          style={{
            padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
            border: `1px solid ${subMonths === d.months ? 'rgba(251,176,59,0.35)' : 'rgba(255,255,255,0.08)'}`,
            background: subMonths === d.months ? 'rgba(251,176,59,0.08)' : 'rgba(255,255,255,0.04)',
            color: subMonths === d.months ? '#fbb03b' : '#5a5e70',
            fontSize: 11, fontWeight: 600,
          }}
        >
          {d.label}
        </button>
      ))}
      <button
        onClick={onActivate}
        style={{ marginLeft: 10, padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid rgba(34,197,94,0.35)', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: 11, fontWeight: 700 }}
      >
        ✅ Activer
      </button>
    </div>
  )
}