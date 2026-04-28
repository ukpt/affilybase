import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const SECRET = process.env.SHOPIFY_API_SECRET || ''

function verifyHmac(body: string, hmacHeader: string): boolean {
  const hash = crypto
    .createHmac('sha256', SECRET)
    .update(body, 'utf8')
    .digest('base64')
  return hash === hmacHeader
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const hmac = req.headers.get('x-shopify-hmac-sha256') || ''
  const topic = req.headers.get('x-shopify-topic') || ''

  if (!verifyHmac(body, hmac)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  switch (topic) {
    case 'customers/data_request':
    case 'customers/redact':
    case 'shop/redact':
      console.log(`Webhook reçu: ${topic}`)
      break
    default:
      console.log(`Webhook non géré: ${topic}`)
  }

  return NextResponse.json({ success: true }, { status: 200 })
}