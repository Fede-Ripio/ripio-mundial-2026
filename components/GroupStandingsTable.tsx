'use client'

import { getFlagUrl } from '@/lib/flags'

interface Standing {
  group_code: string
  team: string
  team_code: string | null
  played: number
  won: number
  drawn: number
  lost: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
  position: number
}

export default function GroupStandingsTable({ standings }: { standings: Standing[] }) {
  const groups = [...new Set(standings.map(s => s.group_code))].sort()

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map(group => {
        const groupStandings = standings.filter(s => s.group_code === group)

        return (
          <div key={group} className="border border-purple-500/30 rounded-xl overflow-hidden bg-gray-900/30">
            <div className="bg-purple-900/30 border-b border-purple-500/50 px-3 py-2">
              <h3 className="font-bold text-base text-purple-400">Grupo {group}</h3>
            </div>

            <table className="w-full text-xs">
              <thead className="bg-gray-800/50">
                <tr className="text-gray-500">
                  <th className="text-left px-2 py-1.5 pl-3 w-6">#</th>
                  <th className="text-left px-1 py-1.5">Equipo</th>
                  <th className="text-center px-1 py-1.5 w-6">PJ</th>
                  <th className="text-center px-1 py-1.5 w-6">G</th>
                  <th className="text-center px-1 py-1.5 w-6">E</th>
                  <th className="text-center px-1 py-1.5 w-6">P</th>
                  <th className="text-center px-1 py-1.5 w-7">DG</th>
                  <th className="text-center px-1 py-1.5 pr-3 w-7 font-semibold text-gray-400">Pts</th>
                </tr>
              </thead>
              <tbody>
                {groupStandings.map((team) => {
                  const isQualified = team.position <= 2
                  const flagUrl = getFlagUrl(team.team_code, 20)

                  return (
                    <tr
                      key={team.team}
                      className={`border-t border-gray-700/50 hover:bg-gray-800/30 ${
                        isQualified ? 'bg-green-900/10' : ''
                      }`}
                    >
                      <td className="px-2 py-1.5 pl-3">
                        <span className={`font-bold ${isQualified ? 'text-green-400' : 'text-gray-500'}`}>
                          {team.position}
                        </span>
                      </td>
                      <td className="px-1 py-1.5">
                        <div className="flex items-center gap-1.5">
                          {flagUrl ? (
                            <img
                              src={flagUrl}
                              alt={team.team}
                              className="w-[18px] h-[13px] object-cover rounded-sm flex-shrink-0"
                            />
                          ) : (
                            <div className="w-[18px] h-[13px] rounded-sm bg-gray-700 flex-shrink-0" />
                          )}
                          <span className="font-medium truncate max-w-[80px]">{team.team}</span>
                        </div>
                      </td>
                      <td className="text-center px-1 py-1.5 text-gray-400">{team.played}</td>
                      <td className="text-center px-1 py-1.5 text-green-400">{team.won}</td>
                      <td className="text-center px-1 py-1.5 text-yellow-400">{team.drawn}</td>
                      <td className="text-center px-1 py-1.5 text-red-400">{team.lost}</td>
                      <td className="text-center px-1 py-1.5 text-gray-300">
                        {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                      </td>
                      <td className="text-center px-1 py-1.5 pr-3">
                        <span className="font-bold text-purple-400">{team.points}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
