import { createServerSupabaseClient } from '@/lib/supabase-server'
import { buildMatchConsensus, buildCuriosities } from '@/lib/stats'
import type { MatchConsensusRow } from '@/lib/stats'
import { CRYPTO_FACTS } from '@/lib/crypto-facts'
import { WC_TOURNAMENT_SUMMARIES, WC_MOST_COMMON_SCORES, WC_STATS } from '@/lib/wc-history'
import EstadisticasTabs from '@/components/EstadisticasTabs'

export const dynamic = 'force-dynamic'

async function fetchBtcPrice(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      { next: { revalidate: 300 } } // cache 5 min
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.bitcoin?.usd ?? null
  } catch {
    return null
  }
}

export default async function EstadisticasPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { data: consensusRows },
    { data: curiositiesRow },
    btcPrice,
  ] = await Promise.all([
    supabase.rpc('get_match_consensus'),
    supabase.rpc('get_prediction_curiosities').single(),
    fetchBtcPrice(),
  ])

  const consensus = buildMatchConsensus((consensusRows ?? []) as MatchConsensusRow[])
  const curiosities = buildCuriosities(curiositiesRow as any)

  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Ripio Mundial 2026
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Estadísticas</h1>
          <p className="text-gray-400 text-sm">
            Consenso de pronósticos · Historia del Mundial · Cripto y fútbol
          </p>
        </div>

        <EstadisticasTabs
          consensus={consensus}
          curiosities={curiosities}
          cryptoFacts={CRYPTO_FACTS}
          btcPrice={btcPrice}
          wcSummaries={WC_TOURNAMENT_SUMMARIES}
          wcTopScores={WC_MOST_COMMON_SCORES}
          wcStats={WC_STATS}
        />

      </div>
    </div>
  )
}
