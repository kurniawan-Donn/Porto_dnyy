import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import ThemeProvider from "./components/ThemeProvider";
import StructuredData from "./components/StructuredData";
import { SoundProvider } from "./components/SoundProvider";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

// Space Grotesk: heading & teks; JetBrains Mono: label, kode, HUD.
// Keduanya variable font → semua ketebalan dalam satu file.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Dony Kurniawan",
    "IT Audit",
    "Web Developer",
    "Portofolio",
    "Next.js",
    "Politeknik Negeri Madiun",
    "Kotlin",
    "PHP",
    "Full Stack Developer",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Nonce CSP dari proxy.ts. Membaca headers() membuat halaman dirender per
  // request — syarat CSP nonce; data Supabase tetap di-cache (lib/data.ts).
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased selection:bg-cyan-500 selection:text-white`}
      >
        <StructuredData />
        <ThemeProvider nonce={nonce}>
          <SoundProvider>{children}</SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}