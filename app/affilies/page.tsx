'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

export default function Affilies() {
  const [affilies, setAffilies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmer, setConfirmer] = useState<string | null>(null)
  const [supprimant, setSupprimant] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchAffilies = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      setEmail(session.user.email || '')
      const { data: vendeur } = await supabase.from('vendeurs').select('id').eq('email', session.user.email).single()
      if (!vendeur) { setLoading(false); return }
      const { data } = await supabase.from('affilies').select('*, codes(code, actif)').eq('vendeur_id', vendeur.id)
      setAffilies(data || [])
      setLoading(false)
    }
    fetchAffilies()
  }, [])

  const supprimerAffilie = async (affilie: any) => {
    setSupprimant(affilie.id)
    for (const code of affilie.codes || []) {
      await supabase.from('ventes').delete().eq('code_id', code.id)
      await supabase.from('codes').delete().eq('id', code.id)
    }
    await supabase.from('affilies').delete().eq('id', affilie.id)
    setAffilies(prev => prev.filter(a => a.id !== affilie.id))
    setSupprimant(null)
    setConfirmer(null)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F2EC' }}>
      <Sidebar active="Affiliés" email={email} />

      <div style={{ flex: 1, padding: '1.5rem', overflowX: 'hidden' }}>
        <h1 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '1.5rem' }}>Mes affiliés</h1>

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
              <div key={a.id} style={{ background: '#fff', border: `0.5px solid ${confirmer === a.id ? '#f0997b' : '#ddd8ce'}`, borderRadius: '10px', padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{a.nom}</div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{a.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#2D9B6F' }}>{a.codes?.length || 0} code(s)</div>
                    <button onClick={() => setConfirmer(confirmer === a.id ? null : a.id)} style={{ fontSize: '12px', color: '#888', background: 'none', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
                      Supprimer
                    </button>
                  </div>
                </div>

                {confirmer === a.id && (
                  <div style={{ marginTop: '12px', background: '#FAECE7', borderRadius: '6px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontSize: '13px', color: '#712B13' }}>
                      Supprimer <strong>{a.nom}</strong> et tous ses codes ? Action irréversible.
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setConfirmer(null)} style={{ fontSize: '12px', color: '#888', background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer' }}>
                        Annuler
                      </button>
                      <button onClick={() => supprimerAffilie(a)} disabled={supprimant === a.id} style={{ fontSize: '12px', color: '#fff', background: '#993C1D', border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer' }}>
                        {supprimant === a.id ? 'Suppression...' : 'Confirmer'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}