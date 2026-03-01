'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import RipioLogo from './RipioLogo'

const IOS_URL = 'https://apps.apple.com/ar/app/ripio-app-crypto-wallet/id1221006761'
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.ripio.android'
const LS_KEY = 'ripio-app-banner-ts'    // timestamp de último cierre (localStorage)
const SS_KEY = 'ripio-app-banner-seen'  // cerrado en esta sesión (sessionStorage)
const REAPPEAR_HOURS = 24

function getDownloadUrl(): string {
  if (typeof navigator === 'undefined') return IOS_URL
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return ANDROID_URL
  if (/iphone|ipad|ipod/i.test(ua)) return IOS_URL
  return IOS_URL
}

export default function AppDownloadBanner() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const ts = localStorage.getItem(LS_KEY)
    const hoursSince = ts ? (Date.now() - Number(ts)) / (1000 * 60 * 60) : Infinity

    // Si pasaron 24h, reseteamos el flag de sesión para que vuelva a aparecer
    if (hoursSince >= REAPPEAR_HOURS) {
      sessionStorage.removeItem(SS_KEY)
    }

    // Si ya lo cerraron en esta sesión, no mostrar
    if (sessionStorage.getItem(SS_KEY)) return

    const t = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem(SS_KEY, '1')             // no reaparece en esta sesión
    localStorage.setItem(LS_KEY, String(Date.now())) // para el conteo de 24h
  }

  if (!mounted) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Chevron dismiss pill */}
      <div className="flex justify-center">
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="bg-gray-900 border border-gray-800 border-b-0 rounded-t-xl px-5 py-1.5 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Banner */}
      <div className="bg-gray-950 border-t border-gray-800 px-4 py-3 flex items-center gap-3 shadow-2xl">

        {/* Icons: wARS + Ripio */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <img
            src="https://cdn.prod.website-files.com/640b8191d2fdcfb39b135a5b/69121e0c7b24a0930d8e4efa_world_logos_wars_logo.svg"
            alt="wARS"
            className="w-8 h-8"
          />
          <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center border border-purple-500/30">
            <RipioLogo className="h-3.5 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm leading-tight">Conseguí wARS en Ripio</p>
          <p className="text-xs text-gray-400 leading-tight mt-0.5">Generan rendimientos todos los días</p>
        </div>

        {/* CTA */}
        <a
          href={getDownloadUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0"
        >
          Descargar app
        </a>

      </div>
    </div>
  )
}
