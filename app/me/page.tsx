import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: predictions } = await supabase
    .from('predictions')
    .select('*, matches(*)')
    .eq('user_id', user.id)

  const { data: matches } = await supabase
    .from('matches')
    .select('id', { count: 'exact', head: true })

  let points = 0
  let exactHits = 0

  predictions?.forEach(pred => {
    const match = pred.matches
    if (match?.status === 'finished' && match.home_score !== null) {
      if (pred.home_goals === match.home_score && pred.away_goals === match.away_score) {
        points += 3
        exactHits += 1
      } else {
        const predOutcome = pred.home_goals > pred.away_goals ? 'home' : pred.home_goals < pred.away_goals ? 'away' : 'draw'
        const matchOutcome = match.home_score > match.away_score ? 'home' : match.home_score < match.away_score ? 'away' : 'draw'
        if (predOutcome === matchOutcome) points += 1
      }
    }
  })

  const totalMatches = matches?.count || 0
  const completionRate = totalMatches > 0 ? Math.round((predictions?.length || 0) / totalMatches * 100) : 0

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-12">👤 Mi Perfil</h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="border border-purple-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">{points}</div>
            <div className="text-sm text-gray-400">Puntos</div>
          </div>
          <div className="border border-purple-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{exactHits}</div>
            <div className="text-sm text-gray-400">Exactos</div>
          </div>
          <div className="border border-purple-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{predictions?.length || 0}</div>
            <div className="text-sm text-gray-400">Pronósticos</div>
          </div>
          <div className="border border-purple-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">{completionRate}%</div>
            <div className="text-sm text-gray-400">Completado</div>
          </div>
        </div>

        <div className="border border-purple-500/30 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Información</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-purple-500/20">
              <span className="text-gray-500">Email:</span>
              <span className="font-semibold">{user.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-purple-500/20">
              <span className="text-gray-500">Nombre:</span>
              <span className="font-semibold">{profile?.display_name || user.email?.split('@')[0]}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-500">Miembro desde:</span>
              <span className="font-semibold">
                {new Date(profile?.created_at || '').toLocaleDateString('es-AR')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/matches"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold px-6 py-4 rounded-xl"
          >
            Ver mis pronósticos
          </Link>
          <Link
            href="/leaderboard"
            className="flex-1 border border-purple-500/50 hover:bg-purple-900/20 text-white text-center font-semibold px-6 py-4 rounded-xl"
          >
            Ver clasificación
          </Link>
        </div>
      </div>
    </div>
  )
}
