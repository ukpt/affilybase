'use client'
import Logo from './components/Logo'
import StatsVendeur from './components/StatsVendeur'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './lib/supabase'

type Code = {
  id: string
  code: string
  commission_pct: number
  remise_pct: number
  actif: boolean
  affilies: { nom: string; email: string }
}

type Vendeur = {
  id: string
  email: string
  shopify_url: string
}

export default function Dashboard() {
  const router = useRouter()
  const [codes, setCodes] = useState<Code[]>([])
  const [vendeur, setVendeur] = useState<Vendeur | null>(null)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/landing'; return }
      const { data: affilieCheck } = await supabase
        .from('affilies')
        .select('id')
        .eq('email', user.email)
        .single()

      if (affilieCheck) { window.location.href = '/affilie'; return }
      setUserEmail(user.email || '')

      const { data: v } = await supabase
        .from('vendeurs')
        .select('*')
        .eq('email', user.email)
        .single()
      setVendeur(v)

      if (v) {
        const { data: c } = await supabase
          .from('codes')
          .select('*, affilies(nom, email)')
          .eq('vendeur_id', v.id)
          .order('created_at', { ascending: false })
        setCodes(c || [])
      }
      setLoading(false)
    }
    init()
  }, [])

  const totalCodes = codes.length
  const codesActifs = codes.filter(c => c.actif).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: '#F5F0E8'}}>
        <div className="text-sm text-stone-500">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{background: '#F5F0E8'}}>

      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-stone-200 flex flex-col py-5">
        <div className="px-5 pb-6">
         <Logo size="sm" />
        </div>
        <nav className="flex flex-col">
          <div className="px-5 py-2 text-sm font-medium text-stone-900 bg-stone-100 border-l-2 border-stone-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-900 inline-block"></span>
            Tableau de bord
          </div>
          {[
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
          <div className="text-xs text-stone-600 font-medium truncate">{userEmail}</div>
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

        {/* Topbar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-base font-medium text-stone-900">Tableau de bord</h1>
            <p className="text-xs text-stone-500 mt-0.5">Bienvenue sur Affily</p>
          </div>
          <button
            onClick={() => window.location.href = '/nouveau-code'}
            className="text-xs font-medium bg-stone-900 text-white px-3 py-1.5 rounded cursor-pointer hover:bg-stone-700"
          >
            + Nouveau code
          </button>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="bg-white border border-stone-200 rounded-lg p-3.5">
            <div className="text-xs text-stone-400 mb-1.5">Codes créés</div>
            <div className="text-2xl font-medium text-stone-900">{totalCodes}</div>
            <div className="text-xs text-stone-500 mt-1">{codesActifs} actifs</div>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-3.5">
            <div className="text-xs text-stone-400 mb-1.5">Affiliés</div>
            <div className="text-2xl font-medium text-stone-900">{totalCodes}</div>
            <div className="text-xs text-stone-500 mt-1">dans votre programme</div>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-3.5">
            <div className="text-xs text-stone-400 mb-1.5">Ventes générées</div>
            <div className="text-2xl font-medium text-stone-900">0 €</div>
            <div className="text-xs text-stone-500 mt-1">connectez Shopify pour tracker</div>
          </div>
        </div>

        {/* Codes */}
        <h2 className="text-sm font-medium text-stone-900 mb-3">Vos codes d'affiliation</h2>

        {codes.length === 0 ? (
          <div
            onClick={() => window.location.href = '/nouveau-code'}
            className="bg-white border border-dashed border-stone-300 rounded-xl p-10 text-center cursor-pointer hover:bg-stone-50"
          >
            <div className="text-2xl text-stone-300 mb-2">+</div>
            <div className="text-sm text-stone-500">Créez votre premier code d'affiliation</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {codes.map(c => (
              <div key={c.id} className="bg-white border border-stone-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-medium text-stone-900 font-mono">{c.code}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${c.actif ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                    {c.actif ? 'Actif' : 'Pause'}
                  </span>
                </div>
                {[
                  ['Affilié', c.affilies?.nom || '—'],
                  ['Commission affilié', c.commission_pct + '%'],
                  ['Remise acheteur', c.remise_pct + '%'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                    <span className="text-stone-500">{label}</span>
                    <span className="text-stone-900 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            ))}
            <div
              onClick={() => window.location.href = '/nouveau-code'}
              className="border border-dashed border-stone-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-stone-50 min-h-32"
              style={{background:'#F5F0E8'}}
            >
              <div className="text-center">
                <div className="text-2xl text-stone-400 mb-1">+</div>
                <div className="text-xs text-stone-500">Nouveau code</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}