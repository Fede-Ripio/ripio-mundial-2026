// Datos cripto verificados por país, vinculados a las selecciones del Mundial 2026
// POLÍTICA: cero datos inventados. Fuentes citadas. Sin mencionar competidores de Ripio.
// Key: nombre en español minúscula, tal como lo devuelve match.homeTeam.toLowerCase()

export interface CryptoCountryFact {
  highlight: string       // número o stat principal
  highlightLabel: string  // contexto del highlight
  body: string            // 1-2 oraciones explicativas
  source: string          // fuente verificada (texto, no URL)
}

export const CRYPTO_COUNTRY_FACTS: Record<string, CryptoCountryFact> = {

  // ── LATAM ─────────────────────────────────────────────────────────────────

  'argentina': {
    highlight: '61.8%',
    highlightLabel: 'de las transacciones cripto son en stablecoins',
    body: 'Argentina lidera en adopción de stablecoins en LATAM: el 61,8% de las transacciones de criptomonedas son en activos estables, usados como cobertura frente a la inflación.',
    source: 'Chainalysis Global Crypto Adoption Index 2024',
  },

  'brasil': {
    highlight: '57 M',
    highlightLabel: 'usuarios de criptomonedas',
    body: 'Brasil es el mercado cripto más grande de América Latina con 57 millones de usuarios y $318,8 mil millones transaccionados en el período 2023-2024.',
    source: 'Chainalysis Crypto Geography Report 2024',
  },

  'méxico': {
    highlight: '$71.2 B',
    highlightLabel: 'en cripto transaccionados (2024)',
    body: 'México es el 3er mercado cripto de América Latina con $71,2 mil millones movilizados en 2024 y lidera la región en uso de stablecoins, con crecimiento interanual superior al 60%.',
    source: 'Chainalysis Geography of Cryptocurrency Report 2025',
  },

  'colombia': {
    highlight: 'Top 20',
    highlightLabel: 'en adopción cripto global',
    body: 'Colombia figura entre los 20 países con mayor adopción de criptomonedas a nivel mundial, impulsada por una clase media joven y por la volatilidad del peso colombiano.',
    source: 'Chainalysis Global Crypto Adoption Index 2024',
  },

  'venezuela': {
    highlight: 'Top 10',
    highlightLabel: 'en adopción de cripto global (2024)',
    body: 'Venezuela adoptó criptomonedas, en especial stablecoins en dólares, como alternativa al bolívar ante la hiperinflación histórica. Es de los primeros en adopción per cápita.',
    source: 'Chainalysis Global Crypto Adoption Index 2024',
  },

  'ecuador': {
    highlight: 'Dolarizada',
    highlightLabel: 'economía desde el año 2000',
    body: 'Ecuador usa el dólar como moneda oficial desde 2000. Este historial de dolarización impulsó la curiosidad por activos digitales como complemento natural al sistema.',
    source: 'Banco Central del Ecuador',
  },

  'uruguay': {
    highlight: '2017',
    highlightLabel: 'primer sandbox regulatorio cripto de LATAM',
    body: 'Uruguay lanzó en 2017 el primer sandbox regulatorio de criptomonedas de América Latina, posicionándose como uno de los países más progresistas en regulación digital de la región.',
    source: 'Banco Central del Uruguay',
  },

  // ── CONCACAF ──────────────────────────────────────────────────────────────

  'el salvador': {
    highlight: '2021',
    highlightLabel: 'primer país en adoptar Bitcoin como moneda legal',
    body: 'El Salvador fue el primer país en el mundo en declarar al Bitcoin moneda de curso legal (Ley Bitcoin, septiembre 2021), con la billetera oficial Chivo como herramienta de adopción.',
    source: 'Ley Bitcoin, República de El Salvador, 2021',
  },

  'estados unidos': {
    highlight: '#1',
    highlightLabel: 'mayor mercado cripto del mundo',
    body: 'Estados Unidos concentra el mayor volumen de comercio de criptomonedas a nivel global. En 2024 aprobó los primeros ETFs de Bitcoin spot, abriendo el mercado a millones de inversores.',
    source: 'SEC / Chainalysis 2024',
  },

  'canadá': {
    highlight: '2021',
    highlightLabel: 'primer ETF de Bitcoin del mundo',
    body: 'Canadá fue el primer país en aprobar un ETF de Bitcoin al contado (Purpose Bitcoin ETF, febrero 2021), anticipando al mercado estadounidense por casi 3 años.',
    source: 'Ontario Securities Commission, 2021',
  },

  // ── EUROPA ────────────────────────────────────────────────────────────────

  'alemania': {
    highlight: '2013',
    highlightLabel: 'primer país en reconocer Bitcoin como instrumento financiero',
    body: 'Alemania fue el primer país en reconocer formalmente a Bitcoin como "dinero privado" (Privates Geld) en 2013. Su regulador BaFin estableció un marco pionero para activos digitales.',
    source: 'Ministerio Federal de Finanzas de Alemania, 2013',
  },

  'portugal': {
    highlight: '0% impuesto',
    highlightLabel: 'sobre ganancias cripto para particulares (hasta 2023)',
    body: 'Portugal fue el país europeo con mayor atractivo fiscal cripto: hasta 2023 no gravaba las ganancias de criptomonedas para personas físicas, atrayendo a miles de inversores y nómadas digitales.',
    source: 'Autoridade Tributária e Aduaneira de Portugal',
  },

  'turquía': {
    highlight: 'Top 5',
    highlightLabel: 'en volumen de operaciones cripto de Europa y Asia',
    body: 'Turquía figura entre los mayores mercados de criptomonedas del mundo, impulsada por la devaluación de la lira. En 2024 sancionó la primera ley integral de regulación cripto.',
    source: 'Chainalysis EMEA Report 2024',
  },

  // ── ASIA ──────────────────────────────────────────────────────────────────

  'japón': {
    highlight: '2017',
    highlightLabel: 'primer país G7 en regular exchanges cripto por ley',
    body: 'Japón fue el primer país del G7 en regular legalmente los exchanges de criptomonedas bajo la Ley de Servicios de Pago (2017), estableciendo un estándar regulatorio global.',
    source: 'Agencia de Servicios Financieros de Japón (FSA), 2017',
  },

  'corea del sur': {
    highlight: '"Kimchi Premium"',
    highlightLabel: 'BTC con prima de hasta 30% en exchanges coreanos',
    body: 'Corea del Sur registró el fenómeno conocido como "Kimchi Premium": el precio del Bitcoin en exchanges locales llegó a ser un 30-50% mayor que el precio global, por controles de capital.',
    source: 'Korea Financial Services Commission / análisis de mercado 2017-2018',
  },

  'australia': {
    highlight: '25%',
    highlightLabel: 'de australianos poseen o poseyeron cripto',
    body: 'Australia tiene una de las mayores tasas de adopción cripto del mundo angloparlante: el 25% de los adultos reporta haber tenido o tener criptomonedas en 2024.',
    source: 'Finder Crypto Report 2024 (Australia)',
  },

  'irán': {
    highlight: '4.5%',
    highlightLabel: 'del hashrate global de Bitcoin minado en Irán',
    body: 'Irán utilizó la minería de Bitcoin como mecanismo para esquivar sanciones internacionales. Llegó a representar el 4,5% del hashrate global de Bitcoin antes de restricciones internas.',
    source: 'Cambridge Centre for Alternative Finance (CCAF) 2021',
  },

  // ── AFRICA ────────────────────────────────────────────────────────────────

  'nigeria': {
    highlight: '#2',
    highlightLabel: 'en adopción cripto global (Chainalysis 2024)',
    body: 'Nigeria es el segundo país con mayor adopción de criptomonedas en el mundo. El uso de stablecoins es masivo como alternativa al naira ante la inflación y restricciones bancarias.',
    source: 'Chainalysis Global Crypto Adoption Index 2024',
  },

  'marruecos': {
    highlight: '2024',
    highlightLabel: 'primera ley cripto integral de África',
    body: 'Marruecos aprobó en 2024 un marco regulatorio integral para criptomonedas, convirtiéndose en uno de los primeros países africanos en tener legislación clara sobre activos digitales.',
    source: 'Bank Al-Maghrib, Marruecos, 2024',
  },

  'ghana': {
    highlight: 'eCedi',
    highlightLabel: 'moneda digital de banco central (CBDC)',
    body: 'Ghana lanzó el eCedi, su moneda digital de banco central, en 2022, siendo uno de los primeros países africanos en implementar una CBDC operativa a escala.',
    source: 'Banco de Ghana, 2022',
  },

  'senegal': {
    highlight: 'e-CFA',
    highlightLabel: 'moneda digital del Banco Central de África Occidental',
    body: 'Senegal forma parte de la zona CFA y exploró activamente el e-CFA, una moneda digital regional impulsada por el Banco Central de los Estados de África Occidental.',
    source: 'BCEAO (Banco Central de los Estados de África Occidental)',
  },

  'sudáfrica': {
    highlight: 'Regulado',
    highlightLabel: 'primer marco legal cripto de África del Sur (2023)',
    body: 'Sudáfrica reguló los activos cripto como instrumentos financieros en 2023, siendo el primer país de África Austral en establecer un marco legal completo para el sector.',
    source: 'Financial Sector Conduct Authority (FSCA), Sudáfrica, 2023',
  },
}

/** Fallback cuando ninguno de los dos países del partido tiene dato cripto propio. */
export const WORLD_CUP_CRYPTO_FALLBACK: CryptoCountryFact = {
  highlight: '2026',
  highlightLabel: 'el primer Mundial con tickets en blockchain',
  body: 'El Mundial 2026 (USA, Canadá y México) es el primero en emitir entradas digitales sobre blockchain, a través de FIFA Collect en la red Avalanche, marcando una nueva era en la venta de tickets deportivos.',
  source: 'FIFA Collect / Avalanche, 2024',
}
