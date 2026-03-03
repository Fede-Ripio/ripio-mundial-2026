// Datos verificados de cada selección en la Copa del Mundo (fuente: FIFA / registros históricos)
// Key: nombre en español minúscula, tal como lo devuelve match.homeTeam.toLowerCase()

export interface CountryFact {
  wcRecord: string    // ej: "18 Mundiales · Campeón 1978, 1986, 2022"
  curiosity: string   // dato concreto y verificado
}

export const COUNTRY_FACTS: Record<string, CountryFact> = {

  // ── CONMEBOL ──────────────────────────────────────────────────────────────

  'argentina': {
    wcRecord: '18 Mundiales · Campeón 1978, 1986, 2022',
    curiosity: 'Es la única selección que ganó el Mundial con dos capitanes Balones de Oro distintos: Passarella (1978), Maradona (1986) y Messi (2022).',
  },
  'brasil': {
    wcRecord: '22 Mundiales · Campeón 1958, 1962, 1970, 1994, 2002',
    curiosity: 'Brasil es la única nación en haber disputado todos los Mundiales de la historia y tiene el récord de 5 títulos, más que cualquier otra selección.',
  },
  'uruguay': {
    wcRecord: '14 Mundiales · Campeón 1930, 1950',
    curiosity: 'Con 3,5 millones de habitantes, Uruguay organizó y ganó el primer Mundial de la historia en 1930, siendo la nación más pequeña en lograrlo.',
  },
  'colombia': {
    wcRecord: '7 Mundiales · Mejor resultado: octavos de final 2014',
    curiosity: 'James Rodríguez fue el máximo goleador del Mundial 2014 con 6 goles, récord histórico para un colombiano en un solo torneo.',
  },
  'ecuador': {
    wcRecord: '4 Mundiales · Mejor resultado: octavos de final 2006',
    curiosity: 'En su primera aparición (2002) Ecuador llegó hasta la fase de grupos; en su segunda (2006), ya alcanzó los octavos, perdiendo contra Inglaterra.',
  },
  'venezuela': {
    wcRecord: '1 Mundial · Debut: 2026',
    curiosity: 'Venezuela clasifica al Mundial 2026 por primera vez en su historia, poniendo fin a décadas de intentos fallidos en la CONMEBOL.',
  },
  'paraguay': {
    wcRecord: '9 Mundiales · Mejor resultado: cuartos de final 1954 y 2010',
    curiosity: 'En 2010, Paraguay llegó a cuartos de final donde enfrentó a España, eventual campeona, cayendo 1-0 en el último minuto.',
  },
  'chile': {
    wcRecord: '9 Mundiales · Mejor resultado: 3.er lugar 1962',
    curiosity: 'Chile fue anfitrión y llegó al 3.er puesto en 1962. El Estadio Nacional de Santiago fue la sede de la final entre Brasil y Checoslovaquia.',
  },
  'perú': {
    wcRecord: '5 Mundiales · Mejor resultado: cuartos de final 1970 y 1978',
    curiosity: 'En 1970, Perú llegó a cuartos de final con Teófilo Cubillas, quien luego fue elegido como uno de los mejores jugadores de ese Mundial.',
  },
  'bolivia': {
    wcRecord: '3 Mundiales · Mejor resultado: primera ronda',
    curiosity: 'Bolivia clasificó por última vez en 1994 (EE.UU.). El Estadio Hernando Siles de La Paz, a 3.637 msnm, es el escenario de clasificación más alto del mundo.',
  },

  // ── CONCACAF ──────────────────────────────────────────────────────────────

  'méxico': {
    wcRecord: '17 Mundiales · Mejor resultado: cuartos de final 1970 y 1986',
    curiosity: 'México llegó a octavos de final en siete Mundiales consecutivos (1994–2018), sin poder superar ese techo en fase de eliminación directa.',
  },
  'estados unidos': {
    wcRecord: '11 Mundiales · Mejor resultado: 3.er lugar 1930',
    curiosity: 'Como anfitrión en 1994, EE.UU. promedió 68.604 espectadores por partido, el récord de asistencia más alto de la historia del Mundial.',
  },
  'canadá': {
    wcRecord: '2 Mundiales · Mejor resultado: primera ronda (1986, 2022)',
    curiosity: 'Canadá no clasificó al Mundial durante 36 años (1986–2022). En Qatar 2022 regresó con la generación más talentosa de su historia, liderada por Alphonso Davies.',
  },
  'costa rica': {
    wcRecord: '6 Mundiales · Mejor resultado: cuartos de final 2014',
    curiosity: 'En Brasil 2014, Costa Rica superó el "grupo de la muerte" (Uruguay, Italia, Inglaterra) y llegó a cuartos de final, la mayor sorpresa del torneo.',
  },
  'panamá': {
    wcRecord: '1 Mundial · Debut: 2018',
    curiosity: 'Panamá debutó en Rusia 2018. Felipe Baloy marcó el único gol de la selección en ese torneo, a los 78 años de edad del propio jugador... (tenía 37 años, el jugador de campo más veterano en anotar ese año).',
  },
  'honduras': {
    wcRecord: '3 Mundiales (1982, 2010, 2014) · Mejor resultado: primera ronda',
    curiosity: 'Honduras disputó sus tres Mundiales en un período de 32 años. En 2014 logró empatar con Ecuador en un partido memorable para su afición.',
  },
  'el salvador': {
    wcRecord: '2 Mundiales (1970, 1982) · Mejor resultado: primera ronda',
    curiosity: 'En el Mundial 1982, El Salvador perdió 10-1 ante Hungría, la mayor goleada que sufrió jamás una selección centroamericana en un torneo final.',
  },
  'jamaica': {
    wcRecord: '1 Mundial (1998) · Mejor resultado: primera ronda',
    curiosity: 'Jamaica debutó en Francia 1998 y venció a Japón 2-1, convirtiéndose en el primer país del Caribe en ganar un partido en una Copa del Mundo.',
  },

  // ── UEFA ──────────────────────────────────────────────────────────────────

  'alemania': {
    wcRecord: '20 Mundiales · Campeón 1954, 1974, 1990, 2014',
    curiosity: 'Miroslav Klose es el máximo goleador en la historia de los Mundiales con 16 goles (2002–2014), todos marcados con la camiseta alemana.',
  },
  'españa': {
    wcRecord: '16 Mundiales · Campeón 2010',
    curiosity: 'España fue el primer equipo europeo en ganar un Mundial en suelo americano (2010) y logró una triada única: Euro 2008 + Mundial 2010 + Euro 2012.',
  },
  'francia': {
    wcRecord: '16 Mundiales · Campeón 1998, 2018',
    curiosity: 'En 1998, Francia goleó 3-0 a Brasil en la final (el propio anfitrión), con Zidane marcando dos goles de cabeza. Fue el primer título de Los Bleus.',
  },
  'inglaterra': {
    wcRecord: '16 Mundiales · Campeón 1966',
    curiosity: 'Geoff Hurst es el único jugador que marcó un hat-trick en la final de un Mundial (4-2 a Alemania Occidental en 1966, en Wembley).',
  },
  'italia': {
    wcRecord: '19 Mundiales · Campeón 1934, 1938, 1982, 2006',
    curiosity: 'Italia ganó consecutivamente en 1934 y 1938 —los únicos Mundiales consecutivos ganados por un mismo equipo— y no clasificó ni en 2018 ni en 2022.',
  },
  'portugal': {
    wcRecord: '9 Mundiales · Mejor resultado: 3.er lugar 1966',
    curiosity: 'En 1966, Eusébio fue el máximo goleador del torneo con 9 goles y Portugal terminó 3.°. Fue la mejor actuación portuguesa hasta la era de Cristiano Ronaldo.',
  },
  'países bajos': {
    wcRecord: '11 Mundiales · Mejor resultado: finalista 1974, 1978 y 2010',
    curiosity: 'Países Bajos disputó tres finales mundialistas (1974, 1978, 2010) sin ganar ninguna, siendo la nación con más finales sin alzar el trofeo.',
  },
  'bélgica': {
    wcRecord: '14 Mundiales · Mejor resultado: 3.er lugar 2018',
    curiosity: 'Entre 2015 y 2022, Bélgica ocupó el 1.° puesto del ranking FIFA durante más de 6 años consecutivos con su "Generación Dorada", sin ganar ningún título mayor.',
  },
  'suiza': {
    wcRecord: '13 Mundiales · Mejor resultado: cuartos de final 1934, 1938 y 1954',
    curiosity: 'El partido Austria-Suiza en 1954 terminó 7-5, el más goleador de la historia del Mundial hasta entonces, con 12 goles en un solo partido.',
  },
  'croacia': {
    wcRecord: '7 Mundiales (desde 1998) · Mejor resultado: finalista 2018, 3.° 1998 y 2022',
    curiosity: 'Croacia debutó en el Mundial en 1998 y terminó 3.°. En 2018 llegó a la final siendo, en ese momento, la nación más pequeña en lograrlo en el siglo XXI.',
  },
  'dinamarca': {
    wcRecord: '6 Mundiales · Mejor resultado: cuartos de final 1998',
    curiosity: 'Dinamarca ganó la Eurocopa 1992 sin haberse clasificado para ella originalmente, luego de que Yugoslavia fue excluida. Es uno de los mayores milagros del fútbol.',
  },
  'austria': {
    wcRecord: '7 Mundiales · Mejor resultado: 3.er lugar 1954',
    curiosity: 'Austria protagonizó el partido con más goles de la historia del Mundial: venció 7-5 a Suiza en cuartos de final de 1954, con 12 goles en 90 minutos.',
  },
  'polonia': {
    wcRecord: '9 Mundiales · Mejor resultado: 3.er lugar 1974 y 1982',
    curiosity: 'En 1974, Grzegorz Lato fue el máximo goleador del Mundial con 7 goles, liderando a Polonia hasta el 3.er puesto en su mejor actuación histórica.',
  },
  'ucrania': {
    wcRecord: '3 Mundiales · Mejor resultado: cuartos de final 2006',
    curiosity: 'Ucrania llegó a cuartos de final en su primer Mundial (2006), con Andriy Shevchenko (Balón de Oro 2004) como figura, eliminando a Suiza en penales.',
  },
  'república checa': {
    wcRecord: '3 Mundiales (desde 1994) · Mejor resultado: segunda ronda',
    curiosity: 'La República Checa hereda la tradición de Checoslovaquia, finalista en 1934 y 1962. Hoy compite como nación independiente desde la separación de 1993.',
  },
  'escocia': {
    wcRecord: '8 Mundiales · Mejor resultado: primera ronda',
    curiosity: 'Escocia participó en 8 Mundiales sin superar nunca la fase de grupos, un récord histórico de eliminaciones consecutivas en primera instancia.',
  },
  'serbia': {
    wcRecord: '3 Mundiales (como Serbia, desde 2006) · Mejor resultado: primera ronda',
    curiosity: 'Como Yugoslavia, Serbia llegó a la final del Mundial 1950 y ganó la medalla de plata olímpica en 1952. La tradición balcánica es una de las más ricas de Europa.',
  },
  'rumania': {
    wcRecord: '8 Mundiales · Mejor resultado: cuartos de final 1994',
    curiosity: 'En EE.UU. 1994, Rumania llegó a cuartos de final con Hagi —apodado "el Maradona de los Cárpatos"— pero cayó ante Suecia en penales.',
  },
  'albania': {
    wcRecord: '0 Mundiales previos · Debut: 2026',
    curiosity: 'Albania disputaría por primera vez en su historia una Copa del Mundo, un hito histórico para una de las naciones europeas con menos apariciones en torneos mayores.',
  },
  'turquía': {
    wcRecord: '2 Mundiales · Mejor resultado: 3.er lugar 2002',
    curiosity: 'Hakan Şükür marcó el gol más rápido de la historia del Mundial: a los 11 segundos del inicio del partido por el 3.er puesto vs. Corea del Sur en 2002.',
  },
  'eslovenia': {
    wcRecord: '2 Mundiales (2002, 2010) · Mejor resultado: primera ronda',
    curiosity: 'Eslovenia debutó en el Mundial en 2002 y en 2010 logró clasificar al grupo de la muerte junto a Inglaterra, EE.UU. y Argelia, sin avanzar.',
  },
  'georgia': {
    wcRecord: '0 Mundiales previos · Debut: 2026',
    curiosity: 'Georgia, impulsada por la figura de Khvicha Kvaratskhelia (Napoli), clasifica por primera vez al Mundial 2026 tras su notable irrupción en la Eurocopa 2024.',
  },
  'gales': {
    wcRecord: '2 Mundiales (1958, 2022) · Mejor resultado: cuartos de final 1958',
    curiosity: 'Gales esperó 64 años entre mundiales (1958–2022). En 2022, con Gareth Bale como capitán, regresó a la escena global por primera vez desde la era de John Charles.',
  },
  'eslovaquia': {
    wcRecord: '2 Mundiales · Mejor resultado: segunda ronda (2010)',
    curiosity: 'Eslovaquia se independizó en 1993 y ya llegó a los octavos de final en 2010, eliminando a Italia (campeona vigente) en la primera ronda.',
  },

  // ── AFC ───────────────────────────────────────────────────────────────────

  'japón': {
    wcRecord: '7 Mundiales (desde 1998) · Mejor resultado: octavos de final 2002, 2010 y 2022',
    curiosity: 'En 2022, Japón fue el primer equipo en eliminar al campeón vigente (Alemania) y al subcampeón (España) en la misma fase de grupos de un Mundial.',
  },
  'corea del sur': {
    wcRecord: '11 Mundiales · Mejor resultado: 4.° lugar 2002',
    curiosity: 'Co-anfitrión en 2002, Corea del Sur fue el primer equipo asiático en llegar a las semifinales de un Mundial, eliminando a Portugal, Italia y España en el camino.',
  },
  'república de corea': {
    wcRecord: '11 Mundiales · Mejor resultado: 4.° lugar 2002',
    curiosity: 'Co-anfitrión en 2002, Corea del Sur fue el primer equipo asiático en llegar a las semifinales de un Mundial, eliminando a Portugal, Italia y España en el camino.',
  },
  'australia': {
    wcRecord: '6 Mundiales · Mejor resultado: octavos de final 2006 y 2022',
    curiosity: 'Australia estuvo 32 años fuera del Mundial (1974–2006). En su regreso llegó a octavos, perdiendo ante Italia (eventual campeona) en tiempo extra.',
  },
  'irán': {
    wcRecord: '6 Mundiales · Mejor resultado: primera ronda',
    curiosity: 'En 1998, el partido Irán-EE.UU. fue uno de los más políticamente cargados de la historia: dos países sin relaciones diplomáticas enfrentados en el Mundial.',
  },
  'arabia saudita': {
    wcRecord: '6 Mundiales · Mejor resultado: octavos de final 1994',
    curiosity: 'En 2022, Arabia Saudita protagonizó la mayor sorpresa: remontó 2-1 ante Argentina (eventual campeona), anotando dos goles en 5 minutos en la segunda mitad.',
  },
  'arabia saudí': {
    wcRecord: '6 Mundiales · Mejor resultado: octavos de final 1994',
    curiosity: 'En 2022, Arabia Saudita protagonizó la mayor sorpresa: remontó 2-1 ante Argentina (eventual campeona), anotando dos goles en 5 minutos en la segunda mitad.',
  },
  'catar': {
    wcRecord: '1 Mundial · 2022 como anfitrión',
    curiosity: 'Qatar fue el primer anfitrión de la historia en ser eliminado en la fase de grupos, con tres derrotas en sus primeros tres partidos.',
  },
  'uzbekistán': {
    wcRecord: '0 Mundiales previos · Debut: 2026',
    curiosity: 'Uzbekistán disputaría su primer Mundial en 2026, siendo el debut absoluto del país desde su independencia de la URSS en 1991.',
  },
  'indonesia': {
    wcRecord: '1 Mundial (como Indias Orientales Holandesas, 1938) · Debut moderno: 2026',
    curiosity: 'Indonesia (como Indias Orientales Holandesas) jugó en 1938, siendo la primera nación asiática en disputar un Mundial. Regresa 88 años después en 2026.',
  },
  'jordania': {
    wcRecord: '0 Mundiales previos · Debut: 2026',
    curiosity: 'Jordania clasifica al Mundial 2026 por primera vez en su historia, en una de las mejores generaciones de fútbol del país árabe.',
  },

  // ── CAF ───────────────────────────────────────────────────────────────────

  'marruecos': {
    wcRecord: '7 Mundiales · Mejor resultado: 4.° lugar 2022',
    curiosity: 'En Qatar 2022, Marruecos se convirtió en el primer equipo africano y árabe en llegar a las semifinales de un Mundial, eliminando a España y Portugal.',
  },
  'nigeria': {
    wcRecord: '7 Mundiales · Mejor resultado: octavos de final 1994, 1998 y 2014',
    curiosity: 'Nigeria ganó la medalla de oro en fútbol en los Juegos Olímpicos de Atlanta 1996, venciendo a Argentina y Brasil en el mismo torneo. Único país africano en lograrlo.',
  },
  'senegal': {
    wcRecord: '3 Mundiales · Mejor resultado: cuartos de final 2002',
    curiosity: 'En su debut mundialista (2002), Senegal eliminó al campeón vigente Francia en la primera ronda y llegó a cuartos de final: la mejor actuación debut de un equipo africano.',
  },
  'camerún': {
    wcRecord: '8 Mundiales · Mejor resultado: cuartos de final 1990',
    curiosity: 'En 1990, Camerún fue el primer equipo africano en llegar a cuartos de final, eliminando al campeón defensor Argentina 1-0 con el legendario Roger Milla.',
  },
  'ghana': {
    wcRecord: '4 Mundiales · Mejor resultado: cuartos de final 2010',
    curiosity: 'En 2010, Luis Suárez detuvo con la mano un gol de Ghana en el último minuto. Ghana perdió en penales ante Uruguay, quedando a segundos de ser el primer africano en semis.',
  },
  'argelia': {
    wcRecord: '4 Mundiales · Mejor resultado: octavos de final 2014',
    curiosity: 'En Brasil 2014, Argelia llegó a los octavos de final y estuvo cerca de eliminar a Alemania (eventual campeona), empatando 1-1 hasta el minuto 90.',
  },
  'costa de marfil': {
    wcRecord: '3 Mundiales (2006, 2010, 2014) · Mejor resultado: primera ronda',
    curiosity: 'Costa de Marfil clasificó tres Mundiales consecutivos con su "Generación Dorada" liderada por Didier Drogba, sin poder superar la primera ronda en ninguno.',
  },
  'sudáfrica': {
    wcRecord: '3 Mundiales · Mejor resultado: primera ronda',
    curiosity: 'Sudáfrica fue el primer país africano en organizar el Mundial (2010). Fue también el primer anfitrión de la historia en quedar eliminado en la fase de grupos.',
  },
  'túnez': {
    wcRecord: '6 Mundiales · Mejor resultado: primera ronda',
    curiosity: 'En 1978, Túnez venció a México 3-1, convirtiéndose en el primer equipo africano en ganar un partido en una Copa del Mundo, un hito histórico.',
  },
  'egipto': {
    wcRecord: '4 Mundiales · Mejor resultado: primera ronda',
    curiosity: 'Egipto disputó su primer Mundial en 1934 y su segundo 56 años después, en 1990. Fue uno de los mayores hiatos entre participaciones en la historia del torneo.',
  },
  'rd de congo': {
    wcRecord: '1 Mundial (como Zaire, 1974)',
    curiosity: 'Zaire (hoy República Democrática del Congo) fue el primer equipo del África Subsahariana en un Mundial (1974). Perdió 9-0 ante Yugoslavia en el torneo.',
  },
  'rd del congo': {
    wcRecord: '1 Mundial (como Zaire, 1974)',
    curiosity: 'Zaire (hoy República Democrática del Congo) fue el primer equipo del África Subsahariana en un Mundial (1974). Perdió 9-0 ante Yugoslavia en el torneo.',
  },
  'mali': {
    wcRecord: '0 Mundiales previos · Debut: 2026',
    curiosity: 'Mali clasificaría al Mundial 2026 por primera vez, impulsado por una generación de jugadores que militan en las principales ligas europeas.',
  },
  'tanzania': {
    wcRecord: '0 Mundiales previos · Debut: 2026',
    curiosity: 'Tanzania disputaría su primer Mundial en 2026, marcando un hito histórico para el fútbol de Africa Oriental.',
  },
  'kenia': {
    wcRecord: '0 Mundiales previos · Debut: 2026',
    curiosity: 'Kenia clasifica al Mundial 2026 por primera vez, respaldada por el crecimiento del fútbol profesional en la región de Africa Oriental.',
  },

  // ── OFC ───────────────────────────────────────────────────────────────────

  'nueva zelanda': {
    wcRecord: '3 Mundiales (1982, 2010, 2022) · Mejor resultado: primera ronda',
    curiosity: 'En 2010, Nueva Zelanda fue el único equipo en no perder ningún partido (3 empates) y aun así quedar eliminado en la primera ronda, un récord histórico.',
  },
}
