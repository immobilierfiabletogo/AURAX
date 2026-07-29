'use client'

import Link from 'next/link'

export type Tab =
  | "stats"
  | "annonces"
  | "utilisateurs"
  | "paiements"
  | "requests";

interface Props {
  tab: Tab
  onTabChange: (t: Tab) => void
  totalAnnonces: number
  totalUsers: number
  totalPayments: number
}

export default function AdminTabs({ tab, onTabChange, totalAnnonces, totalUsers,totalPayments, }: Props) {
  return (
    <div style={{
      display: 'flex', gap: 4,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12, padding: 4,
      marginBottom: 28, width: 'fit-content',
    }}>
      {([
        { key: 'stats', label: '📊 Statistiques', count: null },
        { key: 'annonces', label: '🏠 Annonces', count: totalAnnonces },
        { key: 'utilisateurs', label: '👥 Utilisateurs', count: totalUsers },
        { key: "paiements", label: "💳 Paiements", count: totalPayments },
      ] as const).map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          style={{
            padding: '9px 20px', borderRadius: 9, border: 'none',
            background: tab === key ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: tab === key ? '#f0f2f8' : '#5a5e70',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.15s',
          }}
        >
          {label}
          {count !== null && (
            <span style={{
              background: 'rgba(251,176,59,0.15)', color: '#fbb03b',
              fontFamily: 'monospace', fontSize: 10,
              padding: '1px 6px', borderRadius: 20,
            }}>
              {count}
            </span>
          )}
        </button>
      ))}
      <Link
        href="/admin/analytics"
        style={{
          padding: '9px 20px', borderRadius: 9,
          color: '#5a5e70', fontSize: 13, fontWeight: 600,
          textDecoration: 'none', display: 'flex', alignItems: 'center',
          transition: 'all 0.15s',
        }}
      >
        📈 Analytics
      </Link>
      <Link
        href="/admin/moderation"
        style={{
          padding: '9px 20px', borderRadius: 9,
          color: '#5a5e70', fontSize: 13, fontWeight: 600,
          textDecoration: 'none', display: 'flex', alignItems: 'center',
          transition: 'all 0.15s',
        }}
      >
        🛡️ Modération
      </Link>
    </div>
  )
}