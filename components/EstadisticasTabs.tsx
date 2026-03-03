'use client'

import type { MatchConsensus } from '@/lib/stats'
import type { CountryFact } from '@/lib/country-facts'
import type { CryptoCountryFact } from '@/lib/crypto-country-facts'
import MatchDayCard from './MatchDayCard'

interface Props {
  matches: MatchConsensus[]
  countryFacts: Record<string, CountryFact>
  cryptoCountryFacts: Record<string, CryptoCountryFact>
  headerLabel: string
}

function formatDateHeader(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

function getDateKey(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

export default function EstadisticasTabs({
  matches,
  countryFacts,
  cryptoCountryFacts,
  headerLabel,
}: Props) {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        El torneo ha finalizado.
      </div>
    )
  }

  // Group matches by date in AR timezone
  const groups: { dateKey: string; dateLabel: string; matches: MatchConsensus[] }[] = []
  const seen = new Map<string, number>()

  for (const m of matches) {
    const key = m.kickoffAt ? getDateKey(m.kickoffAt) : 'sin-fecha'
    const label = m.kickoffAt ? formatDateHeader(m.kickoffAt) : 'Sin fecha'

    if (!seen.has(key)) {
      seen.set(key, groups.length)
      groups.push({ dateKey: key, dateLabel: label, matches: [] })
    }
    groups[seen.get(key)!].matches.push(m)
  }

  return (
    <div className="space-y-10">
      {groups.map(group => (
        <section key={group.dateKey}>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 capitalize">
            {group.dateLabel}
          </h2>
          <div className="space-y-4">
            {group.matches.map(m => {
              const homeKey = m.homeTeam.toLowerCase()
              const awayKey = m.awayTeam.toLowerCase()
              return (
                <MatchDayCard
                  key={m.matchId}
                  match={m}
                  homeCountryFact={countryFacts[homeKey]}
                  awayCountryFact={countryFacts[awayKey]}
                  homeCryptoFact={cryptoCountryFacts[homeKey]}
                  awayCryptoFact={cryptoCountryFacts[awayKey]}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
