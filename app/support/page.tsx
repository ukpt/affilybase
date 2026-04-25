'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function Support() {
  const [vendeur, setVendeur] = useState<any>(null)
  const [sujet, setSujet] = useState('')
  const [message, setMessage] = useState('')
  const [envoye, setEnvoye] = useState(false)
  const [loading, setLoading] = useState(true)

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
      setLoading(false)
    }
    init()
  }, [])

  const handleSubmit = async () => {
    if (!sujet || !message) return
    setEnvoye(true)
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
            { label: 'Support', href: '/support' },
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
      <div className="flex-1 p-6" style={{ fontFamily: 'Georgia, serif' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="text-base font-medium text-stone-900">Support prioritaire</h1>
          <p className="text-xs text-stone-500 mt-0.5">Nous répondons à vos demandes sous 2h</p>
        </div>

        {!isPlanBusiness ? (
          <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '1rem' }}>🔒</div>
            <h2 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '0.5rem', color: '#1a1a1a' }}>Support prioritaire</h2>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Le support prioritaire avec réponse sous 2h est disponible uniquement avec le plan Business.
            </p>
            <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '1.5rem' }}>
              Sur les autres plans, vous pouvez nous contacter via <a href="/contact" style={{ color: '#2D9B6F' }}>notre page contact</a> avec un délai de réponse de 24h.
            </p>
            <a href="/abonnement" style={{ background: '#2D9B6F', color: '#fff', borderRadius: '6px', padding: '0.75rem 1.5rem', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
              Passer au plan Business — 39.99€/mois
            </a>
          </div>
        ) : envoye ? (
          <div style={{ background: '#E1F5EE', borderRadius: '10px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '0.5rem', color: '#0F6E56' }}>Demande envoyée !</h2>
            <p style={{ fontSize: '14px', color: '#085041', marginBottom: '1rem' }}>Notre équipe vous répond sous 2h.</p>
            <button onClick={() => { setEnvoye(false); setSujet(''); setMessage('') }} style={{ background: '#2D9B6F', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.75rem 1.5rem', fontSize: '14px', cursor: 'pointer' }}>
              Nouvelle demande
            </button>
          </div>
        ) : (
          <div>
            {/* Badge prioritaire */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#E1F5EE', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '16px' }}>⚡</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#085041' }}>Support prioritaire activé</div>
                <div style={{ fontSize: '12px', color: '#0F6E56' }}>Réponse garantie sous 2h — lun–ven 9h–18h</div>
              </div>
            </div>

            <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '1rem' }}>Nouvelle demande de support</h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Sujet</label>
                <select value={sujet} onChange={e => setSujet(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '14px', fontFamily: 'Georgia, serif', background: '#F5F2EC', outline: 'none' }}>
                  <option value="">Sélectionnez un sujet</option>
                  <option value="bug">🐛 Bug / Problème technique</option>
                  <option value="facturation">💳 Facturation / Abonnement</option>
                  <option value="shopify">🛍 Intégration Shopify</option>
                  <option value="affilies">👥 Gestion des affiliés</option>
                  <option value="autre">💬 Autre demande</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Décrivez votre problème en détail..."
                  rows={5}
                  style={{ width: '100%', padding: '0.75rem', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '14px', fontFamily: 'Georgia, serif', background: '#F5F2EC', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button onClick={handleSubmit} disabled={!sujet || !message} style={{ background: sujet && message ? '#2D9B6F' : '#ccc', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.85rem 1.5rem', fontSize: '14px', fontWeight: 500, cursor: sujet && message ? 'pointer' : 'not-allowed', width: '100%' }}>
                Envoyer la demande
              </button>
            </div>

            {/* FAQ rapide */}
            <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Questions fréquentes</h2>
              {[
                ['Comment ajouter un affilié ?', 'Depuis le tableau de bord, cliquez sur "+ Nouveau code" et renseignez les informations de votre affilié.'],
                ['Comment connecter ma boutique Shopify ?', 'Allez dans Paramètres et entrez l\'URL de votre boutique Shopify (ex: ma-boutique.myshopify.com).'],
                ['Comment payer mes affiliés ?', 'Depuis la page Stats, cliquez sur "Marquer payé" pour chaque code une fois le virement effectué.'],
              ].map(([q, a], i) => (
                <div key={i} style={{ marginBottom: i < 2 ? '12px' : 0, paddingBottom: i < 2 ? '12px' : 0, borderBottom: i < 2 ? '0.5px solid #ddd8ce' : 'none' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{q}</div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}