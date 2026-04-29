'use client'
import Logo from '../components/Logo'

const menuItems = [
  { label: 'Tableau de bord', href: '/' },
  { label: 'Mes codes', href: '/mes-codes' },
  { label: 'Affiliés', href: '/affilies' },
  { label: 'Stats', href: '/stats' },
  { label: 'Paiements', href: '/paiements' },
  { label: 'Boutiques', href: '/boutiques' },
  { label: 'Support', href: '/support' },
  { label: 'Paramètres', href: '/parametres' },
]

export default function Parametres() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F2EC' }}>
      <div className="w-52 bg-white border-r border-stone-200 flex flex-col py-5">
        <div className="px-5 pb-6"><Logo size="sm" /></div>
        <nav className="flex flex-col">
          <div className="px-5 py-2 text-sm font-medium text-stone-900 bg-stone-100 border-l-2 border-stone-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-900 inline-block"></span>
            Paramètres
          </div>
          {menuItems.filter(i => i.label !== 'Paramètres').map(({ label, href }) => (
            <a key={href} href={href} className="px-5 py-2 text-sm text-stone-500 flex items-center gap-2 hover:text-stone-900">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 inline-block"></span>
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div style={{ flex: 1, padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '1rem' }}>Paramètres</h1>
        <p style={{ color: '#888', fontSize: '14px' }}>Fonctionnalité disponible prochainement.</p>
      </div>
    </div>
  )
}