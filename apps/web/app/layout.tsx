import type { Metadata } from "next";
import { Toaster } from "sonner";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Depilmoni | Comercio, Conteudo e Eventos",
    template: "%s | Depilmoni"
  },
  description: siteConfig.description,
  openGraph: {
    title: "Depilmoni | Comercio, Conteudo e Eventos",
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
      <body>
        <StorefrontShell>{children}</StorefrontShell>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
