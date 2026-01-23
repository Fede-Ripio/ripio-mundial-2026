import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
    }

    const invite_code = Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data: league, error: leagueError } = await supabase
      .from('leagues')
      .insert({
        name: name.trim(),
        is_public: false,
        owner_id: user.id,
        invite_code
      })
      .select()
      .single()

    if (leagueError) throw leagueError

    const { error: memberError } = await supabase
      .from('league_members')
      .insert({
        league_id: league.id,
        user_id: user.id,
        role: 'owner'
      })

    if (memberError) throw memberError

    return NextResponse.json({ league })
  } catch (error: any) {
    console.error('Error creating league:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
