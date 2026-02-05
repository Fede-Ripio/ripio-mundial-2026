interface FlagEmojiProps {
  countryCode?: string | null
  size?: 'sm' | 'md' | 'lg'
}

export default function FlagEmoji({ countryCode, size = 'md' }: FlagEmojiProps) {
  if (!countryCode) return <span className="text-gray-500">❓</span>

  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  // Convertir código ISO a emoji de bandera
  const getFlag = (code: string): string => {
    // Casos especiales
    if (code === 'GB-ENG') return '🏴󠁧󠁢󠁥󠁮󠁧󠁿' // Inglaterra
    if (code === 'GB-SCT') return '🏴󠁧󠁢󠁳󠁣󠁴󠁿' // Escocia
    if (code === 'GB-WLS') return '🏴󠁧󠁢󠁷󠁬󠁳󠁿' // Gales
    
    // Códigos ISO estándar → emoji
    const codePoints = [...code.toUpperCase()]
      .map(char => 127397 + char.charCodeAt(0))
    
    return String.fromCodePoint(...codePoints)
  }

  return (
    <span className={sizeClasses[size]} role="img" aria-label={`Bandera de ${countryCode}`}>
      {getFlag(countryCode)}
    </span>
  )
}
