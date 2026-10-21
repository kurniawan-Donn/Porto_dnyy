import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Font OG image dibaca via fs (lib/og.tsx) — pastikan ikut ter-bundle
  // saat OG image dibuat ulang di runtime (revalidate)
  outputFileTracingIncludes: {
    "/**": [
      "./node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff",
      "./node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff",
      "./node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;