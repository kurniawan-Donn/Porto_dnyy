"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export default function ThemeProvider({
  children,
  nonce,
}: {
  children: ReactNode;
  nonce?: string;
}) {
  return (
    <NextThemesProvider
      nonce={nonce}
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}