'use client'

import type { MatchConsensus } from '@/lib/stats'
import type { CountryFact } from '@/lib/country-facts'
import type { CryptoCountryFact } from '@/lib/crypto-country-facts'
import { WORLD_CUP_CRYPTO_FALLBACK } from '@/lib/crypto-country-facts'
type CryptoCountryFacts = CryptoCountryFact[]
import { getHeadToHead } from '@/lib/wc-history'
import { normalizeTeamName } from '@/lib/team-names'

interface Props {
  match: MatchConsensus
  homeCountryFact?: CountryFact
  awayCountryFact?: CountryFact
  homeCryptoFacts?: CryptoCountryFacts
  awayCryptoFacts?: CryptoCountryFacts
  matchIndex?: number
}

// ── Flag map ──────────────────────────────────────────────────────────────────
const FLAGS: Record<string, string> = {
  'argentina': '🇦🇷', 'brasil': '🇧🇷', 'méxico': '🇲🇽', 'colombia': '🇨🇴',
  'venezuela': '🇻🇪', 'ecuador': '🇪🇨', 'uruguay': '🇺🇾', 'perú': '🇵🇪',
  'chile': '🇨🇱', 'bolivia': '🇧🇴', 'paraguay': '🇵🇾',
  'el salvador': '🇸🇻', 'estados unidos': '🇺🇸', 'canadá': '🇨🇦',
  'costa rica': '🇨🇷', 'panamá': '🇵🇦', 'honduras': '🇭🇳',
  'jamaica': '🇯🇲', 'trinidad y tobago': '🇹🇹', 'cuba': '🇨🇺',
  'alemania': '🇩🇪', 'francia': '🇫🇷', 'españa': '🇪🇸', 'portugal': '🇵🇹',
  'países bajos': '🇳🇱', 'bélgica': '🇧🇪', 'italia': '🇮🇹',
  'inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'croacia': '🇭🇷', 'austria': '🇦🇹',
  'suiza': '🇨🇭', 'serbia': '🇷🇸', 'rumanía': '🇷🇴', 'turquía': '🇹🇷',
  'ucrania': '🇺🇦', 'hungría': '🇭🇺', 'escocia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'gales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'república checa': '🇨🇿', 'eslovenia': '🇸🇮',
  'eslovaquia': '🇸🇰', 'albania': '🇦🇱', 'grecia': '🇬🇷', 'dinamarca': '🇩🇰',
  'noruega': '🇳🇴', 'suecia': '🇸🇪', 'finlandia': '🇫🇮',
  'japón': '🇯🇵', 'corea del sur': '🇰🇷', 'república de corea': '🇰🇷',
  'australia': '🇦🇺', 'china': '🇨🇳', 'irán': '🇮🇷',
  'arabia saudita': '🇸🇦', 'qatar': '🇶🇦', 'irak': '🇮🇶',
  'uzbekistán': '🇺🇿', 'indonesia': '🇮🇩', 'tailandia': '🇹🇭',
  'nigeria': '🇳🇬', 'marruecos': '🇲🇦', 'senegal': '🇸🇳',
  'ghana': '🇬🇭', 'sudáfrica': '🇿🇦', 'costa de marfil': '🇨🇮',
  'túnez': '🇹🇳', 'camerún': '🇨🇲', 'mali': '🇲🇱', 'angola': '🇦🇴',
  'egipto': '🇪🇬', 'argelia': '🇩🇿', 'nueva zelanda': '🇳🇿',
}

function flag(team: string): string {
  return FLAGS[team.toLowerCase()] ?? ''
}

// ── Stage labels ───────────────────────────────────────────────────────────────
const STAGE_LABELS: Record<string, string> = {
  group:        'Fase de Grupos',
  ro32:         'Ronda de 32',
  ro16:         'Octavos de Final',
  quarterfinal: 'Cuartos de Final',
  semifinal:    'Semifinal',
  third_place:  '3.er y 4.° Lugar',
  final:        'Final',
}

function formatKickoff(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  const time = date.toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  return `${time} ART`
}

