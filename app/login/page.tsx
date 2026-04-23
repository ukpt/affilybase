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

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Compte créé ! Vérifiez votre email pour confirmer.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else window.location.href = '/'
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
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-400"
                style={{background: '#FDFAF5'}}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-400"
                style={{background: '#FDFAF5'}}
              />
            </div>

            {message && (
              <div className="text-xs text-center py-2 px-3 rounded-lg bg-stone-50 text-stone-600 border border-stone-200">
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

          <p className="text-center text-xs text-stone-400 cursor-pointer hover:text-stone-600">
            Mot de passe oublié ?
          </p>

        </div>

        <p className="text-center text-xs text-stone-400 mt-6">
          En vous connectant, vous acceptez nos{' '}
          <span className="underline cursor-pointer">conditions d'utilisation</span>
        </p>

      </div>
    </div>
  )
}