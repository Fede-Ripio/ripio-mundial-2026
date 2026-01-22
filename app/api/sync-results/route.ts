import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY!

async function syncResults() {
  try {
    const logs: string[] = []
    let updatedCount = 0
    let errorCount = 0

    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .in('status', ['scheduled', 'live', 'finished'])
      .order('match_number', { ascending: true })

    if (!matches) {
      return { error: 'No matches found', logs: ['❌ No hay partidos'] }
    }

    logs.push(`📊 Total de partidos a verificar: ${matches.length}`)

    const LEAGUE_ID = 1
    const SEASON = 2022

    const apiUrl = `https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID}&season=${SEASON}`
    
    logs.push(`🔄 Consultando API-Football...`)
    
    const response = await fetch(apiUrl, {
      headers: {
        'x-apisports-key': API_FOOTBALL_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`API-Football error: ${response.status}`)
    }

    const apiData = await response.json()
    
    if (!apiData.response || apiData.response.length === 0) {
      logs.push('⚠️ No hay datos disponibles en la API')
      return { 
        success: true, 
        logs,
        message: 'No hay datos del Mundial 2026 todavía.' 
      }
    }

    logs.push(`✅ Recibidos ${apiData.response.length} partidos de la API`)

    for (const apiMatch of apiData.response.slice(0, 20)) {
      try {
        const fixture = apiMatch.fixture
        const teams = apiMatch.teams
        const goals = apiMatch.goals

        const homeTeam = teams.home.name
        const awayTeam = teams.away.name

        const matchToUpdate = matches.find(m => 
          m.home_team.toLowerCase().includes(homeTeam.toLowerCase().split(' ')[0]) ||
          m.away_team.toLowerCase().includes(awayTeam.toLowerCase().split(' ')[0])
        )

        if (!matchToUpdate) continue

        let status = 'scheduled'
        if (fixture.status.short === 'FT' || fixture.status.short === 'AET' || fixture.status.short === 'PEN') {
          status = 'finished'
        } else if (fixture.status.short === '1H' || fixture.status.short === '2H' || fixture.status.short === 'HT') {
          status = 'live'
        }

        if (
          matchToUpdate.status !== status ||
          matchToUpdate.home_score !== goals.home ||
          matchToUpdate.away_score !== goals.away
        ) {
          const { error } = await supabase
            .from('matches')
            .update({
              home_score: goals.home,
              away_score: goals.away,
              status: status,
              updated_at: new Date().toISOString()
            })
            .eq('id', matchToUpdate.id)

          if (error) {
            logs.push(`❌ Error en ${homeTeam} vs ${awayTeam}: ${error.message}`)
            errorCount++
          } else {
            logs.push(`✅ Actualizado: ${homeTeam} ${goals.home}-${goals.away} ${awayTeam} (${status})`)
            updatedCount++
          }
        }
      } catch (err: any) {
        logs.push(`❌ Error procesando partido: ${err.message}`)
        errorCount++
      }
    }

    logs.push(`\n📈 RESUMEN:`)
    logs.push(`   • Partidos actualizados: ${updatedCount}`)
    logs.push(`   • Errores: ${errorCount}`)

    return {
      success: true,
      updated: updatedCount,
      errors: errorCount,
      logs
    }

  } catch (error: any) {
    console.error('Sync error:', error)
    return { 
      error: error.message || 'Error sincronizando resultados',
      logs: ['❌ Error fatal: ' + error.message]
    }
  }
}

// Manejar tanto GET (cron) como POST (manual)
export async function GET() {
  const result = await syncResults()
  return NextResponse.json(result)
}

export async function POST() {
  const result = await syncResults()
  return NextResponse.json(result)
}
