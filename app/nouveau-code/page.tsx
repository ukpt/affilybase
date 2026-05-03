'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

const LIMITES_PLAN: Record<string, number> = {
  free: 1,
  starter: 20,
  pro: 50,
  business: Infinity,
}

export default function NouveauCode() {
  const [code, setCode] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [commission, setCommission] = useState('')
  const [remise, setRemise] = useState('')
  const [produits, setProduits] = useState('tout')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [succes, setSucces] = useState(false)
  const [vendeur, setVendeur] = useState<any>(null)
  const [nbCodes, setNbCodes] = useState(0)
  const [limitAtteinte, setLimitAtteinte] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      const { data: v } = await supabase.from('vendeurs').select('*').eq('email', session.user.email).single()
      if (v) {
        setVendeur(v)
        const { data: codes } = await supabase.from('codes').select('id').eq('vendeur_id', v.id)
        const nb = codes?.length || 0
        setNbCodes(nb)
        const limite = LIMITES_PLAN[v.plan || 'free']
        setLimitAtteinte(nb >= limite)
      }
    }
    init()
  }, [])

  const handleSubmit = async () => {
    if (!code || !nom || !email || !commission || !remise) {
      setMessage('Veuillez remplir tous les champs')
      return
    }

    // Vérification limite plan
    const limite = LIMITES_PLAN[vendeur?.plan || 'free']
    if (nbCodes >= limite) {
      setMessage(`Limite atteinte pour votre plan. Passez à un plan supérieur pour créer plus de codes.`)
      return
    }

    setLoading(true)
    setMessage('')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/login'; return }
    const user = session.user

    let vendeurId = vendeur?.id
    if (!vendeurId) {
      const { data: newVendeur } = await supabase.from('vendeurs').insert({ email: user.email }).select('id').single()
      vendeurId = newVendeur?.id
    }

    const { data: affilie } = await supabase.from('affilies').insert({ vendeur_id: vendeurId, nom, email }).select('id').single()

    await fetch('/api/create-affilie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nom, vendeurId, code: code.toUpperCase(), commissionPct: parseInt(commission), remisePct: parseInt(remise) })
    })

    const { error } = await supabase.from('codes').insert({
      vendeur_id: vendeurId,
      affilie_id: affilie?.id,
      code: code.toUpperCase(),
      commission_pct: parseInt(commission),
      remise_pct: parseInt(remise),
      actif: true
    })

    if (error) {
      setMessage('Erreur base de données : ' + error.message)
      setLoading(false)
      return
    }

    const shopifyRes = await fetch('/api/shopify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.toUpperCase(), remise_pct: parseInt(remise) })
    })

    const shopifyData = await shopifyRes.json()
    if (!shopifyRes.ok) {
      setMessage('Code enregistré mais erreur Shopify : ' + shopifyData.error)
    } else {
      setSucces(true)
    }
    setLoading(false)
  }

  if (succes) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F2EC' }}>
        <Sidebar active="Mes codes" />
        <div className="page-content" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '16px', padding: '2.5rem' }}>
              <div style={{ width: '56px', height: '56px', background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '24px', color: '#1D9E75' }}>✓</div>
              <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a', marginBottom: '8px' }}>Code créé avec succès !</h2>
              <div style={{ fontSize: '24px', fontFamily: 'monospace', fontWeight: 500, color: '#1a1a1a', margin: '1rem 0', padding: '0.75rem', borderRadius: '8px', background: '#F5F2EC' }}>
                {code.toUpperCase()}
              </div>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>Le code a été créé dans votre boutique Shopify !</p>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>Un email d'invitation a été envoyé à <strong>{nom}</strong>.</p>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '1.5rem' }}>Il peut maintenant se connecter sur son espace affilié.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => window.location.href = '/'} style={{ width: '100%', background: '#1a1a1a', color: '#fff', fontSize: '13px', fontWeight: 500, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  Voir le dashboard
                </button>
                <button onClick={() => { setSucces(false); setCode(''); setNom(''); setEmail(''); setCommission(''); setRemise('') }} style={{ width: '100%', background: 'transparent', color: '#555', fontSize: '13px', padding: '10px', borderRadius: '8px', border: '0.5px solid #ddd8ce', cursor: 'pointer' }}>
                  Créer un autre code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const limite = LIMITES_PLAN[vendeur?.plan || 'free']
  const limiteTexte = limite === Infinity ? 'Illimité' : `${nbCodes}/${limite}`

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F2EC' }}>
      <Sidebar active="Mes codes" email={vendeur?.email} />

      <div className="page-content" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* Bannière limite atteinte */}
          {limitAtteinte && (
            <div style={{ background: '#FAECE7', border: '0.5px solid #f0997b', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#712B13', marginBottom: '4px' }}>
                🔒 Limite atteinte — {limiteTexte} codes
              </div>
              <div style={{ fontSize: '12px', color: '#993C1D', marginBottom: '10px' }}>
                Votre plan {vendeur?.plan || 'Free'} est limité à {limite} code{limite > 1 ? 's' : ''}.
              </div>
              <a href="/abonnement" style={{ background: '#1D9E75', color: '#fff', borderRadius: '6px', padding: '6px 16px', fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>
                Passer à un plan supérieur
              </a>
            </div>
          )}

          <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>Créer un code d'affiliation</h1>
              <span style={{ fontSize: '11px', color: limitAtteinte ? '#D85A30' : '#888', background: limitAtteinte ? '#FAECE7' : '#F5F2EC', padding: '2px 8px', borderRadius: '4px' }}>
                {limiteTexte} codes
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '1.5rem' }}>Le code sera créé automatiquement dans votre boutique Shopify</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Nom du code</label>
                <input type="text" placeholder="ex: MARIE20" value={code} onChange={e => setCode(e.target.value.toUpperCase())} disabled={limitAtteinte} style={{ width: '100%', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', fontFamily: 'monospace', background: limitAtteinte ? '#f5f5f5' : '#F5F2EC', outline: 'none', boxSizing: 'border-box', opacity: limitAtteinte ? 0.6 : 1 }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Nom de l'affilié</label>
                <input type="text" placeholder="ex: Marie Aubry" value={nom} onChange={e => setNom(e.target.value)} disabled={limitAtteinte} style={{ width: '100%', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', background: limitAtteinte ? '#f5f5f5' : '#F5F2EC', outline: 'none', boxSizing: 'border-box', opacity: limitAtteinte ? 0.6 : 1 }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Email de l'affilié</label>
                <input type="email" placeholder="marie@email.fr" value={email} onChange={e => setEmail(e.target.value)} disabled={limitAtteinte} style={{ width: '100%', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', background: limitAtteinte ? '#f5f5f5' : '#F5F2EC', outline: 'none', boxSizing: 'border-box', opacity: limitAtteinte ? 0.6 : 1 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Commission affilié</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" placeholder="10" min="1" max="50" value={commission} onChange={e => setCommission(e.target.value)} disabled={limitAtteinte} style={{ width: '100%', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 28px 10px 12px', fontSize: '13px', background: limitAtteinte ? '#f5f5f5' : '#F5F2EC', outline: 'none', boxSizing: 'border-box', opacity: limitAtteinte ? 0.6 : 1 }} />
                    <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '13px', color: '#aaa' }}>%</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Remise acheteur</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" placeholder="20" min="1" max="80" value={remise} onChange={e => setRemise(e.target.value)} disabled={limitAtteinte} style={{ width: '100%', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 28px 10px 12px', fontSize: '13px', background: limitAtteinte ? '#f5f5f5' : '#F5F2EC', outline: 'none', boxSizing: 'border-box', opacity: limitAtteinte ? 0.6 : 1 }} />
                    <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '13px', color: '#aaa' }}>%</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Applicable sur</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setProduits('tout')} disabled={limitAtteinte} style={{ flex: 1, fontSize: '13px', padding: '8px', borderRadius: '8px', cursor: limitAtteinte ? 'not-allowed' : 'pointer', background: produits === 'tout' ? '#1a1a1a' : '#F5F2EC', color: produits === 'tout' ? '#fff' : '#555', border: '0.5px solid #ddd8ce', fontWeight: produits === 'tout' ? 500 : 400 }}>Toute la boutique</button>
                  <button onClick={() => setProduits('choisis')} disabled={limitAtteinte} style={{ flex: 1, fontSize: '13px', padding: '8px', borderRadius: '8px', cursor: limitAtteinte ? 'not-allowed' : 'pointer', background: produits === 'choisis' ? '#1a1a1a' : '#F5F2EC', color: produits === 'choisis' ? '#fff' : '#555', border: '0.5px solid #ddd8ce', fontWeight: produits === 'choisis' ? 500 : 400 }}>Produits choisis</button>
                </div>
              </div>

              <div style={{ background: '#F5F2EC', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#555', marginBottom: '10px' }}>Récapitulatif</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    ['Code', code || '—', true],
                    ['Commission affilié', commission ? commission + '%' : '—', false],
                    ['Remise acheteur', remise ? remise + '%' : '—', false],
                    ['Créé dans Shopify', 'Automatiquement', false],
                    ['Invitation affilié', 'Par email', false],
                  ].map(([label, val, mono]) => (
                    <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#888' }}>{label}</span>
                      <span style={{ color: '#1a1a1a', fontWeight: 500, fontFamily: mono ? 'monospace' : 'inherit' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {message && (
                <div style={{ fontSize: '12px', textAlign: 'center', padding: '8px 12px', borderRadius: '8px', background: '#FAECE7', color: '#993C1D', border: '0.5px solid #f0997b' }}>{message}</div>
              )}

              <button onClick={handleSubmit} disabled={loading || limitAtteinte} style={{ width: '100%', background: loading || limitAtteinte ? '#ccc' : '#1a1a1a', color: '#fff', fontSize: '13px', fontWeight: 500, padding: '12px', borderRadius: '8px', border: 'none', cursor: loading || limitAtteinte ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Création en cours...' : limitAtteinte ? '🔒 Limite atteinte' : "Créer le code et envoyer l'invitation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}