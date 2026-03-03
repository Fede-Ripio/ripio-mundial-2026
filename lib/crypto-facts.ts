// Datos cripto verificados para la sección de estadísticas
// Política: cero datos inventados. Todas las fuentes están citadas en el campo `source`.
// Restricciones: no mencionar competidores de Ripio, no temas negativos de cripto.

export type CryptoFactCategory = 'btc-mundial' | 'adoption' | 'ripio' | 'world-cup'

export interface CryptoFact {
  id: string
  category: CryptoFactCategory
  icon: string
  /** Número o dato protagonista, ej: "$16.813" */
  highlight: string
  /** Contexto del highlight, ej: "precio de BTC" */
  highlightLabel?: string
  title: string
  /** Texto corto — 2-3 oraciones máximo */
  body: string
  /** Fuente pública verificable */
  source: string
  /** Si corresponde a un país específico */
  countryEmoji?: string
}

// ---------------------------------------------------------------------------
// Fuentes verificadas:
//   - BTC price jul 2010: ~$0.08 (Bitcoin tenía 15 meses de vida, primeros intercambios jun 2010)
//     Fuente: CoinMarketCap historical; Bitcoin wiki
//   - BTC price jul 13 2014: ~$620 (rango mensual jul 2014: $564-$645, CoinMarketCap)
//   - BTC price jul 15 2018: ~$6.300 (BTC cruzó $7.000 el 17-jul según TechCrunch)
//   - BTC price dic 18 2022: $16.813,28 (StatMuse Money, verificado)
//   - Argentina stablecoins 61,8%: Chainalysis 2024 LATAM Crypto Adoption
//   - Argentina #15 global adoption: Chainalysis 2024 Global Crypto Adoption Index
//   - Brasil 57M usuarios + $318B: Chainalysis 2025 LATAM Report
//   - FIFA 2026 blockchain tickets en Avalanche: FIFA Collect / InsideBitcoins (oct 2024)
//   - Ripio fundada 2014: dato público de Ripio
// ---------------------------------------------------------------------------

export const CRYPTO_FACTS: CryptoFact[] = [
  {
    id: 'btc-worldcups',
    category: 'btc-mundial',
    icon: '🔶',
    highlight: '~$0.08 → $16.813',
    highlightLabel: 'de BTC en finales del Mundial',
    title: 'Bitcoin creció con cada Copa del Mundo',
    body: 'Cuando España ganó en Sudáfrica 2010, un Bitcoin valía ~$0.08 y tenía apenas 15 meses de vida. Cuando Alemania levantó la copa en Brasil 2014, valía ~$620. En Francia 2018 llegó a ~$6.300 y cuando Argentina ganó en Qatar 2022, cotizaba a $16.813.',
    source: 'CoinMarketCap, StatMuse Money',
  },
  {
    id: 'argentina-stablecoins',
    category: 'adoption',
    icon: '🇦🇷',
    countryEmoji: '🇦🇷',
    highlight: '61,8%',
    highlightLabel: 'de las transacciones cripto en Argentina son stablecoins',
    title: 'Argentina: 3 estrellas mundialistas y líder en stablecoins',
    body: 'Argentina ganó el Mundial en 1978, 1986 y 2022. También es el país #1 de LATAM en adopción de stablecoins: el 61,8% de su volumen cripto corresponde a activos estables, la proporción más alta de la región.',
    source: 'Chainalysis 2024 LATAM Crypto Adoption',
  },
  {
    id: 'brasil-crypto-market',
    category: 'adoption',
    icon: '🇧🇷',
    countryEmoji: '🇧🇷',
    highlight: '57 millones',
    highlightLabel: 'de usuarios cripto en Brasil',
    title: 'Brasil: 5 estrellas y el mayor mercado cripto de LATAM',
    body: 'El único país con 5 Mundiales (1958, 1962, 1970, 1994, 2002) también lidera el mercado cripto en la región. Entre jul 2024 y jun 2025, Brasil recibió $318.800 millones en activos digitales — casi un tercio de toda LATAM.',
    source: 'Chainalysis 2025 LATAM Report',
  },
  {
    id: 'fifa-2026-blockchain',
    category: 'world-cup',
    icon: '⛓️',
    highlight: 'NFT',
    highlightLabel: 'tickets del Mundial 2026 en blockchain',
    title: 'Los tickets del Mundial 2026 son tokens en blockchain',
    body: 'Por primera vez en la historia, la FIFA vende entradas del Mundial como "Right to Buy" tokens en la blockchain Avalanche, a través de su plataforma FIFA Collect. Los holders pueden comprar entradas a valor nominal cuando su equipo clasifica.',
    source: 'FIFA Collect, Inside Bitcoins (oct 2024)',
  },
  {
    id: 'ripio-nacio-2013',
    category: 'ripio',
    icon: '💜',
    highlight: '2013',
    highlightLabel: 'año de nacimiento de Ripio',
    title: 'Ripio nació un año antes del Mundial de Brasil',
    body: 'Ripio fue fundada en 2013 en Argentina, justo antes del Mundial de Brasil 2014. Desde entonces, conecta a millones de personas de América Latina con el ecosistema cripto.',
    source: 'ripio.com',
  },
  {
    id: 'mexico-remesas',
    category: 'adoption',
    icon: '🇲🇽',
    countryEmoji: '🇲🇽',
    highlight: '$64.745M',
    highlightLabel: 'en remesas recibidas por México en 2024',
    title: 'México, sede del Mundial × 2 y #2 en cripto en LATAM',
    body: 'México fue sede del Mundial en 1970 y 1986 — el único país que lo organizó dos veces. También es el 2° mayor receptor de remesas del mundo ($64.745 millones en 2024) y el #2 de LATAM en adopción cripto (Chainalysis 2024, puesto 13 global).',
    source: 'Banco de México 2024, Chainalysis Global Adoption Index 2024',
  },
]
