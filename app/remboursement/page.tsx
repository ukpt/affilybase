export default function Remboursement() {
  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem', color: '#1a1a1a', background: '#F5F2EC', minHeight: '100vh' }}>
      
      <a href="/landing" style={{ fontSize: '13px', color: '#888', textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>← Retour</a>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '22px', fontWeight: 700 }}>Affily</span>
        <div style={{ width: '100%', height: '1px', background: '#1a1a1a', margin: '3px 0' }} />
        <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Base</span>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '0.5rem' }}>Politique de Remboursement</h1>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>Dernière mise à jour : 1er mai 2026</p>

      {[
        {
          title: '1. Période d\'essai gratuite',
          content: "Affilybase propose un plan gratuit sans limitation de durée permettant de tester le service avant tout engagement payant. Nous vous encourageons à utiliser cette période pour évaluer si le service correspond à vos besoins."
        },
        {
          title: '2. Politique de remboursement',
          content: "Si vous n'êtes pas satisfait(e) de votre abonnement Affilybase, vous pouvez demander un remboursement intégral dans les 7 jours suivant votre premier paiement. Au-delà de cette période, aucun remboursement ne sera accordé pour les périodes déjà facturées."
        },
        {
          title: '3. Comment demander un remboursement',
          content: "Pour demander un remboursement, contactez-nous via notre page Contact en indiquant votre adresse email et la raison de votre demande. Nous traiterons votre demande dans un délai de 5 jours ouvrés."
        },
        {
          title: '4. Résiliation',
          content: "Vous pouvez résilier votre abonnement à tout moment depuis la page Paramètres de votre compte. La résiliation prend effet à la fin de la période de facturation en cours. Vous continuez à bénéficier du service jusqu'à cette date."
        },
        {
          title: '5. Cas particuliers',
          content: "En cas de dysfonctionnement majeur du service imputable à Affilybase et affectant significativement votre utilisation, nous nous engageons à étudier toute demande de remboursement au cas par cas, indépendamment des délais mentionnés ci-dessus."
        },
        {
          title: '6. Contact',
          content: "Pour toute question relative à notre politique de remboursement, contactez-nous via notre page Contact. Nous nous engageons à répondre dans un délai de 48 heures ouvrées."
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