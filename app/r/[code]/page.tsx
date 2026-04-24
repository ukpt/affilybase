import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
  params: { code: string }
}

export default async function RedirectCode({ params }: Props) {
  const code = params.code.toUpperCase()

  const { data } = await supabase
    .from('codes')
    .select('*, vendeurs(*)')
    .eq('code', code)
    .single()

  if (!data) redirect('/landing')
  
  const shopifyUrl = data.vendeurs?.shopify_url
  if (!shopifyUrl) redirect('/landing')

  redirect(`${shopifyUrl}?discount=${code}`)
}