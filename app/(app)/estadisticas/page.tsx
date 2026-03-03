import { createServerSupabaseClient } from '@/lib/supabase-server'
import { buildMatchConsensus } from '@/lib/stats'
import type { MatchConsensusRow } from '@/lib/stats'
import { COUNTRY_FACTS } from '@/lib/country-facts'
import { CRYPTO_COUNTRY_FACTS } from '@/lib/crypto-country-facts'
import EstadisticasTabs from '@/components/EstadisticasTabs'

export const dynamic = 'force-dynamic'

/** Returns today's date as YYYY-MM-DD in Argentina timezone */
function todayAR(): string {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

export default async function EstadisticasPage() {
  const supabase = await createServerSupabaseClient()

  const { data: consensusRows } = await supabase.rpc('get_match_consensus')
  const allMatches = buildMatchConsensus((consensusRows ?? []) as MatchConsensusRow[])

  const today = todayAR()

  // Matches happening today (any status)
  const todayMatches = allMatches.filter(m => {
    if (!m.kickoffAt) return false
    const matchDate = new Date(m.kickoffAt).toLocaleDateString('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
    })
    return matchDate === today
  })

  // If no matches today, show only the next day that has matches
  const sortedUpcoming = allMatches
    .filter(m => m.status !== 'finished' && m.kickoffAt)
    .sort((a, b) => (a.kickoffAt ?? '').localeCompare(b.kickoffAt ?? ''))

  const nextDayKey = sortedUpcoming.length > 0
    ? new Date(sortedUpcoming[0].kickoffAt!).toLocaleDateString('en-CA', {
        timeZone: 'America/Argentina/Buenos_Aires',
      })
    : null

  const upcomingMatches = nextDayKey
    ? sortedUpcoming.filter(m => {
        const d = new Date(m.kickoffAt!).toLocaleDateString('en-CA', {
          timeZone: 'America/Argentina/Buenos_Aires',
        })
        return d === nextDayKey
      })
    : []

  const matches = todayMatches.length > 0 ? todayMatches : upcomingMatches
  const headerLabel = todayMatches.length > 0 ? 'Partidos de hoy' : 'Próximos partidos'

  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Ripio Mundial 2026
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{headerLabel}</h1>
          <p className="text-gray-400 text-sm">
            Pronósticos de la comunidad · Datos de los países · Cripto y fútbol
          </p>
        </div>

        <EstadisticasTabs
          matches={matches}
          countryFacts={COUNTRY_FACTS}
          cryptoCountryFacts={CRYPTO_COUNTRY_FACTS}
          headerLabel={headerLabel}
        />

      </div>
    </div>
  )
}
