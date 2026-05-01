'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
  }, [])

  const handleReset = async () => {
    if (!password || password !== confirm) {
      setMessage('Les mots de passe ne correspondent pas')
      return
    }
    if (password.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Mot de passe mis à jour avec succès !')
      setTimeout(() => window.location.href = '/', 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F0E8' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="md" />
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-8">
          <h1 className="text-base font-medium text-stone-900 mb-1">Nouveau mot de passe</h1>
          <p className="text-sm text-stone-500 mb-6">Choisissez un nouveau mot de passe pour votre compte.</p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">Nouveau mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-400"
                style={{ background: '#FDFAF5' }}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-400"
                style={{ background: '#FDFAF5' }}
              />
            </div>

            {message && (
              <div className={`text-xs text-center py-2 px-3 rounded-lg border ${message.includes('succès') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
                {message}
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-stone-900 text-white text-sm font-medium py-2.5 rounded-lg mt-2 cursor-pointer hover:bg-stone-700 disabled:opacity-50"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}