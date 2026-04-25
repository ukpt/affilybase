'use client'
import { useState } from 'react'

export default function Contact() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [envoye, setEnvoye] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation envoi — à connecter à un service email plus tard
    setEnvoye(true)
  }

  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem', color: '#1a1a1a', background: '#F5F2EC', minHeight: '100vh' }}>
      
      <a href="/landing" style={{ fontSize: '13px', color: '#888', textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>← Retour</a>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '22px', fontWeight: 700 }}>Affily</span>
        <div style={{ width: '100%', height: '1px', background: '#1a1a1a', margin: '3px 0' }} />
        <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Base</span>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '0.5rem' }}>Contact</h1>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '2rem', lineHeight: 1.7 }}>
        Une question, un problème ou une suggestion ? On vous répond sous 24h.
      </p>

      {envoye ? (
        <div style={{ background: '#E1F5EE', borderRadius: '10px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '0.5rem', color: '#0F6E56' }}>Message envoyé !</h2>
          <p style={{ fontSize: '14px', color: '#085041' }}>Nous vous répondrons dans les 24 heures.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Nom</label>
            <input
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)}
              placeholder="Votre nom"
              style={{ width: '100%', padding: '0.75rem', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '14px', fontFamily: 'Georgia, serif', background: '#F5F2EC', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{ width: '100%', padding: '0.75rem', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '14px', fontFamily: 'Georgia, serif', background: '#F5F2EC', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Décrivez votre question ou problème..."
              rows={5}
              style={{ width: '100%', padding: '0.75rem', border: '0.5px solid #ddd8ce', borderRadius: '6px', fontSize: '14px', fontFamily: 'Georgia, serif', background: '#F5F2EC', outline: 'none', resize: 'vertical' }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!nom || !email || !message}
            style={{ background: nom && email && message ? '#2D9B6F' : '#ccc', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.85rem 1.5rem', fontSize: '14px', fontWeight: 500, cursor: nom && email && message ? 'pointer' : 'not-allowed', width: '100%' }}
          >
            Envoyer le message
          </button>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#fff', border: '0.5px solid #ddd8ce', borderRadius: '10px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '1rem' }}>Autres moyens de nous contacter</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '13px', color: '#555' }}>📧 Email : <span style={{ color: '#2D9B6F' }}>contact@affilybase.com</span></div>
          <div style={{ fontSize: '13px', color: '#555' }}>⏱ Temps de réponse moyen : moins de 24h</div>
          <div style={{ fontSize: '13px', color: '#555' }}>🕐 Support disponible : lun–ven, 9h–18h</div>
        </div>
      </div>

    </main>
  )
}