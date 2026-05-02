'use client'
import { useState } from 'react'
import Logo from './Logo'
import { supabase } from '../lib/supabase'

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

export default function Sidebar({ active, email }: { active: string, email?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <div className="w-52 bg-white border-r border-stone-200 flex-col py-5 hidden md:flex" style={{ minHeight: '100vh' }}>
        <div className="px-5 pb-6"><Logo size="sm" /></div>
        <nav className="flex flex-col">
          {menuItems.map(({ label, href }) => (
            <a key={href} href={href} className={`px-5 py-2 text-sm flex items-center gap-2 cursor-pointer hover:text-stone-900 ${label === active ? 'text-stone-900 font-medium bg-stone-100 border-l-2 border-stone-900' : 'text-stone-500'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 inline-block"></span>
              {label}
            </a>
          ))}
        </nav>
        {email && (
          <div className="mt-auto px-5 pb-4">
            <div className="text-xs text-stone-400 mb-1">Connecté en tant que</div>
            <div className="text-xs text-stone-600 font-medium truncate">{email}</div>
            <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} className="mt-3 text-xs text-stone-400 hover:text-stone-600 cursor-pointer">
              Se déconnecter
            </button>
          </div>
        )}
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-white border-b border-stone-200 flex items-center justify-between px-4 py-3 fixed top-0 left-0 right-0 z-50">
        <Logo size="sm" />
        <button onClick={() => setOpen(!open)} style={{ display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer', background: 'none', border: 'none', padding: '4px' }}>
          <span style={{ width: '20px', height: '2px', background: '#1a1a1a', borderRadius: '2px', display: 'block', transition: 'all 0.2s', transform: open ? 'rotate(45deg) translateY(6px)' : 'none' }}></span>
          <span style={{ width: '20px', height: '2px', background: '#1a1a1a', borderRadius: '2px', display: 'block', transition: 'all 0.2s', opacity: open ? 0 : 1 }}></span>
          <span style={{ width: '20px', height: '2px', background: '#1a1a1a', borderRadius: '2px', display: 'block', transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translateY(-6px)' : 'none' }}></span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={() => setOpen(false)}>
          <div style={{ background: '#fff', width: '260px', height: '100%', padding: '70px 0 20px' }} onClick={e => e.stopPropagation()}>
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {menuItems.map(({ label, href }) => (
                <a key={href} href={href} style={{ padding: '12px 20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', background: label === active ? '#F5F2EC' : 'transparent', color: label === active ? '#1a1a1a' : '#888', fontWeight: label === active ? 500 : 400, borderLeft: label === active ? '2px solid #1a1a1a' : '2px solid transparent' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', opacity: label === active ? 1 : 0.4, display: 'inline-block', flexShrink: 0 }}></span>
                  {label}
                </a>
              ))}
            </nav>
            {email && (
              <div style={{ padding: '20px', borderTop: '0.5px solid #ddd8ce', marginTop: 'auto' }}>
                <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px' }}>Connecté en tant que</div>
                <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</div>
                <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} style={{ fontSize: '12px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile spacer */}
      <div className="md:hidden" style={{ height: '53px' }}></div>
    </>
  )
}