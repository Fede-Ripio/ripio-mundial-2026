import Image from 'next/image'
import Link from 'next/link'

export default function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
      
      <div className="absolute inset-0">
        <Image
          src="/images/hero-desktop.jpg"
          alt="Ripio Mundial 2026"
          fill
          priority
          quality={90}
          className="object-cover hidden md:block"
        />
        
        <Image
          src="/images/hero-tablet.jpg"
          alt="Ripio Mundial 2026"
          fill
          priority
          quality={90}
          className="object-cover hidden sm:block md:hidden"
        />
        
        <Image
          src="/images/hero-mobile.jpg"
          alt="Ripio Mundial 2026"
          fill
          priority
          quality={90}
          className="object-cover block sm:hidden"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 w-full text-center">
          
          <div className="inline-flex items-center gap-2 bg-purple-600/90 backdrop-blur-sm border border-purple-400/30 rounded-full px-5 py-2.5 mb-8">
            <span className="text-2xl">⚽</span>
            <span className="text-sm font-semibold text-white">Mundial 2026</span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 leading-none">
            <span className="block text-white drop-shadow-2xl mb-2">RIPIO</span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">MUNDIAL</span>
          </h1>

          <p className="text-2xl sm:text-3xl md:text-4xl text-white mb-12 font-semibold drop-shadow-xl">
            Pronosticá resultados y ganá premios
          </p>

          <div className="bg-black/80 backdrop-blur-md border-2 border-purple-500/50 rounded-2xl p-8 mb-10 max-w-2xl mx-auto shadow-2xl">
            <div className="text-base text-purple-300 font-semibold mb-6 tracking-wider">PREMIOS EN wARS</div>
            <div className="flex items-center justify-center gap-12 sm:gap-16">
              <div>
                <div className="text-5xl sm:text-6xl mb-3">🥇</div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400">1MM</div>
              </div>
              <div>
                <div className="text-5xl sm:text-6xl mb-3">🥈</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-300">500K</div>
              </div>
              <div>
                <div className="text-5xl sm:text-6xl mb-3">🥉</div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-400">250K</div>
              </div>
            </div>
          </div>

          {!isLoggedIn ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link href="/register" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl min-w-[220px]">
                🚀 Empezar ahora
              </Link>
              <Link href="/login" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/40 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all min-w-[220px]">
                Iniciar sesión
              </Link>
            </div>
          ) : (
            <Link href="/matches" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl mb-6">
              ⚽ Mis Pronósticos
            </Link>
          )}

          <p className="text-sm text-gray-300">Gratis • Sin inversión • Competí con miles de usuarios</p>

        </div>
      </div>

    </section>
  )
}
