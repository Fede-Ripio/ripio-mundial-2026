'use client'

/**
 * Auth Callback — procesado CLIENT-SIDE intencionalmente.
 *
 * Por qué client-side:
 * Los escáneres de seguridad de email (Gmail, Outlook, Barracuda, etc.)
 * hacen un GET al link del email antes de que el usuario lo abra.
 * Al hacer el exchange en un useEffect, los escáneres (que no ejecutan JS)
 * no consumen el token.
 *
 * Flujo token_hash (preferido, activado via Supabase email template):
 * El email apunta directamente a este callback con ?token_hash=XXX&type=email.
 * Nunca pasa por el endpoint /auth/v1/verify de Supabase en el servidor, por
 * lo que scanners corporativos que sigan la cadena completa de redirects
 * tampoco pueden consumir el OTP.
 *
 * Flujo code (fallback PKCE):
 * Para links generados con el template anterior. Se mantiene por compatibilidad.
 */

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type') as 'email' | 'recovery' | 'invite' | null
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/pronosticos'

    const supabase = createClient()

    if (tokenHash && type) {
      // Flujo token_hash: la verificación ocurre en el browser del usuario real.
      // Scanners obtienen HTML (200) y no ejecutan JS → token intacto.
      supabase.auth.verifyOtp({ token_hash: tokenHash, type }).then(({ error }) => {
        if (error) {
          console.error('Auth callback error (token_hash):', error.message)
          setError(error.message)
          setTimeout(() => router.replace('/ingresa?error=invalid_link'), 1500)
          return
        }
        router.replace(next)
      })
      return
    }

    if (code) {
      // Flujo PKCE code (fallback para links emitidos con template anterior)
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.error('Auth callback error (code):', error.message)
          setError(error.message)
          setTimeout(() => router.replace('/ingresa?error=invalid_link'), 1500)
          return
        }
        router.replace(next)
      })
      return
    }

    router.replace('/ingresa?error=invalid_link')
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
