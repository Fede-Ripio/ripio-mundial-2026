import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizeTeamName } from '@/lib/team-names'

const CRON_SECRET = process.env.CRON_SECRET || 'change-me'

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

export async function GET() {
  return await syncResults()
}

async function syncResults() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const logs: string[] = []
  const now = new Date()
  const windowStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const windowEnd = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000)

  logs.push(`Ventana: ${windowStart.toISOString().split('T')[0]} a ${windowEnd.toISOString().split('T')[0]}`)

  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('id, match_number, home_team, away_team, kickoff_at, status')
    .gte('kickoff_at', windowStart.toISOString())
    .lte('kickoff_at', windowEnd.toISOString())
    .in('status', ['scheduled', 'live'])
    .order('match_number', { ascending: true })

  if (matchesError) {
    logs.push(`Error DB: ${matchesError.message}`)
    return NextResponse.json({ error: matchesError.message, logs }, { status: 500 })
  }

  if (!matches || matches.length === 0) {
    logs.push(`No hay partidos en ventana`)
    return NextResponse.json({ message: 'No hay partidos', synced: 0, logs })
  }

  logs.push(`${matches.length} partidos en ventana`)

  const apiUrl = 'https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4429&s=2026'
  const apiResponse = await fetch(apiUrl)

  if (!apiResponse.ok) {
    logs.push(`TheSportsDB error ${apiResponse.status}`)
    return NextResponse.json({ error: 'API error', logs }, { status: 500 })
  }

  const apiData = await apiResponse.json()
  const events = apiData.events || []

  if (events.length === 0) {
    logs.push(`TheSportsDB sin eventos`)
    return NextResponse.json({ message: 'API sin datos', synced: 0, logs })
  }

  logs.push(`${events.length} eventos de TheSportsDB`)

  let updatedCount = 0
  let matchedCount = 0

  for (const match of matches) {
    // Normalizar usando mapeo
    const normHome = normalizeTeamName(match.home_team)
    const normAway = normalizeTeamName(match.away_team)

    const apiMatch = events.find((e: any) => {
      if (!e.strHomeTeam || !e.strAwayTeam) return false
      const apiHome = normalizeTeamName(e.strHomeTeam)
      const apiAway = normalizeTeamName(e.strAwayTeam)
      
      return (apiHome === normHome || apiHome.includes(normHome) || normHome.includes(apiHome)) &&
             (apiAway === normAway || apiAway.includes(normAway) || normAway.includes(apiAway))
    })

    if (!apiMatch) {
      logs.push(`❌ No match: ${match.home_team} vs ${match.away_team} (${normHome} vs ${normAway})`)
      continue
    }

    matchedCount++
    logs.push(`✅ Match #${match.match_number}: ${match.home_team} vs ${match.away_team}`)

    const homeScore = apiMatch.intHomeScore ? parseInt(apiMatch.intHomeScore) : null
    const awayScore = apiMatch.intAwayScore ? parseInt(apiMatch.intAwayScore) : null

    if (homeScore !== null && awayScore !== null) {
      await supabase.from('matches').update({
        home_score: homeScore,
        away_score: awayScore,
        status: 'finished',
        updated_at: new Date().toISOString()
      }).eq('id', match.id)
      
      updatedCount++
      logs.push(`   📊 Actualizado: ${homeScore}-${awayScore}`)
    } else {
      logs.push(`   ⏳ Sin scores (${apiMatch.strStatus})`)
    }
  }

  if (updatedCount > 0) {
    await supabase.rpc('resolve_qualified_teams')
    logs.push(`♻️ Clasificacion recalculada`)
  }

  logs.push(`\n📈 RESUMEN: ${matchedCount} matcheados, ${updatedCount} actualizados de ${matches.length}`)

  return NextResponse.json({
    success: true,
    checked: matches.length,
    matched: matchedCount,
    updated: updatedCount,
    logs
  })
}
