import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const CRON_SECRET = process.env.CRON_SECRET || 'change-me-in-production'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return await syncResults()
  } catch (error: any) {
    console.error('[CRON ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const host = request.headers.get('host')
  const userAgent = request.headers.get('user-agent') || ''
  
  if (!userAgent.includes('vercel-cron') && !host?.includes('vercel.app')) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  return await syncResults()
}

async function syncResults() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const logs: string[] = []
  let updatedCount = 0

  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('id, match_number, home_team, away_team, kickoff_at, status')
    .gte('kickoff_at', yesterday.toISOString())
    .lte('kickoff_at', tomorrow.toISOString())
    .in('status', ['scheduled', 'live'])
    .order('match_number', { ascending: true })

  if (matchesError) {
    logs.push(`Error DB: ${matchesError.message}`)
    return NextResponse.json({ error: matchesError.message, logs }, { status: 500 })
  }

  if (!matches || matches.length === 0) {
    logs.push(`No hay partidos en ventana activa`)
    return NextResponse.json({ 
      message: 'No hay partidos activos',
      synced: 0,
      logs
    })
  }

  logs.push(`${matches.length} partidos en ventana activa`)

  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) {
    logs.push('API_FOOTBALL_KEY no configurada')
    return NextResponse.json({ error: 'API_FOOTBALL_KEY no configurada', logs }, { status: 500 })
  }

  const LEAGUE_ID = 1
  const SEASON = 2022

  const apiUrl = `https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID}&season=${SEASON}`
  
  logs.push(`Consultando API-Football Mundial ${SEASON}`)

  const apiResponse = await fetch(apiUrl, {
    headers: {
      'x-apisports-key': apiKey,
    },
  })

  if (!apiResponse.ok) {
    logs.push(`API-Football error ${apiResponse.status}`)
    throw new Error(`API-Football error: ${apiResponse.status}`)
  }

  const apiData = await apiResponse.json()
  const fixtures = apiData.response || []

  if (fixtures.length === 0) {
    logs.push('API sin datos')
    return NextResponse.json({ message: 'API sin datos', synced: 0, logs })
  }

  logs.push(`${fixtures.length} partidos recibidos de la API`)

  for (const match of matches) {
    const apiMatch = fixtures.find((f: any) => {
      const homeMatch = f.teams.home.name.toLowerCase().includes(match.home_team.toLowerCase()) ||
                        match.home_team.toLowerCase().includes(f.teams.home.name.toLowerCase())
      const awayMatch = f.teams.away.name.toLowerCase().includes(match.away_team.toLowerCase()) ||
                        match.away_team.toLowerCase().includes(f.teams.away.name.toLowerCase())
      return homeMatch && awayMatch
    })

    if (!apiMatch) continue

    const homeScore = apiMatch.goals.home
    const awayScore = apiMatch.goals.away
    const apiStatus = apiMatch.fixture.status.short

    let newStatus = 'scheduled'
    if (apiStatus === 'FT' || apiStatus === 'AET' || apiStatus === 'PEN') {
      newStatus = 'finished'
    } else if (['1H', '2H', 'HT', 'ET', 'P'].includes(apiStatus)) {
      newStatus = 'live'
    }

    if (homeScore !== null && awayScore !== null) {
      const { error: updateError } = await supabase
        .from('matches')
        .update({
          home_score: homeScore,
          away_score: awayScore,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', match.id)

      if (!updateError) {
        updatedCount++
        logs.push(`Actualizado #${match.match_number}: ${homeScore}-${awayScore}`)
      }
    }
  }

  if (updatedCount > 0) {
    logs.push(`Recalculando clasificacion`)
    await supabase.rpc('resolve_qualified_teams')
  }

  logs.push(`RESUMEN: ${updatedCount} partidos actualizados`)

  return NextResponse.json({
    success: true,
    checked: matches.length,
    updated: updatedCount,
    season: SEASON,
    timestamp: new Date().toISOString(),
    logs
  })
}
