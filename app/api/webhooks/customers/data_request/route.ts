import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const hmac = req.headers.get('x-shopify-hmac-sha256') || ''
  const secret = process.env.SHOPIFY_API_SECRET || ''
  
  const hash = crypto.createHmac('sha256', secret).update(body).digest('base64')
  if (hash !== hmac) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  console.log('Customer data request received')
  return NextResponse.json({ success: true }, { status: 200 })
}