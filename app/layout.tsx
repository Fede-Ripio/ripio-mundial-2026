import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { createServerSupabaseClient } from '@/lib/supabase-server'

const BASE_URL = "https://ripio-mundial-2026.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Ripio Mundial 2026",
    template: "%s · Ripio Mundial 2026",
  },
  description: "Pronosticá los resultados del Mundial 2026 y ganá hasta 1MM wARS. Gratis, sin inversión.",
  keywords: ["mundial 2026", "prode", "pronósticos", "ripio", "wARS", "fútbol"],
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Ripio Mundial 2026",
    title: "Ripio Mundial 2026 — Pronosticá y ganá 1MM wARS",
    description: "Pronosticá los resultados del Mundial 2026 y ganá hasta 1MM wARS. Gratis, sin inversión. Competí con miles de usuarios.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 601,
        alt: "Ripio Mundial 2026 — Pronosticá y ganá premios en wARS",
      },
    ],
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ripio Mundial 2026 — Pronosticá y ganá 1MM wARS",
    description: "Pronosticá los resultados del Mundial 2026 y ganá hasta 1MM wARS. Gratis, sin inversión.",
    images: ["/images/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { display_name: string | null; avatar_url: string | null } | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <html lang="es">
      <body className="bg-gray-950 text-gray-100">
        <AppShell user={user} profile={profile}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
