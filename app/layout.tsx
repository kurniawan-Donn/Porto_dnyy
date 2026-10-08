import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "./components/ThemeProvider";
import StructuredData from "./components/StructuredData";
import { SoundProvider } from "./components/SoundProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ============================================
// ✏️ GANTI dengan domain asli setelah deploy
// ============================================
const SITE_URL = "https://donykurniawan.vercel.app";
const SITE_NAME = "Dony Kurniawan";
const SITE_DESCRIPTION =
  "Portofolio Dony Kurniawan — Mahasiswa IT Politeknik Negeri Madiun yang berfokus pada IT Audit dan Web Development.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | IT Audit & Web Developer`,
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
    title: `${SITE_NAME} | IT Audit & Web Developer`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png", // ← Buat gambar 1200x630 di /public
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Portofolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | IT Audit & Web Developer`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-cyan-500 selection:text-white`}
      >
        <StructuredData />
        <ThemeProvider>
          <SoundProvider>{children}</SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}