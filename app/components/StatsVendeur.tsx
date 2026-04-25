'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function StatsVendeur({ vendeurId }: { vendeurId: string }) {
  const [stats, setStats] = useState<any>(null)
  const [ventes, setVentes] = useState<any[]>([])
  const [periode, setPeriode] = useState<'semaine' | 'mois' | 'tout'>('mois')

  useEffect(() => {
    const init = async () => {
      // Récupérer tous les codes du vendeur
      const { data: codes } = await supabase
        .from('codes')
        .select('*')
        .eq('vendeur_id', vendeurId)

      if (!codes) return

      const codeIds = codes.map(c => c.id)

      // Récupérer toutes les ventes
      const { data: ventesData } = await supabase
        .from('ventes')
        .select('*, codes(*)')
        .in('code_id', codeIds)
        .order('created_at', { ascending: false })

      setVentes(ventesData || [])

      // Calculer stats par affilié
      const statsParCode = codes.map(code => {
        const ventesCode = (ventesData || []).filter(v => v.code_id === code.id)
        return {
          code: code.code,
          affilie: code.affiliies?.nom || 'Inconnu',
          ventes: ventesCode.length,
          commission: ventesCode.reduce((s: number, v: any) => s + v.commission, 0),
          montant: ventesCode.reduce((s: number, v: any) => s + v.montant, 0),
          aVerser: ventesCode.filter((v: any) => !v.payee).reduce((s: number, v: any) => s + v.commission, 0),
        }
      }).sort((a, b) => b.ventes - a.ventes)

      setStats(statsParCode)
    }
    init()
  }, [vendeurId])

  const now = new Date()
  const ventesFiltrees = ventes.filter(v => {
    const date = new Date(v.created_at)
    if (periode === 'semaine') return (now.getTime() - date.getTime()) < 7 * 24 * 60 * 60 * 1000
    if (periode === 'mois') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    return true
  })

  const totalVentes = ventesFiltrees.length
  const totalCommissions = ventesFiltrees.reduce((s, v) => s + v.commission, 0)
  const totalMontant = ventesFiltrees.reduce((s, v) => s + v.montant, 0)
  const aVerser = ventes.filter(v => !v.payee).reduce((s, v) => s + v.commission, 0)

  // Graphique 7 jours
  const last7days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const label = d.toLocaleDateString('fr-FR', { weekday: 'short' })
    const count = ventes.filter(v => new Date(v.created_at).toDateString() === d.toDateString()).length
    const montant = ventes.filter(v => new Date(v.created_at).toDateString() === d.toDateString()).reduce((s, v) => s + v.montant, 0)
    return { label, count, montant }
  })
  const maxCount = Math.max(...last7days.map(d => d.count), 1)

  if (!stats) return null

  return (
    <div style={{ marginBottom: '2rem' }}>

      {/* STATS GLOBALES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '1.25rem' }}>
        {[
          { label: 'Ventes générées', value: totalVentes, sub: 'via vos affiliés' },
          { label: 'Chiffre d\'affaires', value: `${totalMontant.toFixed(2)}€`, sub: 'généré par affiliés' },
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

      {/* GRAPHIQUE */}
      <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>Évolution des ventes</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['semaine', 'mois', 'tout'] as const).map(p => (
              <button key={p} onClick={() => setPeriode(p)} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '4px', border: '0.5px solid #ddd8ce', background: periode === p ? '#1a1a1a' : '#F5F2EC', color: periode === p ? '#fff' : '#555', cursor: 'pointer' }}>
                {p === 'semaine' ? '7 jours' : p === 'mois' ? 'Ce mois' : 'Tout'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px', marginBottom: '8px' }}>
          {last7days.map(({ label, count, montant }, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              {count > 0 && <div style={{ fontSize: '9px', color: '#2D9B6F' }}>{montant}€</div>}
              <div style={{ width: '100%', background: count > 0 ? '#2D9B6F' : '#e8e4dc', borderRadius: '4px 4px 0 0', height: `${(count / maxCount) * 80 + (count > 0 ? 10 : 4)}px`, minHeight: '4px' }} />
              <div style={{ fontSize: '10px', color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
          {totalVentes} vente{totalVentes > 1 ? 's' : ''} — {totalMontant.toFixed(2)}€ de CA généré
        </div>
      </div>

      {/* TOP AFFILIÉS */}
      <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Performance par code</div>
        {stats.filter((s: any) => s.ventes > 0).length === 0 ? (
          <div style={{ fontSize: '13px', color: '#888', textAlign: 'center', padding: '1rem' }}>Aucune vente encore — vos affiliés partagent leurs codes bientôt !</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stats.filter((s: any) => s.ventes > 0).map((s: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#F5F2EC', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {i === 0 && <span style={{ fontSize: '14px' }}>🏆</span>}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{s.code}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{s.ventes} vente{s.ventes > 1 ? 's' : ''} — {s.montant.toFixed(2)}€ de CA</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#2D9B6F' }}>{s.commission.toFixed(2)}€</div>
                  <div style={{ fontSize: '11px', color: s.aVerser > 0 ? '#BA7517' : '#888' }}>
                    {s.aVerser > 0 ? `${s.aVerser.toFixed(2)}€ à verser` : 'À jour ✓'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}