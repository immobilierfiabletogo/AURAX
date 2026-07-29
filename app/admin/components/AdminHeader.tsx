'use client'

import { Bell } from 'lucide-react'

interface Props {
  unreadCount: number
  onClearNotifs: () => void
  monetizationEnabled: boolean
  loadingToggle: boolean
  onToggleMonetization: () => void
  onLogout: () => void
}

export default function AdminHeader({
  unreadCount, onClearNotifs,
  monetizationEnabled, loadingToggle, onToggleMonetization,
  onLogout
}: Props) {
  return (
    <div style={{
      background: '#13151c',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 28px', height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px', color: '#fbb03b' }}>
        AU<span style={{ color: '#f0f2f8' }}>RAX</span>
        <span style={{ marginLeft: 8, fontSize: 10, color: '#3a3e50', fontFamily: 'monospace', letterSpacing: 2 }}>CONSOLE</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Cloche notifications */}
        <div onClick={onClearNotifs} style={{ position: 'relative', cursor: 'pointer', color: '#5a5e70' }}>
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: -5, right: -5,
              background: '#ef4444', color: 'white',
              borderRadius: '50%', width: 14, height: 14,
              fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {unreadCount}
            </span>
          )}
        </div>

        {/* Toggle monétisation */}
        <button
          onClick={onToggleMonetization}
          disabled={loadingToggle}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 20,
            cursor: loadingToggle ? 'wait' : 'pointer',
            border: `1px solid ${monetizationEnabled ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.08)'}`,
            background: monetizationEnabled ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
            fontFamily: 'inherit', opacity: loadingToggle ? 0.6 : 1,
          }}
        >
          <span style={{
            width: 28, height: 16, borderRadius: 10, position: 'relative',
            background: monetizationEnabled ? '#22c55e' : '#3a3e50', transition: 'background 0.2s',
            display: 'inline-block',
          }}>
            <span style={{
              position: 'absolute', top: 2,
              left: monetizationEnabled ? 14 : 2,
              width: 12, height: 12, borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s',
            }} />
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: monetizationEnabled ? '#22c55e' : '#5a5e70' }}>
            {monetizationEnabled ? '💰 Monétisation ON' : 'Mode gratuit (beta)'}
          </span>
        </button>

        <span style={{
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#ef4444', fontSize: 10, fontWeight: 700,
          letterSpacing: 1, padding: '3px 9px', borderRadius: 20,
          fontFamily: 'monospace',
        }}>ADMIN</span>

        <button
          onClick={onLogout}
          style={{
            padding: '7px 14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, color: '#5a5e70',
            fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  )
}