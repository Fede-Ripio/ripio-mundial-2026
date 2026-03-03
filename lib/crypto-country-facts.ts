// Datos cripto verificados por país, vinculados a las selecciones del Mundial 2026
// POLÍTICA: cero datos inventados. Fuentes citadas. Sin mencionar competidores de Ripio.
// Key: nombre en español minúscula, tal como lo devuelve match.homeTeam.toLowerCase()
// Cada entrada es un array → el card rota por índice del partido (matchIndex % facts.length)

export interface CryptoCountryFact {
  highlight: string       // número o stat principal
  highlightLabel: string  // contexto del highlight
  body: string            // 1-2 oraciones explicativas
  source: string          // fuente verificada (texto, no URL)
}

export const CRYPTO_COUNTRY_FACTS: Record<string, CryptoCountryFact[]> = {

  // ── LATAM ─────────────────────────────────────────────────────────────────

  'argentina': [
    {
      highlight: '61.8%',
      highlightLabel: 'de las transacciones cripto son en stablecoins',
      body: 'Argentina lidera en adopción de stablecoins en LATAM: el 61,8% de las transacciones de criptomonedas son en activos estables, usados como cobertura frente a la inflación.',
      source: 'Chainalysis Global Crypto Adoption Index 2024',
    },
    {
      highlight: 'PSAV',
      highlightLabel: 'registro oficial de proveedores (CNV 2024)',
      body: 'La CNV implementó el registro de Proveedores de Servicios de Activos Virtuales (PSAV) en 2024, formalizando la supervisión del sector cripto en el país.',
      source: 'CNV (Argentina), Resolución General 994/2024',
    },
  ],

  'brasil': [
    {
      highlight: '57 M',
      highlightLabel: 'usuarios de criptomonedas',
      body: 'Brasil es el mercado cripto más grande de América Latina con 57 millones de usuarios y $318,8 mil millones transaccionados en el período 2023-2024.',
      source: 'Chainalysis Crypto Geography Report 2024',
    },
    {
      highlight: 'Drex',
      highlightLabel: 'moneda digital del banco central',
      body: 'El Banco Central de Brasil impulsa el proyecto Drex, su iniciativa de moneda digital, con pilotos activos y publicaciones técnicas desde 2023.',
      source: 'Banco Central do Brasil, comunicados oficiales sobre Drex',
    },
  ],

  'méxico': [
    {
      highlight: '$71.2 B',
      highlightLabel: 'en cripto transaccionados (2024)',
      body: 'México es el 3er mercado cripto de América Latina con $71,2 mil millones movilizados en 2024 y lidera la región en uso de stablecoins, con crecimiento interanual superior al 60%.',
      source: 'Chainalysis Geography of Cryptocurrency Report 2025',
    },
  ],

  'colombia': [
    {
      highlight: 'Top 20',
      highlightLabel: 'en adopción cripto global',
      body: 'Colombia figura entre los 20 países con mayor adopción de criptomonedas a nivel mundial, impulsada por una clase media joven y por la volatilidad del peso colombiano.',
      source: 'Chainalysis Global Crypto Adoption Index 2024',
    },
  ],

  'venezuela': [
    {
      highlight: 'Top 10',
      highlightLabel: 'en adopción de cripto global (2024)',
      body: 'Venezuela adoptó criptomonedas, en especial stablecoins en dólares, como alternativa al bolívar ante la hiperinflación histórica. Es de los primeros en adopción per cápita.',
      source: 'Chainalysis Global Crypto Adoption Index 2024',
    },
  ],

  'ecuador': [
    {
      highlight: 'Dolarizada',
      highlightLabel: 'economía desde el año 2000',
      body: 'Ecuador usa el dólar como moneda oficial desde 2000. Este historial de dolarización impulsó la curiosidad por activos digitales como complemento natural al sistema.',
      source: 'Banco Central del Ecuador',
    },
  ],

  'uruguay': [
    {
      highlight: '2017',
      highlightLabel: 'primer sandbox regulatorio cripto de LATAM',
      body: 'Uruguay lanzó en 2017 el primer sandbox regulatorio de criptomonedas de América Latina, posicionándose como uno de los países más progresistas en regulación digital de la región.',
      source: 'Banco Central del Uruguay',
    },
    {
      highlight: 'e-Peso',
      highlightLabel: 'piloto de moneda digital (BCU 2017-2018)',
      body: 'Uruguay fue uno de los primeros países en ejecutar un piloto de dinero digital emitido por banco central: el e-Peso, ensayado por el Banco Central del Uruguay entre 2017 y 2018.',
      source: 'Banco Central del Uruguay (BCU), informe del piloto e-Peso',
    },
  ],

  // ── CONCACAF ──────────────────────────────────────────────────────────────

  'el salvador': [
    {
      highlight: '2021',
      highlightLabel: 'primer país en adoptar Bitcoin como moneda legal',
      body: 'El Salvador fue el primer país en el mundo en declarar al Bitcoin moneda de curso legal (Ley Bitcoin, septiembre 2021), con la billetera oficial Chivo como herramienta de adopción.',
      source: 'Ley Bitcoin, República de El Salvador, 2021',
    },
  ],

  'estados unidos': [
    {
      highlight: '#1',
      highlightLabel: 'mayor mercado cripto del mundo',
      body: 'Estados Unidos concentra el mayor volumen de comercio de criptomonedas a nivel global. En 2024 aprobó los primeros ETFs de Bitcoin spot, abriendo el mercado a millones de inversores.',
      source: 'SEC / Chainalysis 2024',
    },
  ],

  'canadá': [
    {
      highlight: '2021',
      highlightLabel: 'primer ETF de Bitcoin del mundo',
      body: 'Canadá fue el primer país en aprobar un ETF de Bitcoin al contado (Purpose Bitcoin ETF, febrero 2021), anticipando al mercado estadounidense por casi 3 años.',
      source: 'Ontario Securities Commission, 2021',
    },
  ],

  'jamaica': [
    {
      highlight: '282,274',
      highlightLabel: 'usuarios registrados de JAM-DEX (fin 2024)',
      body: 'Jamaica lanzó JAM-DEX, su moneda digital de banco central. A fines de 2024 reportó 282.274 usuarios registrados, con un crecimiento del 7% interanual.',
      source: 'Jamaica Observer, "Jam-Dex gains ground" (cita datos del Bank of Jamaica)',
    },
    {
      highlight: '10,000',
      highlightLabel: 'comercios aceptando JAM-DEX',
      body: 'El Bank of Jamaica informó ~10.000 comercios aceptando JAM-DEX, consolidando la red de pagos digitales del Caribe con una CBDC operativa.',
      source: 'Jamaica Gleaner, nota sobre JAM-DEX citando al Bank of Jamaica (2023)',
    },
  ],

  'honduras': [
    {
      highlight: 'Próspera',
      highlightLabel: 'zona especial con Bitcoin como unidad de cuenta (2024)',
      body: 'La zona económica especial Próspera (Honduras) adoptó Bitcoin como unidad de cuenta en 2024, habilitándolo para transacciones y pago de impuestos dentro de esa jurisdicción.',
      source: 'Nexo Jornal, cobertura sobre Próspera y adopción de bitcoin (2024)',
    },
  ],

  // ── EUROPA ────────────────────────────────────────────────────────────────

  'alemania': [
    {
      highlight: '2013',
      highlightLabel: 'primer país en reconocer Bitcoin como instrumento financiero',
      body: 'Alemania fue el primer país en reconocer formalmente a Bitcoin como "dinero privado" (Privates Geld) en 2013. Su regulador BaFin estableció un marco pionero para activos digitales.',
      source: 'Ministerio Federal de Finanzas de Alemania, 2013',
    },
    {
      highlight: '0% impuesto',
      highlightLabel: 'sobre cripto mantenida más de 1 año (BMF 2022)',
      body: 'La guía fiscal del Ministerio de Finanzas establece exención total para ventas de criptomonedas mantenidas más de un año por personas físicas, un marco muy atractivo para inversores a largo plazo.',
      source: 'BMF (Alemania), Schreiben zur ertragsteuerlichen Behandlung von Kryptowerten (2022)',
    },
  ],

  'portugal': [
    {
      highlight: '0% impuesto',
      highlightLabel: 'sobre ganancias cripto para particulares (hasta 2023)',
      body: 'Portugal fue el país europeo con mayor atractivo fiscal cripto: hasta 2023 no gravaba las ganancias de criptomonedas para personas físicas, atrayendo a miles de inversores y nómadas digitales.',
      source: 'Autoridade Tributária e Aduaneira de Portugal',
    },
  ],

  'turquía': [
    {
      highlight: 'Top 5',
      highlightLabel: 'en volumen de operaciones cripto de Europa y Asia',
      body: 'Turquía figura entre los mayores mercados de criptomonedas del mundo, impulsada por la devaluación de la lira. En 2024 sancionó la primera ley integral de regulación cripto.',
      source: 'Chainalysis EMEA Report 2024',
    },
  ],

  'inglaterra': [
    {
      highlight: '12%',
      highlightLabel: 'de adultos con criptoactivos (FCA 2024)',
      body: 'La FCA (regulador financiero del Reino Unido) reporta que el 12% de los adultos posee criptoactivos según su encuesta nacional (Wave 5, 2024), con crecimiento sostenido desde 2021.',
      source: 'FCA, Cryptoasset consumer research 2024 (Wave 5)',
    },
  ],

  'bélgica': [
    {
      highlight: '28%',
      highlightLabel: 'de inversores con criptoactivos (FSMA 2024)',
      body: 'La FSMA (regulador financiero belga) reporta que el 28% de los inversores encuestados posee criptoactivos dentro de sus productos de ahorro e inversión.',
      source: 'FSMA, Retail Investor Survey 2024 (slide "Asset Ownership")',
    },
    {
      highlight: '45%',
      highlightLabel: 'de inversores de 30-39 años poseen cripto (FSMA 2024)',
      body: 'En el mismo estudio, la tenencia de criptoactivos sube al 45% entre los inversores de 30 a 39 años y al 43% en el tramo de 16 a 29 años.',
      source: 'FSMA, Retail Investor Survey 2024 (tabla por edad en "Asset Ownership")',
    },
  ],

  'países bajos': [
    {
      highlight: '€1.2 B',
      highlightLabel: 'en inversiones cripto indirectas (oct 2025)',
      body: 'El banco central neerlandés (DNB) reporta que las tenencias de inversiones cripto indirectas (ETFs/ETNs y "crypto treasuries") subieron a €1.200 millones a octubre de 2025.',
      source: 'De Nederlandsche Bank (DNB), "Value of Dutch indirect crypto investments grows to over €1 billion"',
    },
    {
      highlight: '70%',
      highlightLabel: 'de la exposición en 7 instrumentos',
      body: 'DNB destaca que, aunque existen muchos instrumentos cripto, siete valores explican aproximadamente el 70% de todas las tenencias indirectas neerlandesas.',
      source: 'De Nederlandsche Bank (DNB), "Value of Dutch indirect crypto investments grows to over €1 billion"',
    },
  ],

  'austria': [
    {
      highlight: '3%',
      highlightLabel: 'de hogares austríacos con criptoactivos (OeNB)',
      body: 'El banco central austríaco (OeNB) reporta que aproximadamente el 3% de los hogares en Austria posee criptoactivos, con una mediana de tenencia de €6.000.',
      source: 'OeNB (Austrian central bank), encuesta sobre tenencia de criptoactivos en hogares',
    },
    {
      highlight: '€6,000',
      highlightLabel: 'mediana de tenencias cripto en hogares austríacos',
      body: 'Entre los hogares austríacos que sí tienen criptoactivos, OeNB informa que la mediana reportada ronda los €6.000, un dato concreto del "tamaño típico" de la inversión cripto.',
      source: 'OeNB, resultados de encuesta de hogares (tenencia y montos mediana)',
    },
  ],

  'dinamarca': [
    {
      highlight: '6.5%',
      highlightLabel: 'de tenencia cripto en Dinamarca (mar 2024)',
      body: 'El estudio EY/K33 estima una tasa de tenencia de criptomonedas del 6,5% en Dinamarca (marzo 2024) dentro del comparativo nórdico.',
      source: 'EY + K33 Research, Nordic Crypto Adoption Survey (2024)',
    },
    {
      highlight: '12%',
      highlightLabel: 'de los jóvenes 18-29 con cripto en Dinamarca',
      body: 'La adopción es mayor en jóvenes: el reporte muestra ~12% de tenencia en el tramo de 18 a 29 años en Dinamarca, el doble del promedio del país.',
      source: 'EY + K33 Research, Nordic Crypto Adoption Survey (2024)',
    },
  ],

  'noruega': [
    {
      highlight: '6.5%',
      highlightLabel: 'de tenencia cripto en los países nórdicos (mar 2024)',
      body: 'El estudio comparativo EY/K33 muestra que los países nórdicos, incluyendo Noruega, registran tasas de tenencia cripto en torno al 6-7%, con mayor concentración en menores de 30 años.',
      source: 'EY + K33 Research, Nordic Crypto Adoption Survey (2024)',
    },
  ],

  'suecia': [
    {
      highlight: '6.8%',
      highlightLabel: 'de tenencia cripto en Suecia (mar 2024)',
      body: 'En el comparativo nórdico de EY/K33, Suecia aparece con una tasa de tenencia del 6,8% y ~550.000 suecos con criptomonedas, el número absoluto más alto de los países nórdicos.',
      source: 'EY + K33 Research, Nordic Crypto Adoption Survey (2024)',
    },
    {
      highlight: '20%',
      highlightLabel: 'de suecos menores de 30 con cripto (aprox.)',
      body: 'El reporte indica que cerca de 1 de cada 5 suecos menores de 30 años posee criptomonedas, un ángulo generacional que destaca la adopción en la franja más joven.',
      source: 'EY + K33 Research, Nordic Crypto Adoption Survey (2024)',
    },
  ],

  // ── ASIA ──────────────────────────────────────────────────────────────────

  'japón': [
    {
      highlight: '2017',
      highlightLabel: 'primer país G7 en regular exchanges cripto por ley',
      body: 'Japón fue el primer país del G7 en regular legalmente los exchanges de criptomonedas bajo la Ley de Servicios de Pago (2017), estableciendo un estándar regulatorio global.',
      source: 'Agencia de Servicios Financieros de Japón (FSA), 2017',
    },
  ],

  'corea del sur': [
    {
      highlight: '"Kimchi Premium"',
      highlightLabel: 'BTC con prima de hasta 30% en exchanges coreanos',
      body: 'Corea del Sur registró el fenómeno conocido como "Kimchi Premium": el precio del Bitcoin en exchanges locales llegó a ser un 30-50% mayor que el precio global, por controles de capital.',
      source: 'Korea Financial Services Commission / análisis de mercado 2017-2018',
    },
  ],

  'australia': [
    {
      highlight: '25%',
      highlightLabel: 'de australianos poseen o poseyeron cripto',
      body: 'Australia tiene una de las mayores tasas de adopción cripto del mundo angloparlante: el 25% de los adultos reporta haber tenido o tener criptomonedas en 2024.',
      source: 'Finder Crypto Report 2024 (Australia)',
    },
  ],

  'irán': [
    {
      highlight: '4.5%',
      highlightLabel: 'del hashrate global de Bitcoin minado en Irán',
      body: 'Irán utilizó la minería de Bitcoin como mecanismo para esquivar sanciones internacionales. Llegó a representar el 4,5% del hashrate global de Bitcoin antes de restricciones internas.',
      source: 'Cambridge Centre for Alternative Finance (CCAF) 2021',
    },
  ],

  'china': [
    {
      highlight: '¥14.2 T',
      highlightLabel: 'en transacciones acumuladas de e-CNY (sep 2025)',
      body: 'Las transacciones acumuladas del RMB digital (e-CNY / yuan digital) alcanzaron 14,2 billones de yuanes (~USD 2 billones) hacia fines de septiembre de 2025, según datos citados del Banco Popular de China.',
      source: 'State Council (english.www.gov.cn) / Xinhua citando al PBoC, "digital RMB transactions top 14.2 trillion yuan"',
    },
  ],

  // ── AFRICA ────────────────────────────────────────────────────────────────

  'nigeria': [
    {
      highlight: '#2',
      highlightLabel: 'en adopción cripto global (Chainalysis 2024)',
      body: 'Nigeria es el segundo país con mayor adopción de criptomonedas en el mundo. El uso de stablecoins es masivo como alternativa al naira ante la inflación y restricciones bancarias.',
      source: 'Chainalysis Global Crypto Adoption Index 2024',
    },
  ],

  'marruecos': [
    {
      highlight: '2024',
      highlightLabel: 'primera ley cripto integral de África',
      body: 'Marruecos aprobó en 2024 un marco regulatorio integral para criptomonedas, convirtiéndose en uno de los primeros países africanos en tener legislación clara sobre activos digitales.',
      source: 'Bank Al-Maghrib, Marruecos, 2024',
    },
  ],

  'ghana': [
    {
      highlight: 'eCedi',
      highlightLabel: 'moneda digital de banco central (CBDC)',
      body: 'Ghana lanzó el eCedi, su moneda digital de banco central, en 2022, siendo uno de los primeros países africanos en implementar una CBDC operativa a escala.',
      source: 'Banco de Ghana, 2022',
    },
  ],

  'senegal': [
    {
      highlight: 'e-CFA',
      highlightLabel: 'moneda digital del Banco Central de África Occidental',
      body: 'Senegal forma parte de la zona CFA y exploró activamente el e-CFA, una moneda digital regional impulsada por el Banco Central de los Estados de África Occidental.',
      source: 'BCEAO (Banco Central de los Estados de África Occidental)',
    },
  ],

  'sudáfrica': [
    {
      highlight: 'Regulado',
      highlightLabel: 'primer marco legal cripto de África del Sur (2023)',
      body: 'Sudáfrica reguló los activos cripto como instrumentos financieros en 2023, siendo el primer país de África Austral en establecer un marco legal completo para el sector.',
      source: 'Financial Sector Conduct Authority (FSCA), Sudáfrica, 2023',
    },
  ],

  'argelia': [
    {
      highlight: 'Top 10',
      highlightLabel: 'en P2P cripto de África del Norte (Chainalysis)',
      body: 'Argelia figura entre los países africanos con mayor actividad P2P en criptomonedas. Pese a la prohibición formal, el uso de canales informales impulsó el volumen transaccionado.',
      source: 'Chainalysis, Geography of Cryptocurrency Report (Africa, 2023)',
    },
  ],

  'túnez': [
    {
      highlight: 'eDinar',
      highlightLabel: 'proyecto de CBDC del banco central (BCT)',
      body: 'El Banco Central de Túnez exploró el eDinar, una iniciativa de moneda digital que lo posicionó como uno de los primeros países africanos en investigar formalmente una CBDC.',
      source: 'Banque Centrale de Tunisie (BCT), comunicaciones sobre digitalización monetaria',
    },
  ],

  'nueva zelanda': [
    {
      highlight: 'CBDC',
      highlightLabel: 'consulta pública del banco central (RBNZ 2023)',
      body: 'El Banco de la Reserva de Nueva Zelanda lanzó una consulta pública sobre el futuro del dinero y una posible CBDC en 2023, recibiendo miles de respuestas ciudadanas.',
      source: 'Reserve Bank of New Zealand (RBNZ), "The Future of Money" consultation (2023)',
    },
  ],

  'suiza': [
    {
      highlight: 'Crypto Valley',
      highlightLabel: 'hub blockchain global en Zug (desde 2013)',
      body: 'El cantón de Zug es conocido mundialmente como el "Crypto Valley": alberga más de 1.000 empresas blockchain, incluyendo la Fundación Ethereum, registrada allí en 2014.',
      source: 'Crypto Valley Association / Ethereum Foundation, Zug (registro 2014)',
    },
    {
      highlight: 'DLT Act',
      highlightLabel: 'primera ley de valores en blockchain del mundo (2021)',
      body: 'La Ley DLT suiza (2021) fue el primer marco legal del mundo específicamente diseñado para valores basados en tecnología de registro distribuido, habilitando activos financieros nativamente digitales.',
      source: 'Federal Council of Switzerland, DLT Act (1 Feb 2021)',
    },
  ],

  'españa': [
    {
      highlight: 'CNMV',
      highlightLabel: 'primera regulación de publicidad cripto en Europa (2022)',
      body: 'España fue pionera en Europa: desde 2022, la CNMV exige registro previo y advertencias de riesgo en toda publicidad de criptoactivos dirigida a más de 100.000 personas.',
      source: 'CNMV, Circular 1/2022 sobre publicidad de criptoactivos',
    },
    {
      highlight: 'Banco de España',
      highlightLabel: 'registro formal de proveedores cripto',
      body: 'El Banco de España mantiene el registro oficial de proveedores de servicios de criptomonedas bajo el marco de prevención de blanqueo de capitales, alineado con las directivas europeas.',
      source: 'Banco de España, registro de proveedores de servicios de cambio de moneda virtual (AML5)',
    },
  ],

  'francia': [
    {
      highlight: 'PSAN',
      highlightLabel: 'régimen cripto pionero en Europa (Loi PACTE 2019)',
      body: 'Con la Loi PACTE (2019), Francia creó el PSAN (Prestataires de Services sur Actifs Numériques), uno de los primeros marcos formales de registro y supervisión cripto en toda Europa.',
      source: 'AMF / Loi PACTE n°2019-486, République Française (2019)',
    },
    {
      highlight: 'AMF',
      highlightLabel: 'barómetro anual de inversores en cripto (2024)',
      body: 'La AMF (regulador financiero francés) publica un barómetro anual con datos específicos de tenencia e inversión en criptoactivos, uno de los estudios de adopción institucional más completos de Europa.',
      source: 'AMF, Savings & Investment Barometer (2024 edition)',
    },
  ],

  'croacia': [
    {
      highlight: 'Ene 2023',
      highlightLabel: 'miembro más nuevo de la eurozona',
      body: 'Croacia adoptó el euro el 1 de enero de 2023, siendo el miembro más reciente de la eurozona. El cambio de kuna a euro intensificó el debate local sobre soberanía monetaria y activos digitales alternativos.',
      source: 'European Central Bank / Hrvatska narodna banka, comunicaciones de transición (2023)',
    },
  ],

  'arabia saudí': [
    {
      highlight: 'Project Aber',
      highlightLabel: 'CBDC experimental con Emiratos Árabes (SAMA 2020)',
      body: 'Arabia Saudí y los Emiratos Árabes Unidos ejecutaron el Proyecto Aber (2019-2020): un experimento conjunto de moneda digital de banco central para pagos transfronterizos interbancarios, con resultados publicados por ambos bancos centrales.',
      source: 'Saudi Central Bank (SAMA) + Central Bank of UAE, Project Aber Final Report (2020)',
    },
    {
      highlight: 'Vision 2030',
      highlightLabel: 'agenda de economía digital nacional',
      body: 'La Visión 2030 de Arabia Saudí incluye la digitalización financiera como eje estratégico. SAMA publicó una Estrategia de Fintech con objetivos específicos de infraestructura de pagos digitales.',
      source: 'Saudi Central Bank (SAMA), Fintech Strategy 2023-2025',
    },
  ],

  // Alias para coincidir con ambas grafías posibles en la DB
  'arabia saudita': [
    {
      highlight: 'Project Aber',
      highlightLabel: 'CBDC experimental con Emiratos Árabes (SAMA 2020)',
      body: 'Arabia Saudí y los Emiratos Árabes Unidos ejecutaron el Proyecto Aber (2019-2020): un experimento conjunto de moneda digital de banco central para pagos transfronterizos interbancarios.',
      source: 'Saudi Central Bank (SAMA) + Central Bank of UAE, Project Aber Final Report (2020)',
    },
    {
      highlight: 'Vision 2030',
      highlightLabel: 'agenda de economía digital nacional',
      body: 'La Visión 2030 de Arabia Saudí incluye la digitalización financiera como eje estratégico. SAMA publicó una Estrategia de Fintech con objetivos de infraestructura de pagos digitales.',
      source: 'Saudi Central Bank (SAMA), Fintech Strategy 2023-2025',
    },
  ],
}

/** Fallback cuando ninguno de los dos países del partido tiene dato cripto propio. */
export const WORLD_CUP_CRYPTO_FALLBACK: CryptoCountryFact[] = [
  {
    highlight: '2026',
    highlightLabel: 'el primer Mundial con tickets en blockchain',
    body: 'El Mundial 2026 (USA, Canadá y México) es el primero en emitir entradas digitales sobre blockchain, a través de FIFA Collect en la red Avalanche, marcando una nueva era en la venta de tickets deportivos.',
    source: 'FIFA Collect / Avalanche, 2024',
  },
]
