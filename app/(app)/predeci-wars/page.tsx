import Link from 'next/link'

export const dynamic = 'force-dynamic'

const markets = [
  {
    id: '41',
    title: 'Película más popular',
    emoji: '🎬'
  },
  {
    id: '40',
    title: 'Artista más escuchado',
    emoji: '🎵'
  },
  {
    id: '39',
    title: 'Modelo de IA más usado',
    emoji: '🤖'
  }
]

export default async function PredictionsWarsPage() {
  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12 px-4 sm:px-6">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Ripio Mundial 2026</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-1">Predecí con wARS</h1>
        <p className="text-gray-500 text-sm">
          Mercados de predicción en Base Network · Powered by Precog
        </p>
      </div>

      {/* Mercados */}
      <div className="max-w-2xl space-y-10">

          {markets.map((market) => (
            <div key={market.id}>

              {/* Título + link externo */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>{market.emoji}</span>
                  <span>{market.title}</span>
                </h2>
                <a
                  href={`https://precog.market/market?network=8453&id=${market.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-xs font-semibold flex-shrink-0"
                >
                  Ver completo →
                </a>
              </div>

              {/* Iframe en container con scroll horizontal en mobile */}
              <div className="overflow-x-auto rounded-xl -mx-1 px-1">
                <div style={{ minWidth: '400px' }}>
                  <iframe
                    title={market.title}
                    src={`https://embed.precog.market/market?network=8453&id=${market.id}&type=compact&theme=dark&source=chain`}
                    className="w-full border-none rounded-xl"
                    style={{ height: '320px', background: 'transparent', display: 'block' }}
                    loading="lazy"
                    scrolling="no"
                  />
                </div>
              </div>

            </div>
          ))}

      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 pt-10 mt-12">
        <div className="max-w-2xl text-center">
          <Link
            href="/matches"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <span>⚽</span>
            <span>Volver al prode del Mundial</span>
          </Link>
        </div>
      </div>

    </div>
  )
}
