import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileGate from "@/components/MobileGate";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, ORG, AUTHOR } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EcoHealth Detection Map | Live Illegal Mining Monitoring for Ghana",
    template: "%s — EcoHealth Detection Map",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "galamsey",
    "illegal mining Ghana",
    "satellite monitoring",
    "Sentinel-2",
    "mining detection map",
    "environmental enforcement",
    "EcoHealth",
  ],
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  creator: AUTHOR.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "EcoHealth Detection Map | Live Illegal Mining Monitoring for Ghana",
    description: SITE_DESCRIPTION,
    locale: "en_GH",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "EcoHealth live detection map showing illegal mining sites across Ghana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoHealth Detection Map",
    description: SITE_DESCRIPTION,
    images: ["/og.jpg"],
    creator: "@mr_moore1776",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "Environmental Monitoring",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GHS" },
  publisher: {
    "@type": "Organization",
    name: ORG.name,
    url: ORG.url,
    founder: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
  },
  about: {
    "@type": "Thing",
    name: "Illegal mining (galamsey) detection in Ghana",
  },
  areaServed: { "@type": "Country", name: "Ghana" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://unpkg.com/maplibre-gl@5.18.0/dist/maplibre-gl.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MobileGate>{children}</MobileGate>
      </body>
    </html>
  );
}
