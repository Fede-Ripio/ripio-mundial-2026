'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import RipioLogo from './RipioLogo'

interface NavProfile {
  display_name: string | null
  avatar_url: string | null
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map(word => word[0]?.toUpperCase() ?? '')
    .filter(Boolean)
    .slice(0, 2)
    .join('')
}

function NavAvatar({ profile, size = 'sm' }: { profile: NavProfile | null; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'md' ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-xs'
  const url = profile?.avatar_url
  const name = profile?.display_name

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name ?? 'avatar'}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 border border-purple-500/40`}
      />
    )
  }

  return (
    <div className={`${sizeClass} rounded-full bg-purple-900/60 border border-purple-500/40 flex items-center justify-center flex-shrink-0`}>
      <span className="font-bold text-purple-300 select-none leading-none">
        {getInitials(name)}
      </span>
    </div>
  )
}

export default function NavbarClient({
  user,
  profile,
}: {
  user: any
  profile: NavProfile | null
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Usuario'

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
    router.push('/')
    router.refresh()
  }

  const links = [
    { href: '/pronosticos', label: 'Pronósticos' },
    { href: '/cuadro', label: 'Cuadro' },
    { href: '/ranking', label: 'Ranking' },
    { href: '/ligas', label: 'Ligas' },
    { href: '/reglas', label: 'Reglas' },
    { href: '/predeci-wars', label: 'Predecí wARS' },
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
                  href="/ingresa"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/registro"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
                >
                  <NavAvatar profile={profile} />
                  <span>{displayName}</span>
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
                      href="/ingresa"
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-gray-400"
                    >
                      Ingresar
                    </Link>
                    <Link
                      href="/registro"
                      onClick={() => setIsOpen(false)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
                    >
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/perfil"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 bg-gray-900 px-4 py-3 rounded-lg"
                    >
                      <NavAvatar profile={profile} size="md" />
                      <div>
                        <div className="text-xs text-gray-500">Mi perfil</div>
                        <div className="text-sm font-semibold text-purple-400">{displayName}</div>
                      </div>
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
