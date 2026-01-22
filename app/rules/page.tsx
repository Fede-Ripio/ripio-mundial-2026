export default function RulesPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-8">📜 Reglas del Prode</h1>

        <div className="space-y-6">
          
          {/* Cómo funciona */}
          <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">🎯 Cómo Funciona</h2>
            <ol className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Registrate gratis con tu email y elegí un nombre de usuario único</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>Pronosticá el resultado de cada partido ANTES de que comience</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>Sumá puntos según tus aciertos (explicado abajo)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span>Competí en la liga general "Ripio Mundial" y/o creá ligas privadas con tus amigos</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                <span>¡Los mejores ganan premios en wARS al final del Mundial!</span>
              </li>
            </ol>
          </section>

          {/* Sistema de Puntaje */}
          <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">⭐ Sistema de Puntaje</h2>
            <div className="space-y-4">
              <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <div className="font-bold text-green-400 text-xl">+3 Puntos</div>
                    <div className="text-sm text-gray-300">Resultado exacto</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  <strong>Ejemplo:</strong> Pronosticaste Argentina 2-1 México y el resultado fue 2-1
                </p>
              </div>

              <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">✓</span>
                  <div>
                    <div className="font-bold text-yellow-400 text-xl">+1 Punto</div>
                    <div className="text-sm text-gray-300">Acertar ganador o empate (resultado 1X2)</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  <strong>Ejemplo:</strong> Pronosticaste 3-0 y el resultado fue 1-0 (ambos gana local)
                </p>
              </div>

              <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">✗</span>
                  <div>
                    <div className="font-bold text-red-400 text-xl">0 Puntos</div>
                    <div className="text-sm text-gray-300">No acertar el resultado</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  <strong>Ejemplo:</strong> Pronosticaste 2-0 (local gana) y el resultado fue 0-1 (visitante gana)
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <strong className="text-blue-400">ℹ️ Nota importante:</strong> Los resultados se evalúan según el marcador al final de los 90 minutos reglamentarios. No se consideran alargues ni penales para el puntaje.
              </p>
            </div>
          </section>

          {/* Cierre de pronósticos */}
          <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">⏰ Cierre de Pronósticos</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-blue-400 text-xl">•</span>
                <span>Los pronósticos se cierran <strong className="text-white">automáticamente</strong> cuando comienza cada partido</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 text-xl">•</span>
                <span>Podés modificar tu pronóstico <strong className="text-white">las veces que quieras</strong> hasta el momento del kickoff</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 text-xl">•</span>
                <span>Una vez iniciado el partido, <strong className="text-white">no se aceptan cambios</strong> (los inputs se deshabilitan)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 text-xl">•</span>
                <span>Si no hiciste un pronóstico antes del cierre, <strong className="text-white">no sumás puntos</strong> en ese partido</span>
              </li>
            </ul>
          </section>

          {/* Premios */}
          <section className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 border-2 border-yellow-600/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">🏆 Premios Liga General "Ripio Mundial"</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center bg-yellow-600/10 rounded-xl p-6">
                <div className="text-5xl mb-2">🥇</div>
                <div className="text-3xl font-bold text-yellow-400">1MM wARS</div>
                <div className="text-sm text-gray-400 mt-2">Primer Puesto</div>
              </div>
              <div className="text-center bg-gray-400/10 rounded-xl p-6">
                <div className="text-5xl mb-2">🥈</div>
                <div className="text-3xl font-bold text-gray-300">500K wARS</div>
                <div className="text-sm text-gray-400 mt-2">Segundo Puesto</div>
              </div>
              <div className="text-center bg-orange-600/10 rounded-xl p-6">
                <div className="text-5xl mb-2">🥉</div>
                <div className="text-3xl font-bold text-orange-400">250K wARS</div>
                <div className="text-sm text-gray-400 mt-2">Tercer Puesto</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 text-center">
              Los premios se entregan al finalizar el Mundial 2026
            </p>
          </section>

          {/* Desempate */}
          <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">⚖️ Criterios de Desempate</h2>
            <p className="text-gray-300 mb-4">En caso de igualdad de puntos en el ranking, se desempata en el siguiente orden:</p>
            <ol className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="font-bold text-blue-400">1°</span>
                <span>Mayor cantidad de <strong className="text-white">resultados exactos</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-400">2°</span>
                <span>Mayor cantidad de <strong className="text-white">aciertos 1X2</strong> (ganador/empate)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-400">3°</span>
                <span>Fecha de registro <strong className="text-white">más antigua</strong> (primero en registrarse)</span>
              </li>
            </ol>
          </section>

          {/* Ligas Privadas */}
          <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">🏅 Ligas Privadas</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Además de competir en la liga general, podés <strong className="text-white">crear ligas privadas</strong> para jugar con amigos, familia o colegas:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex gap-2">
                  <span className="text-blue-400">→</span>
                  <span>Cada usuario puede crear <strong className="text-white">múltiples ligas</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">→</span>
                  <span>Al crear una liga, obtenés un <strong className="text-white">código de invitación único</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">→</span>
                  <span>Compartí el código con quienes quieras que participen</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">→</span>
                  <span>Cada liga tiene su <strong className="text-white">ranking independiente</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">→</span>
                  <span>Los premios en ligas privadas los definen los participantes 🎁</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Fair Play */}
          <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">🤝 Fair Play</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>Los pronósticos son <strong className="text-white">privados</strong> hasta que cierra cada partido</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>Los resultados se actualizan <strong className="text-white">automáticamente</strong> desde fuentes oficiales</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>El sistema es <strong className="text-white">100% transparente</strong>: todos compiten con las mismas reglas</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">✗</span>
                <span>Está prohibido crear <strong className="text-white">múltiples cuentas</strong> para una misma persona</span>
              </li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-3 text-blue-400">⚠️ Términos y Condiciones</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                • Este prode es organizado por Ripio y está sujeto a los términos y condiciones de la plataforma.
              </p>
              <p>
                • Los premios en wARS se entregarán a las wallets registradas de los ganadores dentro de los 30 días posteriores a la final del Mundial 2026.
              </p>
              <p>
                • Ripio se reserva el derecho de descalificar participantes que violen las reglas de fair play o intenten manipular el sistema.
              </p>
              <p>
                • En caso de empate no resuelto por los criterios de desempate, Ripio se reserva el derecho de dividir el premio equitativamente.
              </p>
            </div>
          </section>

        </div>

      </div>
    </div>
  )
}
