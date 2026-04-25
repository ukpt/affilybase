export default function Confidentialite() {
  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem', color: '#1a1a1a', background: '#F5F2EC', minHeight: '100vh' }}>
      
      <a href="/landing" style={{ fontSize: '13px', color: '#888', textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>← Retour</a>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '22px', fontWeight: 700 }}>Affily</span>
        <div style={{ width: '100%', height: '1px', background: '#1a1a1a', margin: '3px 0' }} />
        <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Base</span>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '0.5rem' }}>Politique de Confidentialité</h1>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>Dernière mise à jour : 25 avril 2026</p>

      {[
        {
          title: '1. Données collectées',
          content: "Affilybase collecte les données suivantes : adresse email (inscription et connexion), URL de votre boutique Shopify, données relatives à vos codes d'affiliation, ventes et commissions générées via la plateforme."
        },
        {
          title: '2. Utilisation des données',
          content: "Vos données sont utilisées exclusivement pour : fournir et améliorer le service Affilybase, gérer votre compte et abonnement, calculer et afficher les statistiques de votre programme d'affiliation, vous contacter en cas de besoin lié au service."
        },
        {
          title: '3. Partage des données',
          content: "Affilybase ne vend ni ne loue vos données personnelles à des tiers. Vos données peuvent être partagées avec nos prestataires techniques (Supabase pour la base de données, Vercel pour l'hébergement, Stripe pour les paiements) dans le strict cadre de la fourniture du service."
        },
        {
          title: '4. Cookies',
          content: "Affilybase utilise des cookies techniques nécessaires au fonctionnement du service (authentification, session). Aucun cookie publicitaire ou de tracking tiers n'est utilisé."
        },
        {
          title: '5. Conservation des données',
          content: "Vos données sont conservées pendant toute la durée de votre abonnement et jusqu'à 30 jours après la suppression de votre compte, délai nécessaire pour les sauvegardes de sécurité."
        },
        {
          title: '6. Vos droits',
          content: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous via la page Contact. Nous nous engageons à répondre dans un délai de 30 jours."
        },
        {
          title: '7. Sécurité',
          content: "Affilybase met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction."
        },
        {
          title: '8. Contact',
          content: "Pour toute question relative à notre politique de confidentialité ou pour exercer vos droits, contactez-nous via notre page Contact."
        },
      ].map(({ title, content }, i) => (
        <div key={i} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '0.5rem' }}>{title}</h2>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8 }}>{content}</p>
        </div>
      ))}
    </main>
  )
}