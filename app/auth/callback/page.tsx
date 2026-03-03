'use client'

/**
 * Auth Callback — procesado CLIENT-SIDE intencionalmente.
 *
 * Por qué client-side y no un Route Handler (route.ts):
 * Los escáneres de seguridad de email (Gmail, Outlook, Barracuda, etc.)
 * hacen un GET al link del email antes de que el usuario lo abra,
 * para verificar que no sea phishing. Si el exchange ocurre server-side,
 * el escáner consume el código OTP de un solo uso y el usuario recibe
 * "link expirado" al intentar ingresar.
 *
 * Los escáneres no ejecutan JavaScript, así que al hacer el exchange
 * en un useEffect, el código queda intacto hasta que el navegador del
 * usuario real ejecuta el JS.
 */

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/pronosticos'

    if (!code) {
      router.replace('/ingresa?error=invalid_link')
      return
    }

    const supabase = createClient()

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('Auth callback error:', error.message)
        setError(error.message)
        setTimeout(() => {
          router.replace('/ingresa?error=invalid_link')
        }, 1500)
        return
      }

      router.replace(next)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-400">Link inválido. Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">⚽</div>
        <p className="text-gray-400">Verificando acceso...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚽</div>
          <p className="text-gray-400">Verificando acceso...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
