'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu, X, LogOut, ChevronLeft, ChevronRight,
  ClipboardList, LayoutGrid, Trophy, Users, BookOpen, Zap, Star,
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
  { href: '/pronosticos',  label: 'Pronósticos',  Icon: ClipboardList },
  { href: '/cuadro',       label: 'Fixture',       Icon: LayoutGrid    },
  { href: '/ranking',      label: 'Ranking',       Icon: Trophy        },
  { href: '/ligas',        label: 'Ligas',         Icon: Users         },
  { href: '/reglas',       label: 'Reglas',        Icon: BookOpen      },
  { href: '/predeci-wars', label: 'Predecí wARS',  Icon: Zap           },
]

const RIPIO_CUP_LINK = { href: '/ripio-cup', label: 'Ripio Cup', Icon: Star }

export default function AppShell({
  user,
  profile,
  children,
}: {
  user: any
  profile: NavProfile | null
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Usuario'
  const isRipioEmployee = !!user?.email?.endsWith('@ripio.com')

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setMobileOpen(false)
    router.push('/')
    router.refresh()
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="flex min-h-screen">

      {/* ── DESKTOP SIDEBAR ───────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-full bg-gray-950 border-r border-gray-800 z-40 transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Header: Logo + toggle button */}
        <div className="flex items-center justify-between h-16 border-b border-gray-800 flex-shrink-0 px-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity overflow-hidden flex-1 min-w-0"
          >
            <RipioLogo className="h-8 text-white flex-shrink-0" />
            <span
              className={`font-bold text-white text-sm whitespace-nowrap transition-all duration-300 ${
                sidebarOpen ? 'opacity-100 max-w-[160px] ml-0' : 'opacity-0 max-w-0 ml-0'
              }`}
            >
              Mundial 2026
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            title={sidebarOpen ? 'Contraer menú' : 'Expandir menú'}
          >
            {sidebarOpen
              ? <ChevronLeft className="w-4 h-4" />
              : <ChevronRight className="w-4 h-4" />
            }
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">

          {/* Ripio Cup — solo para @ripio.com */}
          {isRipioEmployee && (() => {
            const { href, label, Icon } = RIPIO_CUP_LINK
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <>
                <Link
                  href={href}
                  title={!sidebarOpen ? label : undefined}
                  className={`flex items-center h-11 transition-colors border-r-2 ${
                    sidebarOpen ? 'px-4 gap-3' : 'justify-center px-2'
                  } ${
                    isActive
                      ? 'text-purple-300 bg-purple-600/20 border-purple-400'
                      : 'text-purple-400/80 hover:text-purple-300 bg-purple-900/10 hover:bg-purple-900/20 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 text-purple-400" />
                  <span
                    className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                      sidebarOpen ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0 overflow-hidden'
                    }`}
                  >
                    {label}
                  </span>
                </Link>
                {/* Separador */}
                <div className={`my-2 transition-all duration-300 ${sidebarOpen ? 'mx-4' : 'mx-2'} h-px bg-gray-800`} />
              </>
            )
          })()}

          {NAV_LINKS.map(({ href, label, Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                title={!sidebarOpen ? label : undefined}
                className={`flex items-center h-11 transition-colors border-r-2 ${
                  sidebarOpen ? 'px-4 gap-3' : 'justify-center px-2'
                } ${
                  isActive
                    ? 'text-purple-400 bg-purple-500/10 border-purple-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900 border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
                <span
                  className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    sidebarOpen ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0 overflow-hidden'
                  }`}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-800 flex-shrink-0">
          {user ? (
            <>
              <Link
                href="/perfil"
                title={!sidebarOpen ? displayName : undefined}
                className={`flex items-center transition-colors hover:bg-gray-900 overflow-hidden ${
                  sidebarOpen ? 'gap-3 px-4 py-3.5' : 'justify-center py-3'
                }`}
              >
                <NavAvatar profile={profile} size="sm" />
                <div
                  className={`min-w-0 transition-all duration-300 ${
                    sidebarOpen ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0 overflow-hidden'
                  }`}
                >
                  <div className="text-sm font-semibold text-white truncate">{displayName}</div>
                  <div className="text-xs text-gray-500">Ver perfil</div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                title={!sidebarOpen ? 'Cerrar sesión' : undefined}
                className={`flex items-center w-full transition-colors text-gray-500 hover:text-red-400 hover:bg-gray-900 overflow-hidden ${
                  sidebarOpen ? 'gap-3 px-4 py-3 text-sm' : 'justify-center py-3'
                }`}
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span
                  className={`whitespace-nowrap transition-all duration-300 ${
                    sidebarOpen ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0 overflow-hidden'
                  }`}
                >
                  Cerrar sesión
                </span>
              </button>
            </>
          ) : (
            <div className={`py-3 ${sidebarOpen ? 'px-4 space-y-2' : 'px-2 flex flex-col items-center gap-2'}`}>
              {sidebarOpen ? (
                <>
                  <Link
                    href="/registro"
                    className="block bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-semibold text-center transition-colors"
                  >
                    Registrarse
                  </Link>
                  <Link
                    href="/ingresa"
                    className="block text-xs text-gray-400 hover:text-white text-center transition-colors py-1"
                  >
                    Ingresar
                  </Link>
                </>
              ) : (
                <Link
                  href="/ingresa"
                  title="Ingresar"
                  className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-900"
                >
                  <LogOut className="w-4 h-4 rotate-180" />
                </Link>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ── MOBILE OVERLAY ────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobile}
      />

      {/* ── MOBILE DRAWER ─────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gray-950 border-r border-gray-800 z-50 md:hidden flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <Link href="/" onClick={closeMobile} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <RipioLogo className="h-8 text-white" />
            <span className="font-bold text-white">Mundial 2026</span>
          </Link>
          <button onClick={closeMobile} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User section */}
        {user ? (
          <Link
            href="/perfil"
            onClick={closeMobile}
            className="flex items-center gap-4 px-5 py-5 border-b border-gray-800 hover:bg-gray-900 transition-colors"
          >
            <NavAvatar profile={profile} size="lg" />
            <div className="min-w-0">
              <div className="font-semibold text-white truncate">{displayName}</div>
              <div className="text-sm text-gray-400 mt-0.5">Ver perfil</div>
            </div>
          </Link>
        ) : (
          <div className="px-5 py-5 border-b border-gray-800 flex flex-col gap-3">
            <Link
              href="/registro"
              onClick={closeMobile}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold text-center transition-colors"
            >
              Registrarse gratis
            </Link>
            <Link
              href="/ingresa"
              onClick={closeMobile}
              className="text-sm text-gray-400 hover:text-white text-center transition-colors"
            >
              Ya tengo cuenta
            </Link>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">

          {/* Ripio Cup — solo para @ripio.com */}
          {isRipioEmployee && (() => {
            const { href, label, Icon } = RIPIO_CUP_LINK
            const isActive = pathname === href
            return (
              <>
                <Link
                  href={href}
                  onClick={closeMobile}
                  className={`flex items-center gap-4 px-6 py-3.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-purple-300 bg-purple-600/20 border-l-2 border-purple-400'
                      : 'text-purple-400/80 hover:text-purple-300 bg-purple-900/10 hover:bg-purple-900/20 border-l-2 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 text-purple-400" />
                  {label}
                </Link>
                <div className="mx-5 my-2 h-px bg-gray-800" />
              </>
            )
          })()}

          {NAV_LINKS.map(({ href, label, Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
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

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-16'
        }`}
      >
        {/* Mobile topbar */}
        <header className="md:hidden sticky top-0 z-40 bg-black border-b border-gray-900 h-16 flex items-center px-4 gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-gray-400 hover:text-white"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <RipioLogo className="h-8 text-white" />
            <span className="font-bold text-white text-sm">Mundial 2026</span>
          </Link>
        </header>

        {/* Page content */}
        {children}
      </div>

    </div>
  )
}
