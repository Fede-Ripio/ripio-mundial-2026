import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import Hero from '@/components/Hero'

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-black text-white">
      
      <Hero isLoggedIn={!!user} />

      <section className="py-20 bg-gradient-to-b from-black to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-gray-400">
              Simple, rápido y transparente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
              <div className="text-5xl mb-4">1️⃣</div>
              <h3 className="text-xl font-bold mb-3">Registrate gratis</h3>
              <p className="text-gray-400">
                Creá tu cuenta en segundos y unite a la liga general
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
              <div className="text-5xl mb-4">2️⃣</div>
              <h3 className="text-xl font-bold mb-3">Pronosticá</h3>
              <p className="text-gray-400">
                Elegí el resultado de cada partido antes de que empiece
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
              <div className="text-5xl mb-4">3️⃣</div>
              <h3 className="text-xl font-bold mb-3">Sumá puntos</h3>
              <p className="text-gray-400">
                +3 por resultado exacto, +1 por acertar ganador o empate
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
              <div className="text-5xl mb-4">4️⃣</div>
              <h3 className="text-xl font-bold mb-3">Ganá premios</h3>
              <p className="text-gray-400">
                Los mejores del ranking ganan wARS al final del Mundial
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-purple-900/30 border border-purple-500/50 rounded-full px-6 py-2 mb-6">
              <span className="text-sm font-bold text-purple-300">PREMIOS</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              1.75M wARS en premios
            </h2>
            <p className="text-xl text-gray-400">
              Liga General Ripio Mundial
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-700/10 border-2 border-yellow-500/50 rounded-2xl p-8 text-center">
              <div className="text-7xl mb-4">🥇</div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">1MM wARS</div>
              <div className="text-gray-400">Primer puesto</div>
            </div>

            <div className="bg-gradient-to-br from-gray-700/20 to-gray-600/10 border-2 border-gray-400/50 rounded-2xl p-8 text-center">
              <div className="text-7xl mb-4">🥈</div>
              <div className="text-4xl font-bold text-gray-300 mb-2">500K wARS</div>
              <div className="text-gray-400">Segundo puesto</div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/20 to-orange-700/10 border-2 border-orange-500/50 rounded-2xl p-8 text-center">
              <div className="text-7xl mb-4">🥉</div>
              <div className="text-4xl font-bold text-orange-400 mb-2">250K wARS</div>
              <div className="text-gray-400">Tercer puesto</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-t from-purple-900/20 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            El Mundial empieza en junio 2026
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Registrate ahora y empezá a armar tus pronósticos
          </p>
          {!user ? (
            <Link
              href="/register"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-12 py-5 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl"
            >
              🚀 Crear cuenta gratis
            </Link>
          ) : (
            <Link
              href="/matches"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-12 py-5 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl"
            >
              ⚽ Ver mis pronósticos
            </Link>
          )}
        </div>
      </section>

    </div>
  )
}
