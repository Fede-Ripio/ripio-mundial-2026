import Image from 'next/image'
import Link from 'next/link'

const WARS_LOGO = 'https://cdn.prod.website-files.com/640b8191d2fdcfb39b135a5b/69121e0c7b24a0930d8e4efa_world_logos_wars_logo.svg'

export default function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] w-full overflow-x-hidden bg-gradient-to-b from-purple-950 via-purple-900 to-black flex flex-col">

      <div className="absolute inset-0">
        <Image
          src="/images/hero-desktop.jpg"
          alt="Ripio Mundial 2026"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover hidden md:block"
        />
        <Image
          src="/images/hero-tablet.jpg"
          alt="Ripio Mundial 2026"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover hidden sm:block md:hidden"
        />
        <Image
          src="/images/hero-mobile.jpg"
          alt="Ripio Mundial 2026"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover block sm:hidden"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

      <div className="relative z-10 flex-1 flex items-center justify-center py-16">
        <div className="max-w-4xl mx-auto px-6 w-full text-center">

          <div className="inline-flex items-center gap-2 bg-purple-600/90 backdrop-blur-sm border border-purple-400/30 rounded-full px-5 py-2.5 mb-8">
            <span className="text-sm font-semibold text-white">Mundial 2026</span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 leading-none">
            <span className="block text-white drop-shadow-2xl mb-2">RIPIO</span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">MUNDIAL</span>
          </h1>

          <p className="text-2xl sm:text-3xl md:text-4xl text-white mb-12 font-semibold drop-shadow-xl">
            Pronosticá resultados y ganá premios
          </p>

          {/* Prizes box */}
          <div className="bg-black/70 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 sm:p-8 mb-10 max-w-2xl mx-auto shadow-2xl">
            {/* wARS logo + label */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={WARS_LOGO} alt="wARS" className="w-10 h-10" />
              <span className="text-base sm:text-lg text-white font-bold tracking-wide">Premios en wARS</span>
            </div>
            {/* Prize amounts */}
            <div className="flex items-end justify-center gap-6 sm:gap-12">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl mb-2">🥇</div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400">1MM</div>
                <div className="text-xs text-gray-500 mt-1">1er puesto</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl mb-2">🥈</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-300">500K</div>
                <div className="text-xs text-gray-500 mt-1">2do puesto</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl mb-2">🥉</div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-300">250K</div>
                <div className="text-xs text-gray-500 mt-1">3er puesto</div>
              </div>
            </div>
          </div>

          {!isLoggedIn ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link href="/registro" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl min-w-[220px]">
                Registrarse
              </Link>
              <Link href="/ingresa" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/40 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all min-w-[220px]">
                Iniciar sesión
              </Link>
            </div>
          ) : (
            <Link href="/pronosticos" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl mb-6">
              Mis Pronósticos
            </Link>
          )}

          <p className="text-sm text-gray-300">Gratis · Sin inversión · Competí con miles de usuarios</p>

        </div>
      </div>

    </section>
  )
}
