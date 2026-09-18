import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Elegant serif for display headings (loaded via .font-display in globals.css)
const displaySerif = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BTR Immobilier Déco — Mobilier sur mesure",
    template: "%s | BTR Immobilier Déco",
  },
  description:
    "Mobilier et aménagement intérieur sur mesure : tables, placards, meubles TV, bureaux et cuisines. Demandez votre devis via WhatsApp.",
  openGraph: {
    title: "BTR Immobilier Déco — Mobilier sur mesure",
    description:
      "Mobilier et aménagement intérieur sur mesure, fabriqué selon vos dimensions. Devis via WhatsApp.",
    type: "website",
    locale: "fr_MA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-stone-900">
        {children}
      </body>
    </html>
  );
}
