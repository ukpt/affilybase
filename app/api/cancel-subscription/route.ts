import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { vendeurId } = await req.json()

  try {
    const { data: vendeur } = await supabaseAdmin
      .from('vendeurs')
      .select('stripe_subscription_id')
      .eq('id', vendeurId)
      .single()

    if (!vendeur?.stripe_subscription_id) {
      return NextResponse.json({ error: 'Aucun abonnement trouvé' }, { status: 400 })
    }

    await stripe.subscriptions.update(vendeur.stripe_subscription_id, {
      cancel_at_period_end: true
    })

    await supabaseAdmin
      .from('vendeurs')
      .update({ plan_cancel_at_period_end: true })
      .eq('id', vendeurId)

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}