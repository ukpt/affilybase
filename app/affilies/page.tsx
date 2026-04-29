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

export default function Affilies() {
  const [affilies, setAffilies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAffilies = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      const { data: vendeur } = await supabase.from('vendeurs').select('id').eq('email', session.user.email).single()
      if (!vendeur) { setLoading(false); return }
      const { data } = await supabase.from('affilies').select('*, codes(code, actif)').eq('vendeur_id', vendeur.id)
      setAffilies(data || [])
      setLoading(false)
    }
    fetchAffilies()
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F2EC' }}>
      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-stone-200 flex flex-col py-5">
        <div className="px-5 pb-6"><Logo size="sm" /></div>
        <nav className="flex flex-col">
          <div className="px-5 py-2 text-sm font-medium text-stone-900 bg-stone-100 border-l-2 border-stone-900 flex items-center gap-2 cursor-pointer">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-900 inline-block"></span>
            Affiliés
          </div>
          {menuItems.filter(i => i.label !== 'Affiliés').map(({ label, href }) => (
            <a key={href} href={href} className="px-5 py-2 text-sm text-stone-500 flex items-center gap-2 cursor-pointer hover:text-stone-900">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 inline-block"></span>
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '1.5rem' }}>Mes affiliés</h1>

        {loading && <p style={{ color: '#888', fontSize: '14px' }}>Chargement...</p>}

        {!loading && affilies.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '10px', border: '0.5px solid #ddd8ce' }}>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '1rem' }}>Aucun affilié pour l'instant.</p>
            <a href="/nouveau-code" style={{ background: '#1a1a1a', color: '#fff', borderRadius: '6px', padding: '0.6rem 1.2rem', fontSize: '13px', textDecoration: 'none' }}>Créer un premier code</a>
          </div>
        )}

        {!loading && affilies.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {affilies.map((a) => (
              <div key={a.id} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{a.nom}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{a.email}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#2D9B6F' }}>{a.codes?.length || 0} code(s)</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}