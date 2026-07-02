import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{minHeight:'100vh', background:'#f7f7f5', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px'}}>
      <div style={{textAlign:'center', maxWidth:'400px'}}>
        <p style={{fontSize:'80px', marginBottom:'16px'}}>🏠</p>
        <h1 style={{fontSize:'24px', fontWeight:'800', color:'#1a1c22', marginBottom:'8px'}}>
          Page introuvable
        </h1>
        <p style={{fontSize:'14px', color:'#6a6e7a', marginBottom:'8px', lineHeight:'1.6'}}>
          Cette page n'existe pas ou a été déplacée.
        </p>
        <p style={{fontSize:'13px', color:'#9a9ea8', marginBottom:'28px'}}>
          Revenez à l'accueil pour continuer votre recherche immobilière.
        </p>
        <Link 
          href="/" 
          style={{display:'inline-block', padding:'12px 28px', background:'#1a1c22', color:'white', borderRadius:'12px', fontWeight:'700', fontSize:'14px', textDecoration:'none'}}
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}