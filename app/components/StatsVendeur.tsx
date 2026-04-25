'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function StatsVendeur({ vendeurId, plan }: { vendeurId: string, plan: string }) {
  const [ventes, setVentes] = useState<any[]>([])
  const [codes, setCodes] = useState<any[]>([])
  const [filtreAffilie, setFiltreAffilie] = useState<string>('tous')
  const [periode, setPeriode] = useState<'semaine' | 'mois' | 'tout'>('mois')

  useEffect(() => {
    const init = async () => {
      const { data: codesData } = await supabase
        .from('codes')
        .select('*')
        .eq('vendeur_id', vendeurId)

      if (!codesData) return
      setCodes(codesData)

      const codeIds = codesData.map(c => c.id)
      const { data: ventesData } = await supabase
        .from('ventes')
        .select('*, codes(*)')
        .in('code_id', codeIds)
        .order('created_at', { ascending: false })

      setVentes(ventesData || [])
    }
    init()
  }, [vendeurId])

  // Blocage plan Free
  if (plan === 'free') {
    return (
      <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '0.5rem', color: '#1a1a1a' }}>Stats avancées</h2>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Les stats avancées sont disponibles à partir du plan Starter.<br />
          Suivez vos ventes, commissions et performances en temps réel.
        </p>
        <a href="/abonnement" style={{ background: '#2D9B6F', color: '#fff', borderRadius: '6px', padding: '0.75rem 1.5rem', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
          Passer au plan Starter — 5€/mois
        </a>
      </div>
    )
  }

  const now = new Date()
  const ventesFiltrees = ventes
    .filter(v => filtreAffilie === 'tous' || v.code_id === filtreAffilie)
    .filter(v => {
      const date = new Date(v.created_at)
      if (periode === 'semaine') return (now.getTime() - date.getTime()) < 7 * 24 * 60 * 60 * 1000
      if (periode === 'mois') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      return true
    })

  const totalVentes = ventesFiltrees.length
  const totalCommissions = ventesFiltrees.reduce((s, v) => s + (v.commission || 0), 0)
  const totalMontant = ventesFiltrees.reduce((s, v) => s + (v.montant || 0), 0)
  const aVerser = ventes.filter(v => !v.payee).reduce((s, v) => s + (v.commission || 0), 0)

  // Graphique 7 jours
  const last7days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const label = d.toLocaleDateString('fr-FR', { weekday: 'short' })
    const ventesJour = ventes.filter(v => new Date(v.created_at).toDateString() === d.toDateString())
    const count = ventesJour.length
    const montant = ventesJour.reduce((s, v) => s + (v.montant || 0), 0)
    return { label, count, montant }
  })
  const maxMontant = Math.max(...last7days.map(d => d.montant), 1)

  const marquerPaye = async (codeId: string) => {
    await supabase
      .from('ventes')
      .update({ payee: true })
      .eq('code_id', codeId)
      .eq('payee', false)
    
    setVentes(prev => prev.map(v => v.code_id === codeId ? { ...v, payee: true } : v))
  }

  // Stats par code
  const statsParCode = codes.map(code => {
    const ventesCode = ventes.filter(v => v.code_id === code.id)
    return {
      id: code.id,
      code: code.code,
      ventes: ventesCode.length,
      commission: ventesCode.reduce((s, v) => s + (v.commission || 0), 0),
      montant: ventesCode.reduce((s, v) => s + (v.montant || 0), 0),
      aVerser: ventesCode.filter(v => !v.payee).reduce((s, v) => s + (v.commission || 0), 0),
    }
  }).sort((a, b) => b.ventes - a.ventes)

  return (
    <div style={{ marginBottom: '2rem' }}>

      {/* STATS GLOBALES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '1.25rem' }}>
        {[
          { label: 'Ventes générées', value: totalVentes, sub: 'via vos affiliés' },
          { label: "Chiffre d'affaires", value: `${totalMontant.toFixed(2)}€`, sub: 'généré par affiliés' },
          { label: 'Commissions dues', value: `${totalCommissions.toFixed(2)}€`, sub: 'à vos affiliés' },
          { label: 'À verser', value: `${aVerser.toFixed(2)}€`, sub: 'en attente' },
        ].map(({ label, value, sub }, i) => (
          <div key={i} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>{label}</div>
            <div style={{ fontSize: '20px', fontWeight: 500 }}>{value}</div>
            <div style={{ fontSize: '11px', color: '#2D9B6F', marginTop: '4px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* FILTRES */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['semaine', 'mois', 'tout'] as const).map(p => (
            <button key={p} onClick={() => setPeriode(p)} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '6px', border: '0.5px solid #ddd8ce', background: periode === p ? '#1a1a1a' : '#fff', color: periode === p ? '#fff' : '#555', cursor: 'pointer' }}>
              {p === 'semaine' ? '7 jours' : p === 'mois' ? 'Ce mois' : 'Tout'}
            </button>
          ))}
        </div>
        <select onChange={e => setFiltreAffilie(e.target.value)} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '6px', border: '0.5px solid #ddd8ce', background: '#fff', color: '#555', cursor: 'pointer' }}>
          <option value="tous">Tous les affiliés</option>
          {codes.filter(c => statsParCode.find(s => s.id === c.id && s.ventes > 0)).map(code => (
            <option key={code.id} value={code.id}>{code.code}</option>
          ))}
        </select>
      </div>

      {/* GRAPHIQUE */}
      <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '1rem' }}>Évolution des ventes (CA en €)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', marginBottom: '8px' }}>
          {last7days.map(({ label, count, montant }, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              {montant > 0 && <div style={{ fontSize: '10px', color: '#2D9B6F', fontWeight: 500 }}>{montant}€</div>}
              <div style={{ width: '100%', background: montant > 0 ? '#2D9B6F' : '#e8e4dc', borderRadius: '4px 4px 0 0', height: `${(montant / maxMontant) * 90 + (montant > 0 ? 10 : 4)}px`, minHeight: '4px', transition: 'height 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
              <div style={{ fontSize: '10px', color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
          {totalVentes} vente{totalVentes > 1 ? 's' : ''} — {totalMontant.toFixed(2)}€ de CA généré
        </div>
      </div>

      {/* PERFORMANCE PAR CODE */}
      <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Performance par code</div>
        {statsParCode.filter(s => s.ventes > 0).length === 0 ? (
          <div style={{ fontSize: '13px', color: '#888', textAlign: 'center', padding: '1rem' }}>Aucune vente encore — vos affiliés partagent leurs codes bientôt !</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {statsParCode.filter(s => s.ventes > 0).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', background: '#F5F2EC', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {i === 0 && <span style={{ fontSize: '14px' }}>🏆</span>}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{s.code}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{s.ventes} vente{s.ventes > 1 ? 's' : ''} — {s.montant.toFixed(2)}€ de CA</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#2D9B6F' }}>{s.commission.toFixed(2)}€</div>
                    <div style={{ fontSize: '11px', color: s.aVerser > 0 ? '#BA7517' : '#888' }}>
                      {s.aVerser > 0 ? `${s.aVerser.toFixed(2)}€ à verser` : 'À jour ✓'}
                    </div>
                  </div>
                  {s.aVerser > 0 && (
                    <button onClick={() => marquerPaye(s.id)} style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '6px', border: '0.5px solid #2D9B6F', background: '#fff', color: '#2D9B6F', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Marquer payé
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}