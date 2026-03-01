// Marketing layout: no sidebar, no persistent header.
// Each page (landing, ingresa, registro) manages its own full-screen layout.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
