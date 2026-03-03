import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página no encontrada',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">

        <div className="text-7xl mb-6">⚽</div>

        <h1 className="text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-2xl font-bold text-white mb-3">
          Página no encontrada
        </h2>

        <p className="text-gray-400 mb-8">
          La página que buscás no existe o fue movida.
        </p>

        <Link
          href="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-all transform hover:scale-105 shadow-xl"
        >
          Volver al inicio
        </Link>

      </div>
    </div>
  )
}
