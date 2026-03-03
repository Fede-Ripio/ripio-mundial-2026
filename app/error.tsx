'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">

        <div className="text-7xl mb-6">🚨</div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Algo salió mal
        </h1>

        <p className="text-gray-400 mb-8">
          Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-all transform hover:scale-105 shadow-xl w-full sm:w-auto"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-xl transition-all w-full sm:w-auto text-center"
          >
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  )
}
