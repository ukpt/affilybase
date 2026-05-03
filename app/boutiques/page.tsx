'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

export default function Boutiques() {
  const [vendeur, setVendeur] = useState<any>(null)
  const [boutiques, setBoutiques] = useState<any[]>([])
  const [nom, setNom] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [ajout, setAjout] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: v } = await supabase.from('vendeurs').select('*').eq('email', user.email).single()
      setVendeur(v)
      if (v) {
        const { data: b } = await supabase.from('boutiques').select('*').eq('vendeur_id', v.id).order('created_at', { ascending: false })
        setBoutiques(b || [])
      }
      setLoading(false)
    }
    init()
  }, [])

  const ajouterBoutique = async () => {
    if (!nom || !url || !vendeur) return
    const { data } = await supabase.from('boutiques').insert({ vendeur_id: vendeur.id, nom, shopify_url: url }).select().single()
    if (data) { setBoutiques(prev => [data, ...prev]); setNom(''); setUrl(''); setAjout(false) }
  }

  const supprimerBoutique = async (id: string) => {
    await supabase.from('boutiques').delete().eq('id', id)
    setBoutiques(prev => prev.filter(b => b.id !== id))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F5F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
      Chargement...
    </div>
  )

  const isPlanBusiness = vendeur?.plan === 'business'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F2EC' }}>
      <Sidebar active="Boutiques" email={vendeur?.email} />

      <div className="page-content" style={{ flex: 1, padding: '1.5rem', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a1a' }}>Mes boutiques</h1>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Gérez vos boutiques Shopify</p>
          </div>
          {isPlanBusiness && (
            <button onClick={() => setAjout(!ajout)} style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.55rem 1rem', fontSize: '13px', cursor: 'pointer' }}>
              + Ajouter une boutique
            </button>
          )}
        </div>

        {!isPlanBusiness && (
          <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '1rem' }}>🔒</div>
            <h2 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '0.5rem', color: '#1a1a1a' }}>Multi-boutiques</h2>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              La gestion de plusieurs boutiques est disponible uniquement avec le plan Business.<br />
              Gérez toutes vos boutiques Shopify depuis un seul compte.
            </p>
            <a href="/abonnement" style={{ background: '#2D9B6F', color: '#fff', borderRadius: '6px', padding: '0.75rem 1.5rem', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
              Passer au plan Business — 39.99€/mois
            </a>
          </div>
        )}

        {isPlanBusiness && ajout && (
          <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '1rem' }}>Nouvelle boutique</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Nom de la boutique</label>
              <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ma boutique" style={{ width: '100%', padding: '0.75rem', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '14px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>URL Shopify</label>
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://ma-boutique.myshopify.com" style={{ width: '100%', padding: '0.75rem', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '14px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={ajouterBoutique} disabled={!nom || !url} style={{ background: nom && url ? '#2D9B6F' : '#ccc', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.75rem 1.5rem', fontSize: '14px', cursor: nom && url ? 'pointer' : 'not-allowed' }}>
                Ajouter
              </button>
              <button onClick={() => setAjout(false)} style={{ background: 'transparent', color: '#888', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '0.75rem 1.5rem', fontSize: '14px', cursor: 'pointer' }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {isPlanBusiness && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {boutiques.length === 0 ? (
              <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#888' }}>Aucune boutique ajoutée — cliquez sur "+ Ajouter une boutique"</p>
              </div>
            ) : (
              boutiques.map((b, i) => (
                <div key={i} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{b.nom}</div>
                    <div style={{ fontSize: '12px', color: '#2D9B6F' }}>{b.shopify_url}</div>
                  </div>
                  <button onClick={() => supprimerBoutique(b.id)} style={{ fontSize: '12px', color: '#888', border: '0.5px solid #ddd8ce', background: '#fff', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer' }}>
                    Supprimer
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}