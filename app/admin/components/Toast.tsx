'use client'

interface Props {
  message: { text: string; type: 'success' | 'error' } | null
}

export default function Toast({ message }: Props) {
  if (!message) return null
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      padding: '12px 20px', borderRadius: 10,
      fontSize: 13, fontWeight: 600, color: '#fff',
      zIndex: 1000, display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      animation: 'slideIn 0.2s ease',
      background: message.type === 'success' ? '#22c55e' : '#ef4444',
    }}>
      {message.type === 'success' ? '✅' : '❌'} {message.text}
    </div>
  )
}