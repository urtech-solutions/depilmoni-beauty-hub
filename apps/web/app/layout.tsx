import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "sonner";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Depilmoni | Beauty Hub",
    template: "%s | Depilmoni"
  },
  description: siteConfig.description,
  openGraph: {
    title: "Depilmoni | Beauty Hub",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Depilmoni",
    locale: "pt_BR",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: any;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <StorefrontShell>{children}</StorefrontShell>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
