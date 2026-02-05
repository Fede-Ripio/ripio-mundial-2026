import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CreateLeagueForm from '@/components/CreateLeagueForm'
import JoinLeagueForm from '@/components/JoinLeagueForm'

export const dynamic = 'force-dynamic'

export default async function LeaguesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: myLeagues } = await supabase
    .from('league_members')
    .select('*, leagues(*)')
    .eq('user_id', user.id)

  const generalLeague = myLeagues?.find(m => m.leagues.name === 'Liga Ripio' || m.leagues.name === 'Ripio Mundial')
  const privateLeagues = myLeagues?.filter(m => m.leagues.name !== 'Liga Ripio' && m.leagues.name !== 'Ripio Mundial') || []

  // CALCULAR POSICIÓN EN LIGA GENERAL
  let generalPosition = null
  let generalTotalUsers = 0
  
  if (generalLeague) {
    const { data: profiles } = await supabase.from('profiles').select('id, email, display_name, created_at')
    const { data: predictions } = await supabase.from('predictions').select('*, matches(*)')
    const { data: members } = await supabase
      .from('league_members')
      .select('user_id')
      .eq('league_id', generalLeague.league_id)

    const leaderboard = (profiles || []).map(profile => {
      const userPredictions = predictions?.filter(p => p.user_id === profile.id) || []
      let points = 0
      let exactHits = 0
      let correctOutcomes = 0

      userPredictions.forEach(pred => {
        const match = pred.matches
        if (match?.status === 'finished' && match.home_score !== null && match.away_score !== null) {
          if (pred.home_goals === match.home_score && pred.away_goals === match.away_score) {
            points += 3
            exactHits += 1
          } else {
            const predOutcome = pred.home_goals > pred.away_goals ? 'home' : pred.home_goals < pred.away_goals ? 'away' : 'draw'
            const matchOutcome = match.home_score > match.away_score ? 'home' : match.home_score < match.away_score ? 'away' : 'draw'
            if (predOutcome === matchOutcome) {
              points += 1
              correctOutcomes += 1
            }
          }
        }
      })

      return { ...profile, points, exactHits, correctOutcomes }
    })
    .filter(u => members?.some(m => m.user_id === u.id))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits
      if (b.correctOutcomes !== a.correctOutcomes) return b.correctOutcomes - a.correctOutcomes
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    })

    generalTotalUsers = leaderboard.length
    const userIndex = leaderboard.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      generalPosition = userIndex + 1
    }
  }

  // CALCULAR POSICIÓN EN LIGAS PRIVADAS
  const leaguesWithPosition = await Promise.all(
    privateLeagues.map(async (membership) => {
      const { data: members } = await supabase
        .from('league_members')
        .select('user_id')
        .eq('league_id', membership.league_id)

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, display_name, created_at')
        .in('id', members?.map(m => m.user_id) || [])

      const { data: predictions } = await supabase
        .from('predictions')
        .select('*, matches(*)')
        .in('user_id', members?.map(m => m.user_id) || [])

      const leaderboard = (profiles || []).map(profile => {
        const userPredictions = predictions?.filter(p => p.user_id === profile.id) || []
        let points = 0
        let exactHits = 0
        let correctOutcomes = 0

        userPredictions.forEach(pred => {
          const match = pred.matches
          if (match?.status === 'finished' && match.home_score !== null && match.away_score !== null) {
            if (pred.home_goals === match.home_score && pred.away_goals === match.away_score) {
              points += 3
              exactHits += 1
            } else {
              const predOutcome = pred.home_goals > pred.away_goals ? 'home' : pred.home_goals < pred.away_goals ? 'away' : 'draw'
              const matchOutcome = match.home_score > match.away_score ? 'home' : match.home_score < match.away_score ? 'away' : 'draw'
              if (predOutcome === matchOutcome) {
                points += 1
                correctOutcomes += 1
              }
            }
          }
        })

        return { ...profile, points, exactHits, correctOutcomes }
      })
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits
        if (b.correctOutcomes !== a.correctOutcomes) return b.correctOutcomes - a.correctOutcomes
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })

      const totalMembers = leaderboard.length
      const userIndex = leaderboard.findIndex(u => u.id === user.id)
      const position = userIndex !== -1 ? userIndex + 1 : null

      return {
        ...membership,
        position,
        totalMembers
      }
    })
  )

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl sm:text-5xl font-bold mb-12">🏅 Mis Ligas</h1>

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
            <div className="grid sm:grid-cols-2 gap-4">
              {leaguesWithPosition.map(membership => (
                <Link
                  key={membership.leagues.id}
                  href={`/leagues/${membership.leagues.id}`}
                  className="border border-purple-500/30 hover:border-purple-500/60 bg-gray-900/30 rounded-2xl p-6 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-bold text-xl group-hover:text-purple-400 transition-colors">
                      {membership.leagues.name}
                    </h3>
                    {membership.role === 'owner' && (
                      <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded flex-shrink-0">
                        👑 Admin
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3 text-sm">
                    <div className="text-gray-500">
                      {membership.role === 'owner' ? 'Sos el administrador' : 'Miembro'}
                    </div>
                    {membership.position && (
                      <>
                        <div className="text-gray-700">•</div>
                        <div className="font-semibold text-purple-400">
                          #{membership.position} de {membership.totalMembers}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-purple-400 font-mono bg-purple-900/20 px-3 py-2 rounded">
                      {membership.leagues.invite_code}
                    </div>
                    <span className="text-gray-500 text-sm group-hover:text-white transition-colors">
                      →
                    </span>
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
