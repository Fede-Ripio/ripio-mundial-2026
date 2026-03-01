import { getFlagUrl, type FlagSize } from '@/lib/flags'

interface FlagProps {
  countryCode?: string | null
  size?: FlagSize
  className?: string
}

/**
 * Muestra la bandera de un país usando flagcdn.com.
 * Acepta códigos ISO 3166-1 alpha-2 (ej: "AR") y subdivisiones (ej: "GB-ENG").
 */
export default function Flag({ countryCode, size = '40x30', className = '' }: FlagProps) {
  const url = getFlagUrl(countryCode, size)

  if (!url) {
    return <div className={`inline-block rounded bg-gray-700 ${className}`} style={{ aspectRatio: '4/3' }} />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={countryCode ?? ''}
      className={`inline-block object-cover rounded ${className}`}
    />
  )
}
