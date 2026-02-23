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
    <div className="min-h-screen bg-black text-white">
      
      {/* Hero */}
      <div className="border-b border-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Predicciones con wARS
          </h1>
          <p className="text-gray-400 text-sm">
            Mercados de predicción • Cierre febrero 2026
          </p>
        </div>
      </div>

      {/* Mercados */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 space-y-20">
          
          {markets.map((market) => (
            <div key={market.id} className="space-y-6">
              
              {/* Título a la izquierda */}
              <div className="flex items-center gap-3">
                <span className="text-5xl">{market.emoji}</span>
                <h2 className="text-3xl font-bold">{market.title}</h2>
              </div>
              
              {/* Iframe centrado, sin hover */}
              <div className="flex justify-center">
                <a
                  href={`https://precog.market/market?network=8453&id=${market.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  style={{ maxWidth: '500px', width: '100%' }}
                >
                  <iframe 
                    title={market.title}
                    src={`https://embed.precog.market/market?network=8453&id=${market.id}&type=compact&theme=dark&source=chain`}
                    className="w-full border-none rounded-xl"
                    style={{ 
                      height: '340px',
                      background: 'transparent'
                    }}
                    loading="lazy"
                    scrolling="no"
                  />
                </a>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          
          <p className="text-sm text-gray-500">
            Powered by Precog Market • Base Network
          </p>
          
          <Link
            href="/matches"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            <span>⚽</span>
            <span>Prode del Mundial</span>
          </Link>

        </div>
      </div>

    </div>
  )
}
