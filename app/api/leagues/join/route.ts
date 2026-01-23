import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { invite_code } = await request.json()

    if (!invite_code || invite_code.trim() === '') {
      return NextResponse.json({ error: 'Código requerido' }, { status: 400 })
    }

    const { data: league, error: leagueError } = await supabase
      .from('leagues')
      .select('*')
      .eq('invite_code', invite_code.toUpperCase().trim())
      .single()

    if (leagueError || !league) {
      return NextResponse.json({ error: 'Código inválido' }, { status: 404 })
    }

    const { data: existing } = await supabase
      .from('league_members')
      .select('*')
      .eq('league_id', league.id)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Ya estás en esta liga' }, { status: 400 })
    }

    const { error: memberError } = await supabase
      .from('league_members')
      .insert({
        league_id: league.id,
        user_id: user.id,
        role: 'member'
      })

    if (memberError) throw memberError

    return NextResponse.json({ league })
  } catch (error: any) {
    console.error('Error joining league:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
