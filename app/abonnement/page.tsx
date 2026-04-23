'use client'

import { useState } from 'react'

export default function Abonnement() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: string) => {
    if (plan === 'free') {
      window.location.href = '/login'
      return
    }
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur : ' + (data.error || 'inconnue'))
      }
    } catch (e) {
      alert('Erreur de connexion')
    }
    setLoading(null)
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0€',
      period: '1 mois',
      description: 'Pour découvrir Affilybase',
      features: ['1 code actif', '1 affilié', 'Lien court personnalisé', 'Dashboard brandé', 'Paiement automatique affilié', 'Valable 1 mois'],
      cta: 'Commencer gratuitement',
      highlight: false,
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '4.90€',
      period: '/mois',
      description: 'Pour démarrer simplement',
      features: ['20 codes actifs', '20 affiliés', 'Lien court personnalisé', 'Dashboard brandé', 'Paiement automatique affilié', 'Support email'],
      cta: 'Choisir Starter',
      highlight: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '9.90€',
      period: '/mois',
      description: 'Pour développer son réseau',
      features: ['50 codes actifs', '50 affiliés', 'Lien court personnalisé', 'Dashboard brandé', 'Paiement automatique affilié', 'Analytics avancés', 'Support prioritaire'],
      cta: 'Choisir Pro',
      highlight: true,
    },
    {
      id: 'business',
      name: 'Business',
      price: '39.90€',
      period: '/mois',
      description: 'Pour scaler sans limites',
      features: ['Codes illimités', 'Affiliés illimités', 'Lien court personnalisé', 'Dashboard brandé', 'Paiement automatique affilié', 'Analytics avancés', 'Multi-boutiques', 'Support dédié'],
      cta: 'Choisir Business',
      highlight: false,
    },
  ]

  return (
    <div className="min-h-screen py-16 px-6" style={{background: '#F5F0E8'}}>
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <div className="inline-flex flex-col items-center mb-6">
            <span style={{fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', color: '#1A1814', letterSpacing: '-1px'}}>Affily</span>
            <div style={{width: '80px', height: '1.5px', background: '#1A1814', opacity: 0.15, margin: '4px 0'}}></div>
            <span style={{fontFamily: 'var(--font-sans)', fontSize: '10px', color: '#7A7468', letterSpacing: '6px'}}>BASE</span>
          </div>
          <h1 className="text-2xl font-medium text-stone-900 mb-3">Choisissez votre plan</h1>
          <p className="text-stone-500 text-sm">Commencez gratuitement — passez à un plan payant quand vous êtes prêt</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {plans.map(plan => (
            <div
              key={plan.id}
              className="rounded-2xl p-5 flex flex-col"
              style={{
                background: 'white',
                border: plan.highlight ? '2px solid #1A1814' : '0.5px solid #DDD8CE',
              }}
            >
              {plan.highlight && (
                <div className="text-xs font-medium text-center mb-3" style={{color: '#1A1814', letterSpacing: '2px'}}>POPULAIRE</div>
              )}

              <div className="mb-4">
                <div className="text-sm font-medium mb-1" style={{color: '#1A1814'}}>{plan.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-medium" style={{color: '#1A1814'}}>{plan.price}</span>
                  <span className="text-xs" style={{color: '#A8A099'}}>{plan.period}</span>
                </div>
                <div className="text-xs mt-1" style={{color: '#A8A099'}}>{plan.description}</div>
              </div>

              <div className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs" style={{color: '#5A5450'}}>
                    <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{background: '#EAF3DE', color: '#3B6D11', fontSize: '9px'}}>✓</div>
                    {f}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
                className="w-full text-sm font-medium py-2.5 rounded-lg cursor-pointer disabled:opacity-50"
                style={{
                  background: plan.highlight ? '#1A1814' : 'transparent',
                  color: plan.highlight ? '#F5F0E8' : '#1A1814',
                  border: plan.highlight ? 'none' : '0.5px solid #DDD8CE',
                }}
              >
                {loading === plan.id ? 'Chargement...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-stone-400 mt-8">
          Paiement sécurisé par Stripe · Annulation à tout moment · Sans engagement
        </p>

      </div>
    </div>
  )
}