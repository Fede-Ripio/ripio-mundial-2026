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
  if (['yahoo.com', 'yahoo.com.ar', 'yahoo.es', 'yahoo.com.mx', 'ymail.com'].includes(domain)) {
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
      <div className="max-w-sm w-full text-center">

        <div className="text-5xl mb-6">📬</div>

        <h1 className="text-2xl font-bold mb-2">Revisá tu email</h1>

        <p className="text-gray-400 text-sm mb-1">
          Te enviamos un link de acceso a
        </p>
        {email && (
          <p className="text-white font-semibold mb-6">{email}</p>
        )}

        {provider ? (
          <a
            href={provider.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-3 font-semibold px-6 py-4 rounded-xl transition-colors mb-3 ${provider.bgColor} ${provider.textColor}`}
          >
            <img
              src={provider.logo}
              alt=""
              width={20}
              height={20}
              className="w-5 h-5"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            Abrir {provider.name}
          </a>
        ) : (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-3 text-left">
            <p className="text-sm text-gray-300">
              Buscá el email de <strong className="text-white">Ripio Mundial</strong> en tu casilla y hacé click en el link de acceso.
            </p>
          </div>
        )}

        <p className="text-xs text-gray-600 mb-8">
          ¿No lo ves? Revisá la carpeta de spam o promociones
        </p>

        <Link
          href="/login"
          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
        >
          ← Reenviar link
        </Link>

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
