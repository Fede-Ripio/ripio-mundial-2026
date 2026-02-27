'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import RipioLogo from './RipioLogo'

export default function NavbarClient({ user }: { user: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [displayName, setDisplayName] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const supabase = createClient()
      supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          setDisplayName(data?.display_name || user.email?.split('@')[0] || 'Usuario')
        })
    }
  }, [user])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
    router.push('/')
    router.refresh()
  }

  const links = [
    { href: '/matches', label: 'Partidos' },
    { href: '/leaderboard', label: 'Ranking' },
    { href: '/leagues', label: 'Ligas' },
    { href: '/rules', label: 'Reglas' },
    { href: '/predictions-wars', label: 'Predecí wARS' },
  ]

  return (
    <nav className="bg-black border-b border-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <RipioLogo className="h-10 sm:h-12 text-white" />
            <span className="font-bold text-lg sm:text-xl text-white">Mundial 2026</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href 
                    ? 'text-purple-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/me"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-gray-900 px-3 py-2 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{displayName || 'Cargando...'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Salir</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-900">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium ${
                    pathname === link.href ? 'text-purple-400' : 'text-gray-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-900 flex flex-col gap-3">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-gray-400"
                    >
                      Ingresar
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
                    >
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-900 px-4 py-2 rounded-lg">
                      <div className="text-xs text-gray-500">Sesión iniciada</div>
                      <div className="text-sm font-semibold text-purple-400">{displayName}</div>
                    </div>
                    <Link
                      href="/me"
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-gray-400 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Mi Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-gray-500 text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
