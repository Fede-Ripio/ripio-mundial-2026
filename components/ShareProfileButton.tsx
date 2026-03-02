'use client'

import { useState } from 'react'

interface ShareProfileButtonProps {
  position: number | null
  points: number
  total: number
}

export default function ShareProfileButton({ position, points, total }: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false)

  if (!position) return null

  const text = `Estoy #${position} de ${total} en Ripio Mundial 2026 con ${points} puntos. ¿Me superás? 👉 ripio-mundial-2026.vercel.app`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text })
        return
      } catch {
        // Si el usuario cancela, no hacemos nada
        return
      }
    }
    // Fallback: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // noop
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex-1 border border-purple-500/50 hover:bg-purple-900/20 text-purple-300 hover:text-white text-center font-semibold px-6 py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-400">¡Copiado!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Compartir posición
        </>
      )}
    </button>
  )
}
