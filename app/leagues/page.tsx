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

  if (!user) redirect('/login')

  const { data: myLeagues } = await supabase
    .from('league_members')
    .select('*, leagues(*)')
    .eq('user_id', user.id)

  const generalLeague = myLeagues?.find(m => m.league_id === GENERAL_LEAGUE_ID)
  const privateLeagues = myLeagues?.filter(m => m.league_id !== GENERAL_LEAGUE_ID) || []

  // POSICIÓN EN LIGA GENERAL
  let generalPosition: number | null = null
  let generalTotalUsers = 0

  if (generalLeague) {
    const { data: rows } = await supabase.rpc('get_leaderboard', { p_league_id: GENERAL_LEAGUE_ID })
    const typedRows = (rows ?? []) as LeaderboardRow[]
    generalTotalUsers = typedRows.length
    const idx = typedRows.findIndex(r => r.user_id === user.id)
    if (idx !== -1) generalPosition = idx + 1
  }

  // POSICIÓN EN LIGAS PRIVADAS — una llamada RPC por liga, en paralelo
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
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        <div className="mb-12">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Ripio Mundial 2026</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mis Ligas</h1>
          <p className="text-gray-400">
            {generalLeague ? 'Liga Ripio' : ''}
            {generalLeague && privateLeagues.length > 0 ? ` · ${privateLeagues.length} liga${privateLeagues.length > 1 ? 's' : ''} privada${privateLeagues.length > 1 ? 's' : ''}` : ''}
            {!generalLeague && privateLeagues.length > 0 ? `${privateLeagues.length} liga${privateLeagues.length > 1 ? 's' : ''} privada${privateLeagues.length > 1 ? 's' : ''}` : ''}
            {!generalLeague && privateLeagues.length === 0 ? 'Sin ligas todavía' : ''}
          </p>
        </div>

        {/* CREAR LIGA PRIVADA */}
        <div className="border-2 border-purple-500/50 bg-purple-900/10 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold mb-2 text-purple-400 flex items-center gap-2">
            <span>➕</span>
            <span>Crear Liga Privada</span>
          </h2>
          <p className="text-gray-400 mb-6">
            Competí con tus amigos en una liga exclusiva
          </p>
          <CreateLeagueForm />
        </div>

        {/* UNIRSE A LIGA */}
        <div className="border-2 border-purple-500/40 bg-purple-900/5 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-2 text-purple-400 flex items-center gap-2">
            <span>🔗</span>
            <span>Unirse a Liga</span>
          </h2>
          <p className="text-gray-400 mb-6">
            ¿Tenés un código de invitación? Ingresalo acá
          </p>
          <JoinLeagueForm />
        </div>

        {/* TUS LIGAS */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-white">Tus Ligas</h2>

          {/* LIGA RIPIO - DESTACADA CON POSICIÓN REAL */}
          {generalLeague && (
            <Link
              href="/leaderboard"
              className="block border-2 border-purple-500/70 bg-gradient-to-br from-purple-900/30 to-purple-700/10 hover:border-purple-500/90 rounded-2xl p-8 mb-6 transition-all group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🏆</span>
                    <h3 className="font-bold text-3xl text-purple-400 group-hover:text-purple-300 transition-colors">
                      Liga Ripio
                    </h3>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">Liga Pública • Mundial 2026</div>

                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Premios Totales</div>
                      <div className="text-3xl font-bold text-purple-400">1.75M wARS</div>
                    </div>
                    <div className="hidden sm:block text-gray-700">•</div>
                    <div>
                      <div className="text-gray-500 mb-1">Tu posición</div>
                      {generalPosition ? (
                        <div className="text-xl font-semibold text-white">
                          #{generalPosition} <span className="text-sm text-gray-400">de {generalTotalUsers}</span>
                        </div>
                      ) : (
                        <div className="text-lg text-gray-500">Sin pronósticos</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 w-full sm:w-auto">
                  <span className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors">
                    Ver Ranking →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* LIGAS PRIVADAS CON POSICIÓN */}
          {leaguesWithPosition.length > 0 ? (
            <div className="flex flex-col gap-4">
              {leaguesWithPosition.map(membership => (
                <Link
                  key={membership.leagues.id}
                  href={`/leagues/${membership.leagues.id}`}
                  className="block border-2 border-purple-500/40 bg-purple-900/10 hover:border-purple-500/60 rounded-2xl p-6 sm:p-8 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {membership.role === 'owner' ? '👑' : '🏅'}
                        </span>
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
                              #{membership.position} <span className="text-sm text-gray-400">de {membership.totalMembers}</span>
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
                      <span className="block text-center border border-purple-500/50 hover:border-purple-400 text-purple-300 font-semibold px-6 py-3 rounded-xl transition-colors group-hover:text-white">
                        Ver Liga →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !generalLeague && (
              <div className="border border-purple-500/30 rounded-xl p-12 text-center">
                <p className="text-gray-400 mb-4">
                  No estás en ninguna liga todavía
                </p>
                <p className="text-sm text-gray-600">
                  Creá una liga privada o unite con un código de invitación
                </p>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  )
}
