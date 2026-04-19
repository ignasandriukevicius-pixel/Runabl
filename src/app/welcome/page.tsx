import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function WelcomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'COACH') {
    redirect('/coach')
  } else if (profile?.role === 'ATHLETE') {
    redirect('/athlete')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Loading...</h1>
    </div>
  )
}
