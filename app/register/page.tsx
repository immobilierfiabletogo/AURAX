'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  
  // 1. Déclaration de tous les états
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'particulier' | 'agence'>('particulier')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [acceptCGU, setAcceptCGU] = useState(false)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 2. Création de l'utilisateur dans l'Auth Supabase
     const { data, error: signUpError } = await supabase.auth.signUp({
       email,
       password,
       options: {
       data: {
         full_name: fullName,
         phone_number: phone,
         user_type: userType,
       }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Le profil est créé automatiquement par le trigger Supabase
    // On affiche un message de confirmation email au lieu de rediriger
    setError(null)
    setLoading(false)
    // On redirige vers une page de confirmation
    router.push('/confirmation-email')

    } catch (err) {
      console.error("Erreur critique inattendue:", err)
      setError("Une erreur critique est survenue lors de l'inscription.")
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .auth { min-height: calc(100vh - 60px); background: #f7f7f5; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .auth-card { background: #fff; border: 1px solid rgba(26,28,34,0.08); border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 8px 32px rgba(26,28,34,0.06); }
        .auth-logo { font-size: 22px; font-weight: 800; letter-spacing: -1px; color: #1a1c22; text-align: center; margin-bottom: 6px; }
        .auth-logo span { color: #fbb03b; }
        .auth-title { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: #1a1c22; text-align: center; margin-bottom: 4px; }
        .auth-sub { font-size: 13px; color: #8a8e9a; text-align: center; margin-bottom: 24px; }
        .auth-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 12px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 16px; word-break: break-word; }
        .auth-label { display: block; font-size: 13px; font-weight: 600; color: #1a1c22; margin-bottom: 6px; }
        .auth-input { width: 100%; padding: 12px 14px; border: 1px solid #e8e8e4; border-radius: 10px; font-size: 14px; font-family: inherit; color: #1a1c22; outline: none; transition: all 0.15s; box-sizing: border-box; }
        .auth-input:focus { border-color: #fbb03b; box-shadow: 0 0 0 3px rgba(251,176,59,0.1); }
        .auth-field { margin-bottom: 16px; }
        .auth-toggle-group { display: flex; gap: 10px; margin-bottom: 20px; }
        .auth-toggle-btn { flex: 1; padding: 10px; border: 1px solid #e8e8e4; background: #fff; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .auth-toggle-btn.active { background: #1a1c22; color: #fff; border-color: #1a1c22; }
        .auth-btn { width: 100%; padding: 14px; background: #1a1c22; color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; margin-top: 8px; }
        .auth-btn:hover { background: #2a2d38; }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-footer { text-align: center; margin-top: 20px; font-size: 13px; color: #8a8e9a; }
        .auth-footer a { color: #fbb03b; font-weight: 600; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="auth">
        <div className="auth-card">
          <div className="auth-logo">AU<span>RAX</span></div>
          <h1 className="auth-title">Créer un compte</h1>
          <p className="auth-sub font-medium">Rejoignez la plateforme immobilière</p>

          <form onSubmit={handleRegister}>
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-field">
              <label className="auth-label">Je suis un</label>
              <div className="auth-toggle-group">
                <button type="button" className={`auth-toggle-btn ${userType === 'particulier' ? 'active' : ''}`} onClick={() => setUserType('particulier')}>
                  👤 Particulier
                </button>
                <button type="button" className={`auth-toggle-btn ${userType === 'agence' ? 'active' : ''}`} onClick={() => setUserType('agence')}>
                  🏢 Agence
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">{userType === 'agence' ? "Nom de l'agence" : 'Nom complet'}</label>
              <input className="auth-input" type="text" required placeholder={userType === 'agence' ? 'Ex: Immo Lomé' : 'Ex: Kofi Mensah'} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div className="auth-field">
              <label className="auth-label">Numéro WhatsApp</label>
              <input className="auth-input" type="tel" required placeholder="Ex: +22890123456" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="auth-field">
              <label className="auth-label">Adresse e-mail</label>
              <input className="auth-input" type="email" required placeholder="exemple@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="auth-field">
              <label className="auth-label">Mot de passe</label>
              <input className="auth-input" type="password" required placeholder="8 caractères minimum" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

              <div className="auth-field" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <input
                  type="checkbox"
                  required
                  checked={acceptCGU}
                  onChange={(e) => setAcceptCGU(e.target.checked)}
                  style={{ marginTop: '3px' }}
                />
                <label style={{ fontSize: '12px', color: '#5a5e70', lineHeight: '1.5' }}>
                  J'accepte les{' '}
                  <Link href="/cgu" target="_blank" style={{ color: '#fbb03b', fontWeight: 600 }}>
                    Conditions Générales d'Utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link href="/confidentialite" target="_blank" style={{ color: '#fbb03b', fontWeight: 600 }}>
                    Politique de confidentialité
                  </Link>
                </label>
              </div>    
            <button type="submit" className="auth-btn" disabled={loading || !acceptCGU}>
              {loading ? 'Création du compte...' : 'Créer mon compte gratuitement'}
            </button>
          </form>

          <div className="auth-footer">
            Déjà un compte ? <Link href="/login">Se connecter</Link>
          </div>
        </div>
      </div>
    </>
  )
}