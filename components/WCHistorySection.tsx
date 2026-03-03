import type { TournamentSummary, CommonScore } from '@/lib/wc-history'

interface Props {
  summaries: TournamentSummary[]
  topScores: CommonScore[]
  stats: {
    totalMatches: number
    totalGoals: number
    avgGoals: number
    uniqueTeams: number
    tournaments: number
    mostGoalsMatch: { home: string; away: string; year: number; homeGoals: number; awayGoals: number }
    biggestMargin: { home: string; away: string; year: number; homeGoals: number; awayGoals: number }
  }
}

export default function WCHistorySection({ summaries, topScores, stats }: Props) {
  const maxAvg = Math.max(...summaries.map(s => s.avg))
  const maxCount = Math.max(...topScores.map(s => s.count))

  return (
    <div className="space-y-8">

      {/* Global stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Torneos',  value: stats.tournaments },
          { label: 'Partidos', value: stats.totalMatches.toLocaleString('es-AR') },
          { label: 'Goles',    value: stats.totalGoals.toLocaleString('es-AR') },
          { label: 'Prom. goles/partido', value: stats.avgGoals },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-400">{value}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Goals per tournament chart */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
          Promedio de goles por torneo (1930–2022)
        </h2>

        <div className="relative">
          {/* Y-axis guide lines */}
          {[2, 3, 4, 5].map(val => (
            <div
              key={val}
              className="absolute w-full border-t border-gray-800/60 flex items-center"
              style={{ bottom: `${(val / maxAvg) * 100}%` }}
            >
              <span className="text-[9px] text-gray-700 -translate-y-2 mr-1 w-4 text-right flex-shrink-0">{val}</span>
            </div>
          ))}

          {/* Bars */}
          <div className="flex items-end gap-0.5 sm:gap-1 h-44 pl-5">
            {summaries.map(s => {
              const heightPct = (s.avg / maxAvg) * 100
              const isBest = s.avg === maxAvg
              return (
                <div
                  key={s.year}
                  className="group relative flex-1 flex flex-col items-center justify-end"
                  title={`${s.year}: ${s.avg} goles/partido (${s.matches} partidos)`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none left-1/2 -translate-x-1/2">
                    {s.year}: {s.avg} goles/p
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${
                      isBest
                        ? 'bg-gradient-to-t from-purple-700 to-yellow-400'
                        : 'bg-gradient-to-t from-purple-800 to-purple-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />

                  {/* Year label */}
                  <span className="text-[7px] sm:text-[8px] text-gray-600 mt-1 rotate-90 sm:rotate-0 origin-center whitespace-nowrap">
                    {s.year % 100 === 0 ? s.year : `'${String(s.year).slice(2)}`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-[10px] text-gray-700 mt-4">
          Récord: 1954 Suiza (5,38 goles/partido) · Menor: 1990 Italia (2,21)
        </p>
      </div>

      {/* Most common scores */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
          Marcadores más frecuentes en la historia
        </h2>
        <div className="space-y-2">
          {topScores.map((s, i) => (
            <div key={s.score} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-4 text-right flex-shrink-0">{i + 1}</span>
              <span className="font-mono font-bold text-sm text-white w-8 flex-shrink-0">{s.score}</span>
              <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-700 to-purple-400 rounded-full transition-all duration-700"
                  style={{ width: `${(s.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-12 text-right flex-shrink-0">{s.count} veces</span>
            </div>
          ))}
        </div>
      </div>

      {/* Did you know */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
          ¿Sabías que...?
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <DidYouKnowCard
            label="Más goles"
            text={`El partido con más goles de la historia fue ${stats.mostGoalsMatch.home} ${stats.mostGoalsMatch.homeGoals}–${stats.mostGoalsMatch.awayGoals} ${stats.mostGoalsMatch.away} (${stats.mostGoalsMatch.year}).`}
          />
          <DidYouKnowCard
            label="Mayor goleada"
            text={`La mayor goleada fue ${stats.biggestMargin.home} ${stats.biggestMargin.homeGoals}–${stats.biggestMargin.awayGoals} ${stats.biggestMargin.away} (${stats.biggestMargin.year}).`}
          />
          <DidYouKnowCard
            label="Selecciones"
            text={`${stats.uniqueTeams} selecciones distintas participaron en los ${stats.tournaments} mundiales jugados hasta 2022.`}
          />
          <DidYouKnowCard
            label="Marcador"
            text={`El marcador 1-0 es el más repetido: ocurrió 111 veces en la historia del torneo, casi un partido de cada ocho.`}
          />
        </div>
      </div>

    </div>
  )
}

function DidYouKnowCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-3 items-start bg-gray-900/40 border border-gray-800 rounded-xl p-4">
      <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wide flex-shrink-0 pt-0.5 whitespace-nowrap">{label}</span>
      <p className="text-xs text-gray-300 leading-relaxed">{text}</p>
    </div>
  )
}