function formatDateShort(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-AR', {
    weekday: 'short', day: 'numeric', month: 'short',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

export default function MatchDayCard({
  match: m,
  homeCountryFact,
  awayCountryFact,
  homeCryptoFacts,
  awayCryptoFacts,
  matchIndex = 0,
}: Props) {
  const isEmpty = m.totalPredictions === 0
  const { homeWinPct, drawPct, awayWinPct } = m

  const winner =
    homeWinPct > drawPct && homeWinPct > awayWinPct ? 'home' :
    awayWinPct > drawPct && awayWinPct > homeWinPct ? 'away' : 'draw'

  const stageLabel = STAGE_LABELS[m.stage] ?? m.stage
  const isFinished = m.status === 'finished'
  const isLive = m.status === 'in_progress'

  const cryptoFacts = homeCryptoFacts ?? awayCryptoFacts ?? WORLD_CUP_CRYPTO_FALLBACK
  const cryptoFact = cryptoFacts[matchIndex % cryptoFacts.length]
  const cryptoTeamLabel = homeCryptoFacts
    ? m.homeTeam
    : awayCryptoFacts ? m.awayTeam : null

  const hasAnyFact = homeCountryFact || awayCountryFact || cryptoFact

  const homeFlag = flag(m.homeTeam)
  const awayFlag = flag(m.awayTeam)

  // Head-to-head history (1930-2022)
  const h2h = getHeadToHead(m.homeTeam, m.awayTeam)
  const homeEngName = normalizeTeamName(m.homeTeam)
  const homeIsTeam1 = h2h ? h2h.team1.toLowerCase() === homeEngName.toLowerCase() : false
  const homeH2HWins = h2h ? (homeIsTeam1 ? h2h.t1wins : h2h.t2wins) : 0
  const awayH2HWins = h2h ? (homeIsTeam1 ? h2h.t2wins : h2h.t1wins) : 0

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">

      {/* ── Match header ─────────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-800/60">

        {/* Stage + status row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            {stageLabel}
            {m.stage === 'group' && m.homeTeamCode && ' · Grupo'}
          </span>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="text-[10px] font-bold text-green-400 animate-pulse">EN VIVO</span>
            )}
            {isFinished && m.homeScore !== null && (
              <span className="text-xs text-green-400/80 bg-green-900/20 px-2 py-0.5 rounded-full font-mono font-bold">
                {m.homeScore} – {m.awayScore}
              </span>
            )}
            {!isFinished && m.kickoffAt && (
              <span className="text-[10px] text-gray-600">
                {formatDateShort(m.kickoffAt)} · {formatKickoff(m.kickoffAt)}
              </span>
            )}
          </div>
        </div>

        {/* Teams with LOCAL / VISITANTE labels */}
        <div className="flex items-center justify-between gap-2">

          {/* Home */}
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-0.5">Local</div>
            <div className={`text-base sm:text-lg font-bold leading-tight line-clamp-1 ${
              winner === 'home' && !isEmpty ? 'text-white' : 'text-gray-300'
            }`}>
              {homeFlag && <span className="mr-1">{homeFlag}</span>}
              {m.homeTeam}
            </div>
          </div>

          <span className="text-xs text-gray-600 flex-shrink-0 px-1">vs</span>

          {/* Away */}
          <div className="flex-1 min-w-0 text-right">
            <div className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-0.5">Visitante</div>
            <div className={`text-base sm:text-lg font-bold leading-tight line-clamp-1 ${
              winner === 'away' && !isEmpty ? 'text-white' : 'text-gray-300'
            }`}>
              {m.awayTeam}
              {awayFlag && <span className="ml-1">{awayFlag}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Consensus + score distribution ───────────────────────── */}
      <div className="px-5 py-4 border-b border-gray-800/60">
        {isEmpty ? (
          <div className="h-7 bg-gray-800/60 rounded-full flex items-center justify-center">
            <span className="text-[10px] text-gray-600">Nadie pronosticó este partido todavía</span>
          </div>
        ) : (
          <>
            {/* Win/draw/loss bar */}
            <div className="flex h-7 rounded-full overflow-hidden text-[10px] font-bold mb-2">
              {homeWinPct > 0 && (
                <div
                  className="flex items-center justify-center bg-gradient-to-r from-purple-700 to-purple-500 transition-all duration-700"
                  style={{ width: `${homeWinPct}%` }}
                >
                  {homeWinPct >= 15 && `${homeWinPct}%`}
                </div>
              )}
              {drawPct > 0 && (
                <div
                  className="flex items-center justify-center bg-gray-600 transition-all duration-700"
                  style={{ width: `${drawPct}%` }}
                >
                  {drawPct >= 12 && `${drawPct}%`}
                </div>
              )}
              {awayWinPct > 0 && (
                <div
                  className="flex items-center justify-center bg-gradient-to-r from-purple-900 to-purple-800 transition-all duration-700"
                  style={{ width: `${awayWinPct}%` }}
                >
                  {awayWinPct >= 15 && `${awayWinPct}%`}
                </div>
              )}
            </div>

            <div className="flex justify-between text-[10px] text-gray-500 mb-5">
              <span className={winner === 'home' ? 'text-purple-400 font-semibold' : ''}>{homeWinPct}% local</span>
              <span className={winner === 'draw' ? 'text-gray-300 font-semibold' : ''}>{drawPct}% empate</span>
              <span className={winner === 'away' ? 'text-purple-300 font-semibold' : ''}>{awayWinPct}% visitante</span>
            </div>

            {/* Score distribution */}
            {m.topScores.length > 0 && (
              <div>
                <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">
                  Distribución de marcadores
                </div>
                <div className="space-y-1.5">
                  {m.topScores.map((s, i) => {
                    const pct = Math.round((s.count / m.totalPredictions) * 100)
                    const topCount = m.topScores[0].count
                    const barColor = s.count === topCount
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500'
                      : 'bg-gray-700'
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold text-gray-300 min-w-[28px] text-right flex-shrink-0">
                          {s.homeGoals}-{s.awayGoals}
                        </span>
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${barColor} transition-all duration-700`}
                            style={{ width: `${Math.max(pct, 2)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 w-7 flex-shrink-0">{pct}%</span>
                      </div>
                    )
                  })}
                </div>
                <div className="text-[10px] text-gray-600 mt-2 text-right">
                  {m.totalPredictions.toLocaleString('es-AR')} pronóstico{m.totalPredictions !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── H2H history ───────────────────────────────────────────── */}
      <div className="px-5 py-3 border-b border-gray-800/60">
        <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">
          Historial en Mundiales{h2h ? ` · ${h2h.total} encuentro${h2h.total !== 1 ? 's' : ''}` : ''}
        </div>
        {h2h ? (
          <>
            <div className="flex h-5 rounded-full overflow-hidden text-[9px] font-bold mb-1.5">
              {homeH2HWins > 0 && (
                <div
                  className="flex items-center justify-center bg-gradient-to-r from-purple-700 to-purple-500"
                  style={{ width: `${Math.round((homeH2HWins / h2h.total) * 100)}%` }}
                >
                  {homeH2HWins}
                </div>
              )}
              {h2h.draws > 0 && (
                <div
                  className="flex items-center justify-center bg-gray-600"
                  style={{ width: `${Math.round((h2h.draws / h2h.total) * 100)}%` }}
                >
                  {h2h.draws}
                </div>
              )}
              {awayH2HWins > 0 && (
                <div
                  className="flex items-center justify-center bg-gradient-to-r from-purple-900 to-purple-800"
                  style={{ width: `${Math.round((awayH2HWins / h2h.total) * 100)}%` }}
                >
                  {awayH2HWins}
                </div>
              )}
            </div>
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>{homeH2HWins} victoria{homeH2HWins !== 1 ? 's' : ''} local</span>
              <span>{h2h.draws} empate{h2h.draws !== 1 ? 's' : ''}</span>
              <span>{awayH2HWins} victoria{awayH2HWins !== 1 ? 's' : ''} visitante</span>
            </div>
          </>
        ) : (
          <p className="text-[11px] text-gray-600 italic">
            Se enfrentan por primera vez en la historia del Mundial.
          </p>
        )}
      </div>

      {/* ── Country facts ─────────────────────────────────────────── */}
      {hasAnyFact && (
        <div className="px-5 py-4 space-y-4">

          {(homeCountryFact || awayCountryFact) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {homeCountryFact && (
                <CountryFactCard name={m.homeTeam} countryFlag={homeFlag} fact={homeCountryFact} />
              )}
              {awayCountryFact && (
                <CountryFactCard name={m.awayTeam} countryFlag={awayFlag} fact={awayCountryFact} />
              )}
            </div>
          )}

          {cryptoFact && (
            <CryptoCard
              teamName={cryptoTeamLabel ?? 'Mundial 2026'}
              teamFlag={cryptoTeamLabel ? flag(cryptoTeamLabel) : '🏆'}
              fact={cryptoFact}
            />
          )}
        </div>
      )}
    </div>
  )
}

function CountryFactCard({ name, countryFlag, fact }: { name: string; countryFlag: string; fact: CountryFact }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-1.5">
      <div className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest">
        {countryFlag && <span className="mr-1">{countryFlag}</span>}{name}
      </div>
      <div className="text-xs font-semibold text-gray-300">{fact.wcRecord}</div>
      <p className="text-[11px] text-gray-500 leading-relaxed">{fact.curiosity}</p>
    </div>
  )
}

function CryptoCard({ teamName, teamFlag, fact }: { teamName: string; teamFlag: string; fact: CryptoCountryFact }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
      <div className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest mb-2">
        Cripto · {teamFlag && <span className="mr-0.5">{teamFlag}</span>}{teamName}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
        <div className="flex-shrink-0">
          <div className="text-xl font-bold text-purple-400 leading-none">{fact.highlight}</div>
          <div className="text-[10px] text-gray-600 mt-0.5 leading-tight">{fact.highlightLabel}</div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-400 leading-relaxed">{fact.body}</p>
          <p className="text-[10px] text-gray-700 mt-1.5">Fuente: {fact.source}</p>
        </div>
      </div>
    </div>
  )
}
