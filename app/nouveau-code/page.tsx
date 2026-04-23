'use client'
import Logo from '../components/Logo'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

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
      <div className="min-h-screen flex items-center justify-center" style={{background: '#F5F0E8'}}>
        <div className="w-full max-w-sm text-center">
          <div className="bg-white border border-stone-200 rounded-2xl p-10">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl text-green-600">✓</div>
            </div>
            <h2 className="text-base font-medium text-stone-900 mb-2">Code créé avec succès !</h2>
            <div className="text-2xl font-mono font-medium text-stone-900 my-4 py-3 rounded-lg" style={{background:'#F5F0E8'}}>
              {code.toUpperCase()}
            </div>
            <p className="text-sm text-stone-500 mb-2">Le code a été créé dans votre boutique Shopify !</p>
            <p className="text-sm text-stone-500 mb-6">L'affilié <strong>{nom}</strong> peut maintenant l'utiliser.</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => window.location.href = '/'} className="w-full bg-stone-900 text-white text-sm font-medium py-2.5 rounded-lg cursor-pointer hover:bg-stone-700">
                Voir le dashboard
              </button>
              <button onClick={() => { setSucces(false); setCode(''); setNom(''); setEmail(''); setCommission(''); setRemise('') }} className="w-full border border-stone-200 text-stone-600 text-sm py-2.5 rounded-lg cursor-pointer hover:bg-stone-50">
                Créer un autre code
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#F5F0E8'}}>
      <div className="w-full max-w-lg">

        <div className="flex items-center gap-3 mb-6">
          <Logo size="sm" />
          <span className="text-stone-300">/</span>
          <span className="text-sm text-stone-500">Nouveau code d'affiliation</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-8">
          <h1 className="text-base font-medium text-stone-900 mb-1">Créer un code d'affiliation</h1>
          <p className="text-sm text-stone-500 mb-6">Le code sera créé automatiquement dans votre boutique Shopify</p>

          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">Nom du code</label>
              <input type="text" placeholder="ex: MARIE20" value={code} onChange={e => setCode(e.target.value.toUpperCase())} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-mono text-stone-900 outline-none focus:border-stone-400" style={{background: '#FDFAF5'}} />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">Nom de l'affilié</label>
              <input type="text" placeholder="ex: Marie Aubry" value={nom} onChange={e => setNom(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-400" style={{background: '#FDFAF5'}} />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">Email de l'affilié</label>
              <input type="email" placeholder="marie@email.fr" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-400" style={{background: '#FDFAF5'}} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1.5">Commission affilié</label>
                <div className="relative">
                  <input type="number" placeholder="10" min="1" max="50" value={commission} onChange={e => setCommission(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-400 pr-8" style={{background: '#FDFAF5'}} />
                  <span className="absolute right-3 top-2.5 text-sm text-stone-400">%</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1.5">Remise acheteur</label>
                <div className="relative">
                  <input type="number" placeholder="20" min="1" max="80" value={remise} onChange={e => setRemise(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-400 pr-8" style={{background: '#FDFAF5'}} />
                  <span className="absolute right-3 top-2.5 text-sm text-stone-400">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">Applicable sur</label>
              <div className="flex gap-2">
                <button onClick={() => setProduits('tout')} className={`flex-1 text-sm py-2 rounded-lg cursor-pointer transition-all ${produits === 'tout' ? 'bg-stone-900 text-white font-medium' : 'border border-stone-200 text-stone-500 hover:bg-stone-50'}`}>Toute la boutique</button>
                <button onClick={() => setProduits('choisis')} className={`flex-1 text-sm py-2 rounded-lg cursor-pointer transition-all ${produits === 'choisis' ? 'bg-stone-900 text-white font-medium' : 'border border-stone-200 text-stone-500 hover:bg-stone-50'}`}>Produits choisis</button>
              </div>
            </div>

            <div className="rounded-xl p-4" style={{background: '#F5F0E8'}}>
              <div className="text-xs font-medium text-stone-700 mb-3">Récapitulatif</div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs"><span className="text-stone-500">Code</span><span className="text-stone-900 font-mono font-medium">{code || '—'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-stone-500">Commission affilié</span><span className="text-stone-900 font-medium">{commission ? commission + '%' : '—'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-stone-500">Remise acheteur</span><span className="text-stone-900 font-medium">{remise ? remise + '%' : '—'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-stone-500">Créé dans Shopify</span><span className="text-green-700 font-medium">Automatiquement</span></div>
              </div>
            </div>

            {message && (
              <div className="text-xs text-center py-2 px-3 rounded-lg bg-red-50 text-red-600 border border-red-100">{message}</div>
            )}

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-stone-900 text-white text-sm font-medium py-3 rounded-lg cursor-pointer hover:bg-stone-700 disabled:opacity-50">
              {loading ? 'Création en cours...' : 'Créer le code et envoyer l\'invitation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}