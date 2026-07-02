'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'

function LoginContent() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const confirmed = searchParams.get('confirmed')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 🔐 1. Connexion de l'utilisateur
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Adresse e-mail ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    if (data.user) {
      // 📊 2. Récupération du type de compte (particulier ou agence) pour la redirection
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', data.user.id)
        .single()

      if (profile?.user_type === 'agence') {
        router.push('/dashboard-agence')
      } else {
        router.push('/mon-espace')
      }
    }
    router.refresh()
  }

  return (
    <>
      <style>{`
        .auth { min-height: calc(100vh - 60px); background: #f7f7f5; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .auth-card { background: #fff; border: 1px solid rgba(26,28,34,0.08); border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 8px 32px rgba(26,28,34,0.06); }
        .auth-logo { font-size: 22px; font-weight: 800; letter-spacing: -1px; color: #1a1c22; text-align: center; margin-bottom: 6px; }
        .auth-logo span { color: #fbb03b; }
        .auth-title { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: #1a1c22; text-align: center; margin-bottom: 4px; }
        .auth-sub { font-size: 13px; color: #8a8e9a; text-align: center; margin-bottom: 28px; }
        .auth-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 12px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 16px; }
        .auth-label { display: block; font-size: 13px; font-weight: 600; color: #1a1c22; margin-bottom: 6px; }
        .auth-input { width: 100%; padding: 12px 14px; border: 1px solid #e8e8e4; border-radius: 10px; font-size: 14px; font-family: inherit; color: #1a1c22; outline: none; transition: all 0.15s; box-sizing: border-box; }
        .auth-input:focus { border-color: #fbb03b; box-shadow: 0 0 0 3px rgba(251,176,59,0.1); }
        .auth-field { margin-bottom: 16px; }
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
          <h1 className="auth-title">Connexion</h1>
          <p className="auth-sub">Accédez à votre espace immobilier</p>

          <form onSubmit={handleLogin}>
            {confirmed && (
              <div style={{background:'#f0fdf4', border:'1px solid #bbf7d0', color:'#166534', padding:'12px 14px', borderRadius:'10px', fontSize:'13px', marginBottom:'16px', fontWeight:'600'}}>
                ✅ Email confirmé avec succès. Connectez-vous maintenant.
             </div>
            )}
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-field">
              <label className="auth-label">Adresse e-mail</label>
              <input className="auth-input" type="email" required placeholder="exemple@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="auth-field">
              <label className="auth-label">Mot de passe</label>
              <input className="auth-input" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="auth-footer">
            Pas encore de compte ?{' '}
            <Link href="/register">Créer un compte</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}