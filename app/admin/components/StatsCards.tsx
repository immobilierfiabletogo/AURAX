'use client'

interface Props {
  listings: any[]
  users: any[]
}

export default function StatsCards({ listings, users }: Props) {
  const totalAnnonces = listings.length
  const annoncesActives = listings.filter(l => l.is_active).length
  const annoncesBoostees = listings.filter(l => l.is_boosted).length
  const totalClics = listings.reduce((acc, l) => acc + (l.whatsapp_clicks ?? 0), 0)
  const totalUsers = users.length
  const totalAgences = users.filter(u => u.user_type === 'agence').length
  const totalParticuliers = users.filter(u => u.user_type === 'particulier').length
  const tauxActivation = totalAnnonces > 0 ? Math.round((annoncesActives / totalAnnonces) * 100) : 0

  const stats = [
    { icon: '🏠', val: totalAnnonces, label: 'Total annonces', cls: 'gold' },
    { icon: '✅', val: annoncesActives, label: 'Actives', cls: 'green' },
    { icon: '⚡', val: annoncesBoostees, label: 'Boostées', cls: 'gold' },
    { icon: '📲', val: totalClics, label: 'Clics WhatsApp', cls: 'blue' },
    { icon: '👥', val: totalUsers, label: 'Utilisateurs', cls: '' },
    { icon: '🏢', val: totalAgences, label: 'Agences', cls: '' },
    { icon: '👤', val: totalParticuliers, label: 'Particuliers', cls: '' },
    { icon: '📈', val: `${tauxActivation}%`, label: 'Taux activation', cls: 'green' },
  ]

  const colorMap: Record<string, string> = {
    gold: '#fbb03b', green: '#22c55e', blue: '#60a5fa', '': '#f0f2f8',
  }

  // Top zones
  const zoneCount = listings.reduce((acc: any, l) => {
    acc[l.zone_saisie] = (acc[l.zone_saisie] ?? 0) + 1
    return acc
  }, {})
  const topZones = Object.entries(zoneCount)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 7)

  // Top clics
  const topClics = [...listings]
    .sort((a, b) => (b.whatsapp_clicks ?? 0) - (a.whatsapp_clicks ?? 0))
    .slice(0, 6)

  return (
    <>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: 18,
          }}>
            <div style={{ fontSize: 18, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-1.5px', color: colorMap[s.cls], fontFamily: 'monospace', lineHeight: 1, marginBottom: 3 }}>
              {s.val}
            </div>
            <div style={{ fontSize: 11, color: '#5a5e70' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top zones */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f2f8', marginBottom: 18 }}>Top zones</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topZones.map(([zone, count]: any) => (
            <div key={zone} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: '#5a5e70', width: 130, flexShrink: 0, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{zone}</span>
              <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #fbb03b, #f97316)', width: `${(count / (listings.length || 1)) * 100}%`, transition: 'width 0.6s ease' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#f0f2f8', fontFamily: 'monospace', width: 36, textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top clics WhatsApp */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f2f8', marginBottom: 18 }}>Top annonces par clics WhatsApp</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topClics.map(l => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: '#5a5e70', width: 130, flexShrink: 0, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
              <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #60a5fa, #3b82f6)', width: `${totalClics > 0 ? ((l.whatsapp_clicks ?? 0) / totalClics) * 100 : 0}%`, transition: 'width 0.6s ease' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#f0f2f8', fontFamily: 'monospace', width: 36, textAlign: 'right' }}>{l.whatsapp_clicks ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}