// Filtro de palabras prohibidas — español rioplatense + castellano general
// La detección es normalizada: ignora mayúsculas, acentos y caracteres especiales
// para prevenir evasiones como "b0ludo", "pütø", "m1erda", "B O L U D O", etc.

const BAD_WORDS: string[] = [
  // Insultos rioplatenses
  'pelotudo', 'pelotuda',
  'boludo', 'boluda',
  'forro', 'forra',
  'sorete',
  'chota',
  'pija',
  'cagon', 'cagona', 'cagada',
  'gil', 'gila',
  'tarado', 'tarada',
  'mogolico', 'mogolica',
  'mogolo',
  // Insultos generales castellano
  'hdp',
  'puto', 'puta', 'putas', 'putos',
  'hijo de puta',
  'hijodeputa',
  'concha',
  'reconcha',
  'mierda',
  'carajo',
  'pendejo', 'pendeja',
  'malparido', 'malparida',
  'coño', 'cono',
  'verga',
  'culo',
  'idiota',
  'imbecil',
  'estupido', 'estupida',
  'maricón', 'maricon', 'marica',
  // Variantes compuestas
  'la concha',
  'la puta',
  'vete a la mierda',
  'a la mierda',
  'que te jodan',
  'me cago',
  // Xenofobia / discriminación
  'negro de mierda',
  'negra de mierda',
  'sudaca',
  'boliguayo',
]

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // quita acentos/diacríticos
    .replace(/0/g, 'o')                // 0 → o  (leetspeak básico)
    .replace(/1/g, 'i')                // 1 → i
    .replace(/3/g, 'e')                // 3 → e
    .replace(/4/g, 'a')                // 4 → a
    .replace(/5/g, 's')                // 5 → s
    .replace(/\$/g, 's')               // $ → s
    .replace(/@/g, 'a')                // @ → a
    .replace(/[^a-z ]/g, '')           // elimina el resto de caracteres especiales
    .replace(/\s+/g, ' ')              // colapsa espacios múltiples
    .trim()
}

// Devuelve true si el texto contiene alguna palabra prohibida
export function containsBadWords(text: string): boolean {
  const normalized = normalize(text)
  const normalizedList = BAD_WORDS.map(normalize)
  return normalizedList.some(word => normalized.includes(word))
}
