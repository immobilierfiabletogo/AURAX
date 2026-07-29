'use client'

import Link from 'next/link'

function formatPrix(p: number) {
  return new Intl.NumberFormat('fr-TG', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(p)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface Props {
  listings: any[]
  search: string
  onSearch: (v: string) => void
  onToggleActive: (id: string, current: boolean) => void
  onToggleBoost: (id: string, current: boolean) => void
  onDelete: (id: string) => void
}

export default function ListingsTable({ listings, search, onSearch, onToggleActive, onToggleBoost, onDelete }: Props) {
  const filtered = listings.filter(l =>
    search === '' ||
    l.title?.toLowerCase().includes(search.toLowerCase()) ||
    l.zone_saisie?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f0f2f8' }}>
          Annonces <span style={{ color: '#5a5e70', fontFamily: 'monospace', fontSize: 12 }}>({filtered.length})</span>
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
              {['Bien', 'Prix', 'Zone', 'Statut', 'Boost', 'Clics WA', 'Date', 'Actions'].map((h, i) => (
                <th key={i} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#3a3e50', fontFamily: 'monospace', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 48, height: 36, borderRadius: 7, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {l.images_urls?.length > 0 ? <img src={l.images_urls[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏠'}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{l.title}</div>
                      <div style={{ fontSize: 11, color: '#5a5e70', fontFamily: 'monospace', marginTop: 2 }}>{l.property_type} · {l.transaction_type}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#f0f2f8', fontFamily: 'monospace' }}>{formatPrix(l.price)}</td>
                <td style={{ padding: '12px 14px', color: '#5a5e70', fontSize: 12, fontFamily: 'monospace' }}>{l.zone_saisie}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, fontFamily: 'monospace', background: l.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: l.is_active ? '#22c55e' : '#ef4444' }}>
                    {l.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {l.is_boosted && <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, fontFamily: 'monospace', background: 'rgba(251,176,59,0.12)', color: '#fbb03b' }}>TOP</span>}
                </td>
                <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 800, color: '#60a5fa', fontFamily: 'monospace' }}>{l.whatsapp_clicks ?? 0}</td>
                <td style={{ padding: '12px 14px', color: '#5a5e70', fontSize: 11, fontFamily: 'monospace' }}>{formatDate(l.created_at)}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <button onClick={() => onToggleActive(l.id, l.is_active)} style={btnStyle}>{l.is_active ? 'Désactiver' : 'Activer'}</button>
                    <button onClick={() => onToggleBoost(l.id, l.is_boosted)} style={btnStyle}>{l.is_boosted ? 'Retirer boost' : 'Booster'}</button>
                    <Link href={`/biens/${l.id}`} style={{ ...btnStyle, textDecoration: 'none' }}>Voir</Link>
                    <button onClick={() => onDelete(l.id)} style={{ ...btnStyle, color: '#ef4444' }}>Suppr.</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '5px 10px', borderRadius: 7,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: '#5a5e70', fontSize: 11, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit',
  whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center',
}