'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function BoostContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleLater = () => router.push('/mon-espace')
  const handleBoost = () => alert('Fonctionnalite de boost disponible prochainement !')

  return (
    <>
      <style>{`
        .boost-shell { min-height: calc(100vh - 60px); background: #f7f7f5; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .boost-card { background: #fff; border: 1px solid rgba(26,28,34,0.08); border-radius: 24px; padding: 44px 36px; width: 100%; max-width: 480px; text-align: center; box-shadow: 0 8px 32px rgba(26,28,34,0.06); animation: slideUp 0.4s ease both; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .boost-check { width: 64px; height: 64px; border-radius: 50%; background: rgba(34,197,94,0.1); border: 2px solid rgba(34,197,94,0.25); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 28px; }
        .boost-step { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #22c55e; margin-bottom: 10px; font-family: monospace; }
        .boost-title { font-size: 24px; font-weight: 800; letter-spacing: -0.8px; color: #1a1c22; margin-bottom: 8px; }
        .boost-sub { font-size: 14px; color: #8a8e9a; margin-bottom: 28px; line-height: 1.6; }
        .boost-offer { background: rgba(251,176,59,0.06); border: 1px solid rgba(251,176,59,0.18); border-radius: 14px; padding: 22px; margin-bottom: 24px; text-align: left; }
        .boost-offer-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #fbb03b; font-family: monospace; margin-bottom: 6px; }
        .boost-offer-title { font-size: 16px; font-weight: 700; color: #1a1c22; margin-bottom: 14px; }
        .boost-perks { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .boost-perk { display: flex; align-items: center; gap: 9px; font-size: 13px; color: #5a5e70; }
        .boost-perk-dot { width: 18px; height: 18px; border-radius: 50%; background: rgba(251,176,59,0.15); display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
        .boost-price-row { display: flex; align-items: baseline; gap: 6px; }
        .boost-price { font-size: 28px; font-weight: 800; color: #fbb03b; font-family: monospace; letter-spacing: -1px; }
        .boost-price-unit { font-size: 13px; color: #b0b4c0; font-family: monospace; }
        .boost-btn-primary { width: 100%; padding: 14px; background: #fbb03b; color: #1a1c22; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; margin-bottom: 10px; }
        .boost-btn-primary:hover { background: #fac255; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(251,176,59,0.3); }
        .boost-btn-later { width: 100%; padding: 13px; background: transparent; color: #b0b4c0; border: 1px solid #e8e8e4; border-radius: 12px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .boost-btn-later:hover { color: #5a5e70; border-color: #c0c4cc; }
        .boost-note { margin-top: 16px; font-size: 11px; color: #c0c4cc; font-family: monospace; line-height: 1.6; }
        @media (max-width: 480px) { .boost-card { padding: 32px 20px; } }
      `}</style>

      <div className="boost-shell">
        <div className="boost-card">
          <div className="boost-check">✓</div>
          <p className="boost-step">Annonce publiee</p>
          <h1 className="boost-title">Votre bien est en ligne !</h1>
          <p className="boost-sub">Voulez-vous le mettre en avant pour attirer plus de contacts a Lome ?</p>

          <div className="boost-offer">
            <p className="boost-offer-label">Offre Top Annonce</p>
            <p className="boost-offer-title">Boostez pendant 3 jours</p>
            <ul className="boost-perks">
              <li className="boost-perk"><span className="boost-perk-dot">🔝</span>Affiche en tete des resultats</li>
              <li className="boost-perk"><span className="boost-perk-dot">⭐</span>Badge "Top Annonce" visible par tous</li>
              <li className="boost-perk"><span className="boost-perk-dot">📊</span>Jusqu'a 5x plus de contacts WhatsApp</li>
            </ul>
            <div className="boost-price-row">
              <span className="boost-price">500</span>
              <span className="boost-price-unit">FCFA / 3 jours</span>
            </div>
          </div>

          <button className="boost-btn-primary" onClick={handleBoost}>Booster mon annonce</button>
          <button className="boost-btn-later" onClick={handleLater}>Plus tard — continuer sans boost</button>
          <p className="boost-note">Votre annonce est deja visible sur la plateforme.<br />Le boost sera disponible au paiement prochainement.</p>
        </div>
      </div>
    </>
  )
}

export default function BoostPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a8e9a' }}>Chargement...</div>}>
      <BoostContent />
    </Suspense>
  )
}
