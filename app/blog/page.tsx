import Link from 'next/link'

const articles = [
  {
    slug: 'programme-affiliation-shopify-france',
    titre: 'Comment créer un programme d\'affiliation pour sa boutique Shopify en France',
    description: 'Guide complet pour lancer votre programme d\'affiliation Shopify en 2026 — codes promo, commissions, partenariats boutiques.',
    date: '18 mai 2026',
    temps: '5 min',
    tag: 'Shopify',
    tagColor: '#E1F5EE',
    tagTextColor: '#085041',
  },
  {
    slug: 'programme-affiliation-woocommerce-france',
    titre: 'Programme d\'affiliation WooCommerce : le guide complet pour les boutiques françaises',
    description: 'Comment mettre en place un programme d\'affiliation sur votre site WooCommerce — plugin gratuit, tracking automatique, commissions.',
    date: '18 mai 2026',
    temps: '6 min',
    tag: 'WooCommerce',
    tagColor: '#F0EAF9',
    tagTextColor: '#5B2D8E',
  },
  {
    slug: 'vendre-en-ligne-sans-budget-pub',
    titre: 'Vendre en ligne sans budget pub : l\'affiliation marketing pour les petites boutiques',
    description: 'Comment les petites boutiques en ligne peuvent booster leurs ventes sans dépenser en publicité grâce à l\'affiliation.',
    date: '18 mai 2026',
    temps: '4 min',
    tag: 'Marketing',
    tagColor: '#FAEEDA',
    tagTextColor: '#633806',
  },
]

export const metadata = {
  title: 'Blog Affilybase — Conseils affiliation et marketing pour boutiques en ligne',
  description: 'Guides et conseils pour booster vos ventes avec l\'affiliation marketing — Shopify, WooCommerce, boutiques françaises.',
}

export default function Blog() {
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
          <a href="/login" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Se connecter</a>
          <a href="/login" style={{ background: '#2D9B6F', color: '#fff', borderRadius: '6px', padding: '0.55rem 1.1rem', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>Essai gratuit</a>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ display: 'inline-block', background: '#d4cfc6', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, marginBottom: '1rem' }}>Blog</span>
          <h1 style={{ fontSize: '28px', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.5rem' }}>Conseils affiliation & marketing</h1>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>Guides pratiques pour booster vos ventes avec l'affiliation — Shopify, WooCommerce, boutiques françaises.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {articles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ background: article.tagColor, color: article.tagTextColor, fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontFamily: 'sans-serif' }}>{article.tag}</span>
                  <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'sans-serif' }}>{article.date} · {article.temps} de lecture</span>
                </div>
                <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a1a', marginBottom: '8px', lineHeight: 1.4 }}>{article.titre}</h2>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, fontFamily: 'sans-serif' }}>{article.description}</p>
                <div style={{ marginTop: '12px', fontSize: '13px', color: '#2D9B6F', fontFamily: 'sans-serif' }}>Lire l'article →</div>
              </div>
            </Link>
          ))}
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