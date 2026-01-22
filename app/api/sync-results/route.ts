import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY!

export async function POST(request: Request) {
  try {
    // Verificar que sea admin (opcional, lo hacemos en el client)
    
    const logs: string[] = []
    let updatedCount = 0
    let errorCount = 0

    // Obtener todos los partidos que están "live" o "finished" o próximos
    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .in('status', ['scheduled', 'live', 'finished'])
      .order('match_number', { ascending: true })

    if (!matches) {
      return NextResponse.json({ error: 'No matches found' }, { status: 404 })
    }

    logs.push(`📊 Total de partidos a verificar: ${matches.length}`)

    // Para testing: usar Mundial 2022 (ID: 1) ya que 2026 aún no tiene datos
    // Cuando sea 2026 real, cambiar a league: 1, season: 2026
    const LEAGUE_ID = 1 // World Cup
    const SEASON = 2022 // Cambiar a 2026 cuando esté disponible

    // Llamar a API-Football para obtener fixtures
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
      return NextResponse.json({ 
        success: true, 
        logs,
        message: 'No hay datos del Mundial 2026 todavía. Probá con edición manual o esperá al torneo.' 
      })
    }

    logs.push(`✅ Recibidos ${apiData.response.length} partidos de la API`)

    // Mapear y actualizar
    for (const apiMatch of apiData.response.slice(0, 20)) { // Limitamos a 20 para testing
      try {
        const fixture = apiMatch.fixture
        const teams = apiMatch.teams
        const goals = apiMatch.goals

        // Buscar partido por equipos (aproximación)
        const homeTeam = teams.home.name
        const awayTeam = teams.away.name

        // Buscar match en nuestra DB (por nombre de equipo aproximado)
        const matchToUpdate = matches.find(m => 
          m.home_team.toLowerCase().includes(homeTeam.toLowerCase().split(' ')[0]) ||
          m.away_team.toLowerCase().includes(awayTeam.toLowerCase().split(' ')[0])
        )

        if (!matchToUpdate) continue

        // Determinar estado
        let status = 'scheduled'
        if (fixture.status.short === 'FT' || fixture.status.short === 'AET' || fixture.status.short === 'PEN') {
          status = 'finished'
        } else if (fixture.status.short === '1H' || fixture.status.short === '2H' || fixture.status.short === 'HT') {
          status = 'live'
        }

        // Actualizar solo si cambió algo
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

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      errors: errorCount,
      logs
    })

  } catch (error: any) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Error sincronizando resultados',
        logs: ['❌ Error fatal: ' + error.message]
      },
      { status: 500 }
    )
  }
}
