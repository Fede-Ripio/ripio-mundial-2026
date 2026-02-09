'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const errorParam = searchParams.get('error')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Verificar que el email existe en profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (!profile) {
        throw new Error('Este email no está registrado. ¿Querés crear una cuenta?')
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      router.push('/auth/check-email')
    } catch (err: any) {
      setError(err.message || 'Error al enviar el email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold">
              <span className="text-purple-400">Ripio</span> Mundial 2026
            </h1>
          </Link>
          <h2 className="text-2xl font-bold mb-2">Iniciar sesión</h2>
          <p className="text-gray-400 text-sm">
            Te enviamos un link de acceso por email
          </p>
        </div>

        {errorParam === 'invalid_link' && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">
              ❌ El link venció o ya fue usado. Pedí uno nuevo.
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              <div className="mb-2">❌ {error}</div>
              {error.includes('no está registrado') && (
                <Link 
                  href="/register"
                  className="inline-block mt-2 text-purple-400 hover:text-purple-300 font-semibold underline"
                >
                  Crear cuenta →
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <>⏳ Enviando...</> : <>📧 Continuar</>}
          </button>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-300">
              💡 Sin contraseñas. Ingresás con un link seguro por email.
            </p>
          </div>

        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">¿No tenés cuenta? </span>
          <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
            Registrate gratis
          </Link>
        </div>

      </div>
    </div>
  )
}
