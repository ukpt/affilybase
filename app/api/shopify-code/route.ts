import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { code, remise_pct } = await request.json()

  const shop = process.env.SHOPIFY_SHOP
  const token = process.env.SHOPIFY_ACCESS_TOKEN

  console.log('SHOP:', shop)
  console.log('TOKEN début:', token?.substring(0, 15))

  const response = await fetch(
    `https://${shop}/admin/api/2024-01/price_rules.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token!
      },
      body: JSON.stringify({
        price_rule: {
          title: code,
          target_type: 'line_item',
          target_selection: 'all',
          allocation_method: 'across',
          value_type: 'percentage',
          value: `-${remise_pct}`,
          customer_selection: 'all',
          starts_at: new Date().toISOString()
        }
      })
    }
  )

  const priceRule = await response.json()
  console.log('Shopify response:', JSON.stringify(priceRule))

  if (!priceRule.price_rule) {
    return NextResponse.json({ error: JSON.stringify(priceRule) }, { status: 400 })
  }

  const priceRuleId = priceRule.price_rule.id

  const codeResponse = await fetch(
    `https://${shop}/admin/api/2024-01/price_rules/${priceRuleId}/discount_codes.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token!
      },
      body: JSON.stringify({
        discount_code: { code }
      })
    }
  )

  const discountCode = await codeResponse.json()

  if (!discountCode.discount_code) {
    return NextResponse.json({ error: JSON.stringify(discountCode) }, { status: 400 })
  }

  return NextResponse.json({ success: true, code })
}