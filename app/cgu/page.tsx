export default function CGU() {
  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem', color: '#1a1a1a', background: '#F5F2EC', minHeight: '100vh' }}>
      
      <a href="/landing" style={{ fontSize: '13px', color: '#888', textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>← Retour</a>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '22px', fontWeight: 700 }}>Affily</span>
        <div style={{ width: '100%', height: '1px', background: '#1a1a1a', margin: '3px 0' }} />
        <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Base</span>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '0.5rem' }}>Conditions Générales d'Utilisation</h1>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>Dernière mise à jour : 25 avril 2026</p>

      {[
        {
          title: '1. Objet',
          content: "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme Affilybase, accessible à l'adresse affilybase.vercel.app. En utilisant Affilybase, vous acceptez sans réserve les présentes CGU."
        },
        {
          title: '2. Description du service',
          content: "Affilybase est une plateforme SaaS permettant aux boutiques Shopify de créer et gérer des programmes d'affiliation. Elle permet aux vendeurs de créer des codes promo personnalisés pour leurs partenaires (affiliés), et de suivre les ventes et commissions générées."
        },
        {
          title: '3. Inscription et compte',
          content: "Pour utiliser Affilybase, vous devez créer un compte en fournissant une adresse email valide. Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les activités réalisées depuis votre compte."
        },
        {
          title: '4. Plans et tarification',
          content: "Affilybase propose plusieurs plans d'abonnement : Free (gratuit, 1 mois d'essai), Starter (5€/mois), Pro (9.99€/mois) et Business (39.99€/mois). Les prix sont indiqués en euros TTC. Vous pouvez changer de plan ou résilier à tout moment, sans engagement."
        },
        {
          title: '5. Paiement des commissions',
          content: "Affilybase calcule automatiquement les commissions dues aux affiliés selon les paramètres définis par le vendeur. Le paiement effectif des commissions est de la responsabilité exclusive du vendeur. Affilybase n'agit pas comme intermédiaire financier et ne garantit pas le paiement des commissions."
        },
        {
          title: '6. Propriété intellectuelle',
          content: "Affilybase et tous ses éléments (logo, design, code source) sont la propriété exclusive d'Affilybase. Toute reproduction ou utilisation non autorisée est interdite."
        },
        {
          title: '7. Limitation de responsabilité',
          content: "Affilybase ne peut être tenu responsable des pertes de données, interruptions de service, ou dommages indirects liés à l'utilisation de la plateforme. Le service est fourni 'tel quel', sans garantie de disponibilité continue."
        },
        {
          title: '8. Résiliation',
          content: "Vous pouvez résilier votre compte à tout moment depuis les paramètres de votre dashboard. Affilybase se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU."
        },
        {
          title: '9. Droit applicable',
          content: "Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence exclusive des tribunaux français."
        },
        {
          title: '10. Contact',
          content: "Pour toute question relative aux présentes CGU, vous pouvez nous contacter via la page Contact de notre site."
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