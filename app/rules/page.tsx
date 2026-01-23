export default function RulesPage() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12">📜 Reglas del Prode</h1>

        <div className="space-y-8">
          
          <section className="border border-purple-500/30 rounded-2xl p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-400">🎯 Cómo Funciona</h2>
            <ol className="space-y-4 text-gray-300">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Registrate gratis con tu email</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>Pronosticá el resultado de cada partido ANTES de que comience</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>Sumá puntos según tus aciertos</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span>Competí y ganá premios en wARS</span>
              </li>
            </ol>
          </section>

          <section className="border border-purple-500/30 rounded-2xl p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-400">⭐ Sistema de Puntaje</h2>
            <div className="space-y-6">
              <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">🎯</span>
                  <div>
                    <div className="font-bold text-green-400 text-2xl">+3 Puntos</div>
                    <div className="text-sm text-gray-400">Resultado exacto</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Ejemplo: Pronosticaste 2-1 y el resultado fue 2-1
                </p>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/40 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">✓</span>
                  <div>
                    <div className="font-bold text-yellow-400 text-2xl">+1 Punto</div>
                    <div className="text-sm text-gray-400">Acertar ganador o empate</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Ejemplo: Pronosticaste 3-0 y salió 1-0 (ambos gana local)
                </p>
              </div>
            </div>
          </section>

          <section className="border-2 border-purple-500/50 rounded-2xl p-8 bg-purple-900/10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-400">🏆 Premios</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-2">🥇</div>
                <div className="text-3xl font-bold text-yellow-400">1MM wARS</div>
                <div className="text-sm text-gray-400 mt-2">Primer Puesto</div>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-2">🥈</div>
                <div className="text-3xl font-bold text-gray-300">500K wARS</div>
                <div className="text-sm text-gray-400 mt-2">Segundo Puesto</div>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-2">🥉</div>
                <div className="text-3xl font-bold text-orange-400">250K wARS</div>
                <div className="text-sm text-gray-400 mt-2">Tercer Puesto</div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
