'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

const MOYENS = ['Virement bancaire', 'Virement instantané', 'PayPal', 'Lydia / Sumeria', 'Revolut', 'Wise', 'Autre']

export default function Paiements() {
  const [vendeur, setVendeur] = useState<any>(null)
  const [affilies, setAffilies] = useState<any[]>([])
  const [paiements, setPaiements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [moyens, setMoyens] = useState<string[]>([])
  const [frequence, setFrequence] = useState('mensuel')
  const [savingMoyens, setSavingMoyens] = useState(false)
  const [savedMoyens, setSavedMoyens] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: v } = await supabase.from('vendeurs').select('*').eq('email', user.email).single()
      if (!v) { setLoading(false); return }
      setVendeur(v)
      setMoyens(v.moyens_paiement || [])
      setFrequence(v.frequence_paiement || 'mensuel')
      const { data: codesData } = await supabase.from('codes').select('*, affilies(*)').eq('vendeur_id', v.id)
      const { data: ventesData } = await supabase.from('ventes').select('*').in('code_id', (codesData || []).map((c: any) => c.id))
      const { data: paiementsData } = await supabase.from('paiements').select('*, affilies(nom, email)').eq('vendeur_id', v.id).order('created_at', { ascending: false })
      setPaiements(paiementsData || [])
      const affiliesAvecDettes = (codesData || []).map((code: any) => {
        const ventesCode = (ventesData || []).filter((vente: any) => vente.code_id === code.id && !vente.payee)
        const montant = ventesCode.reduce((s: number, vente: any) => s + (vente.commission || 0), 0)
        return { ...code.affilies, code: code.code, ventes: ventesCode.length, montant, coordonnees: code.affilies?.coordonnees_paiement || {} }
      }).filter((a: any) => a.montant > 0)
      setAffilies(affiliesAvecDettes)
      setLoading(false)
    }
    init()
  }, [])

  const toggleMoyen = (m: string) => {
    setMoyens(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }

  const saveMoyens = async () => {
    if (!vendeur) return
    setSavingMoyens(true)
    await supabase.from('vendeurs').update({ moyens_paiement: moyens, frequence_paiement: frequence }).eq('id', vendeur.id)
    setSavingMoyens(false)
    setSavedMoyens(true)
    setTimeout(() => setSavedMoyens(false), 2000)
  }

  const marquerPaye = async (affilie: any) => {
    if (!vendeur) return
    const moyen = moyens[0] || 'Non précisé'
    await supabase.from('paiements').insert({ vendeur_id: vendeur.id, affilie_id: affilie.id, montant: affilie.montant, moyen })
    await supabase.from('ventes').update({ payee: true }).eq('code_id', affilie.id).eq('payee', false)
    await supabase.from('notifications_affilies').insert({ affilie_id: affilie.id, message: `🎉 Bonne nouvelle ! ${vendeur.nom || vendeur.email} vient de te virer ${affilie.montant.toFixed(2)} € pour tes ${affilie.ventes} ventes. Merci pour ton travail !` })
    setAffilies(prev => prev.filter(a => a.id !== affilie.id))
    const { data: newPaiement } = await supabase.from('paiements').select('*, affilies(nom, email)').eq('vendeur_id', vendeur.id).order('created_at', { ascending: false }).limit(1).single()
    if (newPaiement) setPaiements(prev => [newPaiement, ...prev])
  }

  const copier = (texte: string) => navigator.clipboard.writeText(texte)
  const totalAVerser = affilies.reduce((s, a) => s + a.montant, 0)
  const totalVerseMois = paiements.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).reduce((s, p) => s + (p.montant || 0), 0)
  const totalVerse = paiements.reduce((s, p) => s + (p.montant || 0), 0)
  const initiales = (nom: string) => nom?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??'

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F5F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
      Chargement...
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F2EC' }}>
      <Sidebar active="Paiements" email={vendeur?.email} />

      <div style={{ flex: 1, padding: '1.5rem', maxWidth: '800px', overflowX: 'hidden' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '2px' }}>Paiements</h1>
          <p style={{ fontSize: '12px', color: '#888' }}>Suivez et gérez les commissions de vos affiliés</p>
        </div>

        {/* Résumé */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '1.25rem' }}>
          {[
            { label: 'Total à verser', value: `${totalAVerser.toFixed(2)} €`, sub: `${affilies.length} affilié(s) en attente`, color: '#D85A30' },
            { label: 'Versé ce mois', value: `${totalVerseMois.toFixed(2)} €`, sub: `${paiements.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length} affilié(s) payé(s)`, color: '#1D9E75' },
            { label: 'Total versé', value: `${totalVerse.toFixed(2)} €`, sub: 'depuis le début', color: '#1a1a1a' },
          ].map(({ label, value, sub, color }, i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '22px', fontWeight: 500, color }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Moyens de paiement */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px', paddingBottom: '8px', borderBottom: '0.5px solid #ddd8ce' }}>Moyens de paiement que vous proposez</div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>Vos affiliés verront uniquement ces options pour renseigner leurs coordonnées.</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {MOYENS.map(m => (
              <button key={m} onClick={() => toggleMoyen(m)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '20px', border: `0.5px solid ${moyens.includes(m) ? '#1D9E75' : '#ddd8ce'}`, background: moyens.includes(m) ? '#E1F5EE' : '#F5F2EC', fontSize: '12px', color: moyens.includes(m) ? '#085041' : '#888', cursor: 'pointer' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: moyens.includes(m) ? '#1D9E75' : '#ddd8ce', display: 'inline-block' }}></span>
                {m}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '12px', color: '#888' }}>Fréquence :</div>
            {['mensuel', 'bimensuel', 'manuel'].map(f => (
              <button key={f} onClick={() => setFrequence(f)} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '6px', border: '0.5px solid #ddd8ce', background: frequence === f ? '#1a1a1a' : '#F5F2EC', color: frequence === f ? '#fff' : '#555', cursor: 'pointer' }}>
                {f === 'mensuel' ? 'Mensuel' : f === 'bimensuel' ? 'Tous les 15 jours' : 'Manuel'}
              </button>
            ))}
            <button onClick={saveMoyens} disabled={savingMoyens} style={{ marginLeft: 'auto', background: savedMoyens ? '#1D9E75' : '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}>
              {savingMoyens ? 'Sauvegarde...' : savedMoyens ? '✓ Sauvegardé' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        {/* En attente */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>En attente de paiement</span>
            <span style={{ background: '#FAEEDA', color: '#633806', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>{affilies.length}</span>
          </div>
          {affilies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888', fontSize: '13px' }}>
              Aucun paiement en attente — tous vos affiliés sont à jour ✓
            </div>
          ) : (
            affilies.map((a, i) => (
              <div key={i} style={{ border: '0.5px solid #FAEEDA', background: '#FAEEDA22', borderRadius: '8px', padding: '1rem', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FAEEDA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, color: '#633806', flexShrink: 0 }}>{initiales(a.nom)}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{a.nom}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>{a.code} — {a.ventes} vente(s)</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 500, color: '#D85A30' }}>{a.montant.toFixed(2)} €</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>à verser</div>
                    </div>
                    <button onClick={() => marquerPaye(a)} style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Marquer payé
                    </button>
                  </div>
                </div>
                {Object.keys(a.coordonnees).length > 0 ? (
                  <div style={{ paddingTop: '10px', borderTop: '0.5px solid #FAEEDA', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: '#633806', background: '#FAEEDA', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>{Object.keys(a.coordonnees)[0]}</span>
                    <span style={{ fontSize: '12px', color: '#555' }}>{Object.values(a.coordonnees)[0] as string}</span>
                    <button onClick={() => copier(Object.values(a.coordonnees)[0] as string)} style={{ fontSize: '11px', color: '#1D9E75', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>Copier</button>
                  </div>
                ) : (
                  <div style={{ paddingTop: '10px', borderTop: '0.5px solid #FAEEDA', fontSize: '12px', color: '#aaa' }}>
                    L'affilié n'a pas encore renseigné ses coordonnées de paiement
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Historique */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Historique</span>
            <span style={{ background: '#E1F5EE', color: '#085041', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>{paiements.length} payé(s)</span>
          </div>
          {paiements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888', fontSize: '13px' }}>Aucun paiement effectué pour l'instant</div>
          ) : (
            paiements.map((p, i) => (
              <div key={i} style={{ borderRadius: '8px', padding: '0.875rem', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F5F2EC', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, color: '#085041', flexShrink: 0 }}>{initiales(p.affilies?.nom)}</div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#1a1a1a' }}>{p.affilies?.nom}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>Payé le {new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })} · {p.moyen}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1D9E75' }}>+{p.montant?.toFixed(2)} €</div>
                  <span style={{ background: '#E1F5EE', color: '#085041', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>Payé ✓</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}