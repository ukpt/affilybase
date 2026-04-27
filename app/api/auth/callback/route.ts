import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const shop = searchParams.get('shop')
  const code = searchParams.get('code')

  if (!shop || !code) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    // Échange du code contre un access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    })

    const { access_token } = await tokenResponse.json()

    // Enregistrement des webhooks de conformité
    const webhooks = [
      { topic: 'customers/data_request', address: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/customers/data_request` },
      { topic: 'customers/redact', address: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/customers/redact` },
      { topic: 'shop/redact', address: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/shop/redact` },
    ]

    for (const webhook of webhooks) {
      await fetch(`https://${shop}/admin/api/2026-04/webhooks.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': access_token,
        },
        body: JSON.stringify({ webhook: { topic: webhook.topic, address: webhook.address, format: 'json' } }),
      })
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}