import Link from 'next/link'

export const metadata = {
  title: "Conditions Générales d'Utilisation — AURAX",
  description: "Règles d'usage de la plateforme immobilière AURAX.",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="legal-section">
      <h2>{title}</h2>
      {children}
    </div>
  )
}

export default function CGUPage() {
  return (
    <>
      <style>{`
        .legal-shell { background: #f7f7f5; min-height: 100vh; padding: 60px 24px 80px; }
        .legal-wrap { max-width: 760px; margin: 0 auto; }
        .legal-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #2ECC71; margin-bottom: 10px; }
        .legal-title { font-size: 30px; font-weight: 800; letter-spacing: -0.8px; color: #1a1c22; margin-bottom: 8px; }
        .legal-updated { font-size: 13px; color: #9a9ea8; margin-bottom: 36px; font-style: italic; }
        .legal-card { background: #fff; border: 1px solid rgba(26,28,34,0.08); border-radius: 20px; padding: 40px; box-shadow: 0 8px 32px rgba(26,28,34,0.05); }
        .legal-section { margin-bottom: 28px; }
        .legal-section:last-child { margin-bottom: 0; }
        .legal-section h2 { font-size: 16px; font-weight: 700; color: #1a1c22; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #efefec; }
        .legal-section p { font-size: 13.5px; line-height: 1.75; color: #4a4e5a; margin-bottom: 10px; }
        .legal-section ul { margin: 8px 0 10px 0; padding-left: 0; list-style: none; }
        .legal-section li { font-size: 13.5px; line-height: 1.7; color: #4a4e5a; padding-left: 20px; position: relative; margin-bottom: 6px; }
        .legal-section li::before { content: ''; position: absolute; left: 4px; top: 9px; width: 5px; height: 5px; border-radius: 50%; background: #2ECC71; }
        .legal-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #8a8e9a; text-decoration: none; margin-bottom: 24px; }
        .legal-back:hover { color: #1a1c22; }
        .legal-warning-box { background: rgba(251,176,59,0.07); border: 1px solid rgba(251,176,59,0.22); border-radius: 14px; padding: 16px 20px; margin-top: 10px; }
        .legal-contact-box { background: rgba(46,204,113,0.06); border: 1px solid rgba(46,204,113,0.18); border-radius: 14px; padding: 18px 20px; margin-top: 10px; }
      `}</style>

      <div className="legal-shell">
        <div className="legal-wrap">
          <Link href="/" className="legal-back">← Retour à l'accueil</Link>

          <p className="legal-eyebrow">AURAX — Document légal</p>
          <h1 className="legal-title">Conditions Générales d'Utilisation</h1>
          <p className="legal-updated">Dernière mise à jour : Août 2026</p>

          <div className="legal-card">

            <Section title="1. Objet">
              <p>
                Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et l'usage de
                la plateforme AURAX, service de mise en relation entre agences immobilières, promoteurs,
                propriétaires, acheteurs et locataires sur le marché togolais.
              </p>
              <p>En créant un compte ou en utilisant la plateforme, vous acceptez sans réserve l'intégralité des présentes CGU.</p>
            </Section>

            <Section title="2. Description du service">
              <ul>
                <li>Aux agences, promoteurs et propriétaires de publier des annonces (location, vente)</li>
                <li>Aux acheteurs et locataires de consulter ces annonces et de contacter directement les annonceurs</li>
              </ul>
              <p>AURAX n'est ni agence immobilière, ni partie aux transactions conclues entre utilisateurs. La plateforme met simplement en relation les parties intéressées.</p>
            </Section>

            <Section title="3. Inscription et compte">
              <ul>
                <li>Vous devez fournir des informations exactes et à jour lors de l'inscription</li>
                <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                <li>Un compte est strictement personnel ou professionnel et ne peut être cédé à un tiers</li>
                <li>AURAX peut suspendre tout compte fournissant des informations fausses ou trompeuses</li>
              </ul>
            </Section>

            <Section title="4. Règles de publication des annonces">
              <ul>
                <li>L'annonce doit concerner exclusivement un bien immobilier réel situé au Togo</li>
                <li>Les informations (prix, localisation, description, photos) doivent être exactes</li>
                <li>Les photos doivent représenter le bien concerné, sans être trompeuses</li>
                <li>Il est strictement interdit de publier du contenu non immobilier (véhicules, objets, services, offres d'emploi)</li>
                <li>Il est interdit de publier un contenu illégal, frauduleux, discriminatoire ou injurieux</li>
              </ul>
              <p>Chaque annonce est soumise à modération avant publication. AURAX se réserve le droit de refuser, suspendre ou supprimer toute annonce non conforme, sans préavis.</p>
            </Section>

            <Section title="5. Responsabilités des utilisateurs">
              <ul>
                <li>Ne pas exiger de paiement avant toute visite physique du bien</li>
                <li>Vérifier par eux-mêmes l'état réel du bien avant tout engagement financier</li>
                <li>Se comporter de manière respectueuse et honnête envers les autres utilisateurs</li>
                <li>Ne pas utiliser la plateforme à des fins frauduleuses</li>
              </ul>
              <div className="legal-warning-box">
                <p style={{ margin: 0 }}>
                  ⚠️ AURAX recommande vivement de ne jamais effectuer de paiement (caution, avance, frais de
                  dossier) avant d'avoir visité physiquement le bien et vérifié l'identité de l'interlocuteur.
                </p>
              </div>
            </Section>

            <Section title="6. Limitation de responsabilité">
              <ul>
                <li>AURAX n'est pas partie aux transactions conclues entre utilisateurs</li>
                <li>AURAX ne garantit pas l'exactitude absolue des informations publiées, malgré la modération</li>
                <li>AURAX ne peut être tenu responsable des litiges ou pertes résultant d'une transaction entre utilisateurs</li>
                <li>AURAX ne garantit pas une disponibilité ininterrompue du service</li>
              </ul>
              <p>Il appartient à chaque utilisateur de faire preuve de vigilance avant toute transaction immobilière.</p>
            </Section>

            <Section title="7. Modération et signalement">
              <p>
                AURAX se réserve le droit de modérer, suspendre ou supprimer tout contenu ou compte ne
                respectant pas les présentes CGU, notamment en cas de signalement par d'autres utilisateurs.
              </p>
              <p>Les utilisateurs peuvent signaler toute annonce suspecte directement depuis la plateforme ou en contactant l'équipe AURAX.</p>
            </Section>

            <Section title="8. Propriété intellectuelle">
              <p>La marque AURAX, son logo et son interface sont la propriété exclusive de AURAX. Toute reproduction non autorisée est interdite.</p>
              <p>Les utilisateurs conservent les droits sur leur contenu publié, mais accordent à AURAX une licence d'affichage dans le cadre normal du service.</p>
            </Section>

            <Section title="9. Tarification">
              <p>
                L'inscription et la consultation des annonces sont gratuites pour les acheteurs et
                locataires. Les agences, promoteurs et propriétaires peuvent accéder à des fonctionnalités
                payantes (mise en avant, abonnement) dont les tarifs sont communiqués de manière transparente
                sur la plateforme.
              </p>
            </Section>

            <Section title="10. Suspension et résiliation">
              <p>AURAX peut suspendre l'accès d'un utilisateur en cas de non-respect des CGU, sans préavis en cas de manquement grave (fraude, contenu illégal, comportement abusif).</p>
              <p>Tout utilisateur peut demander la suppression de son compte à tout moment.</p>
            </Section>

            <Section title="11. Droit applicable">
              <p>Les présentes CGU sont soumises au droit togolais. Tout litige relève de la compétence des juridictions togolaises.</p>
            </Section>

            <Section title="12. Modification des CGU">
              <p>AURAX peut modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications substantielles via la plateforme.</p>
            </Section>

            <Section title="13. Contact">
              <div className="legal-contact-box">
                <p style={{ margin: 0 }}>📱 WhatsApp : [79963708]</p>
                <p style={{ margin: 0 }}>✉️ E-mail : [djaglijosephbenoit@gmail.com]</p>
              </div>
            </Section>

          </div>
        </div>
      </div>
    </>
  )
}