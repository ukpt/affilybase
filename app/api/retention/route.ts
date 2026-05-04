import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const maintenant = new Date()
  const j29Min = new Date(maintenant)
  const j29Max = new Date(maintenant)
  j29Min.setDate(j29Min.getDate() - 30)
  j29Max.setDate(j29Max.getDate() - 29)

  const { data: vendeurs } = await supabase
    .from('vendeurs')
    .select('*, codes(*), ventes(*)')
    .eq('plan', 'free')
    .gte('created_at', j29Min.toISOString())
    .lte('created_at', j29Max.toISOString())

  if (!vendeurs || vendeurs.length === 0) {
    return NextResponse.json({ message: 'Aucun vendeur à relancer', count: 0 })
  }

  let envoyes = 0

  for (const vendeur of vendeurs) {
    const aDesVentes = vendeur.ventes && vendeur.ventes.length > 0

    if (aDesVentes) {
      await resend.emails.send({
        from: 'Affilybase <noreply@affilybase.com>',
        to: vendeur.email,
        subject: '🎉 Félicitations — vous avez généré vos premières ventes !',
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; background: #F5F2EC; padding: 24px; border-radius: 12px;">
            <div style="text-align: center; padding: 24px 0 20px;">
              <div style="font-size: 22px; font-weight: 600; letter-spacing: 0.02em;">Affily</div>
              <div style="font-size: 10px; letter-spacing: 0.2em; color: #888; font-weight: 400;">BASE</div>
            </div>

            <div style="background: #fff; border: 0.5px solid #ddd8ce; border-radius: 12px; padding: 32px;">
              <h1 style="font-size: 20px; font-weight: 500; margin-bottom: 8px; margin-top: 0;">Votre programme fonctionne ! 🚀</h1>
              <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 20px;">
                Bonjour ${vendeur.nom || vendeur.email},<br><br>
                Votre période d'essai gratuite se termine dans <strong>1 jour</strong>. Et bonne nouvelle — votre programme d'affiliation a déjà généré des ventes !<br><br>
                Pourquoi s'arrêter là ? La visibilité en ligne est la base de toute vente sur internet. Plus vos affiliés partagent votre boutique, plus vous touchez de nouveaux clients — sans dépenser un euro en publicité. Affilybase est conçu pour vous aider à faire connaître votre boutique au plus grand nombre, grâce à un réseau d'ambassadeurs qui parlent de vous chaque jour.
              </p>

              <div style="background: #E1F5EE; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <div style="font-size: 13px; font-weight: 500; color: #085041; margin-bottom: 4px;">Continuez sur votre lancée</div>
                <div style="font-size: 13px; color: #0F6E56; line-height: 1.6;">
                  Passez au plan <strong>Starter à 4.99€/mois</strong> pour continuer à utiliser Affilybase et garder tous vos affiliés actifs. Ou optez pour le plan <strong>Pro à 9.99€/mois</strong> pour gérer jusqu'à 50 codes.
                </div>
              </div>

              <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                <div style="flex: 1; background: #F5F2EC; border-radius: 8px; padding: 16px; text-align: center; border: 0.5px solid #ddd8ce;">
                  <div style="font-size: 13px; font-weight: 500; margin-bottom: 4px;">Starter</div>
                  <div style="font-size: 22px; font-weight: 500; color: #1D9E75; margin-bottom: 4px;">4.99€</div>
                  <div style="font-size: 12px; color: #888;">par mois · 20 codes</div>
                </div>
                <div style="flex: 1; background: #F5F2EC; border-radius: 8px; padding: 16px; text-align: center; border: 0.5px solid #ddd8ce;">
                  <div style="font-size: 13px; font-weight: 500; margin-bottom: 4px;">Pro</div>
                  <div style="font-size: 22px; font-weight: 500; color: #1D9E75; margin-bottom: 4px;">9.99€</div>
                  <div style="font-size: 12px; color: #888;">par mois · 50 codes</div>
                </div>
              </div>

              <a href="https://affilybase.com/abonnement" style="display: block; text-align: center; background: #1a1a1a; color: #fff; text-decoration: none; border-radius: 8px; padding: 14px; font-size: 14px; font-weight: 500;">
                Choisir mon plan →
              </a>
            </div>

            <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 24px;">
              © 2026 Affilybase — <a href="https://affilybase.com/confidentialite" style="color: #aaa;">Confidentialité</a>
            </p>
          </div>
        `
      })
    } else {
      const nouvelleDate = new Date()
      nouvelleDate.setDate(nouvelleDate.getDate() + 30)

      await supabase.from('vendeurs')
        .update({ free_trial_end: nouvelleDate.toISOString() })
        .eq('id', vendeur.id)

      await resend.emails.send({
        from: 'Affilybase <noreply@affilybase.com>',
        to: vendeur.email,
        subject: '🎁 On vous offre 30 jours supplémentaires gratuits',
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; background: #F5F2EC; padding: 24px; border-radius: 12px;">
            <div style="text-align: center; padding: 24px 0 20px;">
              <div style="font-size: 22px; font-weight: 600; letter-spacing: 0.02em;">Affily</div>
              <div style="font-size: 10px; letter-spacing: 0.2em; color: #888; font-weight: 400;">BASE</div>
            </div>

            <div style="background: #fff; border: 0.5px solid #ddd8ce; border-radius: 12px; padding: 32px;">
              <h1 style="font-size: 20px; font-weight: 500; margin-bottom: 8px; margin-top: 0;">Un cadeau pour vous lancer 🎁</h1>
              <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 20px;">
                Bonjour ${vendeur.nom || vendeur.email},<br><br>
                Votre période d'essai gratuite se termine demain. On sait que lancer un programme d'affiliation prend du temps — c'est pourquoi on vous offre <strong>30 jours supplémentaires gratuits</strong> pour trouver vos premiers affiliés.
              </p>

              <div style="background: #E1F5EE; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
                <div style="font-size: 13px; color: #085041; margin-bottom: 4px;">Votre nouveau délai gratuit</div>
                <div style="font-size: 22px; font-weight: 500; color: #1D9E75;">30 jours offerts ✓</div>
                <div style="font-size: 12px; color: #0F6E56; margin-top: 4px;">Aucune carte bancaire requise</div>
              </div>

              <div style="margin-bottom: 24px;">
                <div style="font-size: 13px; font-weight: 500; margin-bottom: 12px; color: #1a1a1a;">Quelques idées pour démarrer :</div>
                <div style="display: flex; gap: 10px; margin-bottom: 10px; font-size: 13px; color: #555; align-items: flex-start;">
                  <span>🏪</span>
                  <span>Contactez des boutiques complémentaires sur Instagram pour échanger des codes</span>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 10px; font-size: 13px; color: #555; align-items: flex-start;">
                  <span>📱</span>
                  <span>Approchez un micro-influenceur dans votre niche avec une proposition simple</span>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 10px; font-size: 13px; color: #555; align-items: flex-start;">
                  <span>👥</span>
                  <span>Invitez vos 3 meilleurs clients à devenir affiliés</span>
                </div>
              </div>

              <a href="https://affilybase.com" style="display: block; text-align: center; background: #1a1a1a; color: #fff; text-decoration: none; border-radius: 8px; padding: 14px; font-size: 14px; font-weight: 500;">
                Accéder à mon tableau de bord →
              </a>
            </div>

            <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 24px;">
              © 2026 Affilybase — <a href="https://affilybase.com/confidentialite" style="color: #aaa;">Confidentialité</a>
            </p>
          </div>
        `
      })
    }

    envoyes++
  }

  return NextResponse.json({ message: `${envoyes} email(s) envoyé(s)`, count: envoyes })
}