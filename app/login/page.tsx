'use client'
import Logo from '../components/Logo'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Compte créé ! Vérifiez votre email pour confirmer.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        const { data: vendeur } = await supabase
          .from('vendeurs')
          .select('id')
          .eq('email', email)
          .single()

        if (vendeur) {
          window.location.href = '/'
        } else {
          const { data: affilie } = await supabase
            .from('affilies')
            .select('id')
            .eq('email', email)
            .single()

          if (affilie) {
            window.location.href = '/affilie'
          } else {
            window.location.href = '/onboarding'
          }
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#F5F0E8'}}>
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <Logo size="md" />
          <p className="text-sm text-stone-500 mt-4">Créez votre programme d'affiliation</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-8">

          <div className="flex mb-6 bg-stone-100 rounded-lg p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${mode === 'login' ? 'bg-white text-stone-900' : 'text-stone-500'}`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 text-sm py-1.5 rounded-md transition-all ${mode === 'signup' ? 'bg-white text-stone-900 font-medium' : 'text-stone-500'}`}
            >
              Inscription
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="sophie@maboutique.fr"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-400"
                style={{background: '#FDFAF5'}}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-400"
                  style={{background: '#FDFAF5', paddingRight: '40px'}}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div className={`text-xs text-center py-2 px-3 rounded-lg border ${message.includes('Compte créé') || message.includes('envoyé') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-50 text-stone-600 border-stone-200'}`}>
                {message}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-stone-900 text-white text-sm font-medium py-2.5 rounded-lg mt-2 cursor-pointer hover:bg-stone-700 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </div>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-stone-100"></div>
            <span className="text-xs text-stone-400">ou</span>
            <div className="flex-1 h-px bg-stone-100"></div>
          </div>

          <p
            onClick={async () => {
              if (!email) { setMessage("Entrez votre email d'abord"); return }
              await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://www.affilybase.com/reset-password'
              })
              setMessage('Email de réinitialisation envoyé !')
            }}
            className="text-center text-xs text-stone-400 cursor-pointer hover:text-stone-600"
          >
            Mot de passe oublié ?
          </p>

        </div>

        <p className="text-center text-xs text-stone-400 mt-6">
          En vous connectant, vous acceptez nos{' '}
          <a href="/cgu" className="underline cursor-pointer">conditions d'utilisation</a>
        </p>

      </div>
    </div>
  )
}