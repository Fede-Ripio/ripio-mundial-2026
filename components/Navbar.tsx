import { createServerSupabaseClient } from '@/lib/supabase-server'
import NavbarClient from './NavbarClient'

export default async function Navbar() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { display_name: string | null; avatar_url: string | null } | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return <NavbarClient user={user} profile={profile} />
}
