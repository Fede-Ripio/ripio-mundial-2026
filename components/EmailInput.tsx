'use client'

import { useState, useRef, useEffect } from 'react'

interface EmailInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  label?: string
}

const POPULAR_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
  'live.com',
  'ripio.com'
]

export default function EmailInput({
  value,
  onChange,
  placeholder = 'tu@email.com',
  required = false,
  className = '',
  label = 'Email'
}: EmailInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const generateSuggestions = (input: string) => {
    const trimmed = input.trim().toLowerCase()
    
    // No suggestions si ya es un email completo válido
    if (trimmed.includes('@') && trimmed.split('@')[1]?.includes('.')) {
      return []
    }

    // Si escribió algo antes del @
    const [username, domain] = trimmed.split('@')
    
    if (!username || username.length < 2) {
      return []
    }

    // Si ya escribió @, filtrar dominios que matcheen
    if (domain !== undefined) {
      const filtered = POPULAR_DOMAINS
        .filter(d => d.startsWith(domain))
        .map(d => `${username}@${d}`)
      
      return filtered.slice(0, 5)
    }

    // Si no escribió @, sugerir todos los dominios
    return POPULAR_DOMAINS.map(d => `${username}@${d}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    const newSuggestions = generateSuggestions(newValue)
    setSuggestions(newSuggestions)
    setShowSuggestions(newSuggestions.length > 0)
    setSelectedIndex(-1)
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault()
          handleSuggestionClick(suggestions[selectedIndex])
        }
        break
      
      case 'Escape':
        setShowSuggestions(false)
        break
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        ref={inputRef}
        type="email"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          const sug = generateSuggestions(value)
          setSuggestions(sug)
          setShowSuggestions(sug.length > 0)
        }}
        required={required}
        placeholder={placeholder}
        autoComplete="email"
        className={`w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors ${className}`}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-purple-500/50 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-purple-600/30 transition-colors flex items-center gap-3 ${
                index === selectedIndex ? 'bg-purple-600/40' : ''
              }`}
            >
              <span className="text-gray-400">✉️</span>
              <span className="text-white font-medium">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
      
      {value.length >= 2 && !value.includes('@') && (
        <p className="text-xs text-gray-500 mt-1">
          💡 Empezá a escribir para ver sugerencias de dominio
        </p>
      )}
    </div>
  )
}
