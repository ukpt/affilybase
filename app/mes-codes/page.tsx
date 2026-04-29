'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

const menuItems = [
  { label: 'Tableau de bord', href: '/' },
  { label: 'Mes codes', href: '/mes-codes' },
  { label: 'Affiliés', href: '/affilies' },
  { label: 'Stats', href: '/stats' },
  { label: 'Paiements', href: '/paiements' },
  { label: 'Boutiques', href: '/boutiques' },
  { label: 'Support', href: '/support' },
  { label: 'Paramètres', href: '/parametres' },
]

export default function MesCodes() {
  const [codes, setCodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCodes = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      const { data: vendeur } = await supabase.from('vendeurs').select('id').eq('email', session.user.email).single()
      if (!vendeur) { setLoading(false); return }
      const { data } = await supabase.from('codes').select('*, affilies(nom, email)').eq('vendeur_id', vendeur.id).order('created_at', { ascending: false })
      setCodes(data || [])
      setLoading(false)
    }
    fetchCodes()
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F2EC' }}>
      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-stone-200 flex flex-col py-5">
        <div className="px-5 pb-6"><Logo size="sm" /></div>
        <nav className="flex flex-col">
          <div className="px-5 py-2 text-sm font-medium text-stone-900 bg-stone-100 border-l-2 border-stone-900 flex items-center gap-2 cursor-pointer">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-900 inline-block"></span>
            Mes codes
          </div>
          {menuItems.filter(i => i.label !== 'Mes codes').map(({ label, href }) => (
            <a key={href} href={href} className="px-5 py-2 text-sm text-stone-500 flex items-center gap-2 cursor-pointer hover:text-stone-900">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 inline-block"></span>
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 500 }}>Mes codes d'affiliation</h1>
          <a href="/nouveau-code" style={{ background: '#1a1a1a', color: '#fff', borderRadius: '6px', padding: '0.5rem 1rem', fontSize: '13px', textDecoration: 'none' }}>+ Nouveau code</a>
        </div>

        {loading && <p style={{ color: '#888', fontSize: '14px' }}>Chargement...</p>}

        {!loading && codes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '10px', border: '0.5px solid #ddd8ce' }}>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '1rem' }}>Aucun code créé pour l'instant.</p>
            <a href="/nouveau-code" style={{ background: '#1a1a1a', color: '#fff', borderRadius: '6px', padding: '0.6rem 1.2rem', fontSize: '13px', textDecoration: 'none' }}>Créer mon premier code</a>
          </div>
        )}

        {!loading && codes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {codes.map((c) => (
              <div key={c.id} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 600, color: '#1a1a1a' }}>{c.code}</span>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{c.affilies?.nom} — {c.affilies?.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{c.commission_pct}%</div>
                    <div style={{ fontSize: '10px', color: '#888' }}>Commission</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{c.remise_pct}%</div>
                    <div style={{ fontSize: '10px', color: '#888' }}>Remise</div>
                  </div>
                  <span style={{ background: c.actif ? '#e8f5ee' : '#f5f5f5', color: c.actif ? '#0F6E56' : '#888', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>
                    {c.actif ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}