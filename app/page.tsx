import Link from 'next/link'
import { Trophy, Users, Target, TrendingUp } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('kickoff_at', { ascending: true })
    .limit(5)

  const { count: statsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-b from-blue-900/20 to-gray-950 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ripio Mundial 2026
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            El prode más grande del Mundial. Pronosticá resultados y ganá premios increíbles.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/30 rounded-2xl p-6">
              <div className="text-4xl mb-2">🥇</div>
              <div className="text-2xl font-bold text-yellow-400">1MM wARS</div>
              <div className="text-sm text-gray-400">Primer puesto</div>
            </div>
            <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/5 border border-gray-400/30 rounded-2xl p-6">
              <div className="text-4xl mb-2">🥈</div>
              <div className="text-2xl font-bold text-gray-300">500K wARS</div>
              <div className="text-sm text-gray-400">Segundo puesto</div>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-orange-700/5 border border-orange-600/30 rounded-2xl p-6">
              <div className="text-4xl mb-2">🥉</div>
              <div className="text-2xl font-bold text-orange-400">250K wARS</div>
              <div className="text-sm text-gray-400">Tercer puesto</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Registrarse Gratis
            </Link>
            <Link
              href="/matches"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors border border-gray-700"
            >
              Ver Partidos
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-3xl font-bold">{statsCount || 0}</div>
              <div className="text-sm text-gray-400">Participantes</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-3xl font-bold">104</div>
              <div className="text-sm text-gray-400">Partidos</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-3xl font-bold">1.75M</div>
              <div className="text-sm text-gray-400">wARS en premios</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-3xl font-bold">GRATIS</div>
              <div className="text-sm text-gray-400">100% sin costo</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Próximos Partidos</h2>
          <div className="grid gap-4">
            {matches?.map((match) => (
              <div key={match.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-4xl">{match.home_team_code ? getFlagEmoji(match.home_team_code) : '⚽'}</div>
                    <div className="font-semibold text-lg">{match.home_team}</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-500">VS</div>
                  <div className="flex items-center gap-4 flex-1 justify-end">
                    <div className="font-semibold text-lg text-right">{match.away_team}</div>
                    <div className="text-4xl">{match.away_team_code ? getFlagEmoji(match.away_team_code) : '⚽'}</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400 text-center">
                  {match.venue} • {match.city} • {match.kickoff_at ? new Date(match.kickoff_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : 'Fecha a confirmar'}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/matches" className="text-blue-400 hover:text-blue-300 font-semibold">
              Ver todos los partidos →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">¿Cómo Funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Registrate</h3>
              <p className="text-gray-400">Creá tu cuenta gratis en segundos</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Pronosticá</h3>
              <p className="text-gray-400">Elegí los resultados de cada partido antes del inicio</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Ganá</h3>
              <p className="text-gray-400">Los mejores pronósticos ganan wARS</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">¿Listo para competir?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Unite a la liga general "Ripio Mundial" y competí por los premios
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-lg font-semibold text-xl transition-colors"
          >
            Empezar Ahora
          </Link>
        </div>
      </section>
    </div>
  )
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
