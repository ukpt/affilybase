'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Affilie() {
  const [code, setCode] = useState<any>(null)
  const [vendeur, setVendeur] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: affilieData } = await supabase
        .from('affilies')
        .select('*, codes(*), vendeurs(*)')
        .eq('email', user.email)
        .single()

      if (affilieData) {
        setCode(affilieData.codes)
        setVendeur(affilieData.vendeurs)
      }
    }
    init()
  }, [])

  const lienAffiliation = code ? `${vendeur?.shopify_url}?ref=${code.code}` : ''

  const copyCode = () => {
    navigator.clipboard.writeText(code?.code || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(lienAffiliation)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 1500)
  }

  if (!code) return (
    <div style={{ minHeight: '100vh', background: '#F5F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', color: '#888' }}>
      Chargement...
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#F5F2EC', fontFamily: 'Georgia, serif', color: '#1a1a1a', padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '18px', fontWeight: 500 }}>Mon espace affilié</p>
          <p style={{ fontSize: '13px', color: '#888' }}>Boutique : <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{vendeur?.nom || vendeur?.email || 'Votre boutique'}</span></p>
        </div>
        <div style={{ fontSize: '12px', color: '#888', textAlign: 'right' }}>
          Commission : <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{code.commission_pct}% par vente</span>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '1.25rem' }}>
        {[
          { label: 'Ventes générées', value: '—', sub: '' },
          { label: 'Clics sur le lien', value: '—', sub: '' },
          { label: 'Commissions gagnées', value: '—', sub: '' },
        ].map(({ label, value, sub }, i) => (
          <div key={i} style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>{label}</div>
            <div style={{ fontSize: '22px', fontWeight: 500 }}>{value}</div>
            {sub && <div style={{ fontSize: '12px', color: '#2D9B6F', marginTop: '4px' }}>{sub}</div>}
          </div>
        ))}
      </div>

      {/* COMMISSION EN ATTENTE */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#E1F5EE', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '13px', color: '#085041' }}>Commission en attente</span>
        <span style={{ fontSize: '18px', fontWeight: 500, color: '#0F6E56' }}>—</span>
      </div>

      {/* CODE PROMO */}
      <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Ton code promo</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '36px', fontWeight: 500, letterSpacing: '0.08em', background: '#F5F2EC', borderRadius: '8px', padding: '0.75rem 1.5rem', flex: 1, textAlign: 'center', border: '2px dashed #ddd8ce' }}>
            {code.code}
          </div>
          <button onClick={copyCode} style={{ background: '#2D9B6F', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem 1.25rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {copied ? 'Copié !' : 'Copier le code'}
          </button>
        </div>
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>Ton lien d'affiliation</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F5F2EC', borderRadius: '8px', padding: '0.6rem 1rem' }}>
          <span style={{ fontSize: '13px', color: '#2D9B6F', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lienAffiliation}</span>
          <button onClick={copyLink} style={{ fontSize: '12px', color: '#555', border: '0.5px solid #ddd8ce', background: '#fff', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {copiedLink ? 'Copié !' : 'Copier'}
          </button>
        </div>
      </div>

      {/* PARTAGE */}
      <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Partager rapidement</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
          {[
            { label: 'Story Instagram', color: '#E4405F', href: `https://www.instagram.com/` },
            { label: 'TikTok', color: '#000', href: `https://www.tiktok.com/` },
            { label: 'Facebook', color: '#1877F2', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(lienAffiliation)}` },
            { label: 'WhatsApp', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent('Utilise mon code ' + code.code + ' sur ' + lienAffiliation)}` },
          ].map(({ label, color, href }, i) => (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F5F2EC', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '13px', color: '#1a1a1a', textDecoration: 'none' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* DECONNEXION */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} style={{ fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>
          Se déconnecter
        </button>
      </div>

    </main>
  )
}