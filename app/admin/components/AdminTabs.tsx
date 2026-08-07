'use client'

import Link from 'next/link'

export type Tab =
  | 'stats'
  | 'annonces'
  | 'agences'
  | 'utilisateurs'
  | 'paiements'
  | 'requests'

interface Props {
  tab: Tab
  onTabChange: (tab: Tab) => void
  totalAnnonces: number
  totalAgencies: number
  totalUsers: number
  totalPayments: number
}

export default function AdminTabs({
  tab,
  onTabChange,
  totalAnnonces,
  totalAgencies,
  totalUsers,
  totalPayments,
}: Props) {
  const tabs = [
    {
      key: 'stats' as const,
      label: 'Vue d’ensemble',
      count: null,
    },
    {
      key: 'annonces' as const,
      label: 'Annonces',
      count: totalAnnonces,
    },
    {
      key: 'agences' as const,
      label: 'Agences',
      count: totalAgencies,
      alert: totalAgencies > 0,
    },
    {
      key: 'utilisateurs' as const,
      label: 'Utilisateurs',
      count: totalUsers,
    },
    {
      key: 'paiements' as const,
      label: 'Paiements',
      count: totalPayments,
    },
    {
      key: 'requests' as const,
      label: 'Demandes',
      count: null,
    },
  ]

  return (
    <div
      style={{
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: 5,
        width: '100%',
        overflowX: 'auto',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        scrollbarWidth: 'none',
      }}
    >
      {tabs.map(({ key, label, count, alert }) => {
        const active = tab === key

        return (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              minHeight: 38,
              padding: '0 14px',
              border: 'none',
              borderRadius: 10,
              background: active
                ? 'rgba(16,185,129,0.12)'
                : 'transparent',
              color: active
                ? '#34d399'
                : '#737b8c',
              fontSize: 12,
              fontWeight: active ? 750 : 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all .18s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {label}

            {count !== null && (
              <span
                style={{
                  minWidth: 22,
                  height: 20,
                  padding: '0 6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 999,
                  background: alert
                    ? 'rgba(245,158,11,0.14)'
                    : active
                      ? 'rgba(16,185,129,0.15)'
                      : 'rgba(255,255,255,0.06)',
                  color: alert
                    ? '#f59e0b'
                    : active
                      ? '#34d399'
                      : '#697184',
                  fontSize: 10,
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}

      <div
        style={{
          width: 1,
          height: 24,
          margin: '0 3px',
          background: 'rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}
      />

      <Link
        href="/admin/analytics"
        style={{
          flexShrink: 0,
          minHeight: 38,
          padding: '0 14px',
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: 10,
          color: '#737b8c',
          fontSize: 12,
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Analytics
      </Link>

      <Link
        href="/admin/moderation"
        style={{
          flexShrink: 0,
          minHeight: 38,
          padding: '0 14px',
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: 10,
          color: '#737b8c',
          fontSize: 12,
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Modération
      </Link>
    </div>
  )
}