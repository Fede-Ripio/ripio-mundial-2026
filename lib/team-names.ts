// Mapeo de nombres de equipos: Español → Inglés (TheSportsDB)
export const TEAM_NAME_MAP: Record<string, string> = {
  // CONMEBOL
  'argentina': 'argentina',
  'brasil': 'brazil',
  'uruguay': 'uruguay',
  'colombia': 'colombia',
  'ecuador': 'ecuador',
  'paraguay': 'paraguay',
  'chile': 'chile',
  'perú': 'peru',
  'venezuela': 'venezuela',
  'bolivia': 'bolivia',
  
  // CONCACAF
  'méxico': 'mexico',
  'estados unidos': 'usa',
  'canadá': 'canada',
  'costa rica': 'costa rica',
  'panamá': 'panama',
  'jamaica': 'jamaica',
  'honduras': 'honduras',
  'el salvador': 'el salvador',
  'guatemala': 'guatemala',
  'haití': 'haiti',
  'curazao': 'curaçao',
  
  // UEFA
  'alemania': 'germany',
  'españa': 'spain',
  'francia': 'france',
  'inglaterra': 'england',
  'italia': 'italy',
  'países bajos': 'netherlands',
  'portugal': 'portugal',
  'bélgica': 'belgium',
  'suiza': 'switzerland',
  'croacia': 'croatia',
  'dinamarca': 'denmark',
  'austria': 'austria',
  'suecia': 'sweden',
  'polonia': 'poland',
  'ucrania': 'ukraine',
  'república checa': 'czech republic',
  'gales': 'wales',
  'escocia': 'scotland',
  'irlanda': 'ireland',
  'irlanda del norte': 'northern ireland',
  'noruega': 'norway',
  'serbia': 'serbia',
  'rumania': 'romania',
  'eslovaquia': 'slovakia',
  'turquía': 'turkey',
  'grecia': 'greece',
  'macedonia': 'north macedonia',
  'albania': 'albania',
  'kosovo': 'kosovo',
  
  // AFC
  'japón': 'japan',
  'corea del sur': 'south korea',
  'república de corea': 'south korea',
  'corea': 'south korea',
  'australia': 'australia',
  'irán': 'iran',
  'arabia saudí': 'saudi arabia',
  'arabia saudita': 'saudi arabia',
  'irak': 'iraq',
  'catar': 'qatar',
  'qatar': 'qatar',
  'uzbekistán': 'uzbekistan',
  'china': 'china',
  'tailandia': 'thailand',
  
  // CAF
  'marruecos': 'morocco',
  'senegal': 'senegal',
  'túnez': 'tunisia',
  'argelia': 'algeria',
  'egipto': 'egypt',
  'nigeria': 'nigeria',
  'ghana': 'ghana',
  'camerún': 'cameroon',
  'costa de marfil': 'ivory coast',
  'sudáfrica': 'south africa',
  'mali': 'mali',
  'burkina faso': 'burkina faso',
  'cabo verde': 'cape verde',
  'rd de congo': 'dr congo',
  'rd del congo': 'dr congo',
  
  // OFC
  'nueva zelanda': 'new zealand',
  'nueva caledonia': 'new caledonia',
}

export function normalizeTeamName(name: string): string {
  const cleaned = name
    .toLowerCase()
    .replace(/república/g, '')
    .replace(/rep\./g, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  return TEAM_NAME_MAP[cleaned] || cleaned
}
