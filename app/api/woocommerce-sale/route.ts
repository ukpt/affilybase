import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const vendeurId = request.headers.get('X-Vendeur-ID')
    const secret = request.headers.get('X-Secret')

    if (!vendeurId) {
      return NextResponse.json({ error: 'Vendeur ID manquant' }, { status: 401 })
    }

    // Vérifier le secret
    const { data: vendeur } = await supabase
      .from('vendeurs')
      .select('id, webhook_secret')
      .eq('id', vendeurId)
      .single()

    if (!vendeur) {
      return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 })
    }

    const body = await request.json()
    const { code, montant, order_id } = body

    if (!code || !montant) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    // Trouver le code affilié
    const { data: codeData } = await supabase
      .from('codes')
      .select('id, commission_pct, affilie_id')
      .eq('vendeur_id', vendeurId)
      .eq('code', code.toUpperCase())
      .eq('actif', true)
      .single()

    if (!codeData) {
      return NextResponse.json({ error: 'Code introuvable' }, { status: 404 })
    }

    // Calculer la commission
    const commission = (montant * codeData.commission_pct) / 100

    // Enregistrer la vente
    await supabase.from('ventes').insert({
      code_id: codeData.id,
      montant: montant,
      commission: commission,
      payee: false,
      source: 'woocommerce',
      order_id: order_id?.toString()
    })

    return NextResponse.json({ success: true, commission })

  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}