'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

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

      const { data: v } = await supabase
        .from('vendeurs')
        .select('*')
        .eq('email', user.email)
        .single()

      setVendeur(v)

      if (v) {
        const { data: b } = await supabase
          .from('boutiques')
          .select('*')
          .eq('vendeur_id', v.id)
          .order('created_at', { ascending: false })

        setBoutiques(b || [])
      }

      setLoading(false)
    }
    init()
  }, [])

  const ajouterBoutique = async () => {
    if (!nom || !url || !vendeur) return

    const { data } = await supabase
      .from('boutiques')
      .insert({ vendeur_id: vendeur.id, nom, shopify_url: url })
      .select()
      .single()

    if (data) {
      setBoutiques(prev => [data, ...prev])
      setNom('')
      setUrl('')
      setAjout(false)
    }
  }

  const supprimerBoutique = async (id: string) => {
    await supabase.from('boutiques').delete().eq('id', id)
    setBoutiques(prev => prev.filter(b => b.id !== id))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F5F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', color: '#888' }}>
      Chargement...
    </div>
  )

  const isPlanBusiness = vendeur?.plan === 'business'

  return (
    <div className="flex min-h-screen" style={{ background: '#F5F0E8' }}>
      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-stone-200 flex flex-col py-5">
        <div className="px-5 pb-6">
          <Logo size="sm" />
        </div>
        <nav className="flex flex-col">
          {[
            { label: 'Tableau de bord', href: '/' },
            { label: 'Mes codes', href: '/nouveau-code' },
            { label: 'Affiliés', href: '/affilies' },
            { label: 'Stats', href: '/stats' },
            { label: 'Paiements', href: '/paiements' },
            { label: 'Boutiques', href: '/boutiques' },
            { label: 'Paramètres', href: '/parametres' },
          ].map(({ label, href }) => (
            <a key={href} href={href} className="px-5 py-2 text-sm text-stone-500 flex items-center gap-2 cursor-pointer hover:text-stone-900">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 inline-block"></span>
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto px-5 pb-4">
          <div className="text-xs text-stone-400 mb-1">Connecté en tant que</div>
          <div className="text-xs text-stone-600 font-medium truncate">{vendeur?.email}</div>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} className="mt-3 text-xs text-stone-400 hover:text-stone-600 cursor-pointer">
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="text-base font-medium text-stone-900">Mes boutiques</h1>
            <p className="text-xs text-stone-500 mt-0.5">Gérez vos boutiques Shopify</p>
          </div>
          {isPlanBusiness && (
            <button onClick={() => setAjout(!ajout)} style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.55rem 1rem', fontSize: '13px', cursor: 'pointer' }}>
              + Ajouter une boutique
            </button>
          )}
        </div>

        {/* Blocage plan non-Business */}
        {!isPlanBusiness && (
          <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '3rem', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
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

        {/* Formulaire ajout */}
        {isPlanBusiness && ajout && (
          <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem', fontFamily: 'Georgia, serif' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '1rem' }}>Nouvelle boutique</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Nom de la boutique</label>
              <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ma boutique" style={{ width: '100%', padding: '0.75rem', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '14px', fontFamily: 'Georgia, serif', background: '#F5F2EC', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>URL Shopify</label>
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://ma-boutique.myshopify.com" style={{ width: '100%', padding: '0.75rem', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '14px', fontFamily: 'Georgia, serif', background: '#F5F2EC', outline: 'none' }} />
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

        {/* Liste boutiques */}
        {isPlanBusiness && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'Georgia, serif' }}>
            {boutiques.length === 0 ? (
              <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#888' }}>Aucune boutique ajoutée — cliquez sur "+ Ajouter une boutique"</p>
              </div>
            ) : (
              boutiques.map((b, i) => (
                <div key={i} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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