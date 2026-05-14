'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

export default function Parametres() {
  const [vendeur, setVendeur] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [typeBoutique, setTypeBoutique] = useState<'shopify' | 'autre'>('shopify')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [shopifyUrl, setShopifyUrl] = useState('')
  const [autreUrl, setAutreUrl] = useState('')
  const [messageAccueil, setMessageAccueil] = useState("On est vraiment contents de t'avoir avec nous dans notre programme d'affiliation !")
  const [devise, setDevise] = useState('€')
  const [logoUrl, setLogoUrl] = useState('')
  const [showResilier, setShowResilier] = useState(false)
  const [resiliating, setResiliating] = useState(false)
  const [webhookSecret, setWebhookSecret] = useState('')
  const [copiedId, setCopiedId] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: v } = await supabase.from('vendeurs').select('*').eq('email', user.email).single()
      if (v) {
        setVendeur(v)
        setNom(v.nom || '')
        setEmail(v.email || '')
        setShopifyUrl(v.shopify_url || '')
        setAutreUrl(v.autre_url || '')
        setMessageAccueil(v.message_accueil || "On est vraiment contents de t'avoir avec nous dans notre programme d'affiliation !")
        setDevise(v.devise || '€')
        setLogoUrl(v.logo_url || '')
        setTypeBoutique(v.shopify_url ? 'shopify' : 'autre')
        // Générer un secret si pas encore existant
        if (v.webhook_secret) {
          setWebhookSecret(v.webhook_secret)
        } else {
          const secret = 'aff_' + Math.random().toString(36).substring(2, 18)
          setWebhookSecret(secret)
          await supabase.from('vendeurs').update({ webhook_secret: secret }).eq('id', v.id)
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const handleSave = async () => {
    if (!vendeur) return
    setSaving(true)
    await supabase.from('vendeurs').update({
      nom,
      shopify_url: typeBoutique === 'shopify' ? shopifyUrl : null,
      autre_url: typeBoutique === 'autre' ? autreUrl : null,
      message_accueil: messageAccueil,
      devise,
    }).eq('id', vendeur.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !vendeur) return
    const ext = file.name.split('.').pop()
    const path = `logos/${vendeur.id}.${ext}`
    await supabase.storage.from('assets').upload(path, file, { upsert: true })
    const { data } = supabase.storage.from('assets').getPublicUrl(path)
    setLogoUrl(data.publicUrl)
    await supabase.from('vendeurs').update({ logo_url: data.publicUrl }).eq('id', vendeur.id)
  }

  const handleResilier = async () => {
    if (!vendeur) return
    setResiliating(true)
    await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendeurId: vendeur.id })
    })
    setVendeur((prev: any) => ({ ...prev, plan_cancel_at_period_end: true }))
    setShowResilier(false)
    setResiliating(false)
  }

  const copyToClipboard = (text: string, type: 'id' | 'secret' | 'url') => {
    navigator.clipboard.writeText(text)
    if (type === 'id') { setCopiedId(true); setTimeout(() => setCopiedId(false), 2000) }
    if (type === 'secret') { setCopiedSecret(true); setTimeout(() => setCopiedSecret(false), 2000) }
    if (type === 'url') { setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F5F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
      Chargement...
    </div>
  )

  const lienAffilie = `affilybase.com/r/${(nom || vendeur?.email?.split('@')[0] || 'maboutique').toUpperCase().replace(/\s/g, '')}`
  const webhookUrl = `https://affilybase.com/api/woocommerce-sale`

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F2EC' }}>
      <Sidebar active="Paramètres" email={vendeur?.email} />

      <div className="page-content" style={{ flex: 1, padding: '1.5rem', maxWidth: '720px', overflowX: 'hidden' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '2px', color: '#1a1a1a' }}>Paramètres</h1>
          <p style={{ fontSize: '12px', color: '#888' }}>Configurez votre compte et votre programme d'affiliation</p>
        </div>

        {/* Profil entreprise */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '1rem', paddingBottom: '8px', borderBottom: '0.5px solid #ddd8ce' }}>Profil entreprise</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#F5F2EC', border: '0.5px solid #ddd8ce', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {logoUrl ? <img src={logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              )}
            </div>
            <div>
              <div style={{ fontSize: '13px', marginBottom: '4px' }}>Logo de l'entreprise</div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>PNG, JPG — max 2 Mo — recommandé 200×200px</div>
              <label style={{ display: 'inline-block', background: '#F5F2EC', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' }}>
                Choisir un fichier
                <input type="file" accept="image/*" onChange={handleLogo} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Nom de l'entreprise</div>
              <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ma Boutique" style={{ width: '100%', padding: '8px 12px', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Email de contact</div>
              <input value={email} disabled style={{ width: '100%', padding: '8px 12px', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '13px', background: '#F5F2EC', outline: 'none', color: '#aaa', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>

        {/* Boutique */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '1rem', paddingBottom: '8px', borderBottom: '0.5px solid #ddd8ce' }}>Boutique</div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Type de boutique</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setTypeBoutique('shopify')} style={{ flex: 1, background: typeBoutique === 'shopify' ? '#1a1a1a' : '#F5F2EC', color: typeBoutique === 'shopify' ? '#fff' : '#555', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }}>
                Shopify
              </button>
              <button onClick={() => setTypeBoutique('autre')} style={{ flex: 1, background: typeBoutique === 'autre' ? '#1a1a1a' : '#F5F2EC', color: typeBoutique === 'autre' ? '#fff' : '#555', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }}>
                Autre / Sans boutique
              </button>
            </div>
          </div>

          {typeBoutique === 'shopify' && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>URL Shopify</div>
              <input value={shopifyUrl} onChange={e => setShopifyUrl(e.target.value)} placeholder="ma-boutique.myshopify.com" style={{ width: '100%', padding: '8px 12px', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}

          {typeBoutique === 'autre' && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>URL de votre site</div>
              <input value={autreUrl} onChange={e => setAutreUrl(e.target.value)} placeholder="https://mon-site.fr" style={{ width: '100%', padding: '8px 12px', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '13px', background: '#F5F2EC', outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>Les clics des affiliés seront redirigés vers cette URL</div>
            </div>
          )}

          <div style={{ background: '#E1F5EE', borderRadius: '8px', padding: '10px 14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#085041', marginBottom: '3px' }}>
              {typeBoutique === 'autre' ? 'Lien de tracking universel' : 'Lien affilié pour les boutiques sans Shopify'}
            </div>
            <div style={{ fontSize: '12px', color: '#0F6E56', marginBottom: '8px' }}>
              {typeBoutique === 'autre'
                ? 'Partagez ce lien à vos affiliés. Les clics seront trackés et redirigés vers votre site.'
                : "Partagez ce lien à vos affiliés s'ils n'ont pas de boutique Shopify. Les clics seront trackés automatiquement."}
            </div>
            <div style={{ background: '#fff', borderRadius: '6px', padding: '7px 12px', fontSize: '12px', color: '#1D9E75', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {lienAffilie}
            </div>
          </div>
        </div>

        {/* Message de bienvenue */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px', paddingBottom: '8px', borderBottom: '0.5px solid #ddd8ce' }}>Message de bienvenue</div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>Ce message est envoyé par email à vos affiliés quand vous créez leur code.</div>
          <div style={{ background: '#F5F2EC', borderRadius: '8px', padding: '1rem', marginBottom: '12px', borderLeft: '3px solid #1D9E75' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Aperçu de l'email reçu par l'affilié</div>
            <div style={{ fontSize: '13px', color: '#1a1a1a', lineHeight: 1.7 }}>
              Bonjour <span style={{ color: '#1D9E75', fontWeight: 500 }}>[Prénom]</span> 👋<br />
              <br />
              Super nouvelle — tu rejoins notre programme d'affiliation !<br />
              <br />
              Ton code promo personnel : <span style={{ fontFamily: 'monospace', fontWeight: 500, background: '#fff', padding: '2px 8px', borderRadius: '4px' }}>MARIE20</span><br />
              <br />
              {messageAccueil}<br />
              <br />
              <span style={{ color: '#888' }}>— L'équipe {nom || 'Ma Boutique'}</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Votre message personnalisé</div>
            <textarea value={messageAccueil} onChange={e => setMessageAccueil(e.target.value)} rows={3} style={{ width: '100%', padding: '8px 12px', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '13px', background: '#F5F2EC', outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }} />
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>Variables disponibles : [Prénom], [Code], [Commission], [Remise]</div>
          </div>
        </div>

        {/* WOOCOMMERCE */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '8px', borderBottom: '0.5px solid #ddd8ce' }}>
            <div style={{ fontSize: '13px', fontWeight: 500 }}>Intégration WooCommerce</div>
            <span style={{ background: '#7F54B3', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '4px' }}>Plugin gratuit</span>
          </div>

          <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6, marginBottom: '1rem' }}>
            Installez notre plugin WordPress et renseignez ces informations pour connecter votre boutique WooCommerce à Affilybase.
          </div>

          {/* ID Vendeur */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Votre ID Vendeur</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, background: '#F5F2EC', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontFamily: 'monospace', color: '#1a1a1a', wordBreak: 'break-all' }}>
                {vendeur?.id}
              </div>
              <button onClick={() => copyToClipboard(vendeur?.id, 'id')} style={{ background: copiedId ? '#1D9E75' : '#F5F2EC', color: copiedId ? '#fff' : '#555', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '8px 14px', fontSize: '12px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                {copiedId ? '✓ Copié' : 'Copier'}
              </button>
            </div>
          </div>

          {/* Clé secrète */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Clé secrète</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, background: '#F5F2EC', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontFamily: 'monospace', color: '#1a1a1a', wordBreak: 'break-all' }}>
                {webhookSecret}
              </div>
              <button onClick={() => copyToClipboard(webhookSecret, 'secret')} style={{ background: copiedSecret ? '#1D9E75' : '#F5F2EC', color: copiedSecret ? '#fff' : '#555', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '8px 14px', fontSize: '12px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                {copiedSecret ? '✓ Copié' : 'Copier'}
              </button>
            </div>
          </div>

          {/* URL Webhook */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>URL de connexion</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, background: '#F5F2EC', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontFamily: 'monospace', color: '#1a1a1a', wordBreak: 'break-all' }}>
                {webhookUrl}
              </div>
              <button onClick={() => copyToClipboard(webhookUrl, 'url')} style={{ background: copiedUrl ? '#1D9E75' : '#F5F2EC', color: copiedUrl ? '#fff' : '#555', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '8px 14px', fontSize: '12px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                {copiedUrl ? '✓ Copié' : 'Copier'}
              </button>
            </div>
          </div>

          <div style={{ background: '#E1F5EE', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#085041', marginBottom: '4px' }}>Comment installer le plugin ?</div>
            {[
              'Téléchargez le plugin depuis affilybase.com',
              'WordPress → Extensions → Ajouter → Téléverser le fichier ZIP',
              'Activez le plugin et collez votre ID Vendeur et votre Clé secrète',
              'Les ventes WooCommerce apparaîtront automatiquement dans votre dashboard',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '6px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#1D9E75', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: '12px', color: '#0F6E56', lineHeight: 1.5 }}>{step}</div>
              </div>
            ))}
          </div>

          <a href="/affilybase-woocommerce.zip" download style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#7F54B3', color: '#fff', borderRadius: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}>
            ↓ Télécharger le plugin WooCommerce
          </a>
        </div>

        {/* Compte */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '1rem', paddingBottom: '8px', borderBottom: '0.5px solid #ddd8ce' }}>Compte</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>Plan actuel</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{vendeur?.plan === 'starter' ? 'Starter' : vendeur?.plan === 'business' ? 'Business' : 'Gratuit'}</div>
                <div style={{ background: vendeur?.plan === 'starter' ? '#E1F5EE' : vendeur?.plan === 'business' ? '#EEEDFE' : '#FAEEDA', color: vendeur?.plan === 'starter' ? '#085041' : vendeur?.plan === 'business' ? '#3C3489' : '#633806', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                  {vendeur?.plan === 'starter' ? 'Starter' : vendeur?.plan === 'business' ? 'Business' : 'Free'}
                </div>
                {vendeur?.plan_cancel_at_period_end && (
                  <div style={{ fontSize: '11px', color: '#D85A30', background: '#FAECE7', padding: '2px 8px', borderRadius: '4px' }}>
                    Résiliation en cours
                  </div>
                )}
              </div>
            </div>
            {vendeur?.plan !== 'business' && !vendeur?.plan_cancel_at_period_end && (
              <a href="/abonnement" style={{ background: '#1D9E75', color: '#fff', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', textDecoration: 'none' }}>
                {vendeur?.plan === 'starter' ? 'Passer au Business' : 'Passer au Starter'}
              </a>
            )}
          </div>
          <div style={{ borderTop: '0.5px solid #ddd8ce', paddingTop: '12px', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Changer le mot de passe</div>
            <button onClick={async () => {
              await supabase.auth.resetPasswordForEmail(vendeur?.email)
              alert('Un email de réinitialisation a été envoyé !')
            }} style={{ background: '#F5F2EC', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '8px 16px', fontSize: '12px', color: '#555', cursor: 'pointer' }}>
              Envoyer un email de réinitialisation
            </button>
          </div>
          {vendeur?.plan !== 'free' && !vendeur?.plan_cancel_at_period_end && (
            <div style={{ borderTop: '0.5px solid #ddd8ce', paddingTop: '12px' }}>
              {!showResilier ? (
                <button onClick={() => setShowResilier(true)} style={{ fontSize: '12px', color: '#D85A30', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Résilier mon abonnement
                </button>
              ) : (
                <div style={{ background: '#FAECE7', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ fontSize: '13px', color: '#712B13', marginBottom: '10px', fontWeight: 500 }}>Confirmer la résiliation</div>
                  <div style={{ fontSize: '12px', color: '#993C1D', marginBottom: '12px', lineHeight: 1.6 }}>
                    Votre abonnement restera actif jusqu'à la fin de la période en cours. Après cette date, votre compte repassera en plan gratuit (1 code maximum).
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setShowResilier(false)} style={{ fontSize: '12px', color: '#555', background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                      Annuler
                    </button>
                    <button onClick={handleResilier} disabled={resiliating} style={{ fontSize: '12px', color: '#fff', background: '#993C1D', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                      {resiliating ? 'Résiliation...' : 'Confirmer la résiliation'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {vendeur?.plan_cancel_at_period_end && (
            <div style={{ borderTop: '0.5px solid #ddd8ce', paddingTop: '12px', fontSize: '12px', color: '#D85A30' }}>
              Votre abonnement sera résilié à la fin de la période en cours.
            </div>
          )}
        </div>

        {/* Sauvegarder */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSave} disabled={saving} style={{ background: saved ? '#1D9E75' : '#1a1a1a', color: '#fff', borderRadius: '6px', padding: '10px 24px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: 'none', transition: 'background 0.2s' }}>
            {saving ? 'Sauvegarde...' : saved ? '✓ Sauvegardé !' : 'Sauvegarder les modifications'}
          </button>
        </div>
      </div>
    </div>
  )
}