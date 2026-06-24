import Link from 'next/link'

export const metadata = {
  title: 'Politique de confidentialité — AURAX',
  description: "Comment AURAX collecte, utilise et protège vos données personnelles.",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="legal-section">
      <h2>{title}</h2>
      {children}
    </div>
  )
}

export default function ConfidentialitePage() {
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
        .legal-contact-box { background: rgba(46,204,113,0.06); border: 1px solid rgba(46,204,113,0.18); border-radius: 14px; padding: 18px 20px; margin-top: 10px; }
      `}</style>

      <div className="legal-shell">
        <div className="legal-wrap">
          <Link href="/" className="legal-back">← Retour à l'accueil</Link>

          <p className="legal-eyebrow">AURAX — Document légal</p>
          <h1 className="legal-title">Politique de confidentialité</h1>
          <p className="legal-updated">Dernière mise à jour : Août 2026</p>

          <div className="legal-card">

            <Section title="1. Introduction">
              <p>
                AURAX (« nous », « la plateforme », « le service ») est une plateforme numérique togolaise
                mettant en relation les agences immobilières, promoteurs, propriétaires, acheteurs et
                locataires sur le marché de Lomé et ses environs.
              </p>
              <p>
                La présente politique décrit comment nous collectons, utilisons, conservons et protégeons
                vos données personnelles, conformément à la législation togolaise relative à la protection
                des données à caractère personnel et aux recommandations de l'Instance de Régulation de la
                Protection des Données à caractère Personnel (IRPDP).
              </p>
              <p>En créant un compte ou en utilisant AURAX, vous acceptez les pratiques décrites ici.</p>
            </Section>

            <Section title="2. Données que nous collectons">
              <p>Nous collectons uniquement les données nécessaires au bon fonctionnement de la plateforme :</p>
              <ul>
                <li>Identité : nom complet ou nom de l'agence</li>
                <li>Coordonnées : numéro WhatsApp, adresse e-mail</li>
                <li>Informations professionnelles (agences) : description, adresse, site web</li>
                <li>Contenu publié : annonces, photos, description, prix, localisation</li>
                <li>Données techniques : journaux de connexion, adresse IP, type d'appareil</li>
                <li>Données d'usage : vues d'annonces, clics de contact, interactions</li>
              </ul>
              <p>Aucune donnée bancaire n'est stockée sur nos serveurs. Les paiements, lorsqu'ils existent, sont traités par des prestataires tiers (Mobile Money, etc.).</p>
            </Section>

            <Section title="3. Pourquoi nous collectons ces données">
              <ul>
                <li>Créer et gérer votre compte utilisateur</li>
                <li>Afficher vos annonces aux personnes intéressées</li>
                <li>Permettre la mise en relation entre utilisateurs</li>
                <li>Assurer la sécurité et la modération de la plateforme</li>
                <li>Améliorer le service via les statistiques d'usage</li>
                <li>Vous contacter pour le support technique</li>
              </ul>
              <p>Nous ne vendons jamais vos données à des tiers et ne les utilisons pas à des fins publicitaires externes.</p>
            </Section>

            <Section title="4. Stockage et sécurité">
              <p>
                Les données sont hébergées sur des infrastructures cloud sécurisées (Supabase) avec
                chiffrement des communications et contrôle d'accès strict. Seules les personnes autorisées
                accèdent aux données nécessaires à l'administration de la plateforme — les agences n'ont
                accès qu'à leurs propres annonces et aux demandes qui leur sont destinées.
              </p>
              <p>Aucun système n'étant totalement infaillible, nous nous engageons à informer les utilisateurs concernés en cas de violation de données.</p>
            </Section>

            <Section title="5. Durée de conservation">
              <p>
                Les données sont conservées pendant la durée d'utilisation active du compte. En cas
                d'inactivité prolongée ou de suppression de compte, elles sont supprimées ou anonymisées
                dans un délai raisonnable.
              </p>
              <p>Les annonces supprimées sont retirées immédiatement de l'affichage public et effacées définitivement dans un délai de 30 jours.</p>
            </Section>

            <Section title="6. Partage des données">
              <ul>
                <li>Avec d'autres utilisateurs : votre nom et contact sont visibles par les personnes intéressées par vos annonces</li>
                <li>Avec nos prestataires techniques : hébergement, notifications, dans la stricte mesure nécessaire</li>
                <li>Avec les autorités compétentes : uniquement si la loi togolaise l'exige</li>
              </ul>
              <p>Aucune donnée n'est transmise à des fins commerciales à des tiers extérieurs.</p>
            </Section>

            <Section title="7. Vos droits">
              <ul>
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit de suppression de votre compte et de vos données</li>
                <li>Droit d'opposition à certains traitements</li>
                <li>Droit à la portabilité de vos données</li>
              </ul>
              <p>Pour exercer ces droits, contactez-nous via les coordonnées ci-dessous.</p>
            </Section>

            <Section title="8. Cookies">
              <p>AURAX utilise uniquement des cookies techniques essentiels au fonctionnement (maintien de session). Aucun cookie publicitaire tiers n'est utilisé à ce stade.</p>
            </Section>

            <Section title="9. Mineurs">
              <p>AURAX est destiné aux utilisateurs majeurs (18 ans et plus). Nous ne collectons pas sciemment de données concernant des mineurs.</p>
            </Section>

            <Section title="10. Modifications">
              <p>Cette politique peut être mise à jour pour refléter l'évolution du service ou de la législation. Toute modification substantielle sera communiquée via la plateforme.</p>
            </Section>

            <Section title="11. Contact">
              <p>Pour toute question relative à cette politique :</p>
              <div className="legal-contact-box">
                <p style={{ margin: 0 }}>📱 WhatsApp : [ 79963708]</p>
                <p style={{ margin: 0 }}>✉️ E-mail : [djaglijosephbenoit@gmail.com]</p>
              </div>
            </Section>

          </div>
        </div>
      </div>
    </>
  )
}