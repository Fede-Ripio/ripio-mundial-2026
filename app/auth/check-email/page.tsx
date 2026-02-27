'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface EmailProvider {
  name: string
  url: string
  bgColor: string
  textColor: string
  logo: string
}

function getEmailProvider(email: string): EmailProvider | null {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return null

  if (['gmail.com', 'googlemail.com'].includes(domain)) {
    return {
      name: 'Gmail',
      url: 'https://mail.google.com',
      bgColor: 'bg-white hover:bg-gray-100',
      textColor: 'text-gray-800',
      logo: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    }
  }
  if (['hotmail.com', 'outlook.com', 'live.com', 'msn.com',
       'hotmail.es', 'hotmail.com.ar', 'live.com.ar', 'outlook.es'].includes(domain)) {
    return {
      name: 'Outlook',
      url: 'https://outlook.live.com',
      bgColor: 'bg-[#0072C6] hover:bg-[#005ea2]',
      textColor: 'text-white',
      logo: 'https://outlook.live.com/favicon.ico',
    }
  }
  if (['yahoo.com', 'yahoo.com.ar', 'yahoo.es', 'yahoo.com.mx',
       'ymail.com'].includes(domain)) {
    return {
      name: 'Yahoo Mail',
      url: 'https://mail.yahoo.com',
      bgColor: 'bg-[#6001D2] hover:bg-[#4f00ad]',
      textColor: 'text-white',
      logo: 'https://mail.yahoo.com/favicon.ico',
    }
  }
  if (['icloud.com', 'me.com', 'mac.com'].includes(domain)) {
    return {
      name: 'iCloud Mail',
      url: 'https://www.icloud.com/mail',
      bgColor: 'bg-[#1c8ef9] hover:bg-[#0070e0]',
      textColor: 'text-white',
      logo: 'https://www.icloud.com/favicon.ico',
    }
  }
  if (['proton.me', 'protonmail.com', 'pm.me'].includes(domain)) {
    return {
      name: 'Proton Mail',
      url: 'https://mail.proton.me',
      bgColor: 'bg-[#6d4aff] hover:bg-[#5735eb]',
      textColor: 'text-white',
      logo: 'https://proton.me/favicon.ico',
    }
  }
  return null
}

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const provider = email ? getEmailProvider(email) : null

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-8 text-center">

          <div className="text-6xl mb-6">📬</div>

          <h1 className="text-3xl font-bold mb-4">¡Revisá tu email!</h1>

          <p className="text-gray-300 mb-2 leading-relaxed text-lg">
            Te enviamos un <strong className="text-purple-400">link de acceso</strong> a tu casilla.
          </p>

          {email && (
            <p className="text-sm text-gray-500 mb-6">{email}</p>
          )}

          {/* Botón directo al proveedor */}
          {provider ? (
            <a
              href={provider.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-3 font-semibold px-6 py-4 rounded-xl transition-colors mb-4 ${provider.bgColor} ${provider.textColor}`}
            >
              <img
                src={provider.logo}
                alt={provider.name}
                width={20}
                height={20}
                className="w-5 h-5"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              Abrir {provider.name}
            </a>
          ) : (
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-300 font-semibold mb-1">
                📧 Hacé click en el link del email
              </p>
              <p className="text-xs text-gray-400">
                Te va a llevar directo al sitio sin pedir contraseña
              </p>
            </div>
          )}

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-300">
              <strong>💡 ¿No lo ves?</strong> Revisá la carpeta de <strong className="text-white">spam o promociones</strong>
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-400 border-t border-gray-700 pt-4">
            <p>⏱️ El link expira en <strong className="text-white">1 hora</strong></p>
            <p>🔒 Funciona una sola vez por seguridad</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold text-sm"
            >
              ← Enviar otro link
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  )
}
