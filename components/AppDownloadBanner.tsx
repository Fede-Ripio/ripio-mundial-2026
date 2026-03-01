'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import RipioLogo from './RipioLogo'

const IOS_URL = 'https://apps.apple.com/ar/app/ripio/id1146834723'
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.ripio.exchange'
const STORAGE_KEY = 'ripio-app-banner-dismissed'

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
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 600)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
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

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-purple-700 flex items-center justify-center flex-shrink-0 border border-purple-500/30">
          <RipioLogo className="h-4 text-white" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm leading-tight">Conseguí wARS</p>
          <p className="text-xs text-gray-400 leading-tight mt-0.5">Descargá la app de Ripio</p>
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
