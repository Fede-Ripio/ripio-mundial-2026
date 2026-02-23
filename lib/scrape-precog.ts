import * as cheerio from 'cheerio'

export interface MarketOption {
  name: string
  probability: number
  color: string
}

export interface MarketData {
  question: string
  options: MarketOption[]
  status: 'open' | 'closed'
  lastUpdated: Date
}

export async function scrapeMarket(marketId: string): Promise<MarketData | null> {
  try {
    const res = await fetch(
      `https://precog.market/market?network=8453&id=${marketId}`,
      { 
        next: { revalidate: 60 }, // Cache 1 min
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      }
    )

    if (!res.ok) return null

    const html = await res.text()
    const $ = cheerio.load(html)

    // Intentar extraer __NEXT_DATA__ (Next.js SSR)
    const nextDataScript = $('script#__NEXT_DATA__').html()
    if (nextDataScript) {
      const data = JSON.parse(nextDataScript)
      const pageProps = data?.props?.pageProps
      
      if (pageProps?.market) {
        return {
          question: pageProps.market.question,
          options: pageProps.market.options.map((opt: any) => ({
            name: opt.name,
            probability: opt.probability || 0,
            color: opt.color || '#8B5CF6'
          })),
          status: pageProps.market.status,
          lastUpdated: new Date()
        }
      }
    }

    // Fallback: scraping manual del HTML
    // (implementar si __NEXT_DATA__ no funciona)

    return null

  } catch (error) {
    console.error('Scrape error:', error)
    return null
  }
}
