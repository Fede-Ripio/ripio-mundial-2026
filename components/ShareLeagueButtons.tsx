'use client'

import { useState } from 'react'

interface ShareLeagueButtonsProps {
  leagueName: string
  inviteCode: string
  leagueId: string
}

export default function ShareLeagueButtons({ leagueName, inviteCode, leagueId }: ShareLeagueButtonsProps) {
  const [copied, setCopied] = useState(false)
  
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : ''
  
  const leagueUrl = `${baseUrl}/leagues?code=${inviteCode}`
  
  const message = `🏆 Unite a mi liga "${leagueName}" en Ripio Mundial 2026!\n\nCódigo: ${inviteCode}\n\nEntrá acá: ${leagueUrl}`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(leagueUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(leagueUrl)}&text=${encodeURIComponent(`🏆 Unite a mi liga "${leagueName}" en Ripio Mundial 2026!\n\nCódigo: ${inviteCode}`)}`
    window.open(telegramUrl, '_blank')
  }

  const handleX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🏆 Unite a mi liga "${leagueName}" en Ripio Mundial 2026!\n\nCódigo: ${inviteCode}\n${leagueUrl}`)}`
    window.open(xUrl, '_blank')
  }

  return (
    <div className="space-y-4">
      
      {/* Explicación de opciones */}
      <div className="bg-purple-900/10 border border-purple-500/30 rounded-xl p-4 text-sm text-gray-400">
        <strong className="text-purple-400">Opciones de compartir:</strong>
        <ul className="mt-2 space-y-1 ml-4">
          <li>• <strong className="text-white">Copiar código:</strong> Solo el código (ej: XAIXKY)</li>
          <li>• <strong className="text-white">Copiar link:</strong> URL directa para unirse</li>
          <li>• <strong className="text-white">Copiar mensaje:</strong> Invitación completa con texto + código + link</li>
        </ul>
      </div>

      {/* Copiar código/link/mensaje */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          onClick={handleCopyCode}
          className="bg-gray-800 hover:bg-gray-700 border border-purple-500/30 text-white px-2 sm:px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2"
        >
          <span className="text-lg sm:text-base">📋</span>
          <span className="hidden sm:inline">Código</span>
        </button>
        
        <button
          onClick={handleCopyLink}
          className="bg-gray-800 hover:bg-gray-700 border border-purple-500/30 text-white px-2 sm:px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2"
        >
          <span className="text-lg sm:text-base">🔗</span>
          <span className="hidden sm:inline">Link</span>
        </button>

        <button
          onClick={handleCopyMessage}
          className="bg-gray-800 hover:bg-gray-700 border border-purple-500/30 text-white px-2 sm:px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2"
        >
          <span className="text-lg sm:text-base">💬</span>
          <span className="hidden sm:inline">Mensaje</span>
        </button>
      </div>

      {copied && (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm text-center">
          ✅ Copiado al portapapeles
        </div>
      )}

      {/* Preview de URL generada */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-xs text-gray-500 font-mono overflow-x-auto">
        {leagueUrl}
      </div>

      {/* Compartir en redes */}
      <div>
        <div className="text-sm text-gray-400 mb-3">Compartir directamente en:</div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          
          <button
            onClick={handleWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2"
          >
            <span className="text-xl">💬</span>
            <span className="text-xs sm:text-sm">WhatsApp</span>
          </button>

          <button
            onClick={handleTelegram}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2"
          >
            <span className="text-xl">✈️</span>
            <span className="text-xs sm:text-sm">Telegram</span>
          </button>

          <button
            onClick={handleX}
            className="bg-black hover:bg-gray-900 border border-gray-700 text-white px-2 sm:px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center"
          >
            <span className="text-2xl">𝕏</span>
          </button>

        </div>
      </div>

    </div>
  )
}
