'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'
import { Bell } from 'lucide-react'

const ADMIN_EMAIL = 'djaglijosephbenoit@gmail.com'
const ITEMS_PER_PAGE = 50

function formatPrix(p: number) {
  return new Intl.NumberFormat('fr-TG', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(p)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

// 1. COMPOSANT DE TABLEAU RÉUTILISABLE (Mise à jour n°2)
interface TableWrapperProps {
  headers: string[]
  children: React.ReactNode
}

function AdminTable({ headers, children }: TableWrapperProps) {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table className="adm-table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState<'annonces' | 'utilisateurs' | 'stats'>('stats')
  const [listings, setListings] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // États pour la notification utilisateur (Mise à jour n°3)
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Fonction utilitaire pour afficher un retour visuel à l'admin
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type })
    setTimeout(() => setStatusMessage(null), 4000)
  }

  // 2. REQUÊTES OPTIMISÉES AVEC PAGINATION SUR 50 ÉLÉMENTS (Mise à jour n°1)
  const [unreadCount, setUnreadCount] = useState(0)
  const loadData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) { 
        router.push('/')
        return 
      }

      // Ajout de .range(0, ITEMS_PER_PAGE - 1) pour éviter de saturer la mémoire si la base grandit
      const [{ data: l, error: errL }, { data: p, error: errP }] = await Promise.all([
        supabase.from('listings')
          .select('id, title, price, zone_saisie, property_type, transaction_type, images_urls, is_boosted, is_active, created_at, agent_id, whatsapp_clicks')
          .order('created_at', { ascending: false })
          .range(0, ITEMS_PER_PAGE - 1),
        supabase.from('profiles')
          .select('id, full_name, phone_number, user_type, subscription_status, created_at')
          .order('created_at', { ascending: false })
          .range(0, ITEMS_PER_PAGE - 1)
      ])

      if (errL || errP) throw new Error("Erreur lors de la récupération des données.")

      setListings(l ?? [])
      setUsers(p ?? [])
    } catch (error: any) {
      showToast(error.message || "Impossible de charger les données", 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    // Écoute temps réel
    const usersChannel = supabase.channel('realtime:profiles')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, (p) => {
        showToast(`Nouvel utilisateur : ${p.new.full_name}`)
        setUsers(prev => [p.new, ...prev])
        setUnreadCount(prev => prev + 1)
      }).subscribe()

    const listingsChannel = supabase.channel('realtime:listings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'listings' }, (p) => {
        showToast(`Nouvelle annonce : ${p.new.title}`)
        setListings(prev => [p.new, ...prev])
        setUnreadCount(prev => prev + 1)
      }).subscribe()

    return () => { supabase.removeChannel(usersChannel); supabase.removeChannel(listingsChannel) }
  }, [])

  const handleLogout = async () => { 
    await supabase.auth.signOut()
    router.push('/') 
  }

  // 3. ACTIONS SÉCURISÉES AVEC TRY / CATCH ET NOTIFICATIONS (Mise à jour n°3)
  const toggleActive = async (id: string, current: boolean) => { 
    try {
      const { error } = await supabase.from('listings').update({ is_active: !current }).eq('id', id)
      if (error) throw error
      setListings(prev => prev.map(l => l.id === id ? { ...l, is_active: !current } : l))
      showToast(`Annonce ${!current ? 'activée' : 'désactivée'} avec succès !`)
    } catch {
      showToast("Erreur lors du changement de statut", 'error')
    }
  }

  const toggleBoost = async (id: string, current: boolean) => { 
    try {
      const { error } = await supabase.from('listings').update({ is_boosted: !current }).eq('id', id)
      if (error) throw error
      setListings(prev => prev.map(l => l.id === id ? { ...l, is_boosted: !current } : l))
      showToast(current ? "Boost retiré" : "Annonce boostée au TOP ! 🎉")
    } catch {
      showToast("Erreur lors de la modification du boost", 'error')
    }
  }

  const deleteListing = async (id: string) => { 
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette annonce ?')) return
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id)
      if (error) throw error
      setListings(prev => prev.filter(l => l.id !== id))
      showToast("Annonce supprimée définitivement", 'success')
    } catch {
      showToast("Erreur lors de la suppression", 'error')
    }
  }

  const toggleUserType = async (id: string, current: string) => { 
    const next = current === 'agence' ? 'particulier' : 'agence'
    try {
      const { error } = await supabase.from('profiles').update({ user_type: next }).eq('id', id)
      if (error) throw error
      setUsers(prev => prev.map(u => u.id === id ? { ...u, user_type: next } : u))
      showToast(`Utilisateur passé en mode ${next}`)
    } catch {
      showToast("Erreur de modification du type utilisateur", 'error')
    }
  }

  // Calculs des stats restants identiques
  const totalAnnonces = listings.length
  const annoncesActives = listings.filter(l => l.is_active).length
  const annoncesBoostees = listings.filter(l => l.is_boosted).length
  const totalClics = listings.reduce((acc, l) => acc + (l.whatsapp_clicks ?? 0), 0)
  const totalUsers = users.length
  const totalAgences = users.filter(u => u.user_type === 'agence').length
  const totalParticuliers = users.filter(u => u.user_type === 'particulier').length

  const filteredListings = listings.filter(l => search === '' || l.title?.toLowerCase().includes(search.toLowerCase()) || l.zone_saisie?.toLowerCase().includes(search.toLowerCase()))
  const filteredUsers = users.filter(u => search === '' || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.phone_number?.includes(search))

  if (loading) return <div style={{ minHeight: '100vh', background: '#0d0f14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a5e70', fontWeight: 600 }}>Chargement de la console AURAX...</div>

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0f14 !important; }
        .adm { min-height: 100vh; background: #0d0f14; color: #e8eaf0; font-family: inherit; }
        .adm-top { background: #13151c; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 0 28px; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .adm-logo { font-size: 16px; font-weight: 800; letter-spacing: -0.5px; color: #fbb03b; }
        .adm-logo span { color: #f0f2f8; }
        .adm-badge { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; font-size: 10px; font-weight: 700; letter-spacing: 1px; padding: 3px 9px; border-radius: 20px; font-family: monospace; }
        .adm-logout { padding: 7px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #5a5e70; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.14s; }
        .adm-logout:hover { color: #ef4444; }
        .adm-body { max-width: 1200px; margin: 0 auto; padding: 28px 24px; }
        .adm-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 4px; margin-bottom: 28px; width: fit-content; }
        .adm-tab { padding: 9px 20px; border-radius: 9px; border: none; background: transparent; color: #5a5e70; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
        .adm-tab.active { background: rgba(255,255,255,0.08); color: #f0f2f8; }
        .adm-tab-count { background: rgba(251,176,59,0.15); color: #fbb03b; font-family: monospace; font-size: 10px; padding: 1px 6px; border-radius: 20px; }
        .adm-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-bottom: 28px; }
        .adm-stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 18px; }
        .adm-stat-icon { font-size: 18px; margin-bottom: 10px; }
        .adm-stat-val { font-size: 26px; font-weight: 800; letter-spacing: -1.5px; color: #f0f2f8; font-family: monospace; line-height: 1; margin-bottom: 3px; }
        .adm-stat-val.gold { color: #fbb03b; } .adm-stat-val.green { color: #22c55e; } .adm-stat-val.blue { color: #60a5fa; }
        .adm-stat-label { font-size: 11px; color: #5a5e70; }
        .adm-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
        .adm-section-title { font-size: 15px; font-weight: 700; color: #f0f2f8; }
        .adm-search { padding: 8px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 9px; font-size: 12px; font-family: inherit; color: #e8eaf0; outline: none; width: 220px; }
        .adm-search::placeholder { color: #3a3e50; }
        .adm-table { width: 100%; border-collapse: collapse; }
        .adm-table th { text-align: left; padding: 10px 14px; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #3a3e50; font-family: monospace; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .adm-table td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
        .adm-table tr:hover td { background: rgba(255,255,255,0.02); }
        .adm-row-img { width: 48px; height: 36px; border-radius: 7px; overflow: hidden; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 16px; color: #3a3e50; flex-shrink: 0; }
        .adm-row-img img { width: 100%; height: 100%; object-fit: cover; }
        .adm-listing-title { font-size: 13px; font-weight: 600; color: #e8eaf0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px; }
        .adm-listing-meta { font-size: 11px; color: #5a5e70; font-family: monospace; margin-top: 2px; }
        .adm-prix { font-size: 13px; font-weight: 700; color: #f0f2f8; font-family: monospace; }
        .adm-clics { font-size: 14px; font-weight: 800; color: #60a5fa; font-family: monospace; }
        .adm-pill { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 10px; font-weight: 700; font-family: monospace; }
        .adm-pill.active { background: rgba(34,197,94,0.12); color: #22c55e; }
        .adm-pill.inactive { background: rgba(239,68,68,0.12); color: #ef4444; }
        .adm-pill.boosted { background: rgba(251,176,59,0.12); color: #fbb03b; }
        .adm-pill.agence { background: rgba(168,85,247,0.12); color: #a855f7; }
        .adm-pill.particulier { background: rgba(96,165,250,0.12); color: #60a5fa; }
        .adm-actions { display: flex; gap: 5px; flex-wrap: wrap; }
        .adm-btn { padding: 5px 10px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: #5a5e70; font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.12s; white-space: nowrap; text-decoration: none; display: inline-flex; align-items: center; }
        .adm-btn:hover { color: #a0a4b0; }
        .adm-btn.green:hover { color: #22c55e; border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.06); }
        .adm-btn.gold:hover { color: #fbb03b; border-color: rgba(251,176,59,0.3); background: rgba(251,176,59,0.06); }
        .adm-btn.red:hover { color: #ef4444; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.06); }
        .adm-btn.purple:hover { color: #a855f7; border-color: rgba(168,85,247,0.3); background: rgba(168,85,247,0.06); }
        .adm-user-avatar { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #fbb03b, #f97316); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #1a1c22; flex-shrink: 0; }
        .adm-chart { display: flex; flex-direction: column; gap: 10px; }
        .adm-chart-row { display: flex; align-items: center; gap: 12px; }
        .adm-chart-label { font-size: 12px; color: #5a5e70; width: 130px; flex-shrink: 0; font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .adm-chart-bar-bg { flex: 1; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
        .adm-chart-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
        .adm-chart-val { font-size: 12px; font-weight: 700; color: #f0f2f8; font-family: monospace; width: 36px; text-align: right; flex-shrink: 0; }
        .adm-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 22px; margin-bottom: 16px; }
        .adm-card-title { font-size: 14px; font-weight: 700; color: #f0f2f8; margin-bottom: 18px; }
        
        /* Style du Toast Notification */
        .adm-toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; color: #fff; z-index: 1000; display: flex; align-items: center; gap: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); animation: slideIn 0.2s ease; }
        .adm-toast.success { background: #22c55e; border: 1px solid rgba(255,255,255,0.1); }
        .adm-toast.error { background: #ef4444; border: 1px solid rgba(255,255,255,0.1); }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div className="adm">
        <div className="adm-top">
        <div className="adm-logo">AURA<span>X</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    
          {/* AJOUT DU COMPTEUR ICI */}
          <div className="adm-bell" onClick={() => setUnreadCount(0)} style={{ position: 'relative', cursor: 'pointer', color: '#5a5e70' }}>
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="adm-bell-count" style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '14px', height: '14px', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unreadCount}
              </span>
            )}
          </div>

          <span className="adm-badge">ADMIN</span>
          <button className="adm-logout" onClick={handleLogout}>Deconnexion</button>
        </div>
      </div>

        {/* TOAST SYSTEM (Mise à jour n°3) */}
        {statusMessage && (
          <div className={`adm-toast ${statusMessage.type}`}>
            {statusMessage.type === 'success' ? '✅' : '❌'} {statusMessage.text}
          </div>
        )}

        <div className="adm-body">
          <div className="adm-tabs">
            <button className={`adm-tab ${tab === 'stats' ? 'active' : ''}`} onClick={() => { setTab('stats'); setSearch('') }}>📊 Statistiques</button>
            <button className={`adm-tab ${tab === 'annonces' ? 'active' : ''}`} onClick={() => { setTab('annonces'); setSearch('') }}>🏠 Annonces <span className="adm-tab-count">{totalAnnonces}</span></button>
            <button className={`adm-tab ${tab === 'utilisateurs' ? 'active' : ''}`} onClick={() => { setTab('utilisateurs'); setSearch('') }}>👥 Utilisateurs <span className="adm-tab-count">{totalUsers}</span></button>
          </div>

          {/* STATS */}
          {tab === 'stats' && (
            <>
              <div className="adm-stats">
                {[
                  { icon: '🏠', val: totalAnnonces, label: 'Total annonces', cls: 'gold' },
                  { icon: '✅', val: annoncesActives, label: 'Actives', cls: 'green' },
                  { icon: '⚡', val: annoncesBoostees, label: 'Boostees', cls: 'gold' },
                  { icon: '📲', val: totalClics, label: 'Clics WhatsApp', cls: 'blue' },
                  { icon: '👥', val: totalUsers, label: 'Utilisateurs', cls: '' },
                  { icon: '🏢', val: totalAgences, label: 'Agences', cls: '' },
                  { icon: '👤', val: totalParticuliers, label: 'Particuliers', cls: '' },
                  { icon: '📈', val: `${totalAnnonces > 0 ? Math.round((annoncesActives / totalAnnonces) * 100) : 0}%`, label: 'Taux activation', cls: 'green' },
                ].map((s, i) => (
                  <div key={i} className="adm-stat">
                    <div className="adm-stat-icon">{s.icon}</div>
                    <div className={`adm-stat-val ${s.cls}`}>{s.val}</div>
                    <div className="adm-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="adm-card">
                <div className="adm-card-title">Top zones</div>
                <div className="adm-chart">
                  {Object.entries(listings.reduce((acc: any, l) => { acc[l.zone_saisie] = (acc[l.zone_saisie] ?? 0) + 1; return acc }, {}))
                    .sort(([, a]: any, [, b]: any) => b - a).slice(0, 7)
                    .map(([zone, count]: any) => (
                      <div key={zone} className="adm-chart-row">
                        <span className="adm-chart-label">{zone}</span>
                        <div className="adm-chart-bar-bg"><div className="adm-chart-bar-fill" style={{ width: `${(count / (listings.length || 1)) * 100}%`, background: 'linear-gradient(90deg, #fbb03b, #f97316)' }} /></div>
                        <span className="adm-chart-val">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="adm-card">
                <div className="adm-card-title">Top annonces par clics WhatsApp</div>
                <div className="adm-chart">
                  {[...listings].sort((a, b) => (b.whatsapp_clicks ?? 0) - (a.whatsapp_clicks ?? 0)).slice(0, 6)
                    .map(l => (
                      <div key={l.id} className="adm-chart-row">
                        <span className="adm-chart-label">{l.title}</span>
                        <div className="adm-chart-bar-bg"><div className="adm-chart-bar-fill" style={{ width: `${totalClics > 0 ? ((l.whatsapp_clicks ?? 0) / totalClics) * 100 : 0}%`, background: 'linear-gradient(90deg, #60a5fa, #3b82f6)' }} /></div>
                        <span className="adm-chart-val">{l.whatsapp_clicks ?? 0}</span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* ANNONCES MODIFIÉES AVEC LE COMPOSANT TABLE (Mise à jour n°2) */}
          {tab === 'annonces' && (
            <>
              <div className="adm-section-header">
                <h2 className="adm-section-title">Toutes les annonces (Top 50 récents)</h2>
                <input className="adm-search" type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              
              <AdminTable headers={["Bien", "Prix", "Zone", "Statut", "Boost", "Clics", "Date", "Actions"]}>
                {filteredListings.map(l => (
                  <tr key={l.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="adm-row-img">{l.images_urls?.length > 0 ? <img src={l.images_urls[0]} alt="" /> : '🏠'}</div>
                        <div>
                          <div className="adm-listing-title">{l.title}</div>
                          <div className="adm-listing-meta">{l.property_type} · {l.transaction_type}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="adm-prix">{formatPrix(l.price)}</span></td>
                    <td style={{ color: '#5a5e70', fontSize: '12px', fontFamily: 'monospace' }}>{l.zone_saisie}</td>
                    <td><span className={`adm-pill ${l.is_active ? 'active' : 'inactive'}`}>{l.is_active ? 'Actif' : 'Inactif'}</span></td>
                    <td>{l.is_boosted && <span className="adm-pill boosted">Top</span>}</td>
                    <td><span className="adm-clics">{l.whatsapp_clicks ?? 0}</span></td>
                    <td style={{ color: '#5a5e70', fontSize: '11px', fontFamily: 'monospace' }}>{formatDate(l.created_at)}</td>
                    <td>
                      <div className="adm-actions">
                        <button className="adm-btn green" onClick={() => toggleActive(l.id, l.is_active)}>{l.is_active ? 'Désactiver' : 'Activer'}</button>
                        <button className="adm-btn gold" onClick={() => toggleBoost(l.id, l.is_boosted)}>{l.is_boosted ? 'Retirer boost' : 'Booster'}</button>
                        <Link href={`/biens/${l.id}`} className="adm-btn">Voir</Link>
                        <button className="adm-btn red" onClick={() => deleteListing(l.id)}>Suppr.</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </AdminTable>
            </>
          )}

          {/* UTILISATEURS MODIFIÉS AVEC LE COMPOSANT TABLE (Mise à jour n°2) */}
          {tab === 'utilisateurs' && (
            <>
              <div className="adm-section-header">
                <h2 className="adm-section-title">Tous les utilisateurs (Top 50 récents)</h2>
                <input className="adm-search" type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>

              <AdminTable headers={["Utilisateur", "Téléphone", "Type", "Abonnement", "Inscription", "Actions"]}>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="adm-user-avatar">{u.full_name?.[0]?.toUpperCase() ?? '?'}</div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#e8eaf0' }}>{u.full_name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#5a5e70', fontSize: '12px', fontFamily: 'monospace' }}>{u.phone_number}</td>
                    <td><span className={`adm-pill ${u.user_type === 'agence' ? 'agence' : 'particulier'}`}>{u.user_type === 'agence' ? '🏢 Agence' : '👤 Particulier'}</span></td>
                    <td><span className={`adm-pill ${u.subscription_status === 'premium' ? 'boosted' : 'inactive'}`}>{u.subscription_status === 'premium' ? 'Premium' : 'Gratuit'}</span></td>
                    <td style={{ color: '#5a5e70', fontSize: '11px', fontFamily: 'monospace' }}>{formatDate(u.created_at)}</td>
                    <td>
                      <div className="adm-actions">
                        <button className="adm-btn purple" onClick={() => toggleUserType(u.id, u.user_type)}>{u.user_type === 'agence' ? 'Passer Particulier' : 'Passer Agence'}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </AdminTable>
            </>
          )}
        </div>
      </div>
    </>
  )
}