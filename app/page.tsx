'use client'
import Sidebar from './components/Sidebar'
import StatsVendeur from './components/StatsVendeur'
import { useEffect, useState } from 'react'
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
  const [codes, setCodes] = useState<Code[]>([])
  const [vendeur, setVendeur] = useState<Vendeur | null>(null)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const init = async () => {
      const hash = window.location.hash
      if (hash && hash.includes('type=recovery')) {
        window.location.href = '/reset-password' + hash
        return
      }

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F0E8' }}>
        <div className="text-sm text-stone-500">Chargement...</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E8' }}>
      <Sidebar active="Tableau de bord" email={userEmail} />

      <div className="flex-1 p-6 page-content">

        {/* Topbar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-base font-medium text-stone-900">Tableau de bord</h1>
            <p className="text-xs text-stone-500 mt-0.5">Bienvenue sur Affily</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => window.location.href = '/onboarding'}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', color: '#888', cursor: 'pointer' }}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#1D9E75', color: '#fff', fontSize: '10px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>?</div>
              Guide
            </button>
            <button
              onClick={() => window.location.href = '/nouveau-code'}
              className="text-xs font-medium bg-stone-900 text-white px-3 py-1.5 rounded cursor-pointer hover:bg-stone-700"
            >
              + Nouveau code
            </button>
          </div>
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
              style={{ background: '#F5F0E8' }}
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