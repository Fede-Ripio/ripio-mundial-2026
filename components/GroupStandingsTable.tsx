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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map(group => {
        const groupStandings = standings.filter(s => s.group_code === group)
        
        return (
          <div key={group} className="border border-purple-500/30 rounded-xl overflow-hidden bg-gray-900/30">
            <div className="bg-purple-900/30 border-b border-purple-500/50 px-4 py-3">
              <h3 className="font-bold text-lg text-purple-400">Grupo {group}</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800/50">
                  <tr className="text-xs text-gray-400">
                    <th className="text-left p-2 pl-4">Pos</th>
                    <th className="text-left p-2">Equipo</th>
                    <th className="text-center p-2">PJ</th>
                    <th className="text-center p-2">G</th>
                    <th className="text-center p-2">E</th>
                    <th className="text-center p-2">P</th>
                    <th className="text-center p-2">GF</th>
                    <th className="text-center p-2">GC</th>
                    <th className="text-center p-2">DG</th>
                    <th className="text-center p-2 pr-4 font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {groupStandings.map((team, idx) => {
                    const isQualified = team.position <= 2
                    
                    return (
                      <tr 
                        key={team.team} 
                        className={`border-t border-gray-700/50 hover:bg-gray-800/30 ${
                          isQualified ? 'bg-green-900/10' : ''
                        }`}
                      >
                        <td className="p-2 pl-4">
                          <span className={`font-bold ${isQualified ? 'text-green-400' : 'text-gray-500'}`}>
                            {team.position}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {getFlagUrl(team.team_code, '24x18') ? (
                              <img
                                src={getFlagUrl(team.team_code, '24x18')!}
                                alt={team.team}
                                className="w-5 h-4 object-cover rounded flex-shrink-0"
                              />
                            ) : (
                              <div className="w-5 h-4 rounded bg-gray-700 flex-shrink-0" />
                            )}
                            <span className="font-medium truncate max-w-[120px]">{team.team}</span>
                          </div>
                        </td>
                        <td className="text-center p-2 text-gray-400">{team.played}</td>
                        <td className="text-center p-2 text-green-400">{team.won}</td>
                        <td className="text-center p-2 text-yellow-400">{team.drawn}</td>
                        <td className="text-center p-2 text-red-400">{team.lost}</td>
                        <td className="text-center p-2 text-gray-300">{team.goals_for}</td>
                        <td className="text-center p-2 text-gray-300">{team.goals_against}</td>
                        <td className="text-center p-2 text-gray-300">{team.goal_difference > 0 ? '+' : ''}{team.goal_difference}</td>
                        <td className="text-center p-2 pr-4">
                          <span className="font-bold text-purple-400">{team.points}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
