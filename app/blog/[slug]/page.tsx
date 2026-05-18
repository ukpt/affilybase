import { notFound } from 'next/navigation'

const articles: Record<string, any> = {
  'programme-affiliation-shopify-france': {
    titre: 'Comment créer un programme d\'affiliation pour sa boutique Shopify en France',
    description: 'Guide complet pour lancer votre programme d\'affiliation Shopify en 2026 — codes promo, commissions, partenariats boutiques.',
    date: '18 mai 2026',
    temps: '5 min',
    tag: 'Shopify',
    tagColor: '#E1F5EE',
    tagTextColor: '#085041',
    contenu: [
      {
        type: 'intro',
        texte: 'L\'affiliation marketing est l\'une des stratégies les plus efficaces pour booster les ventes d\'une boutique Shopify sans budget publicitaire. Le principe est simple : vous créez des codes promo personnalisés pour vos partenaires — clients fidèles, créateurs de contenu, boutiques complémentaires — et ils les partagent à leur audience. Vous payez une commission uniquement quand une vente est générée.'
      },
      {
        type: 'h2',
        texte: 'Qu\'est-ce qu\'un programme d\'affiliation Shopify ?'
      },
      {
        type: 'texte',
        texte: 'Un programme d\'affiliation Shopify permet à des partenaires externes de promouvoir vos produits en échange d\'une commission sur les ventes générées. Contrairement à la publicité payante, vous ne dépensez rien si personne n\'achète. C\'est un modèle à la performance, idéal pour les petites boutiques.'
      },
      {
        type: 'h2',
        texte: 'Pourquoi lancer un programme d\'affiliation pour votre boutique Shopify ?'
      },
      {
        type: 'liste',
        items: [
          'Zéro risque financier — vous payez uniquement sur les ventes réalisées',
          'Visibilité accrue — vos affiliés parlent de vous à leurs audiences',
          'Partenariats boutiques — échangez des codes avec des boutiques complémentaires',
          'Fidélisation — transformez vos meilleurs clients en ambassadeurs',
          'Compatible avec toutes les boutiques Shopify sans développement',
        ]
      },
      {
        type: 'h2',
        texte: 'Comment créer un programme d\'affiliation Shopify en 5 minutes ?'
      },
      {
        type: 'texte',
        texte: 'Avec Affilybase, vous pouvez lancer votre programme d\'affiliation Shopify en quelques minutes, sans aucune compétence technique. Voici les étapes :'
      },
      {
        type: 'etapes',
        items: [
          { num: '1', titre: 'Créez votre compte Affilybase', desc: 'Inscrivez-vous gratuitement sur affilybase.com — 30 jours d\'essai, sans carte bancaire.' },
          { num: '2', titre: 'Connectez votre boutique Shopify', desc: 'Renseignez l\'URL de votre boutique Shopify. Le tracking est automatique dès la connexion.' },
          { num: '3', titre: 'Créez vos premiers codes affiliés', desc: 'Créez un code promo unique pour chaque affilié — par exemple MARIE20 pour Marie, avec 10% de commission et 20% de remise.' },
          { num: '4', titre: 'Invitez vos affiliés', desc: 'Affilybase envoie automatiquement un email d\'invitation à chaque affilié avec son code et ses statistiques en temps réel.' },
          { num: '5', titre: 'Suivez vos ventes', desc: 'Chaque vente générée via un code affilié est automatiquement détectée et la commission calculée instantanément.' },
        ]
      },
      {
        type: 'h2',
        texte: 'Comment trouver des affiliés pour votre boutique Shopify ?'
      },
      {
        type: 'texte',
        texte: 'Trouver les bons affiliés est la clé du succès de votre programme. Voici les meilleures stratégies :'
      },
      {
        type: 'liste',
        items: [
          'Boutiques complémentaires — contactez des boutiques qui vendent des produits complémentaires aux vôtres et proposez un échange de codes mutuels',
          'Micro-influenceurs — un compte Instagram de 2 000 abonnés très engagés convertit souvent mieux qu\'un compte de 100 000',
          'Clients fidèles — vos meilleurs clients sont vos meilleurs ambassadeurs, ils connaissent et aiment déjà vos produits',
          'Créateurs de contenu — blogueurs, YouTubeurs ou TikTokeurs dans votre niche',
        ]
      },
      {
        type: 'h2',
        texte: 'Combien payer en commission à vos affiliés Shopify ?'
      },
      {
        type: 'texte',
        texte: 'Il n\'y a pas de règle universelle — tout dépend de vos marges. En général, les boutiques françaises utilisent des commissions entre 8% et 15% de la vente. L\'essentiel est de trouver un équilibre qui motive l\'affilié sans impacter votre rentabilité. Avec Affilybase, vous fixez la commission librement pour chaque affilié — et Affilybase ne prend aucune commission sur vos ventes.'
      },
      {
        type: 'cta',
        titre: 'Prêt à lancer votre programme d\'affiliation Shopify ?',
        texte: 'Créez votre compte Affilybase gratuitement — 30 jours d\'essai, sans carte bancaire, sans engagement.',
        bouton: 'Commencer gratuitement',
        lien: '/login'
      }
    ]
  },
  'programme-affiliation-woocommerce-france': {
    titre: 'Programme d\'affiliation WooCommerce : le guide complet pour les boutiques françaises',
    description: 'Comment mettre en place un programme d\'affiliation sur votre site WooCommerce — plugin gratuit, tracking automatique, commissions.',
    date: '18 mai 2026',
    temps: '6 min',
    tag: 'WooCommerce',
    tagColor: '#F0EAF9',
    tagTextColor: '#5B2D8E',
    contenu: [
      {
        type: 'intro',
        texte: 'WooCommerce est la plateforme e-commerce la plus utilisée en France sur WordPress. Si vous avez une boutique WooCommerce, vous pouvez désormais lancer votre programme d\'affiliation en quelques minutes grâce au plugin gratuit Affilybase for WooCommerce.'
      },
      {
        type: 'h2',
        texte: 'Pourquoi créer un programme d\'affiliation pour votre boutique WooCommerce ?'
      },
      {
        type: 'liste',
        items: [
          'Augmentez vos ventes sans budget publicitaire',
          'Transformez vos clients en ambassadeurs de votre marque',
          'Créez des partenariats avec des boutiques complémentaires',
          'Payez uniquement quand une vente est générée',
          'Tracking automatique via le plugin WooCommerce',
        ]
      },
      {
        type: 'h2',
        texte: 'Comment installer le plugin Affilybase for WooCommerce ?'
      },
      {
        type: 'etapes',
        items: [
          { num: '1', titre: 'Téléchargez le plugin', desc: 'Rendez-vous sur affilybase.com et téléchargez le plugin gratuit Affilybase for WooCommerce.' },
          { num: '2', titre: 'Installez sur WordPress', desc: 'Allez dans Extensions → Ajouter → Téléverser le fichier ZIP → Activez le plugin.' },
          { num: '3', titre: 'Connectez votre compte Affilybase', desc: 'Dans le menu Affilybase de votre admin WordPress, renseignez votre ID Vendeur et votre Clé secrète disponibles dans vos paramètres Affilybase.' },
          { num: '4', titre: 'Créez vos codes affiliés', desc: 'Dans votre dashboard Affilybase, créez des codes promo pour vos affiliés. Les ventes sont trackées automatiquement.' },
        ]
      },
      {
        type: 'h2',
        texte: 'Comment fonctionne le tracking WooCommerce ?'
      },
      {
        type: 'texte',
        texte: 'Quand un client passe une commande sur votre boutique WooCommerce avec un code promo affilié, le plugin détecte automatiquement la vente et l\'envoie à votre dashboard Affilybase. La commission est calculée instantanément selon le pourcentage que vous avez défini pour cet affilié. Vous n\'avez rien à faire manuellement.'
      },
      {
        type: 'cta',
        titre: 'Lancez votre programme d\'affiliation WooCommerce gratuitement',
        texte: '30 jours d\'essai gratuit — plugin WooCommerce inclus — sans carte bancaire.',
        bouton: 'Télécharger le plugin gratuit',
        lien: '/affilybase-woocommerce.zip'
      }
    ]
  },
  'vendre-en-ligne-sans-budget-pub': {
    titre: 'Vendre en ligne sans budget pub : l\'affiliation marketing pour les petites boutiques',
    description: 'Comment les petites boutiques en ligne peuvent booster leurs ventes sans dépenser en publicité grâce à l\'affiliation.',
    date: '18 mai 2026',
    temps: '4 min',
    tag: 'Marketing',
    tagColor: '#FAEEDA',
    tagTextColor: '#633806',
    contenu: [
      {
        type: 'intro',
        texte: 'La publicité en ligne coûte de plus en plus cher. Google Ads, Meta Ads, TikTok Ads — les coûts par clic explosent et le retour sur investissement devient de plus en plus difficile à mesurer. Heureusement, il existe une alternative efficace et sans risque : l\'affiliation marketing.'
      },
      {
        type: 'h2',
        texte: 'Pourquoi la pub payante ne fonctionne plus pour les petites boutiques ?'
      },
      {
        type: 'liste',
        items: [
          'Coût par clic trop élevé pour les petits budgets',
          'L\'algorithme change constamment et impacte vos résultats',
          'Vous payez même si personne n\'achète',
          'Difficile de cibler précisément votre audience idéale',
          'Résultats qui s\'arrêtent dès que vous arrêtez de payer',
        ]
      },
      {
        type: 'h2',
        texte: 'L\'affiliation : la pub qui ne coûte rien si ça ne vend pas'
      },
      {
        type: 'texte',
        texte: 'L\'affiliation marketing est basée sur la performance. Vous ne payez une commission que quand une vente est réalisée. Pas de vente, pas de coût. C\'est le modèle idéal pour les petites boutiques qui veulent développer leur visibilité sans risque financier.'
      },
      {
        type: 'h2',
        texte: 'Le partenariat boutiques : la stratégie la plus sous-estimée'
      },
      {
        type: 'texte',
        texte: 'L\'une des stratégies les plus efficaces avec l\'affiliation est le partenariat entre boutiques complémentaires. Par exemple, si vous vendez des objets pour enfants, vous pouvez vous associer avec une boutique de vêtements enfants. Vous échangez vos codes promo mutuellement — elle partage votre code à ses clientes, vous partagez le sien aux vôtres. Résultat : double visibilité, zéro budget.'
      },
      {
        type: 'h2',
        texte: 'Comment démarrer avec l\'affiliation sans expérience ?'
      },
      {
        type: 'etapes',
        items: [
          { num: '1', titre: 'Créez votre compte Affilybase', desc: 'Inscrivez-vous gratuitement — 30 jours d\'essai sans carte bancaire.' },
          { num: '2', titre: 'Identifiez vos premiers affiliés', desc: 'Vos 3 meilleurs clients, une boutique complémentaire sur Instagram, un micro-influenceur dans votre niche.' },
          { num: '3', titre: 'Créez leurs codes promo', desc: 'Un code unique par affilié avec la commission et la remise que vous choisissez.' },
          { num: '4', titre: 'Laissez la magie opérer', desc: 'Vos affiliés partagent, leurs abonnés commandent, vous vendez. Les commissions sont calculées automatiquement.' },
        ]
      },
      {
        type: 'cta',
        titre: 'Commencez à vendre sans budget pub',
        texte: 'Affilybase est gratuit pendant 30 jours — sans carte bancaire, sans engagement. Compatible Shopify et WooCommerce.',
        bouton: 'Essayer gratuitement',
        lien: '/login'
      }
    ]
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = articles[params.slug]
  if (!article) return {}
  return {
    title: article.titre + ' — Blog Affilybase',
    description: article.description,
  }
}

export default function Article({ params }: { params: { slug: string } }) {
  const article = articles[params.slug]
  if (!article) notFound()

  return (
    <main style={{ fontFamily: 'Georgia, serif', background: '#F5F2EC', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ padding: '1rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #ddd8ce', background: '#F5F2EC' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>Affily</span>
            <div style={{ width: '100%', height: '1px', background: '#1a1a1a', margin: '3px 0' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.22em', color: '#1a1a1a' }}>BASE</span>
          </div>
        </a>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="/blog" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Blog</a>
          <a href="/login" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Se connecter</a>
          <a href="/login" style={{ background: '#2D9B6F', color: '#fff', borderRadius: '6px', padding: '0.55rem 1.1rem', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>Essai gratuit</a>
        </div>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <a href="/blog" style={{ fontSize: '13px', color: '#888', textDecoration: 'none', fontFamily: 'sans-serif' }}>← Blog</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '1rem 0' }}>
            <span style={{ background: article.tagColor, color: article.tagTextColor, fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontFamily: 'sans-serif' }}>{article.tag}</span>
            <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'sans-serif' }}>{article.date} · {article.temps} de lecture</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 500, color: '#1a1a1a', lineHeight: 1.4, marginBottom: '1rem' }}>{article.titre}</h1>
        </div>

        {/* Contenu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {article.contenu.map((bloc: any, i: number) => {
            if (bloc.type === 'intro') return (
              <p key={i} style={{ fontSize: '16px', color: '#444', lineHeight: 1.8, borderLeft: '3px solid #2D9B6F', paddingLeft: '16px', fontStyle: 'italic' }}>{bloc.texte}</p>
            )
            if (bloc.type === 'h2') return (
              <h2 key={i} style={{ fontSize: '20px', fontWeight: 500, color: '#1a1a1a', marginTop: '8px' }}>{bloc.texte}</h2>
            )
            if (bloc.type === 'texte') return (
              <p key={i} style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, fontFamily: 'sans-serif' }}>{bloc.texte}</p>
            )
            if (bloc.type === 'liste') return (
              <ul key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none' }}>
                {bloc.items.map((item: string, j: number) => (
                  <li key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '14px', color: '#555', fontFamily: 'sans-serif', lineHeight: 1.6 }}>
                    <span style={{ color: '#2D9B6F', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            )
            if (bloc.type === 'etapes') return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bloc.items.map((etape: any, j: number) => (
                  <div key={j} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1a1a1a', color: '#fff', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'sans-serif' }}>{etape.num}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', marginBottom: '4px', fontFamily: 'sans-serif' }}>{etape.titre}</div>
                      <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, fontFamily: 'sans-serif' }}>{etape.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
            if (bloc.type === 'cta') return (
              <div key={i} style={{ background: '#E1F5EE', border: '0.5px solid #9FE1CB', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', marginTop: '12px' }}>
                <div style={{ fontSize: '18px', fontWeight: 500, color: '#085041', marginBottom: '8px' }}>{bloc.titre}</div>
                <div style={{ fontSize: '13px', color: '#0F6E56', lineHeight: 1.7, marginBottom: '16px', fontFamily: 'sans-serif' }}>{bloc.texte}</div>
                <a href={bloc.lien} style={{ display: 'inline-block', background: '#1a1a1a', color: '#fff', borderRadius: '6px', padding: '10px 24px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', fontFamily: 'sans-serif' }}>{bloc.bouton}</a>
              </div>
            )
            return null
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#1a1a1a', padding: '1.5rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Affily</span>
          <div style={{ width: '100%', height: '1px', background: '#fff', margin: '3px 0' }} />
          <span style={{ fontSize: '8px', letterSpacing: '0.22em', color: '#fff' }}>BASE</span>
        </div>
        <div style={{ fontSize: '11px', color: '#555' }}>© 2026 Affilybase — Tous droits réservés</div>
      </div>

    </main>
  )
}