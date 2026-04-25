'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'
import StatsVendeur from '../components/StatsVendeur'

export default function Stats() {
  const [vendeur, setVendeur] = useState<any>(null)

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
    }
    init()
  }, [])

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
            { label: 'Mes codes', href: '/mes-codes' },
            { label: 'Affiliés', href: '/affilies' },
            { label: 'Stats', href: '/stats' },
            { label: 'Paiements', href: '/paiements' },
            { label: 'Paramètres', href: '/parametres' },
          ].map(({ label, href }) => (
            <a key={href} href={href} className={`px-5 py-2 text-sm flex items-center gap-2 cursor-pointer hover:text-stone-900 ${typeof window !== 'undefined' && window.location.pathname === href ? 'font-medium text-stone-900 bg-stone-100 border-l-2 border-stone-900' : 'text-stone-500'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 inline-block"></span>
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto px-5 pb-4">
          <div className="text-xs text-stone-400 mb-1">Connecté en tant que</div>
          <div className="text-xs text-stone-600 font-medium truncate">{vendeur?.email}</div>
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }}
            className="mt-3 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-base font-medium text-stone-900">Stats avancées</h1>
            <p className="text-xs text-stone-500 mt-0.5">Performance de votre programme d'affiliation</p>
          </div>
        </div>

        {vendeur && <StatsVendeur vendeurId={vendeur.id} />}
      </div>
    </div>
  )
}