import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia'
})

export async function POST(request: Request) {
  try {
    const { plan } = await request.json()

    const prices: Record<string, number> = {
      starter: 900,
      pro: 3900,
      business: 7900
    }

    const planNames: Record<string, string> = {
      starter: 'Affily Starter',
      pro: 'Affily Pro',
      business: 'Affily Business'
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: planNames[plan],
            },
            unit_amount: prices[plan],
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:3000/abonnement?success=true`,
      cancel_url: `http://localhost:3000/abonnement?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}