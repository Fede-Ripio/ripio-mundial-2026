import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { match_id, home_goals, away_goals } = await request.json()

    if (!match_id || home_goals === undefined || away_goals === undefined) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Verificar que el partido no haya empezado
    const { data: match } = await supabase
      .from('matches')
      .select('kickoff_at, status')
      .eq('id', match_id)
      .single()

    if (!match) {
      return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
    }

    // Si tiene kickoff_at, verificar que no haya empezado
    if (match.kickoff_at) {
      const now = new Date()
      const kickoff = new Date(match.kickoff_at)
      
      if (now >= kickoff) {
        return NextResponse.json({ error: 'El partido ya comenzó' }, { status: 403 })
      }
    }

    // Si el partido está en vivo o finalizado, bloquear
    if (match.status === 'live' || match.status === 'finished') {
      return NextResponse.json({ error: 'El partido ya comenzó o finalizó' }, { status: 403 })
    }

    // Upsert predicción
    const { data: prediction, error } = await supabase
      .from('predictions')
      .upsert({
        user_id: user.id,
        match_id,
        home_goals: parseInt(home_goals),
        away_goals: parseInt(away_goals),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,match_id'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ prediction })
  } catch (error: any) {
    console.error('Error saving prediction:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('match_id')

    // --- Pronósticos de TODOS para un partido (público después del kickoff) ---
    if (matchId) {
      const { data: match } = await supabase
        .from('matches')
        .select('kickoff_at, status, home_score, away_score')
        .eq('id', matchId)
        .single()

      if (!match) {
        return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
      }

      const kickoff = match.kickoff_at ? new Date(match.kickoff_at) : null
      const hasStarted =
        (kickoff && new Date() >= kickoff) ||
        match.status === 'live' ||
        match.status === 'finished'

      if (!hasStarted) {
        return NextResponse.json({ error: 'El partido aún no comenzó' }, { status: 403 })
      }

      const { data: predictions } = await supabase
        .from('predictions')
        .select('user_id, home_goals, away_goals, profiles(display_name)')
        .eq('match_id', matchId)
        .order('home_goals', { ascending: false })

      return NextResponse.json({
        predictions: predictions || [],
        match: {
          home_score: match.home_score,
          away_score: match.away_score,
          status: match.status,
        },
      })
    }

    // --- Pronósticos del usuario actual ---
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data: predictions } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', user.id)

    return NextResponse.json({ predictions: predictions || [] })
  } catch (error: any) {
    console.error('Error fetching predictions:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
