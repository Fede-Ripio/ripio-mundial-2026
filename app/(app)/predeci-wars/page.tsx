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
      <div className="max-w-2xl mx-auto space-y-10">

        {markets.map((market) => (
          <div key={market.id}>

            {/* Título */}
            <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
              <span>{market.emoji}</span>
              <span>{market.title}</span>
            </h2>

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

      {/* Descargá la app de Ripio */}
      <div className="max-w-2xl mx-auto mt-16 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Operar cripto</p>
        <h2 className="text-xl font-bold mb-2">Descargá la app de Ripio</h2>
        <p className="text-gray-400 text-sm mb-6">
          Comprá, vendé y gestioná tus criptomonedas en minutos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://apps.apple.com/ar/app/ripio/id1146834723"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white text-black font-semibold px-5 py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors"
          >
            App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.ripio.exchange"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white text-black font-semibold px-5 py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors"
          >
            Google Play
          </a>
        </div>
      </div>

    </div>
  )
}
