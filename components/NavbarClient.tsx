'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu, X, LogOut,
  ClipboardList, LayoutGrid, Trophy, Users, BookOpen, Zap,
} from 'lucide-react'
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

function NavAvatar({ profile, size = 'sm' }: { profile: NavProfile | null; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass =
    size === 'lg' ? 'w-14 h-14 text-xl' :
    size === 'md' ? 'w-9 h-9 text-sm' :
                   'w-7 h-7 text-xs'
  const url = profile?.avatar_url
  const name = profile?.display_name

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name ?? 'avatar'}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 border-2 border-purple-500/40`}
      />
    )
  }

  return (
    <div className={`${sizeClass} rounded-full bg-purple-900/60 border-2 border-purple-500/40 flex items-center justify-center flex-shrink-0`}>
      <span className="font-bold text-purple-300 select-none leading-none">
        {getInitials(name)}
      </span>
    </div>
  )
}

const NAV_LINKS = [
  { href: '/pronosticos',   label: 'Pronósticos',  Icon: ClipboardList },
  { href: '/cuadro',        label: 'Cuadro',        Icon: LayoutGrid    },
  { href: '/ranking',       label: 'Ranking',       Icon: Trophy        },
  { href: '/ligas',         label: 'Ligas',         Icon: Users         },
  { href: '/reglas',        label: 'Reglas',        Icon: BookOpen      },
  { href: '/predeci-wars',  label: 'Predecí wARS',  Icon: Zap           },
]

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

  const close = () => setIsOpen(false)

  return (
    <>
      {/* ── Top navbar ─────────────────────────────────────────────── */}
      <nav className="bg-black border-b border-gray-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <RipioLogo className="h-10 sm:h-12 text-white" />
              <span className="font-bold text-lg sm:text-xl text-white">Mundial 2026</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === href ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <>
                  <Link href="/ingresa" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Ingresar
                  </Link>
                  <Link href="/registro" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
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

            {/* Mobile: hamburger abre el drawer */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-1 text-gray-400 hover:text-white"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ──────────────────────────────────────────── */}

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gray-950 border-r border-gray-800 z-50 md:hidden flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header — minimal: solo el botón X */}
        <div className="flex items-center justify-end px-4 pt-4 pb-2">
          <button onClick={close} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User section — protagonista */}
        {user ? (
          <Link
            href="/perfil"
            onClick={close}
            className="flex items-center gap-4 px-5 pb-5 pt-1 border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
          >
            <NavAvatar profile={profile} size="lg" />
            <div className="min-w-0">
              <div className="font-bold text-white text-base truncate">{displayName}</div>
              <div className="text-sm text-gray-500 truncate mt-0.5">
                {user.email}
              </div>
            </div>
          </Link>
        ) : (
          <div className="px-5 py-5 border-b border-gray-800 flex flex-col gap-3">
            <Link
              href="/registro"
              onClick={close}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold text-center transition-colors"
            >
              Registrarse gratis
            </Link>
            <Link
              href="/ingresa"
              onClick={close}
              className="text-sm text-gray-400 hover:text-white text-center transition-colors"
            >
              Ya tengo cuenta
            </Link>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_LINKS.map(({ href, label, Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`flex items-center gap-4 px-6 py-3.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-purple-400 bg-purple-500/10 border-l-2 border-purple-500'
                    : 'text-gray-300 hover:text-white hover:bg-gray-900 border-l-2 border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: logout */}
        {user && (
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-sm text-gray-500 hover:text-red-400 transition-colors py-2 px-2 rounded-lg hover:bg-gray-900"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </>
  )
}
