import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
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
    .select('id')

  const totalMatches = matches?.length || 0
  const totalPredictions = predictions?.length || 0
  const progress = totalMatches > 0 ? Math.round((totalPredictions / totalMatches) * 100) : 0

  let points = 0
  let exactHits = 0
  let correctOutcomes = 0

  predictions?.forEach(pred => {
    const match = pred.matches
    if (match?.status === 'finished' && match.home_score !== null) {
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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-8">👤 Mi Perfil</h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600/20 border border-blue-500 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">{points}</div>
            <div className="text-sm text-gray-400 mt-1">Puntos</div>
          </div>
          <div className="bg-green-600/20 border border-green-500 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400">{exactHits}</div>
            <div className="text-sm text-gray-400 mt-1">Exactos</div>
          </div>
          <div className="bg-yellow-600/20 border border-yellow-500 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400">{correctOutcomes}</div>
            <div className="text-sm text-gray-400 mt-1">Aciertos</div>
          </div>
          <div className="bg-purple-600/20 border border-purple-500 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400">{progress}%</div>
            <div className="text-sm text-gray-400 mt-1">Completado</div>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Información</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="font-semibold">{profile?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Nombre:</span>
              <span className="font-semibold">{profile?.display_name || 'Sin nombre'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pronósticos:</span>
              <span className="font-semibold">{totalPredictions} / {totalMatches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Miembro desde:</span>
              <span className="font-semibold">
                {new Date(profile?.created_at || '').toLocaleDateString('es-AR')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/matches"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold text-center transition-colors"
          >
            ⚽ Ver Partidos
          </Link>
          <Link
            href="/leaderboard"
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-semibold text-center transition-colors"
          >
            🏆 Ver Clasificación
          </Link>
        </div>

      </div>
    </div>
  )
}
