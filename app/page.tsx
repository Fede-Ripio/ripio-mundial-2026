import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import Hero from '@/components/Hero'

const WARS_LOGO = 'https://cdn.prod.website-files.com/640b8191d2fdcfb39b135a5b/69121e0c7b24a0930d8e4efa_world_logos_wars_logo.svg'

const steps = [
  { n: '1', title: 'Registrate gratis', desc: 'Creá tu cuenta en segundos y unite a la liga general' },
  { n: '2', title: 'Pronosticá', desc: 'Elegí el resultado de cada partido antes de que empiece' },
  { n: '3', title: 'Sumá puntos', desc: '+3 por resultado exacto, +1 por acertar el ganador o empate' },
  { n: '4', title: 'Ganá premios', desc: 'Los mejores del ranking ganan wARS al final del Mundial' },
]

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-black text-white">

      <Hero isLoggedIn={!!user} />

      {/* Cómo funciona */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">¿Cómo funciona?</h2>
            <p className="text-gray-400">Simple, rápido y transparente</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/40 transition-all">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center mb-4">
                  {s.n}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premios */}
      <section className="py-20 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            {/* wARS logo grande */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src={WARS_LOGO} alt="wARS" className="w-16 h-16" />
              <div className="text-left">
                <div className="text-3xl sm:text-4xl font-bold">1.75M wARS</div>
                <div className="text-gray-400 text-sm">en premios · Liga General Ripio Mundial</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-700/10 border-2 border-yellow-500/40 rounded-2xl p-6 text-center">
              <div className="text-6xl mb-3">🥇</div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <img src={WARS_LOGO} alt="wARS" className="w-5 h-5" />
                <span className="text-3xl font-bold text-yellow-400">1MM</span>
              </div>
              <div className="text-sm text-gray-400">Primer puesto</div>
            </div>

            <div className="bg-gradient-to-br from-gray-700/20 to-gray-600/10 border-2 border-gray-500/40 rounded-2xl p-6 text-center">
              <div className="text-6xl mb-3">🥈</div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <img src={WARS_LOGO} alt="wARS" className="w-5 h-5" />
                <span className="text-3xl font-bold text-gray-300">500K</span>
              </div>
              <div className="text-sm text-gray-400">Segundo puesto</div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/20 to-orange-700/10 border-2 border-orange-500/40 rounded-2xl p-6 text-center">
              <div className="text-6xl mb-3">🥉</div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <img src={WARS_LOGO} alt="wARS" className="w-5 h-5" />
                <span className="text-3xl font-bold text-orange-400">250K</span>
              </div>
              <div className="text-sm text-gray-400">Tercer puesto</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-t from-purple-900/20 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            El Mundial empieza en junio 2026
          </h2>
          <p className="text-gray-400 mb-10">
            Registrate ahora y empezá a armar tus pronósticos
          </p>
          {!user ? (
            <Link
              href="/register"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-12 py-5 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl"
            >
              Crear cuenta gratis
            </Link>
          ) : (
            <Link
              href="/matches"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-12 py-5 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl"
            >
              Ver mis pronósticos
            </Link>
          )}
        </div>
      </section>

    </div>
  )
}
