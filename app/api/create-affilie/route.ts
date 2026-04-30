import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { email, nom, vendeurId, code, commissionPct, remisePct } = await req.json()

  try {
    // Créer le compte Auth pour l'affilié
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      password: Math.random().toString(36).slice(-10) + 'Aa1!',
    })

    if (authError && !authError.message.includes('already been registered')) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Envoyer un magic link pour que l'affilié définisse son accès
    await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.affilybase.com'}/affilie`
      }
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}