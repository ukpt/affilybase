import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_PRICE_STARTER!]: 'starter',
  [process.env.STRIPE_PRICE_PRO!]: 'pro',
  [process.env.STRIPE_PRICE_BUSINESS!]: 'business',
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const subscription = event.data.object as Stripe.Subscription

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const priceId = subscription.items.data[0]?.price.id
      const plan = PRICE_TO_PLAN[priceId] || 'free'
      const customerId = subscription.customer as string

      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
      const email = customer.email

      if (email) {
        await supabaseAdmin.from('vendeurs').update({
          plan,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: customerId,
          plan_cancel_at_period_end: subscription.cancel_at_period_end,
        }).eq('email', email)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const customerId = subscription.customer as string
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
      const email = customer.email

      if (email) {
        await supabaseAdmin.from('vendeurs').update({
          plan: 'free',
          stripe_subscription_id: null,
          plan_cancel_at_period_end: false,
        }).eq('email', email)
      }
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
      const email = customer.email

      if (email && invoice.subscription) {
        await supabaseAdmin.from('vendeurs').update({
          plan_cancel_at_period_end: false,
        }).eq('email', email)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}