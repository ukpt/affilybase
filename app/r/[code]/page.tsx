import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function RedirectCode({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const upperCode = code.toUpperCase()

  const { data } = await supabase
    .from('codes')
    .select('*, vendeurs(*)')
    .eq('code', upperCode)
    .single()

  if (!data) redirect('/landing')

  const shopifyUrl = data.vendeurs?.shopify_url
  const autreUrl = data.vendeurs?.autre_url

  // Mode Shopify
  if (shopifyUrl) {
    redirect(`${shopifyUrl}?discount=${upperCode}`)
  }

  // Mode Autre / Sans boutique
  if (autreUrl) {
    const url = autreUrl.startsWith('http') ? autreUrl : `https://${autreUrl}`
    redirect(`${url}?ref=${upperCode}`)
  }

  // Aucune URL configurée
  redirect('/landing')
}