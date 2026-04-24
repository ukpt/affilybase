import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function RedirectCode({ params }: { params: { code: string } }) {
  const { data } = await supabase
    .from('codes')
    .select('*, vendeurs(*)')
    .eq('code', params.code.toUpperCase())
    .single()

  if (!data || !data.vendeurs?.shopify_url) {
    redirect('/')
  }

  const url = `${data.vendeurs.shopify_url}?discount=${params.code.toUpperCase()}`
  redirect(url)
}