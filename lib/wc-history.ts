// Datos históricos del Mundial de Fútbol 1930-2022
// Fuente: https://github.com/EhteshamBahoo/Fifa-WorldCup-Data-Analysis-1930-2026
// Procesado desde clean_fifa_worldcup_matches.csv (964 partidos, 22 torneos)

import { normalizeTeamName } from './team-names'

export interface TournamentSummary {
  year: number
  matches: number
  goals: number
  avg: number
}

export interface CommonScore {
  score: string
  count: number
}

export interface H2HResult {
  team1: string
  team2: string
  total: number
  t1wins: number
  draws: number
  t2wins: number
}

export const WC_STATS = {
  totalMatches: 964,
  totalGoals: 2720,
  avgGoals: 2.82,
  uniqueTeams: 86,
  tournaments: 22,
  mostGoalsMatch: { home: 'Austria', away: 'Switzerland', year: 1954, homeGoals: 7, awayGoals: 5 },
  biggestMargin: { home: 'Hungary', away: 'South Korea', year: 1954, homeGoals: 9, awayGoals: 0 },
} as const

export const WC_TOURNAMENT_SUMMARIES: TournamentSummary[] = [
  { year: 1930, matches: 18, goals: 70,  avg: 3.89 },
  { year: 1934, matches: 17, goals: 70,  avg: 4.12 },
  { year: 1938, matches: 18, goals: 84,  avg: 4.67 },
  { year: 1950, matches: 22, goals: 88,  avg: 4.00 },
  { year: 1954, matches: 26, goals: 140, avg: 5.38 },
  { year: 1958, matches: 35, goals: 126, avg: 3.60 },
  { year: 1962, matches: 32, goals: 89,  avg: 2.78 },
  { year: 1966, matches: 32, goals: 89,  avg: 2.78 },
  { year: 1970, matches: 32, goals: 95,  avg: 2.97 },
  { year: 1974, matches: 38, goals: 97,  avg: 2.55 },
  { year: 1978, matches: 38, goals: 102, avg: 2.68 },
  { year: 1982, matches: 52, goals: 146, avg: 2.81 },
  { year: 1986, matches: 52, goals: 132, avg: 2.54 },
  { year: 1990, matches: 52, goals: 115, avg: 2.21 },
  { year: 1994, matches: 52, goals: 141, avg: 2.71 },
  { year: 1998, matches: 64, goals: 171, avg: 2.67 },
  { year: 2002, matches: 64, goals: 161, avg: 2.52 },
  { year: 2006, matches: 64, goals: 147, avg: 2.30 },
  { year: 2010, matches: 64, goals: 145, avg: 2.27 },
  { year: 2014, matches: 64, goals: 171, avg: 2.67 },
  { year: 2018, matches: 64, goals: 169, avg: 2.64 },
  { year: 2022, matches: 64, goals: 172, avg: 2.69 },
]

export const WC_MOST_COMMON_SCORES: CommonScore[] = [
  { score: '1-0', count: 111 },
  { score: '2-1', count: 106 },
  { score: '1-1', count: 92  },
  { score: '0-0', count: 78  },
  { score: '2-0', count: 72  },
  { score: '0-1', count: 71  },
  { score: '3-1', count: 51  },
  { score: '1-2', count: 46  },
  { score: '0-2', count: 39  },
  { score: '3-0', count: 36  },
]

