'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import StatsVendeur from '../components/StatsVendeur'

export default function Stats() {
  const [vendeur, setVendeur] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: v } = await supabase.from('vendeurs').select('*').eq('email', user.email).single()
      setVendeur(v)
    }
    init()
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F2EC' }}>
      <Sidebar active="Stats" email={vendeur?.email} />

      <div style={{ flex: 1, padding: '1.5rem', overflowX: 'hidden' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a1a' }}>Stats avancées</h1>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Performance de votre programme d'affiliation</p>
        </div>
        {vendeur && <StatsVendeur vendeurId={vendeur.id} plan={vendeur.plan || 'free'} />}
      </div>
    </div>
  )
}