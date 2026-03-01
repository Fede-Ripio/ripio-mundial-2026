/**
 * Helper para URLs de banderas flat usando flagcdn.com (gratuito, sin API key).
 * Usa el formato w{ancho} que devuelve banderas rectangulares planas (no waving).
 *
 * Soporta:
 * - Códigos ISO 3166-1 alpha-2: "AR", "BR", "DE", etc.
 * - Subdivisiones del Reino Unido: "GB-ENG", "GB-SCT", "GB-WLS"
 *
 * Tamaños disponibles (ancho en px): 20 | 40 | 80 | 160 | 320
 * (w24 da 404 — no está soportado por flagcdn)
 */
export type FlagWidth = 20 | 40 | 80 | 160 | 320

export function getFlagUrl(
  code: string | null | undefined,
  width: FlagWidth = 40
): string | null {
  if (!code) return null
  // flagcdn.com usa códigos en minúscula con guión: "gb-eng", "ar", etc.
  const normalized = code.toLowerCase().replace('_', '-')
  return `https://flagcdn.com/w${width}/${normalized}.png`
}