// H2H lookup: keyed by "team1|team2" sorted alphabetically (lowercase)
// Only pairs with 2+ historical meetings
const WC_H2H_MAP: Record<string, H2HResult> = {"argentina|brazil":{"team1":"Argentina","team2":"Brazil","total":4,"t1wins":1,"draws":1,"t2wins":2},"argentina|netherlands":{"team1":"Argentina","team2":"Netherlands","total":6,"t1wins":1,"draws":3,"t2wins":2},"argentina|england":{"team1":"Argentina","team2":"England","total":5,"t1wins":1,"draws":1,"t2wins":3},"argentina|france":{"team1":"Argentina","team2":"France","total":4,"t1wins":2,"draws":1,"t2wins":1},"argentina|germany":{"team1":"Argentina","team2":"Germany","total":3,"t1wins":0,"draws":1,"t2wins":2},"argentina|italy":{"team1":"Argentina","team2":"Italy","total":3,"t1wins":2,"draws":0,"t2wins":1},"argentina|mexico":{"team1":"Argentina","team2":"Mexico","total":4,"t1wins":4,"draws":0,"t2wins":0},"argentina|nigeria":{"team1":"Argentina","team2":"Nigeria","total":3,"t1wins":3,"draws":0,"t2wins":0},"argentina|saudi arabia":{"team1":"Argentina","team2":"Saudi Arabia","total":2,"t1wins":1,"draws":0,"t2wins":1},"argentina|sweden":{"team1":"Argentina","team2":"Sweden","total":2,"t1wins":1,"draws":1,"t2wins":0},"argentina|uruguay":{"team1":"Argentina","team2":"Uruguay","total":2,"t1wins":2,"draws":0,"t2wins":0},"argentina|yugoslavia":{"team1":"Argentina","team2":"Yugoslavia","total":2,"t1wins":0,"draws":1,"t2wins":1},"australia|croatia":{"team1":"Australia","team2":"Croatia","total":2,"t1wins":1,"draws":0,"t2wins":1},"australia|germany":{"team1":"Australia","team2":"Germany","total":2,"t1wins":0,"draws":0,"t2wins":2},"belgium|brazil":{"team1":"Belgium","team2":"Brazil","total":2,"t1wins":0,"draws":0,"t2wins":2},"belgium|england":{"team1":"Belgium","team2":"England","total":3,"t1wins":1,"draws":1,"t2wins":1},"belgium|japan":{"team1":"Belgium","team2":"Japan","total":2,"t1wins":1,"draws":0,"t2wins":1},"bolivia|brazil":{"team1":"Bolivia","team2":"Brazil","total":2,"t1wins":0,"draws":1,"t2wins":1},"brazil|cameroon":{"team1":"Brazil","team2":"Cameroon","total":3,"t1wins":3,"draws":0,"t2wins":0},"brazil|chile":{"team1":"Brazil","team2":"Chile","total":4,"t1wins":3,"draws":1,"t2wins":0},"brazil|colombia":{"team1":"Brazil","team2":"Colombia","total":2,"t1wins":1,"draws":0,"t2wins":1},"brazil|costa rica":{"team1":"Brazil","team2":"Costa Rica","total":2,"t1wins":2,"draws":0,"t2wins":0},"brazil|croatia":{"team1":"Brazil","team2":"Croatia","total":2,"t1wins":2,"draws":0,"t2wins":0},"brazil|czechoslovakia":{"team1":"Brazil","team2":"Czechoslovakia","total":5,"t1wins":3,"draws":2,"t2wins":0},"brazil|england":{"team1":"Brazil","team2":"England","total":2,"t1wins":1,"draws":1,"t2wins":0},"brazil|france":{"team1":"Brazil","team2":"France","total":4,"t1wins":2,"draws":1,"t2wins":1},"brazil|germany":{"team1":"Brazil","team2":"Germany","total":3,"t1wins":0,"draws":0,"t2wins":3},"brazil|ghana":{"team1":"Brazil","team2":"Ghana","total":2,"t1wins":2,"draws":0,"t2wins":0},"brazil|hungary":{"team1":"Brazil","team2":"Hungary","total":3,"t1wins":2,"draws":0,"t2wins":1},"brazil|italy":{"team1":"Brazil","team2":"Italy","total":5,"t1wins":2,"draws":1,"t2wins":2},"brazil|mexico":{"team1":"Brazil","team2":"Mexico","total":5,"t1wins":4,"draws":1,"t2wins":0},"brazil|netherlands":{"team1":"Brazil","team2":"Netherlands","total":5,"t1wins":1,"draws":1,"t2wins":3},"brazil|north korea":{"team1":"Brazil","team2":"North Korea","total":2,"t1wins":2,"draws":0,"t2wins":0},"brazil|peru":{"team1":"Brazil","team2":"Peru","total":3,"t1wins":2,"draws":1,"t2wins":0},"brazil|poland":{"team1":"Brazil","team2":"Poland","total":2,"t1wins":1,"draws":0,"t2wins":1},"brazil|portugal":{"team1":"Brazil","team2":"Portugal","total":2,"t1wins":2,"draws":0,"t2wins":0},"brazil|scotland":{"team1":"Brazil","team2":"Scotland","total":2,"t1wins":2,"draws":0,"t2wins":0},"brazil|senegal":{"team1":"Brazil","team2":"Senegal","total":2,"t1wins":1,"draws":0,"t2wins":1},"brazil|south korea":{"team1":"Brazil","team2":"South Korea","total":4,"t1wins":4,"draws":0,"t2wins":0},"brazil|spain":{"team1":"Brazil","team2":"Spain","total":5,"t1wins":3,"draws":1,"t2wins":1},"brazil|sweden":{"team1":"Brazil","team2":"Sweden","total":7,"t1wins":5,"draws":2,"t2wins":0},"brazil|turkey":{"team1":"Brazil","team2":"Turkey","total":2,"t1wins":1,"draws":0,"t2wins":1},"brazil|uruguay":{"team1":"Brazil","team2":"Uruguay","total":5,"t1wins":3,"draws":0,"t2wins":2},"brazil|usa":{"team1":"Brazil","team2":"USA","total":2,"t1wins":1,"draws":1,"t2wins":0},"brazil|west germany":{"team1":"Brazil","team2":"West Germany","total":4,"t1wins":2,"draws":0,"t2wins":2},"brazil|yugoslavia":{"team1":"Brazil","team2":"Yugoslavia","total":3,"t1wins":3,"draws":0,"t2wins":0},"cameroon|england":{"team1":"Cameroon","team2":"England","total":2,"t1wins":0,"draws":0,"t2wins":2},"cameroon|colombia":{"team1":"Cameroon","team2":"Colombia","total":2,"t1wins":1,"draws":0,"t2wins":1},"cameroon|italy":{"team1":"Cameroon","team2":"Italy","total":2,"t1wins":0,"draws":1,"t2wins":1},"cameroon|russia":{"team1":"Cameroon","team2":"Russia","total":2,"t1wins":0,"draws":0,"t2wins":2},"cameroon|west germany":{"team1":"Cameroon","team2":"West Germany","total":2,"t1wins":0,"draws":0,"t2wins":2},"chile|france":{"team1":"Chile","team2":"France","total":2,"t1wins":1,"draws":0,"t2wins":1},"chile|italy":{"team1":"Chile","team2":"Italy","total":2,"t1wins":1,"draws":0,"t2wins":1},"chile|switzerland":{"team1":"Chile","team2":"Switzerland","total":2,"t1wins":1,"draws":0,"t2wins":1},"chile|west germany":{"team1":"Chile","team2":"West Germany","total":2,"t1wins":0,"draws":0,"t2wins":2},"colombia|ivory coast":{"team1":"Colombia","team2":"Ivory Coast","total":2,"t1wins":1,"draws":0,"t2wins":1},"colombia|usa":{"team1":"Colombia","team2":"USA","total":2,"t1wins":1,"draws":0,"t2wins":1},"costa rica|england":{"team1":"Costa Rica","team2":"England","total":2,"t1wins":1,"draws":0,"t2wins":1},"croatia|france":{"team1":"Croatia","team2":"France","total":3,"t1wins":0,"draws":0,"t2wins":3},"croatia|germany":{"team1":"Croatia","team2":"Germany","total":2,"t1wins":2,"draws":0,"t2wins":0},"croatia|japan":{"team1":"Croatia","team2":"Japan","total":2,"t1wins":1,"draws":1,"t2wins":0},"croatia|mexico":{"team1":"Croatia","team2":"Mexico","total":2,"t1wins":0,"draws":1,"t2wins":1},"czechoslovakia|italy":{"team1":"Czechoslovakia","team2":"Italy","total":2,"t1wins":1,"draws":0,"t2wins":1},"czechoslovakia|west germany":{"team1":"Czechoslovakia","team2":"West Germany","total":3,"t1wins":2,"draws":1,"t2wins":0},"denmark|france":{"team1":"Denmark","team2":"France","total":3,"t1wins":1,"draws":0,"t2wins":2},"denmark|germany":{"team1":"Denmark","team2":"Germany","total":2,"t1wins":1,"draws":0,"t2wins":1},"denmark|uruguay":{"team1":"Denmark","team2":"Uruguay","total":2,"t1wins":1,"draws":1,"t2wins":0},"ecuador|mexico":{"team1":"Ecuador","team2":"Mexico","total":2,"t1wins":0,"draws":1,"t2wins":1},"egypt|netherlands":{"team1":"Egypt","team2":"Netherlands","total":2,"t1wins":0,"draws":0,"t2wins":2},"england|france":{"team1":"England","team2":"France","total":3,"t1wins":0,"draws":1,"t2wins":2},"england|germany":{"team1":"England","team2":"Germany","total":3,"t1wins":2,"draws":0,"t2wins":1},"england|italy":{"team1":"England","team2":"Italy","total":4,"t1wins":2,"draws":1,"t2wins":1},"england|japan":{"team1":"England","team2":"Japan","total":2,"t1wins":2,"draws":0,"t2wins":0},"england|nigeria":{"team1":"England","team2":"Nigeria","total":2,"t1wins":1,"draws":1,"t2wins":0},"england|paraguay":{"team1":"England","team2":"Paraguay","total":2,"t1wins":2,"draws":0,"t2wins":0},"england|portugal":{"team1":"England","team2":"Portugal","total":2,"t1wins":2,"draws":0,"t2wins":0},"england|sweden":{"team1":"England","team2":"Sweden","total":5,"t1wins":3,"draws":0,"t2wins":2},"england|usa":{"team1":"England","team2":"USA","total":2,"t1wins":1,"draws":0,"t2wins":1},"england|west germany":{"team1":"England","team2":"West Germany","total":3,"t1wins":1,"draws":1,"t2wins":1},"france|germany":{"team1":"France","team2":"Germany","total":3,"t1wins":1,"draws":0,"t2wins":2},"france|italy":{"team1":"France","team2":"Italy","total":5,"t1wins":1,"draws":2,"t2wins":2},"france|mexico":{"team1":"France","team2":"Mexico","total":4,"t1wins":2,"draws":1,"t2wins":1},"france|morocco":{"team1":"France","team2":"Morocco","total":2,"t1wins":2,"draws":0,"t2wins":0},"france|portugal":{"team1":"France","team2":"Portugal","total":3,"t1wins":2,"draws":0,"t2wins":1},"france|spain":{"team1":"France","team2":"Spain","total":2,"t1wins":0,"draws":1,"t2wins":1},"france|switzerland":{"team1":"France","team2":"Switzerland","total":3,"t1wins":1,"draws":1,"t2wins":1},"france|uruguay":{"team1":"France","team2":"Uruguay","total":2,"t1wins":1,"draws":0,"t2wins":1},"france|west germany":{"team1":"France","team2":"West Germany","total":3,"t1wins":1,"draws":0,"t2wins":2},"germany|ghana":{"team1":"Germany","team2":"Ghana","total":2,"t1wins":1,"draws":1,"t2wins":0},"germany|portugal":{"team1":"Germany","team2":"Portugal","total":2,"t1wins":1,"draws":0,"t2wins":1},"germany|south korea":{"team1":"Germany","team2":"South Korea","total":2,"t1wins":1,"draws":0,"t2wins":1},"germany|sweden":{"team1":"Germany","team2":"Sweden","total":2,"t1wins":2,"draws":0,"t2wins":0},"ghana|usa":{"team1":"Ghana","team2":"USA","total":2,"t1wins":2,"draws":0,"t2wins":0},"hungary|south korea":{"team1":"Hungary","team2":"South Korea","total":2,"t1wins":2,"draws":0,"t2wins":0},"hungary|west germany":{"team1":"Hungary","team2":"West Germany","total":3,"t1wins":2,"draws":0,"t2wins":1},"iran|usa":{"team1":"Iran","team2":"USA","total":2,"t1wins":0,"draws":0,"t2wins":2},"italy|mexico":{"team1":"Italy","team2":"Mexico","total":3,"t1wins":2,"draws":0,"t2wins":1},"italy|netherlands":{"team1":"Italy","team2":"Netherlands","total":2,"t1wins":0,"draws":1,"t2wins":1},"italy|nigeria":{"team1":"Italy","team2":"Nigeria","total":2,"t1wins":1,"draws":1,"t2wins":0},"italy|poland":{"team1":"Italy","team2":"Poland","total":3,"t1wins":2,"draws":0,"t2wins":1},"italy|spain":{"team1":"Italy","team2":"Spain","total":2,"t1wins":1,"draws":0,"t2wins":1},"italy|uruguay":{"team1":"Italy","team2":"Uruguay","total":4,"t1wins":2,"draws":1,"t2wins":1},"italy|west germany":{"team1":"Italy","team2":"West Germany","total":4,"t1wins":0,"draws":2,"t2wins":2},"japan|senegal":{"team1":"Japan","team2":"Senegal","total":2,"t1wins":1,"draws":1,"t2wins":0},"mexico|nigeria":{"team1":"Mexico","team2":"Nigeria","total":2,"t1wins":0,"draws":1,"t2wins":1},"mexico|south korea":{"team1":"Mexico","team2":"South Korea","total":2,"t1wins":1,"draws":0,"t2wins":1},"mexico|sweden":{"team1":"Mexico","team2":"Sweden","total":2,"t1wins":0,"draws":0,"t2wins":2},"mexico|uruguay":{"team1":"Mexico","team2":"Uruguay","total":2,"t1wins":0,"draws":0,"t2wins":2},"mexico|west germany":{"team1":"Mexico","team2":"West Germany","total":2,"t1wins":0,"draws":0,"t2wins":2},"morocco|spain":{"team1":"Morocco","team2":"Spain","total":2,"t1wins":1,"draws":1,"t2wins":0},"netherlands|portugal":{"team1":"Netherlands","team2":"Portugal","total":2,"t1wins":0,"draws":0,"t2wins":2},"netherlands|spain":{"team1":"Netherlands","team2":"Spain","total":3,"t1wins":1,"draws":1,"t2wins":1},"netherlands|sweden":{"team1":"Netherlands","team2":"Sweden","total":2,"t1wins":0,"draws":1,"t2wins":1},"netherlands|usa":{"team1":"Netherlands","team2":"USA","total":2,"t1wins":2,"draws":0,"t2wins":0},"netherlands|west germany":{"team1":"Netherlands","team2":"West Germany","total":4,"t1wins":2,"draws":0,"t2wins":2},"netherlands|yugoslavia":{"team1":"Netherlands","team2":"Yugoslavia","total":2,"t1wins":1,"draws":1,"t2wins":0},"nigeria|south korea":{"team1":"Nigeria","team2":"South Korea","total":2,"t1wins":1,"draws":0,"t2wins":1},"peru|poland":{"team1":"Peru","team2":"Poland","total":2,"t1wins":0,"draws":1,"t2wins":1},"peru|scotland":{"team1":"Peru","team2":"Scotland","total":2,"t1wins":1,"draws":1,"t2wins":0},"poland|west germany":{"team1":"Poland","team2":"West Germany","total":2,"t1wins":0,"draws":0,"t2wins":2},"portugal|spain":{"team1":"Portugal","team2":"Spain","total":2,"t1wins":0,"draws":2,"t2wins":0},"portugal|uruguay":{"team1":"Portugal","team2":"Uruguay","total":2,"t1wins":0,"draws":0,"t2wins":2},"russia|sweden":{"team1":"Russia","team2":"Sweden","total":2,"t1wins":0,"draws":0,"t2wins":2},"russia|uruguay":{"team1":"Russia","team2":"Uruguay","total":2,"t1wins":0,"draws":1,"t2wins":1},"scotland|west germany":{"team1":"Scotland","team2":"West Germany","total":2,"t1wins":0,"draws":0,"t2wins":2},"scotland|yugoslavia":{"team1":"Scotland","team2":"Yugoslavia","total":2,"t1wins":0,"draws":1,"t2wins":1},"south korea|usa":{"team1":"South Korea","team2":"USA","total":2,"t1wins":0,"draws":1,"t2wins":1},"spain|sweden":{"team1":"Spain","team2":"Sweden","total":2,"t1wins":2,"draws":0,"t2wins":0},"spain|switzerland":{"team1":"Spain","team2":"Switzerland","total":2,"t1wins":1,"draws":1,"t2wins":0},"spain|usa":{"team1":"Spain","team2":"USA","total":3,"t1wins":3,"draws":0,"t2wins":0},"spain|yugoslavia":{"team1":"Spain","team2":"Yugoslavia","total":2,"t1wins":1,"draws":1,"t2wins":0},"sweden|switzerland":{"team1":"Sweden","team2":"Switzerland","total":3,"t1wins":1,"draws":1,"t2wins":1},"sweden|west germany":{"team1":"Sweden","team2":"West Germany","total":4,"t1wins":0,"draws":0,"t2wins":4},"sweden|yugoslavia":{"team1":"Sweden","team2":"Yugoslavia","total":3,"t1wins":1,"draws":2,"t2wins":0},"switzerland|west germany":{"team1":"Switzerland","team2":"West Germany","total":3,"t1wins":0,"draws":0,"t2wins":3},"turkey|ukraine":{"team1":"Turkey","team2":"Ukraine","total":2,"t1wins":1,"draws":0,"t2wins":1},"uruguay|west germany":{"team1":"Uruguay","team2":"West Germany","total":2,"t1wins":0,"draws":1,"t2wins":1},"uruguay|yugoslavia":{"team1":"Uruguay","team2":"Yugoslavia","total":2,"t1wins":2,"draws":0,"t2wins":0},"usa|west germany":{"team1":"USA","team2":"West Germany","total":2,"t1wins":0,"draws":0,"t2wins":2},"west germany|yugoslavia":{"team1":"West Germany","team2":"Yugoslavia","total":5,"t1wins":4,"draws":0,"t2wins":1}}

