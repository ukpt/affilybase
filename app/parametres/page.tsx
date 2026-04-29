'use client'
import Logo from '../components/Logo'
export default function Parametres() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F2EC' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '0.5px solid #ddd8ce', background: '#fff' }}>
        <Logo size="sm" />
        <a href="/" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>← Dashboard</a>
      </nav>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '1rem' }}>Paramètres</h1>
        <p style={{ color: '#888', fontSize: '14px' }}>Fonctionnalité disponible prochainement.</p>
      </div>
    </div>
  )
}