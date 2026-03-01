import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { GENERAL_LEAGUE_ID } from '@/lib/constants'
import Link from 'next/link'
import Hero from '@/components/Hero'

export const metadata: Metadata = {
  title: "Ripio Mundial 2026 — Pronosticá y ganá 1MM wARS",
  description: "Pronosticá los resultados del Mundial 2026 y ganá hasta 1MM wARS. Gratis, sin inversión. Competí con miles de usuarios.",
  openGraph: {
    title: "Ripio Mundial 2026 — Pronosticá y ganá 1MM wARS",
    description: "Pronosticá los resultados del Mundial 2026 y ganá hasta 1MM wARS. Gratis, sin inversión. Competí con miles de usuarios.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 601 }],
  },
}

const WARS_LOGO = 'https://cdn.prod.website-files.com/640b8191d2fdcfb39b135a5b/69121e0c7b24a0930d8e4efa_world_logos_wars_logo.svg'

const steps = [
  { n: '1', title: 'Registrate gratis', desc: 'Creá tu cuenta en segundos y unite a la liga general' },
  { n: '2', title: 'Pronosticá', desc: 'Elegí el resultado de cada partido antes de que empiece' },
  { n: '3', title: 'Sumá puntos', desc: '+3 por resultado exacto, +1 por acertar el ganador o empate' },
  { n: '4', title: 'Ganá premios', desc: 'Los mejores del ranking ganan wARS al final del Mundial' },
]

const PTS_COLOR: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-gray-300',
  3: 'text-orange-400',
}

function initials(name: string | null | undefined): string {
  if (!name) return '?'
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() ?? '').filter(Boolean).slice(0, 2).join('')
}

export default async function Home() {
  const supabase = await createServerSupabaseClient()

  const [
    { data: { user } },
    { data: leaderboardRows },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc('get_leaderboard', { p_league_id: GENERAL_LEAGUE_ID }),
  ])

  const leaderboard = (leaderboardRows ?? []) as Array<{
    user_id: string
    display_name: string | null
    points: number
  }>

  const top5 = leaderboard.slice(0, 5)
  const totalCount = leaderboard.length

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

      {/* Mini ranking — solo si hay participantes */}
      {top5.length > 0 && (
        <section className="py-16 bg-black">
          <div className="max-w-xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Ya hay {totalCount} {totalCount === 1 ? 'jugador' : 'jugadores'} en carrera
              </h2>
              <p className="text-gray-500 text-sm">
                El torneo arrancó. Todavía estás a tiempo de sumarte.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden mb-5">
              {top5.map((row, i) => {
                const pos = i + 1
                const ptColor = PTS_COLOR[pos] ?? 'text-gray-400'
                return (
                  <div
                    key={row.user_id}
                    className={`flex items-center gap-3 px-5 py-3.5 ${i < top5.length - 1 ? 'border-b border-gray-800/60' : ''}`}
                  >
                    {/* Position */}
                    <span className="w-7 text-center flex-shrink-0">
                      <span className="text-sm font-bold text-gray-500">#{pos}</span>
                    </span>

                    {/* Avatar initials */}
                    <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-purple-300 leading-none select-none">
                        {initials(row.display_name)}
                      </span>
                    </div>

                    {/* Name */}
                    <span className="flex-1 min-w-0 text-sm font-medium text-white truncate">
                      {row.display_name || 'Anónimo'}
                    </span>

                    {/* Points */}
                    <span className={`text-sm font-bold flex-shrink-0 tabular-nums ${ptColor}`}>
                      {row.points} pts
                    </span>
                  </div>
                )
              })}

              {totalCount > 5 && (
                <div className="px-5 py-3 text-center text-xs text-gray-600 border-t border-gray-800/60">
                  +{totalCount - 5} participantes más
                </div>
              )}
            </div>

            <div className="text-center">
              <Link
                href="/ranking"
                className="text-sm text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Ver ranking completo →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ¿Qué es wARS? */}
      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start gap-6 bg-gray-900/40 border border-gray-800 rounded-2xl p-6 sm:p-8">
            <img src={WARS_LOGO} alt="wARS" className="w-14 h-14 flex-shrink-0" />
            <div className="space-y-3">
              <h3 className="text-xl font-bold">¿Qué es wARS?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                wARS es la stablecoin de Ripio con paridad 1:1 con el peso argentino. Podés usarla, transferirla
                o generar rendimientos dentro del ecosistema Ripio, sin depender de bancos.
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Para recibir el premio necesitás tener una cuenta activa en la app de Ripio Argentina.
                Podés jugar desde cualquier país, pero el cobro se acredita en una cuenta argentina.
              </p>
              <a
                href="https://www.ripio.com/es/criptomonedas/wars"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Más info sobre wARS en ripio.com →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
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
              href="/registro"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-12 py-5 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl"
            >
              Crear cuenta gratis
            </Link>
          ) : (
            <Link
              href="/pronosticos"
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