// CSV name aliases: "West Germany" counts as "Germany" for modern lookup
const ALIAS_MAP: Record<string, string> = {
  'west germany': 'germany',
  'soviet union': 'russia',
  'czechoslovakia': 'czech republic',
  'zaire': 'dr congo',
  'german democratic republic': 'germany',
  'yugoslavia': 'serbia',
}

function canonicalize(name: string): string {
  const lower = normalizeTeamName(name).toLowerCase()
  return ALIAS_MAP[lower] ?? lower
}

/**
 * Look up head-to-head record between two teams in World Cup history (1930-2022).
 * Team names can be in Spanish or English.
 * Returns null if no recorded meetings (or less than 2).
 */
export function getHeadToHead(teamA: string, teamB: string): H2HResult | null {
  const a = canonicalize(teamA)
  const b = canonicalize(teamB)
  const key = [a, b].sort().join('|')

  const result = WC_H2H_MAP[key] ?? null
  if (!result) return null

  // Check also with alias resolution for West Germany vs Germany edge case
  if (a === 'germany' || b === 'germany') {
    const altKey1 = [a === 'germany' ? 'west germany' : a, b === 'germany' ? 'west germany' : b].sort().join('|')
    const altResult = WC_H2H_MAP[altKey1]
    if (altResult && result) {
      // Merge Germany + West Germany records
      const isTeam1A = result.team1.toLowerCase().includes(a) || altResult.team1.toLowerCase().includes(a)
      return {
        team1: result.team1,
        team2: result.team2,
        total: result.total + (altResult?.total ?? 0),
        t1wins: result.t1wins + (isTeam1A ? (altResult?.t1wins ?? 0) : (altResult?.t2wins ?? 0)),
        draws: result.draws + (altResult?.draws ?? 0),
        t2wins: result.t2wins + (isTeam1A ? (altResult?.t2wins ?? 0) : (altResult?.t1wins ?? 0)),
      }
    }
  }

  return result
}
