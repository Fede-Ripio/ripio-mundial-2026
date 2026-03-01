import Link from 'next/link'

export const metadata = {
  title: 'Reglas · Ripio Mundial 2026',
}

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12 px-4 sm:px-6">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Ripio Mundial 2026</p>
        <h1 className="text-3xl sm:text-4xl font-bold">Reglas</h1>
      </div>

      <div className="max-w-2xl space-y-10">

        {/* Cómo jugar */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-purple-400 uppercase tracking-wide">Cómo jugar</h2>
          <p className="text-gray-300 leading-relaxed">
            Antes de que empiece cada partido, ingresá tu pronóstico del marcador final.
            Una vez que el partido comienza, los pronósticos se cierran y no se pueden modificar.
          </p>
          <p className="text-gray-300 leading-relaxed">
            No hace falta pronosticar todos los partidos — cada partido que acertás suma puntos de forma independiente.
          </p>
        </section>

        {/* Sistema de puntos */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-purple-400 uppercase tracking-wide">Sistema de puntos</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-green-900/20 border border-green-500/20">
              <span className="text-2xl font-bold text-green-400 w-8 text-center flex-shrink-0">3</span>
              <div>
                <p className="font-semibold text-green-300">Pronóstico exacto</p>
                <p className="text-sm text-gray-400 mt-0.5">
                  Acertaste el marcador exacto. Ej: pronosticaste 2-1 y terminó 2-1.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-900/20 border border-yellow-500/20">
              <span className="text-2xl font-bold text-yellow-400 w-8 text-center flex-shrink-0">1</span>
              <div>
                <p className="font-semibold text-yellow-300">Resultado correcto</p>
                <p className="text-sm text-gray-400 mt-0.5">
                  Acertaste el ganador (o el empate) pero no el marcador. Ej: pronosticaste 1-0 y terminó 3-1.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-900/40 border border-gray-800">
              <span className="text-2xl font-bold text-gray-600 w-8 text-center flex-shrink-0">0</span>
              <div>
                <p className="font-semibold text-gray-500">Sin acierto</p>
                <p className="text-sm text-gray-600 mt-0.5">
                  El resultado fue diferente al pronosticado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ranking */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-purple-400 uppercase tracking-wide">Ranking y desempate</h2>
          <p className="text-gray-300 leading-relaxed">
            La clasificación se ordena por puntos totales. En caso de empate se desempata en este orden:
          </p>
          <div className="space-y-2">
            {[
              'Mayor cantidad de pronósticos exactos (+3 pts)',
              'Mayor cantidad de resultados correctos (+1 pt)',
              'Fecha de registro más antigua (quién se anotó primero)',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded-full bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Fase eliminatoria */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-purple-400 uppercase tracking-wide">Fase eliminatoria</h2>
          <p className="text-gray-300 leading-relaxed">
            Los partidos de eliminación directa (desde octavos en adelante) se habilitan automáticamente
            una vez que los equipos clasificados quedan definidos. Hasta ese momento el partido aparece
            bloqueado y no se pueden ingresar pronósticos.
          </p>
        </section>

        {/* Premios */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-purple-400 uppercase tracking-wide">Premios</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-yellow-500/30 rounded-xl p-4 text-center bg-yellow-900/10">
              <div className="text-xs text-gray-500 mb-1">1er puesto</div>
              <div className="text-xl font-bold text-yellow-400">1M</div>
              <div className="text-xs text-gray-400 mt-0.5">wARS</div>
            </div>
            <div className="border border-gray-600/30 rounded-xl p-4 text-center bg-gray-900/20">
              <div className="text-xs text-gray-500 mb-1">2do puesto</div>
              <div className="text-xl font-bold text-gray-300">500K</div>
              <div className="text-xs text-gray-400 mt-0.5">wARS</div>
            </div>
            <div className="border border-orange-500/30 rounded-xl p-4 text-center bg-orange-900/10">
              <div className="text-xs text-gray-500 mb-1">3er puesto</div>
              <div className="text-xl font-bold text-orange-400">250K</div>
              <div className="text-xs text-gray-400 mt-0.5">wARS</div>
            </div>
          </div>
        </section>

        {/* Ligas */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-purple-400 uppercase tracking-wide">Ligas privadas</h2>
          <p className="text-gray-300 leading-relaxed">
            Podés crear una liga privada y compartir el código con tus amigos o compañeros para competir
            en un ranking separado. Todos los jugadores también participan automáticamente en la liga general.
          </p>
        </section>

        <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row gap-3">
          <Link
            href="/matches"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Ir a los partidos
          </Link>
          <Link
            href="/leaderboard"
            className="flex-1 border border-gray-700 hover:border-gray-600 text-white text-center font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Ver clasificación
          </Link>
        </div>

      </div>
    </div>
  )
}
