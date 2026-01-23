import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* HERO */}
      <section 
        className="relative min-h-[90vh] flex items-center px-4 sm:px-6 py-20 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 1000px 800px at 10% 120%, rgba(138, 43, 226, 0.4), transparent 70%), #000000'
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 sm:mb-8">
              Pronosticá el{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500">
                Mundial 2026
              </span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-2xl">
              Competí con miles de usuarios, ganá premios en wARS y viví el Mundial como nunca antes.
            </p>
            {!user ? (
              <Link 
                href="/register"
                className="inline-block bg-white text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg hover:bg-gray-100 transition-colors"
              >
                Mis pronósticos →
              </Link>
            ) : (
              <Link 
                href="/matches"
                className="inline-block bg-white text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg hover:bg-gray-100 transition-colors"
              >
                Mis pronósticos →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* PREMIOS */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <p className="text-purple-400 text-xs sm:text-sm font-bold tracking-wider mb-3 sm:mb-4">PREMIOS</p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-12 sm:mb-20">
            1.75M wARS en premios
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="border border-purple-500/30 rounded-2xl p-8 sm:p-10 hover:border-purple-500/60 transition-colors">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🥇</div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2 sm:mb-3">1MM wARS</div>
              <p className="text-gray-400 text-base sm:text-lg">Primer puesto</p>
            </div>

            <div className="border border-purple-500/30 rounded-2xl p-8 sm:p-10 hover:border-purple-500/60 transition-colors">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🥈</div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2 sm:mb-3">500K wARS</div>
              <p className="text-gray-400 text-base sm:text-lg">Segundo puesto</p>
            </div>

            <div className="border border-purple-500/30 rounded-2xl p-8 sm:p-10 hover:border-purple-500/60 transition-colors sm:col-span-2 md:col-span-1">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🥉</div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2 sm:mb-3">250K wARS</div>
              <p className="text-gray-400 text-base sm:text-lg">Tercer puesto</p>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <p className="text-purple-400 text-xs sm:text-sm font-bold tracking-wider mb-3 sm:mb-4">CÓMO FUNCIONA</p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-12 sm:mb-20">
            Simple, rápido<br className="hidden sm:block" /> y transparente
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="border border-purple-500/30 rounded-2xl p-8 sm:p-10">
              <div className="text-4xl sm:text-5xl font-bold text-purple-400/40 mb-4 sm:mb-6">01</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Registrate gratis</h3>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                Creá tu cuenta en segundos y unite a la liga general.
              </p>
            </div>

            <div className="border border-purple-500/30 rounded-2xl p-8 sm:p-10">
              <div className="text-4xl sm:text-5xl font-bold text-purple-400/40 mb-4 sm:mb-6">02</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Pronosticá</h3>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                Elegí el resultado de cada partido antes de que empiece.
              </p>
            </div>

            <div className="border border-purple-500/30 rounded-2xl p-8 sm:p-10">
              <div className="text-4xl sm:text-5xl font-bold text-purple-400/40 mb-4 sm:mb-6">03</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Sumá puntos</h3>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                +3 por resultado exacto, +1 por acertar ganador o empate.
              </p>
            </div>

            <div className="border border-purple-500/30 rounded-2xl p-8 sm:p-10">
              <div className="text-4xl sm:text-5xl font-bold text-purple-400/40 mb-4 sm:mb-6">04</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Competí y ganá</h3>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                Los mejores ganan wARS al final del torneo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 bg-gradient-to-t from-purple-950/20 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
            El Mundial empieza<br />en junio 2026
          </h2>
          <p className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Registrate ahora y empezá a armar tus pronósticos.
          </p>
          {!user ? (
            <Link 
              href="/register"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg transition-colors"
            >
              Crear cuenta gratis
            </Link>
          ) : (
            <Link 
              href="/matches"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg transition-colors"
            >
              Ver mis pronósticos
            </Link>
          )}
        </div>
      </section>

    </div>
  )
}
