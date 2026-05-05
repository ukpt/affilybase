import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Affilybase — Programme d'affiliation pour boutiques Shopify",
  description: "Créez et gérez votre programme d'affiliation Shopify en 5 minutes. Codes promo personnalisés, tracking automatique des ventes, commissions calculées instantanément.",
  keywords: "affiliation shopify, programme affilié, code promo affilié, marketing affiliation, shopify france",
  metadataBase: new URL("https://www.affilybase.com"),
  openGraph: {
    title: "Affilybase — Programme d'affiliation pour boutiques Shopify",
    description: "Créez et gérez votre programme d'affiliation Shopify en 5 minutes.",
    url: "https://www.affilybase.com",
    siteName: "Affilybase",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}