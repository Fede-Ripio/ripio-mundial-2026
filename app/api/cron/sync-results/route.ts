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

  const LEAGUE_ID = '4429'
  const SEASON = '2026'

  logs.push(`Consultando TheSportsDB Mundial ${SEASON}`)

  let apiUrl = `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=${LEAGUE_ID}&s=${SEASON}`
  let apiResponse = await fetch(apiUrl)

  if (!apiResponse.ok || apiResponse.status === 404) {
    logs.push(`Temporada 2026 no disponible, usando 2022 para testing`)
    apiUrl = `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=${LEAGUE_ID}&s=2022`
    apiResponse = await fetch(apiUrl)
  }

  if (!apiResponse.ok) {
    logs.push(`TheSportsDB error ${apiResponse.status}`)
    throw new Error(`TheSportsDB error: ${apiResponse.status}`)
  }

  const apiData = await apiResponse.json()
  const events = apiData.events || []

  if (events.length === 0) {
    logs.push(`TheSportsDB sin eventos`)
    return NextResponse.json({ 
      message: 'API sin datos',
      synced: 0,
      logs 
    })
  }

  logs.push(`${events.length} partidos recibidos`)

  const mapStatus = (strStatus: string | null): string => {
    if (!strStatus) return 'scheduled'
    const s = strStatus.toUpperCase()
    if (s === 'FT' || s === 'AET' || s === 'PEN') return 'finished'
    if (['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(s)) return 'live'
    return 'scheduled'
  }

  const normalize = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, ' ').trim()
  }

  for (const match of matches) {
    const normHome = normalize(match.home_team)
    const normAway = normalize(match.away_team)

    const apiMatch = events.find((e: any) => {
      if (!e.strHomeTeam || !e.strAwayTeam) return false
      const apiHome = normalize(e.strHomeTeam)
      const apiAway = normalize(e.strAwayTeam)
      return (apiHome.includes(normHome) || normHome.includes(apiHome)) &&
             (apiAway.includes(normAway) || normAway.includes(apiAway))
    })

    if (!apiMatch) continue

    const homeScore = apiMatch.intHomeScore ? parseInt(apiMatch.intHomeScore) : null
    const awayScore = apiMatch.intAwayScore ? parseInt(apiMatch.intAwayScore) : null
    const newStatus = mapStatus(apiMatch.strStatus)

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

  logs.push(`RESUMEN: ${updatedCount} actualizados`)

  return NextResponse.json({
    success: true,
    checked: matches.length,
    updated: updatedCount,
    api: 'TheSportsDB',
    season: SEASON,
    timestamp: new Date().toISOString(),
    logs
  })
}
