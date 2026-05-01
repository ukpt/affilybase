'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = 'w.albouy@orange.fr'

const PLAN_PRICE: Record<string, number> = {
  starter: 4.99,
  pro: 9.99,
  business: 39.99,
  free: 0,
}

export default function Admin() {
  const [vendeurs, setVendeurs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, free: 0, starter: 0, pro: 0, business: 0, mrr: 0, totalRevenu: 0 })

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        window.location.href = '/'
        return
      }

      const { data: vendeursData } = await supabase.from('vendeurs').select('*').order('created_at', { ascending: false })
      const { data: codesData } = await supabase.from('codes').select('vendeur_id')
      const { data: ventesData } = await supabase.from('ventes').select('*, codes(vendeur_id)')

      const vendeursEnrichis = (vendeursData || []).map(v => {
        const moisAbonne = v.plan !== 'free' && v.created_at
          ? Math.max(1, Math.floor((Date.now() - new Date(v.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)))
          : 0
        const prixPlan = PLAN_PRICE[v.plan] || 0
        const revenuTotal = moisAbonne * prixPlan
        const nbCodes = (codesData || []).filter(c => c.vendeur_id === v.id).length
        const nbVentes = (ventesData || []).filter(vente => vente.codes?.vendeur_id === v.id).length

        return { ...v, moisAbonne, revenuTotal, nbCodes, nbVentes }
      })

      setVendeurs(vendeursEnrichis)

      const total = vendeursEnrichis.length
      const free = vendeursEnrichis.filter(v => !v.plan || v.plan === 'free').length
      const starter = vendeursEnrichis.filter(v => v.plan === 'starter').length
      const pro = vendeursEnrichis.filter(v => v.plan === 'pro').length
      const business = vendeursEnrichis.filter(v => v.plan === 'business').length
      const mrr = starter * 4.99 + pro * 9.99 + business * 39.99
      const totalRevenu = vendeursEnrichis.reduce((s, v) => s + v.revenuTotal, 0)

      setStats({ total, free, starter, pro, business, mrr, totalRevenu })
      setLoading(false)
    }
    init()
  }, [])

  const moisLabel = (n: number) => n === 0 ? '—' : n === 1 ? '1 mois' : `${n} mois`

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F5F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
      Chargement...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F5F2EC', padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '2px', color: '#1a1a1a' }}>Dashboard Admin</h1>
            <p style={{ fontSize: '12px', color: '#888' }}>Vue globale Affilybase</p>
          </div>
          <a href="/" style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}>← Dashboard vendeur</a>
        </div>

        {/* Métriques */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '1rem' }}>
          {[
            { label: 'Vendeurs total', value: stats.total, sub: 'inscrits', color: '#1a1a1a' },
            { label: 'MRR', value: `${stats.mrr.toFixed(2)} €`, sub: 'revenu mensuel', color: '#1D9E75' },
            { label: 'Revenus total', value: `${stats.totalRevenu.toFixed(2)} €`, sub: 'depuis le début', color: '#1D9E75' },
            { label: 'Payants', value: stats.starter + stats.pro + stats.business, sub: `${stats.free} gratuits`, color: '#1D9E75' },
          ].map(({ label, value, sub, color }, i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '22px', fontWeight: 500, color }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Répartition plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Free', value: stats.free, bg: '#FAEEDA', color: '#633806', sub: '0 €' },
            { label: 'Starter', value: stats.starter, bg: '#E1F5EE', color: '#085041', sub: '4,99 €' },
            { label: 'Pro', value: stats.pro, bg: '#EEEDFE', color: '#3C3489', sub: '9,99 €' },
            { label: 'Business', value: stats.business, bg: '#F5F2EC', color: '#1a1a1a', sub: '39,99 €' },
          ].map(({ label, value, bg, color, sub }, i) => (
            <div key={i} style={{ background: bg, borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 500, color }}>{value}</div>
              <div style={{ fontSize: '12px', color, opacity: 0.8 }}>{label} · {sub}</div>
            </div>
          ))}
        </div>

        {/* Liste vendeurs */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '1rem', paddingBottom: '8px', borderBottom: '0.5px solid #ddd8ce', display: 'flex', justifyContent: 'space-between' }}>
            <span>Liste des vendeurs</span>
            <span style={{ fontSize: '12px', color: '#888' }}>{stats.total} au total</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {vendeurs.map((v, i) => (
              <div key={i} style={{ border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '1rem', background: '#F5F2EC' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>{v.nom || v.email}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{v.email}{v.shopify_url ? ` · ${v.shopify_url}` : ''}</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>
                      Inscrit le {new Date(v.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      background: v.plan === 'starter' ? '#E1F5EE' : v.plan === 'pro' ? '#EEEDFE' : v.plan === 'business' ? '#F5F2EC' : '#FAEEDA',
                      color: v.plan === 'starter' ? '#085041' : v.plan === 'pro' ? '#3C3489' : v.plan === 'business' ? '#1a1a1a' : '#633806',
                      fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 500
                    }}>
                      {v.plan === 'starter' ? 'Starter' : v.plan === 'pro' ? 'Pro' : v.plan === 'business' ? 'Business' : 'Free'}
                    </div>
                    {v.plan_cancel_at_period_end && (
                      <div style={{ fontSize: '11px', color: '#D85A30', background: '#FAECE7', padding: '3px 8px', borderRadius: '4px' }}>
                        Résiliation en cours
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', paddingTop: '10px', borderTop: '0.5px solid #ddd8ce' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{moisLabel(v.moisAbonne)}</div>
                    <div style={{ fontSize: '10px', color: '#888' }}>abonné depuis</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: v.revenuTotal > 0 ? '#1D9E75' : '#888' }}>
                      {v.revenuTotal.toFixed(2)} €
                    </div>
                    <div style={{ fontSize: '10px', color: '#888' }}>rapporté au total</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{v.nbCodes}</div>
                    <div style={{ fontSize: '10px', color: '#888' }}>codes créés</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{v.nbVentes}</div>
                    <div style={{ fontSize: '10px', color: '#888' }}>ventes générées</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}