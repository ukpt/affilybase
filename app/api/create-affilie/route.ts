import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  const { email, nom } = await req.json()

  try {
    // Créer le compte Auth pour l'affilié
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/affilie`
    })

    if (authError && !authError.message.includes('already been invited') && !authError.message.includes('already registered')) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Envoyer l'email via Resend
    await resend.emails.send({
      from: 'Affilybase <noreply@affilybase.com>',
      to: email,
      subject: 'Vous avez été invité à rejoindre un programme d\'affiliation 🎉',
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; background: #F5F2EC;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 0;">Affily<br><span style="font-size: 10px; letter-spacing: 6px; font-weight: 400; color: #888;">BASE</span></h1>
          </div>
          
          <div style="background: #fff; border-radius: 12px; padding: 32px; border: 0.5px solid #ddd8ce;">
            <h2 style="font-size: 20px; font-weight: 500; color: #1a1a1a; margin-bottom: 16px;">Bienvenue dans le programme d'affiliation ! 🎉</h2>
            
            <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 16px;">
              Bonjour <strong>${nom}</strong> 👋
            </p>
            
            <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 16px;">
              Super nouvelle — vous venez d'être invité(e) à rejoindre un programme d'affiliation sur <strong>Affilybase</strong> !
            </p>
            
            <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 24px;">
              Votre espace affilié vous permet de :
            </p>
            
            <ul style="font-size: 14px; color: #555; line-height: 2; margin-bottom: 24px; padding-left: 20px;">
              <li>Accéder à votre code promo personnel</li>
              <li>Suivre vos ventes et commissions en temps réel</li>
              <li>Partager votre lien d'affiliation sur vos réseaux</li>
            </ul>
            
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/affilie" 
                style="background: #1D9E75; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
                Accéder à mon espace affilié
              </a>
            </div>
            
            <p style="font-size: 12px; color: #aaa; text-align: center; line-height: 1.6;">
              Si vous n'attendiez pas cette invitation, ignorez simplement cet email.
            </p>
          </div>
          
          <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 24px;">
            © 2025 Affilybase — Tous droits réservés
          </p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}