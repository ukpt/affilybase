'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

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

  const handleSubmit = async () => {
    if (!code || !nom || !email || !commission || !remise) {
      setMessage('Veuillez remplir tous les champs')
      return
    }
    setLoading(true)
    setMessage('')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/login'; return }
    const user = session.user

    let vendeurId = null
    const { data: vendeur } = await supabase.from('vendeurs').select('id').eq('email', user.email).single()
    if (vendeur) {
      vendeurId = vendeur.id
    } else {
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
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F2EC' }}>
      <Sidebar active="Mes codes" />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '16px', padding: '2rem' }}>
            <h1 style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a', marginBottom: '4px' }}>Créer un code d'affiliation</h1>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '1.5rem' }}>Le code sera créé automatiquement dans votre boutique Shopify</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Nom du code</label>
                <input type="text" placeholder="ex: MARIE20" value={code} onChange={e => setCode(e.target.value.toUpperCase())} style={{ width: '100%', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', fontFamily: 'monospace', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Nom de l'affilié</label>
                <input type="text" placeholder="ex: Marie Aubry" value={nom} onChange={e => setNom(e.target.value)} style={{ width: '100%', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Email de l'affilié</label>
                <input type="email" placeholder="marie@email.fr" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Commission affilié</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" placeholder="10" min="1" max="50" value={commission} onChange={e => setCommission(e.target.value)} style={{ width: '100%', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 28px 10px 12px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
                    <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '13px', color: '#aaa' }}>%</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Remise acheteur</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" placeholder="20" min="1" max="80" value={remise} onChange={e => setRemise(e.target.value)} style={{ width: '100%', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '10px 28px 10px 12px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
                    <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '13px', color: '#aaa' }}>%</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Applicable sur</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setProduits('tout')} style={{ flex: 1, fontSize: '13px', padding: '8px', borderRadius: '8px', cursor: 'pointer', background: produits === 'tout' ? '#1a1a1a' : '#F5F2EC', color: produits === 'tout' ? '#fff' : '#555', border: '0.5px solid #ddd8ce', fontWeight: produits === 'tout' ? 500 : 400 }}>Toute la boutique</button>
                  <button onClick={() => setProduits('choisis')} style={{ flex: 1, fontSize: '13px', padding: '8px', borderRadius: '8px', cursor: 'pointer', background: produits === 'choisis' ? '#1a1a1a' : '#F5F2EC', color: produits === 'choisis' ? '#fff' : '#555', border: '0.5px solid #ddd8ce', fontWeight: produits === 'choisis' ? 500 : 400 }}>Produits choisis</button>
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

              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: loading ? '#ccc' : '#1a1a1a', color: '#fff', fontSize: '13px', fontWeight: 500, padding: '12px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Création en cours...' : "Créer le code et envoyer l'invitation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}