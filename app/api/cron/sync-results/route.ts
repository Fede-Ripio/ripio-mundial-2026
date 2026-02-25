import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const CRON_SECRET = process.env.CRON_SECRET || 'change-me-in-production'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const { data: matches, error } = await supabase
      .from('matches')
      .select('id, match_number, home_team, away_team, kickoff_at, status')
      .gte('kickoff_at', yesterday.toISOString())
      .lte('kickoff_at', tomorrow.toISOString())
      .in('status', ['scheduled', 'live'])

    if (error) throw error

    if (!matches || matches.length === 0) {
      return NextResponse.json({ 
        message: 'No hay partidos activos',
        synced: 0 
      })
    }

    console.log(`[CRON] ${matches.length} partidos en ventana activa`)

    const apiKey = process.env.API_FOOTBALL_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API_FOOTBALL_KEY no configurada' }, { status: 500 })
    }

    const apiResponse = await fetch(
      'https://v3.football.api-sports.io/fixtures?league=1&season=2022',
      {
        headers: {
          'x-apisports-key': apiKey,
        },
      }
    )

    if (!apiResponse.ok) {
      throw new Error(`API-Football error: ${apiResponse.status}`)
    }

    const apiData = await apiResponse.json()
    const fixtures = apiData.response || []

    console.log(`[API] ${fixtures.length} partidos recibidos`)

    let updated = 0

    for (const match of matches) {
      const apiMatch = fixtures.find((f: any) => {
        const homeMatch = f.teams.home.name.toLowerCase().includes(match.home_team.toLowerCase())
        const awayMatch = f.teams.away.name.toLowerCase().includes(match.away_team.toLowerCase())
        return homeMatch && awayMatch
      })

      if (!apiMatch) continue

      const homeScore = apiMatch.goals.home
      const awayScore = apiMatch.goals.away
      const status = apiMatch.fixture.status.short

      let newStatus = 'scheduled'
      if (status === 'FT' || status === 'AET' || status === 'PEN') {
        newStatus = 'finished'
      } else if (['1H', '2H', 'HT', 'ET', 'P'].includes(status)) {
        newStatus = 'live'
      }

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
        updated++
        console.log(`[UPDATE] Match #${match.match_number}: ${homeScore}-${awayScore}`)
      }
    }

    if (updated > 0) {
      await supabase.rpc('resolve_qualified_teams')
      console.log('[RECALC] Clasificacion recalculada')
    }

    return NextResponse.json({
      success: true,
      checked: matches.length,
      updated,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('[CRON ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'cron/sync-results' })
}
