'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Affilie() {
  const [code, setCode] = useState<any>(null)
  const [vendeur, setVendeur] = useState<any>(null)
  const [ventes, setVentes] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showCoordonnees, setShowCoordonnees] = useState(false)
  const [moyenChoisi, setMoyenChoisi] = useState('')
  const [coordonnee, setCoordonnee] = useState('')
  const [savingCoord, setSavingCoord] = useState(false)
  const [savedCoord, setSavedCoord] = useState(false)
  const [affilieData, setAffilieData] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: aff } = await supabase
        .from('affilies')
        .select('*')
        .eq('email', user.email)
        .single()

      if (!aff) { window.location.href = '/login'; return }
      setAffilieData(aff)

      const coordExistantes = aff.coordonnees_paiement || {}
      if (Object.keys(coordExistantes).length > 0) {
        setMoyenChoisi(Object.keys(coordExistantes)[0])
        setCoordonnee(Object.values(coordExistantes)[0] as string)
      }

      const { data: codeData } = await supabase
        .from('codes')
        .select('*')
        .eq('affilie_id', aff.id)
        .single()

      const { data: vendeurData } = await supabase
        .from('vendeurs')
        .select('*')
        .eq('id', aff.vendeur_id)
        .single()

      if (codeData) {
        const { data: ventesData } = await supabase
          .from('ventes')
          .select('*')
          .eq('code_id', codeData.id)
          .order('created_at', { ascending: false })
        setVentes(ventesData || [])
      }

      const { data: notifs } = await supabase
        .from('notifications_affilies')
        .select('*')
        .eq('affilie_id', aff.id)
        .order('created_at', { ascending: false })

      setNotifications(notifs || [])

      // Marquer les notifs comme lues
      if (notifs && notifs.filter(n => !n.lu).length > 0) {
        await supabase.from('notifications_affilies').update({ lu: true }).eq('affilie_id', aff.id).eq('lu', false)
      }

      setCode(codeData)
      setVendeur(vendeurData)
    }
    init()
  }, [])

  const lienAffiliation = code && vendeur?.shopify_url
    ? `${vendeur.shopify_url}?ref=${code.code}`
    : `https://affilybase.com/r/${code?.code || ''}`

  const totalCommissions = ventes.reduce((sum, v) => sum + (v.commission || 0), 0)
  const commissionsEnAttente = ventes.filter(v => !v.payee).reduce((sum, v) => sum + (v.commission || 0), 0)

  const copyCode = () => { navigator.clipboard.writeText(code?.code || ''); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  const copyLink = () => { navigator.clipboard.writeText(lienAffiliation); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 1500) }

  const saveCoordonnees = async () => {
    if (!affilieData || !moyenChoisi || !coordonnee) return
    setSavingCoord(true)
    await supabase.from('affilies').update({
      coordonnees_paiement: { [moyenChoisi]: coordonnee }
    }).eq('id', affilieData.id)
    setSavingCoord(false)
    setSavedCoord(true)
    setShowCoordonnees(false)
    setTimeout(() => setSavedCoord(false), 2000)
  }

  const moyensDisponibles = vendeur?.moyens_paiement || []
  const frequence = vendeur?.frequence_paiement === 'mensuel' ? 'le 1er de chaque mois' : vendeur?.frequence_paiement === 'bimensuel' ? 'tous les 15 jours' : 'selon disponibilité'

  const notifsNonLues = notifications.filter(n => !n.lu)

  if (!code) return (
    <div style={{ minHeight: '100vh', background: '#F5F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
      Chargement...
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#F5F2EC', padding: '1.5rem', maxWidth: '680px', margin: '0 auto' }}>

      {/* NOTIFICATIONS */}
      {notifications.filter(n => new Date(n.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).map((n, i) => (
        <div key={i} style={{ background: '#E1F5EE', border: '0.5px solid #9FE1CB', borderRadius: '8px', padding: '0.875rem 1rem', marginBottom: '1rem', fontSize: '13px', color: '#085041' }}>
          {n.message}
        </div>
      ))}

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
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>Ventes générées</div>
          <div style={{ fontSize: '22px', fontWeight: 500 }}>{ventes.length}</div>
          <div style={{ fontSize: '12px', color: '#2D9B6F', marginTop: '4px' }}>depuis le début</div>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>Commissions gagnées</div>
          <div style={{ fontSize: '22px', fontWeight: 500 }}>{totalCommissions.toFixed(2)}€</div>
          <div style={{ fontSize: '12px', color: '#2D9B6F', marginTop: '4px' }}>total cumulé</div>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>En attente</div>
          <div style={{ fontSize: '22px', fontWeight: 500 }}>{commissionsEnAttente.toFixed(2)}€</div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>à percevoir</div>
        </div>
      </div>

      {/* COMMISSION EN ATTENTE */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#E1F5EE', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '13px', color: '#085041' }}>Commission en attente</span>
        <span style={{ fontSize: '18px', fontWeight: 500, color: '#0F6E56' }}>{commissionsEnAttente.toFixed(2)}€</span>
      </div>

      {/* COORDONNÉES DE PAIEMENT */}
      <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>Mes coordonnées de paiement</div>
          <button onClick={() => setShowCoordonnees(!showCoordonnees)} style={{ fontSize: '12px', color: '#1D9E75', background: 'none', border: 'none', cursor: 'pointer' }}>
            {showCoordonnees ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {moyensDisponibles.length > 0 && (
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
            Ce vendeur paie via : <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{moyensDisponibles.join(', ')}</span> — {frequence}
          </div>
        )}

        {!showCoordonnees && (
          moyenChoisi && coordonnee ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F5F2EC', borderRadius: '6px', padding: '8px 12px' }}>
              <span style={{ fontSize: '11px', background: '#E1F5EE', color: '#085041', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>{moyenChoisi}</span>
              <span style={{ fontSize: '13px', color: '#555', fontFamily: moyenChoisi === 'Virement bancaire' ? 'monospace' : 'inherit' }}>{coordonnee}</span>
              {savedCoord && <span style={{ fontSize: '11px', color: '#1D9E75', marginLeft: 'auto' }}>✓ Sauvegardé</span>}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: '#aaa', fontStyle: 'italic' }}>
              Aucune coordonnée renseignée — cliquez sur "Modifier" pour indiquer comment vous souhaitez être payé.
            </div>
          )
        )}

        {showCoordonnees && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>Moyen de paiement</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(moyensDisponibles.length > 0 ? moyensDisponibles : ['Virement bancaire', 'PayPal', 'Lydia / Sumeria', 'Revolut', 'Wise', 'Autre']).map((m: string) => (
                  <button key={m} onClick={() => setMoyenChoisi(m)} style={{ padding: '6px 12px', borderRadius: '20px', border: `0.5px solid ${moyenChoisi === m ? '#1D9E75' : '#ddd8ce'}`, background: moyenChoisi === m ? '#E1F5EE' : '#F5F2EC', fontSize: '12px', color: moyenChoisi === m ? '#085041' : '#888', cursor: 'pointer' }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>
                {moyenChoisi === 'Virement bancaire' ? 'IBAN' : moyenChoisi === 'PayPal' ? 'Email PayPal' : moyenChoisi ? `Identifiant ${moyenChoisi}` : 'Vos coordonnées'}
              </div>
              <input
                value={coordonnee}
                onChange={e => setCoordonnee(e.target.value)}
                placeholder={moyenChoisi === 'Virement bancaire' ? 'FR76 XXXX XXXX XXXX XXXX XXXX XXX' : 'ex: mon@email.fr'}
                style={{ width: '100%', padding: '8px 12px', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box', fontFamily: moyenChoisi === 'Virement bancaire' ? 'monospace' : 'inherit' }}
              />
            </div>
            <button onClick={saveCoordonnees} disabled={savingCoord || !moyenChoisi || !coordonnee} style={{ background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', opacity: !moyenChoisi || !coordonnee ? 0.5 : 1 }}>
              {savingCoord ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        )}
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
      <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Partager rapidement</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
          {[
            { label: 'Instagram', color: '#E4405F', href: `https://www.instagram.com/` },
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

      {/* HISTORIQUE VENTES */}
      <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Historique des ventes</div>
        {ventes.length === 0 ? (
          <div style={{ fontSize: '13px', color: '#888', textAlign: 'center', padding: '1rem' }}>Aucune vente pour le moment</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ventes.map((vente, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#F5F2EC', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>Commande #{String(i + 1).padStart(4, '0')}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{new Date(vente.created_at).toLocaleDateString('fr-FR')} — Panier : {vente.montant}€</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#2D9B6F' }}>+{vente.commission}€</span>
                  <span style={{ fontSize: '11px', background: vente.payee ? '#e0ede7' : '#faeeda', color: vente.payee ? '#1a6645' : '#BA7517', padding: '2px 8px', borderRadius: '4px' }}>
                    {vente.payee ? 'Payé' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DÉCONNEXION */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} style={{ fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>
          Se déconnecter
        </button>
      </div>

    </main>
  )
}