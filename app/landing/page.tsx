export default function Landing() {
  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '680px', margin: '0 auto', background: '#F5F2EC', color: '#1a1a1a', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '0.5px solid #ddd8ce' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
          <span style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.04em' }}>Affily</span>
          <div style={{ width: '100%', height: '1px', background: '#1a1a1a', margin: '3px 0' }} />
          <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Base</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="/login" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Se connecter</a>
          <a href="/login" style={{ background: '#2D9B6F', color: '#fff', borderRadius: '6px', padding: '0.55rem 1.1rem', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>Essai gratuit</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding: '3rem 1.5rem 0', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', background: '#e0ede7', color: '#1a6645', fontSize: '12px', padding: '4px 14px', borderRadius: '20px', marginBottom: '1.2rem' }}>Compatible Shopify</span>
        <h1 style={{ fontSize: '30px', fontWeight: 400, lineHeight: 1.4, marginBottom: '1rem' }}>
          Boostez vos ventes Shopify<br />avec vos <span style={{ background: '#d4cfc6', padding: '2px 10px', borderRadius: '4px' }}>Partenaires</span>
        </h1>
        <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto 2rem' }}>
          Collaborez avec des créateurs, des boutiques partenaires ou vos clients — ils recommandent, vous gagnez en visibilité, vous vendez, ils touchent une commission. Tout le monde gagne.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <a href="/login" style={{ background: '#2D9B6F', color: '#fff', borderRadius: '6px', padding: '0.75rem 1.5rem', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Commencer gratuitement</a>
          <a href="#demo" style={{ background: 'transparent', color: '#1a1a1a', border: '1px solid #bbb', borderRadius: '6px', padding: '0.75rem 1.5rem', fontSize: '14px', textDecoration: 'none' }}>Voir la démo</a>
        </div>
      </div>

      {/* DASHBOARD VISUEL */}
      <hr style={{ border: 'none', borderTop: '0.5px solid #ddd8ce', margin: '0 1.5rem 1.5rem' }} />
      <div style={{ margin: '0 1.5rem 2rem', border: '0.5px solid #ddd8ce', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: '130px', background: '#fff', borderRight: '0.5px solid #ddd8ce', padding: '1rem 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.2rem', padding: '0 1rem' }}>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>Affily</span>
            <div style={{ width: '100%', height: '1px', background: '#1a1a1a', margin: '2px 0' }} />
            <span style={{ fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Base</span>
          </div>
          {['Tableau de bord', 'Mes codes', 'Affiliés', 'Paiements', 'Paramètres'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.4rem 1rem', fontSize: '10px', color: i === 0 ? '#1a1a1a' : '#888', fontWeight: i === 0 ? 500 : 400 }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: i === 0 ? '#2D9B6F' : '#ddd8ce' }} />
              {item}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '1rem', background: '#F5F2EC' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>Tableau de bord</div>
              <div style={{ fontSize: '9px', color: '#888' }}>Bienvenue sur Affilybase</div>
            </div>
            <span style={{ background: '#1a1a1a', color: '#fff', borderRadius: '4px', padding: '4px 8px', fontSize: '9px' }}>+ Nouveau code</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '0.75rem' }}>
            {[['Codes créés', '20', '20 actifs'], ['Affiliés', '20', 'dans votre programme'], ['Ventes générées', '1 240€', 'ce mois']].map(([label, val, sub], i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '6px', padding: '0.6rem' }}>
                <div style={{ fontSize: '8px', color: '#888', marginBottom: '3px' }}>{label}</div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{val}</div>
                <div style={{ fontSize: '8px', color: '#888' }}>{sub}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '10px', fontWeight: 500, marginBottom: '0.5rem' }}>Vos codes d'affiliation</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {[['STYLE2024', '10%', '20%'], ['PROMO15', '10%', '15%'], ['PARTNER30', '15%', '10%'], ['SUMMER10', '10%', '10%']].map(([code, comm, remise], i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '6px', padding: '0.6rem' }}>
                <div style={{ fontSize: '10px', fontWeight: 500, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  {code} <span style={{ color: '#2D9B6F', fontSize: '9px' }}>Actif</span>
                </div>
                <div style={{ fontSize: '8px', color: '#888', display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>Commission affilié</span><span>{comm}</span></div>
                <div style={{ fontSize: '8px', color: '#888', display: 'flex', justifyContent: 'space-between' }}><span>Remise acheteur</span><span>{remise}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 FAÇONS */}
      <hr style={{ border: 'none', borderTop: '0.5px solid #ddd8ce' }} />
      <div style={{ padding: '2rem 1.5rem' }}>
        <span style={{ display: 'inline-block', background: '#d4cfc6', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, marginBottom: '1rem' }}>3 façons de l'utiliser</span>
        <h2 style={{ fontSize: '20px', fontWeight: 400, marginBottom: '0.5rem' }}>Un outil, trois stratégies gagnantes</h2>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, marginBottom: '1.5rem' }}>Affilybase s'adapte à votre façon de vendre.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[
            { title: 'Créateurs de contenu', desc: "Donnez un code personnalisé à vos créateurs. Ils partagent, leur audience achète.", bg: '#e0ede7' },
            { title: 'Boutiques partenaires', desc: 'Collaborez avec des boutiques complémentaires. Recommandez-vous mutuellement.', bg: '#e8e4f0' },
            { title: 'Vos clients', desc: 'Transformez vos clients satisfaits en ambassadeurs. Le bouche à oreille organisé.', bg: '#faeeda' },
          ].map(({ title, desc, bg }, i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: bg, marginBottom: '12px' }} />
              <h3 style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>{title}</h3>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.6, marginBottom: '8px' }}>{desc}</p>
              <span style={{ display: 'inline-block', background: '#d4cfc6', color: '#1a1a1a', fontSize: '11px', padding: '3px 8px', borderRadius: '4px' }}>Commission sécurisée</span>
            </div>
          ))}
        </div>
      </div>

      {/* COMMENT CA MARCHE */}
      <hr style={{ border: 'none', borderTop: '0.5px solid #ddd8ce' }} />
      <div style={{ padding: '2rem 1.5rem' }}>
        <span style={{ display: 'inline-block', background: '#d4cfc6', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, marginBottom: '1rem' }}>Comment ça marche</span>
        <h2 style={{ fontSize: '20px', fontWeight: 400, marginBottom: '0.5rem' }}>En place en 5 minutes</h2>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, marginBottom: '1.5rem' }}>Pas besoin de développeur. Tout se configure depuis votre dashboard.</p>
        {[
          ['Installez Affilybase sur votre boutique Shopify', 'Connexion en un clic, aucune ligne de code.'],
          ['Créez vos codes partenaires', 'Personnalisez le nom, la réduction et la commission pour chaque partenaire.'],
          ['Vos partenaires partagent, vous vendez', 'Suivez les ventes et les commissions en temps réel depuis votre dashboard.'],
        ].map(([title, desc], i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '18px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#d4cfc6', color: '#1a1a1a', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{title}</h3>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TARIFS */}
      <hr style={{ border: 'none', borderTop: '0.5px solid #ddd8ce' }} />
      <div style={{ padding: '2rem 1.5rem' }}>
        <span style={{ display: 'inline-block', background: '#d4cfc6', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, marginBottom: '1rem' }}>Tarifs</span>
        <h2 style={{ fontSize: '20px', fontWeight: 400, marginBottom: '0.5rem' }}>Simple et transparent</h2>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, marginBottom: '1.5rem' }}>Commencez gratuitement, évoluez selon vos besoins.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
  {[
    { name: 'Free', price: '0€', period: "1 mois d'essai", features: ['1 code actif', '1 partenaire', 'Dashboard brandé', 'Lien court perso'], excluded: ['Stats avancées', 'Multi-boutiques', 'Support prioritaire'], popular: false },
    { name: 'Starter', price: '5€', period: 'par mois', features: ['20 codes actifs', '20 partenaires', 'Dashboard brandé', 'Lien court perso', 'Stats avancées'], excluded: ['Multi-boutiques', 'Support prioritaire'], popular: true },
    { name: 'Pro', price: '9.99€', period: 'par mois', features: ['50 codes actifs', '50 partenaires', 'Dashboard brandé', 'Lien court perso', 'Stats avancées'], excluded: ['Multi-boutiques', 'Support prioritaire'], popular: false },
    { name: 'Business', price: '39.99€', period: 'par mois', features: ['Illimité', 'Dashboard brandé', 'Lien court perso', 'Stats avancées', 'Multi-boutiques', 'Support prioritaire'], excluded: [], popular: false },
  ].map(({ name, price, period, features, excluded, popular }, i) => (
    <div key={i} style={{ background: '#fff', border: popular ? '2px solid #1a1a1a' : '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1rem' }}>
      {popular && <span style={{ display: 'inline-block', background: '#d4cfc6', color: '#1a1a1a', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', marginBottom: '8px' }}>Populaire</span>}
      <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{name}</div>
      <div style={{ fontSize: '20px', fontWeight: 500, marginBottom: '2px' }}>{price}</div>
      <div style={{ fontSize: '11px', color: '#888', marginBottom: '12px' }}>{period}</div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {features.map((f, j) => <li key={j} style={{ fontSize: '11px', color: '#555', display: 'flex', gap: '5px' }}><span style={{ color: '#2D9B6F' }}>✓</span>{f}</li>)}
        {excluded.map((f, j) => <li key={j} style={{ fontSize: '11px', color: '#bbb', display: 'flex', gap: '5px' }}><span>✗</span>{f}</li>)}
      </ul>
    </div>
  ))}
</div>
      </div>

      {/* CHIFFRES */}
      <hr style={{ border: 'none', borderTop: '0.5px solid #ddd8ce' }} />
      <div style={{ padding: '2rem 1.5rem' }}>
        <span style={{ display: 'inline-block', background: '#d4cfc6', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, marginBottom: '1rem' }}>Affilybase en chiffres</span>
        <h2 style={{ fontSize: '20px', fontWeight: 400, marginBottom: '0.5rem' }}>Déjà adopté par des boutiques Shopify</h2>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, marginBottom: '1.5rem' }}>Des premiers résultats encourageants.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[['+ 150', 'Boutiques actives'], ['2 500+', 'Ventes générées'], ['4.9/5', 'Note moyenne']].map(([val, label], i) => (
            <div key={i} style={{ textAlign: 'center', padding: '1.25rem', background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{val}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AVIS */}
      <hr style={{ border: 'none', borderTop: '0.5px solid #ddd8ce' }} />
      <div style={{ padding: '2rem 1.5rem' }}>
        <span style={{ display: 'inline-block', background: '#d4cfc6', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, marginBottom: '1rem' }}>Avis clients</span>
        <h2 style={{ fontSize: '20px', fontWeight: 400, marginBottom: '0.5rem' }}>Ils utilisent Affilybase</h2>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, marginBottom: '1.5rem' }}>Des boutiques Shopify qui ont boosté leurs ventes grâce à leurs partenaires.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[
            { text: "En moins d'une semaine j'avais 5 créatrices qui partageaient mes produits. Les ventes ont suivi immédiatement.", name: 'Sophie L.', shop: 'Boutique mode — Paris', avatarBg: '#1a1a1a', avatarColor: '#fff', initials: 'L' },
            { text: "Affilybase m'a permis de lancer mon programme en 10 minutes. Mes clients fidèles sont devenus mes meilleurs vendeurs.", name: 'Marc R.', shop: 'Accessoires sport — Lyon', avatarBg: '#E8F5F0', avatarColor: '#2D9B6F', initials: 'A' },
            { text: "On collabore avec deux boutiques complémentaires. On se recommande mutuellement. C'est du gagnant-gagnant.", name: 'Clara B.', shop: 'Déco maison — Bordeaux', avatarBg: '#FDF3E3', avatarColor: '#BA7517', initials: 'N' },
          ].map(({ text, name, shop, avatarBg, avatarColor, initials }, i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ color: '#2D9B6F', fontSize: '13px', letterSpacing: '2px' }}>★★★★★</div>
              <p style={{ fontSize: '12px', color: '#444', lineHeight: 1.7, fontStyle: 'italic', flex: 1 }}>"{text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '0.5px solid #eee', paddingTop: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: avatarBg, color: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{name}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{shop}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <hr style={{ border: 'none', borderTop: '0.5px solid #ddd8ce' }} />
      <div style={{ padding: '2rem 1.5rem' }}>
        <span style={{ display: 'inline-block', background: '#d4cfc6', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, marginBottom: '1rem' }}>FAQ</span>
        <h2 style={{ fontSize: '20px', fontWeight: 400, marginBottom: '0.5rem' }}>Questions fréquentes</h2>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, marginBottom: '1.5rem' }}>Tout ce que vous voulez savoir avant de commencer.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            ['Est-ce compatible avec toutes les boutiques Shopify ?', "Oui, Affilybase est compatible avec toutes les boutiques Shopify. L'installation prend moins de 5 minutes, sans aucune ligne de code."],
            ['Comment est-ce que je paye mes partenaires ?', "Affilybase calcule automatiquement les commissions dues. Au moment du versement, vous choisissez librement votre méthode : virement, PayPal, Lydia ou autre. Vous gardez le contrôle total."],
            ['Mes partenaires peuvent-ils voir leurs commissions en temps réel ?', "Oui. Chaque partenaire a son propre dashboard avec ses ventes, clics et commissions en temps réel."],
            ['Puis-je changer de plan à tout moment ?', "Oui, sans engagement ni pénalité. Aucune carte bancaire requise pour l'essai gratuit."],
          ].map(([q, a], i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>{q}</div>
              <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', borderTop: '0.5px solid #ddd8ce' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '0.75rem' }}>Prêt à <span style={{ background: '#d4cfc6', padding: '2px 10px', borderRadius: '4px' }}>booster vos ventes</span> ?</h2>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '1.5rem' }}>Rejoignez les boutiques Shopify qui utilisent Affilybase pour vendre plus.</p>
        <a href="/login" style={{ background: '#2D9B6F', color: '#fff', borderRadius: '6px', padding: '0.85rem 1.75rem', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Commencer gratuitement — sans engagement</a>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#1a1a1a', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>Affily</span>
          <div style={{ width: '100%', height: '1px', background: '#fff', margin: '3px 0' }} />
          <span style={{ fontSize: '8px', letterSpacing: '0.22em', color: '#fff', textTransform: 'uppercase' }}>Base</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['CGU', 'Confidentialité', 'Contact'].map((link, i) => (
            <span key={i} style={{ fontSize: '11px', color: '#888', cursor: 'pointer' }}>{link}</span>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: '#555', width: '100%', textAlign: 'center', marginTop: '8px' }}>© 2026 Affilybase — Tous droits réservés</div>
      </div>

    </main>
  )
}