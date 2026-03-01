/**
 * Helper para URLs de banderas de países usando flagcdn.com (gratuito, sin API key).
 *
 * Soporta:
 * - Códigos ISO 3166-1 alpha-2 estándar: "AR", "BR", "DE", etc.
 * - Subdivisiones del Reino Unido: "GB-ENG", "GB-SCT", "GB-WLS"
 *
 * Tamaños disponibles: 20x15 | 24x18 | 40x30 | 80x60 | 160x120 | 320x240
 */
export type FlagSize = '20x15' | '24x18' | '40x30' | '80x60' | '160x120' | '320x240'

export function getFlagUrl(
  code: string | null | undefined,
  size: FlagSize = '40x30'
): string | null {
  if (!code) return null
  // flagcdn.com usa códigos en minúscula con guión: "gb-eng", "ar", etc.
  const normalized = code.toLowerCase().replace('_', '-')
  return `https://flagcdn.com/${size}/${normalized}.png`
}
