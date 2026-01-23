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

  const generalLeague = myLeagues?.find(m => m.leagues.name === 'Ripio Mundial')

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-12">🏅 Mis Ligas</h1>

        {/* Liga General */}
        {generalLeague && (
          <div className="border-2 border-purple-500/50 bg-purple-900/10 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-purple-400">🏆 {generalLeague.leagues.name}</h2>
                <p className="text-sm text-gray-400">Liga Pública</p>
              </div>
              <Link href="/leaderboard" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
                Ver Ranking →
              </Link>
            </div>
            <div className="text-3xl font-bold text-center py-6 border-t border-purple-500/30 mt-6">
              <div className="text-gray-400 text-sm mb-2">Premios Totales</div>
              <div className="text-purple-400">1.75M wARS</div>
            </div>
          </div>
        )}

        {/* Crear Liga */}
        <div className="border border-purple-500/30 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">➕ Crear Liga Privada</h2>
          <p className="text-gray-400 mb-6">Competí con tus amigos en una liga exclusiva</p>
          <CreateLeagueForm />
        </div>

        {/* Unirse a Liga */}
        <div className="border border-purple-500/30 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">🔗 Unirse a Liga</h2>
          <p className="text-gray-400 mb-6">¿Tenés un código de invitación? Ingresalo acá</p>
          <JoinLeagueForm />
        </div>

        {/* Mis Ligas Privadas */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Tus Ligas Privadas</h2>
          {myLeagues && myLeagues.filter(m => m.leagues.name !== 'Ripio Mundial').length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {myLeagues.filter(m => m.leagues.name !== 'Ripio Mundial').map(membership => (
                <Link 
                  key={membership.leagues.id} 
                  href={`/leagues/${membership.leagues.id}`} 
                  className="border border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-6 transition-colors"
                >
                  <h3 className="font-bold text-xl mb-2">{membership.leagues.name}</h3>
                  <div className="text-sm text-gray-400 mb-4">
                    {membership.role === 'owner' ? '👑 Admin' : '👤 Miembro'}
                  </div>
                  <div className="text-xs text-purple-400 font-mono bg-purple-900/20 px-3 py-2 rounded">
                    Código: {membership.leagues.invite_code}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-purple-500/30 rounded-xl p-12 text-center">
              <p className="text-gray-400">No estás en ninguna liga privada todavía</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
