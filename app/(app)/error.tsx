'use client'

import { useEffect } from 'react'

export default function AppError({
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
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">

        <div className="text-5xl mb-4">🚨</div>

        <h2 className="text-xl font-bold text-white mb-2">
          Algo salió mal
        </h2>

        <p className="text-gray-400 mb-6 text-sm">
          Ocurrió un error al cargar esta sección.
        </p>

        <button
          onClick={reset}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-all transform hover:scale-105"
        >
          Intentar de nuevo
        </button>

      </div>
    </div>
  )
}
