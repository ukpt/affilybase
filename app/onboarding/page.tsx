'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function Onboarding() {
  const [etape, setEtape] = useState(1)
  const [nom, setNom] = useState('')
  const [typeBoutique, setTypeBoutique] = useState<'shopify' | 'autre'>('shopify')
  const [shopifyUrl, setShopifyUrl] = useState('')
  const [autreUrl, setAutreUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [vendeur, setVendeur] = useState<any>(null)

  // Onboarding étape 2 — code affilié
  const [code, setCode] = useState('')
  const [nomAffilie, setNomAffilie] = useState('')
  const [emailAffilie, setEmailAffilie] = useState('')
  const [commission, setCommission] = useState('')
  const [remise, setRemise] = useState('')
  const [creatingCode, setCreatingCode] = useState(false)
  const [codeMessage, setCodeMessage] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: v } = await supabase.from('vendeurs').select('*').eq('email', user.email).single()
      if (v) setVendeur(v)
    }
    init()
  }, [])

  const saveEtape1 = async () => {
    if (!nom) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: existing } = await supabase.from('vendeurs').select('id').eq('email', user.email).single()
    if (existing) {
      await supabase.from('vendeurs').update({
        nom,
        shopify_url: typeBoutique === 'shopify' ? shopifyUrl : null,
        autre_url: typeBoutique === 'autre' ? autreUrl : null,
      }).eq('id', existing.id)
      setVendeur({ ...existing, nom })
    } else {
      const { data: newV } = await supabase.from('vendeurs').insert({
        email: user.email,
        nom,
        shopify_url: typeBoutique === 'shopify' ? shopifyUrl : null,
        autre_url: typeBoutique === 'autre' ? autreUrl : null,
        plan: 'free',
      }).select().single()
      setVendeur(newV)
    }
    setSaving(false)
    setEtape(2)
  }

  const createCode = async () => {
    if (!code || !nomAffilie || !emailAffilie || !commission || !remise) {
      setCodeMessage('Veuillez remplir tous les champs')
      return
    }
    setCreatingCode(true)
    const { data: affilie } = await supabase.from('affilies').insert({ vendeur_id: vendeur.id, nom: nomAffilie, email: emailAffilie }).select('id').single()
    await fetch('/api/create-affilie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailAffilie, nom: nomAffilie, vendeurId: vendeur.id, code: code.toUpperCase(), commissionPct: parseInt(commission), remisePct: parseInt(remise) })
    })
    await supabase.from('codes').insert({
      vendeur_id: vendeur.id,
      affilie_id: affilie?.id,
      code: code.toUpperCase(),
      commission_pct: parseInt(commission),
      remise_pct: parseInt(remise),
      actif: true
    })
    setCreatingCode(false)
    window.location.href = '/'
  }

  const Etapes = () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2rem' }}>
      {[1, 2, 3].map((n, i) => (
        <>
          <div key={n} style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, flexShrink: 0, background: etape > n ? '#E1F5EE' : etape === n ? '#1a1a1a' : '#F5F2EC', color: etape > n ? '#085041' : etape === n ? '#fff' : '#888' }}>
            {etape > n ? '✓' : n}
          </div>
          {i < 2 && <div key={`line-${n}`} style={{ flex: 1, height: '1px', background: '#ddd8ce' }}></div>}
        </>
      ))}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F5F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Logo size="md" />
        </div>

        <Etapes />

        {/* ÉTAPE 1 — Configuration boutique */}
        {etape === 1 && (
          <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '16px', padding: '2rem' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#1a1a1a', marginBottom: '4px' }}>Configurez votre boutique</h1>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '1.5rem' }}>Ces informations nous permettent de configurer votre programme d'affiliation.</p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Nom de votre entreprise</label>
              <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ma Boutique" style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #ddd8ce', borderRadius: '8px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Type de boutique</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setTypeBoutique('shopify')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', background: typeBoutique === 'shopify' ? '#1a1a1a' : '#F5F2EC', color: typeBoutique === 'shopify' ? '#fff' : '#555', border: '0.5px solid #ddd8ce' }}>Shopify</button>
                <button onClick={() => setTypeBoutique('autre')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', background: typeBoutique === 'autre' ? '#1a1a1a' : '#F5F2EC', color: typeBoutique === 'autre' ? '#fff' : '#555', border: '0.5px solid #ddd8ce' }}>Autre / Sans boutique</button>
              </div>
            </div>

            {typeBoutique === 'shopify' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>URL de votre boutique Shopify</label>
                <input value={shopifyUrl} onChange={e => setShopifyUrl(e.target.value)} placeholder="ma-boutique.myshopify.com" style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #ddd8ce', borderRadius: '8px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            )}

            {typeBoutique === 'autre' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>URL de votre site</label>
                <input value={autreUrl} onChange={e => setAutreUrl(e.target.value)} placeholder="https://mon-site.fr" style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #ddd8ce', borderRadius: '8px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            )}

            <div style={{ background: '#E1F5EE', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '12px', color: '#085041' }}>💡 Vous pourrez modifier ces informations à tout moment dans vos paramètres.</div>
            </div>

            <button onClick={saveEtape1} disabled={saving || !nom} style={{ width: '100%', padding: '12px', background: nom ? '#1a1a1a' : '#ccc', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: nom ? 'pointer' : 'not-allowed' }}>
              {saving ? 'Sauvegarde...' : 'Continuer →'}
            </button>
          </div>
        )}

        {/* ÉTAPE 2 — Conseils */}
        {etape === 2 && (
          <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '16px', padding: '2rem' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#1a1a1a', marginBottom: '4px' }}>Comment ça marche ?</h1>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '1.5rem' }}>Tout ce qu'il faut savoir pour bien démarrer votre programme d'affiliation.</p>

            {/* Principe */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '10px', paddingBottom: '8px', borderBottom: '0.5px solid #ddd8ce' }}>Le principe en 3 étapes</div>
              {[
                ['1', 'Vous créez un code promo personnalisé pour chaque affilié', 'Ex: MARIE20 pour Marie, avec 20% de remise et 10% de commission'],
                ['2', "L'affilié partage son code sur ses réseaux sociaux ou sur son site", 'Instagram, TikTok, YouTube, blog — ses abonnés commandent avec son code'],
                ['3', 'Les ventes sont détectées et les commissions calculées automatiquement', "Sur Shopify, tout est 100% automatique : dès qu'un client passe commande avec un code affilié, la vente est enregistrée et la commission affichée instantanément — pour vous et pour votre affilié, sans aucune action requise. Pour les autres plateformes, ce système automatique arrive prochainement ; en attendant, vous validez les ventes manuellement en quelques clics."],
              ].map(([n, title, sub]) => (
                <div key={n} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#1a1a1a', color: '#fff', fontSize: '11px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{n}</div>
                  <div style={{ fontSize: '13px', color: '#1a1a1a', lineHeight: 1.5 }}>{title}<span style={{ fontSize: '12px', color: '#888', display: 'block', marginTop: '2px' }}>{sub}</span></div>
                </div>
              ))}

              {/* Tableau plateformes */}
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '0.5px solid #ddd8ce', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderBottom: '0.5px solid #ddd8ce', background: '#E1F5EE' }}>
                  <span style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px', background: '#9FE1CB', color: '#04342C', flexShrink: 0 }}>Automatique</span>
                  <span style={{ fontSize: '12px', color: '#1a1a1a', flex: 1 }}>Shopify</span>
                  <span style={{ fontSize: '11px', color: '#888' }}>Tracking natif complet</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px', background: '#FAC775', color: '#412402', flexShrink: 0 }}>Manuel</span>
                  <span style={{ fontSize: '12px', color: '#1a1a1a', flex: 1 }}>Autre site / Sans boutique</span>
                  <span style={{ fontSize: '11px', color: '#888' }}>Validation en 1 clic</span>
                </div>
              </div>
            </div>

            {/* Trouver affiliés */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '10px', paddingBottom: '8px', borderBottom: '0.5px solid #ddd8ce' }}>Comment trouver de bons affiliés ?</div>
              {[
                ['🏪', 'Collaborez avec des boutiques complémentaires', "Repérez sur les réseaux sociaux des e-commerçants qui vendent des produits proches mais non concurrents. Proposez-leur d'échanger vos codes mutuellement — un partenariat gagnant-gagnant qui double votre visibilité sans coût publicitaire."],
                ['📱', 'Cherchez des micro-influenceurs dans votre niche', "Un compte Instagram de 2 000 abonnés très engagés convertit souvent mieux qu'un compte de 100 000."],
                ['🤝', 'Approchez des créateurs de contenu complémentaires', 'Si vous vendez des cosmétiques, cherchez des blogueuses beauté. Si vous vendez du sport, des coachs fitness.'],
                ['👥', 'Pensez aussi à vos clients fidèles', 'Vos meilleurs clients sont vos meilleurs ambassadeurs — ils connaissent et aiment déjà vos produits.'],
                ['💬', "Votre entourage proche d'abord", "Famille, amis, collègues — un réseau de 5 personnes motivées peut générer vos premières ventes rapidement."],
              ].map(([icon, title, sub]) => (
                <div key={title} style={{ background: '#F5F2EC', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
                  <div style={{ fontSize: '13px', color: '#1a1a1a', lineHeight: 1.5 }}>{title}<span style={{ fontSize: '12px', color: '#888', display: 'block', marginTop: '2px' }}>{sub}</span></div>
                </div>
              ))}
            </div>

            {/* Conseil clé */}
            <div style={{ background: '#E1F5EE', borderRadius: '8px', padding: '14px 16px', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#085041', marginBottom: '8px' }}>Conseil clé pour bien convertir</div>
              <div style={{ fontSize: '12px', color: '#0F6E56', lineHeight: 1.7, marginBottom: '10px' }}>Il n'y a pas de chiffre universel — chaque boutique a ses propres marges. L'essentiel est de trouver l'équilibre qui motive votre affilié sans impacter votre rentabilité.</div>
              {[
                ['💡', "Calculez d'abord votre marge nette sur un produit. Réservez une partie pour la remise acheteur, une autre pour la commission affilié — le tout sans dépasser ce que vous pouvez absorber."],
                ['⚖️', "La remise doit être assez attractive pour que l'acheteur ait envie d'utiliser le code. La commission doit être assez motivante pour que l'affilié ait envie de le partager activement."],
                ['🔁', "Testez, ajustez. Un affilié peu actif peut simplement manquer de motivation — réévaluer sa commission peut tout changer."],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '10px', paddingTop: '10px', borderTop: '0.5px solid #9FE1CB' }}>
                  <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
                  <span style={{ fontSize: '12px', color: '#0F6E56', lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setEtape(3)} style={{ width: '100%', padding: '12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              Continuer — créer mon premier code →
            </button>
          </div>
        )}

        {/* ÉTAPE 3 — Premier code */}
        {etape === 3 && (
          <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '16px', padding: '2rem' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#1a1a1a', marginBottom: '4px' }}>Créez votre premier code</h1>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '1.5rem' }}>Invitez votre premier affilié en créant son code promo personnalisé.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Nom du code</label>
                <input type="text" placeholder="ex: MARIE20" value={code} onChange={e => setCode(e.target.value.toUpperCase())} style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #ddd8ce', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Nom de l'affilié</label>
                <input type="text" placeholder="ex: Marie Aubry" value={nomAffilie} onChange={e => setNomAffilie(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #ddd8ce', borderRadius: '8px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Email de l'affilié</label>
                <input type="email" placeholder="marie@email.fr" value={emailAffilie} onChange={e => setEmailAffilie(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #ddd8ce', borderRadius: '8px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Commission affilié</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" placeholder="10" value={commission} onChange={e => setCommission(e.target.value)} style={{ width: '100%', padding: '10px 28px 10px 12px', border: '0.5px solid #ddd8ce', borderRadius: '8px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
                    <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '13px', color: '#aaa' }}>%</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Remise acheteur</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" placeholder="20" value={remise} onChange={e => setRemise(e.target.value)} style={{ width: '100%', padding: '10px 28px 10px 12px', border: '0.5px solid #ddd8ce', borderRadius: '8px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
                    <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '13px', color: '#aaa' }}>%</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#E1F5EE', borderRadius: '8px', padding: '10px 14px' }}>
                <div style={{ fontSize: '12px', color: '#085041' }}>💡 Un email d'invitation sera envoyé automatiquement à votre affilié.</div>
              </div>

              {codeMessage && (
                <div style={{ fontSize: '12px', textAlign: 'center', padding: '8px 12px', borderRadius: '8px', background: '#FAECE7', color: '#993C1D', border: '0.5px solid #f0997b' }}>{codeMessage}</div>
              )}

              <button onClick={createCode} disabled={creatingCode} style={{ width: '100%', padding: '12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                {creatingCode ? 'Création en cours...' : "Créer le code et terminer →"}
              </button>
              <button onClick={() => window.location.href = '/'} style={{ width: '100%', padding: '12px', background: 'transparent', color: '#888', border: '0.5px solid #ddd8ce', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                Passer cette étape — faire ça plus tard
              </button>
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '1rem' }}>
          Étape {etape} sur 3
        </p>
      </div>
    </div>
  )
}