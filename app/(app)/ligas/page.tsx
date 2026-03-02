import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import CreateLeagueForm from '@/components/CreateLeagueForm'
import JoinLeagueForm from '@/components/JoinLeagueForm'
import { GENERAL_LEAGUE_ID } from '@/lib/constants'
import type { LeaderboardRow } from '@/lib/scoring'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function LeaguesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/ingresa')

  const { data: myLeagues } = await supabase
    .from('league_members')
    .select('*, leagues(*)')
    .eq('user_id', user.id)

  const privateLeagues = myLeagues?.filter(m => m.league_id !== GENERAL_LEAGUE_ID) || []

  // Posición en cada liga privada, en paralelo
  const leaguesWithPosition = await Promise.all(
    privateLeagues.map(async (membership) => {
      const { data: rows } = await supabase.rpc('get_leaderboard', { p_league_id: membership.league_id })
      const typedRows = (rows ?? []) as LeaderboardRow[]
      const idx = typedRows.findIndex(r => r.user_id === user.id)
      return {
        ...membership,
        position: idx !== -1 ? idx + 1 : null,
        totalMembers: typedRows.length,
      }
    })
  )

  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Ripio Mundial 2026</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Ligas Privadas</h1>
          <p className="text-gray-400">
            {leaguesWithPosition.length > 0
              ? `Estás en ${leaguesWithPosition.length} liga${leaguesWithPosition.length > 1 ? 's' : ''} privada${leaguesWithPosition.length > 1 ? 's' : ''}`
              : 'Competí con amigos, compañeros o quien quieras'}
          </p>
        </div>

        {/* ACCIONES: CREAR + UNIRSE */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <div className="border-2 border-purple-500/50 bg-purple-900/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-1 text-purple-400 flex items-center gap-2">
              <span>➕</span>
              <span>Crear Liga</span>
            </h2>
            <p className="text-sm text-gray-400 mb-5">
              Nombrala como quieras y compartí el código con tus amigos
            </p>
            <CreateLeagueForm />
          </div>

          <div className="border-2 border-purple-500/30 bg-purple-900/5 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-1 text-purple-400 flex items-center gap-2">
              <span>🔗</span>
              <span>Unirse a Liga</span>
            </h2>
            <p className="text-sm text-gray-400 mb-5">
              ¿Te invitaron? Ingresá el código y entrá directo
            </p>
            <JoinLeagueForm />
          </div>
        </div>

        {/* TUS LIGAS PRIVADAS */}
        {leaguesWithPosition.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-5 text-white">
              Tus Ligas{' '}
              <span className="text-gray-600 font-normal text-lg">({leaguesWithPosition.length})</span>
            </h2>
            <div className="flex flex-col gap-4">
              {leaguesWithPosition.map(membership => (
                <Link
                  key={membership.leagues.id}
                  href={`/ligas/${membership.leagues.id}`}
                  className="block border-2 border-purple-500/40 bg-purple-900/10 hover:border-purple-500/60 rounded-2xl p-6 sm:p-8 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-2xl group-hover:text-purple-300 transition-colors">
                          {membership.leagues.name}
                        </h3>
                        {membership.role === 'owner' && (
                          <span className="text-xs bg-purple-600/20 text-purple-400 border border-purple-500/30 px-2 py-1 rounded-full flex-shrink-0">
                            Admin
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-400 mb-4">
                        Liga Privada • {membership.role === 'owner' ? 'Administrador' : 'Miembro'}
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        {membership.position ? (
                          <div>
                            <div className="text-gray-500 mb-1">Tu posición</div>
                            <div className="text-xl font-semibold text-white">
                              #{membership.position}{' '}
                              <span className="text-sm text-gray-400">de {membership.totalMembers}</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-gray-500 mb-1">Miembros</div>
                            <div className="text-xl font-semibold text-white">{membership.totalMembers}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-gray-500 mb-1">Código</div>
                          <div className="text-sm font-mono text-purple-400 bg-purple-900/20 px-3 py-1 rounded">
                            {membership.leagues.invite_code}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <span className="block text-center border border-purple-500/50 text-purple-300 font-semibold px-6 py-3 rounded-xl transition-colors group-hover:text-white group-hover:border-purple-400">
                        Ver Liga →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
