'use client'

import { useState } from 'react'

interface ShareLeagueCompactProps {
  leagueName: string
  inviteCode: string
  leagueId: string
}

export default function ShareLeagueCompact({ leagueName, inviteCode, leagueId }: ShareLeagueCompactProps) {
  const [copied, setCopied] = useState(false)
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const leagueUrl = `${baseUrl}/leagues?code=${inviteCode}`
  
  const message = `¡Unite a mi liga "${leagueName}" en Ripio Mundial 2026!\n\nCódigo: ${inviteCode}\nLink: ${leagueUrl}`

  const handleCopyInvitation = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="bg-gray-900/30 border border-purple-500/30 rounded-2xl p-6">
      <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
        <span>🔗</span>
        <span>Invitar a la liga</span>
      </h3>

      {/* Código grande */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2 text-center">Código de invitación</div>
        <div className="bg-gray-800 border-2 border-purple-500/50 rounded-xl py-4 px-6 text-center">
          <code className="text-2xl sm:text-3xl font-bold font-mono text-purple-400 tracking-wider">
            {inviteCode}
          </code>
        </div>
      </div>

      {/* Botones */}
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={handleCopyInvitation}
          className="bg-gray-800 hover:bg-gray-700 border border-purple-500/30 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>📋</span>
          <span>{copied ? '✅ Copiado!' : 'Copiar invitación'}</span>
        </button>
        
        <button
          onClick={handleWhatsApp}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>💬</span>
          <span>WhatsApp</span>
        </button>
      </div>

      {copied && (
        <div className="mt-3 bg-green-900/20 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm text-center">
          Invitación copiada al portapapeles
        </div>
      )}
    </div>
  )
}
