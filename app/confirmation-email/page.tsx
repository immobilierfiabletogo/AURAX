import Link from 'next/link'

export default function ConfirmationEmailPage() {
  return (
    <>
      <style>{`
        .confirm-shell { min-height: calc(100vh - 60px); background: #f7f7f5; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .confirm-card { background: #fff; border: 1px solid rgba(26,28,34,0.08); border-radius: 20px; padding: 48px 40px; width: 100%; max-width: 440px; text-align: center; box-shadow: 0 8px 32px rgba(26,28,34,0.06); }
        .confirm-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(46,204,113,0.1); border: 2px solid rgba(46,204,113,0.25); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 28px; }
        .confirm-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #1a1c22; margin-bottom: 10px; }
        .confirm-text { font-size: 14px; color: #6a6e7a; line-height: 1.65; margin-bottom: 28px; }
        .confirm-note { font-size: 12px; color: #9a9ea8; margin-top: 16px; }
        .confirm-link { color: #2ECC71; font-weight: 600; text-decoration: none; }
        .confirm-link:hover { text-decoration: underline; }
      `}</style>

      <div className="confirm-shell">
        <div className="confirm-card">
          <div className="confirm-icon">✉️</div>
          <h1 className="confirm-title">Vérifiez votre e-mail</h1>
          <p className="confirm-text">
            Votre compte a été créé avec succès. Nous vous avons envoyé un e-mail de confirmation.
            Cliquez sur le lien dans cet e-mail pour activer votre compte et accéder à AURAX.
          </p>
          <p className="confirm-note">
            Vous n'avez pas reçu l'e-mail ?{' '}
            <Link href="/login" className="confirm-link">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}