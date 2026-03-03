import type { CryptoFact } from '@/lib/crypto-facts'

interface Props {
  facts: CryptoFact[]
  btcPrice: number | null
}

function formatBtcPrice(price: number): string {
  return price.toLocaleString('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export default function CryptoFactsSection({ facts, btcPrice }: Props) {
  return (
    <div className="space-y-6">

      {/* Current BTC price banner */}
      {btcPrice && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Precio de Bitcoin hoy</div>
            <div className="text-2xl font-bold text-purple-400">{formatBtcPrice(btcPrice)}</div>
          </div>
          <div className="text-xs text-gray-600 text-right">
            CoinGecko
          </div>
        </div>
      )}

      {/* Fact cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {facts.map(fact => (
          <div
            key={fact.id}
            className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 flex flex-col gap-3"
          >
            {/* Title */}
            <h3 className="text-sm font-semibold text-white leading-tight">{fact.title}</h3>

            {/* Highlight */}
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 leading-none">
                {fact.highlight}
              </div>
              {fact.highlightLabel && (
                <div className="text-xs text-gray-500 mt-1">{fact.highlightLabel}</div>
              )}
            </div>

            {/* Body */}
            <p className="text-xs text-gray-300 leading-relaxed">{fact.body}</p>

            {/* Source */}
            <div className="text-[10px] text-gray-700 mt-auto">
              Fuente: {fact.source}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
