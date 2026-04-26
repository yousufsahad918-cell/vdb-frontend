import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyButtons from "@/components/StickyButtons";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL("https://vapeinbangalore.in"),
  title: {
    default: "VapeInBangalore — Buy Vape Online, 30 Min Delivery",
    template: "%s | VapeInBangalore",
  },
  description:
    "Buy vape in Bangalore with 30-45 min delivery. Best disposable vapes & e-liquids delivered discreetly to BTM, HSR, Koramangala, Indiranagar, Whitefield and 20+ areas. Order on WhatsApp now.",
  icons: {
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon-48.png",
    apple: "/favicon-192.png",
  },
  keywords: [
    "vape in bangalore",
    "vape delivery bangalore",
    "buy vape bangalore",
    "vape near me bangalore",
    "disposable vape bangalore",
    "best vape bangalore",
    "vape shop bangalore",
    "order vape bangalore",
    "elfbar bangalore",
    "vape online bangalore",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vapeinbangalore.in",
    siteName: "VapeInBangalore",
    title: "VapeInBangalore — Buy Vape Online, 30 Min Delivery",
    description: "Fast, discreet vape delivery across all of Bangalore. 30-45 min. 20+ areas covered. Order on WhatsApp.",
    images: [{ url: "/hero-delivery.png", width: 1200, height: 630, alt: "VapeInBangalore — Fast Delivery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VapeInBangalore — Buy Vape Online, 30 Min Delivery",
    description: "Fast, discreet vape delivery across Bangalore. Order on WhatsApp.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192.png" />
        <meta name="theme-color" content="#f8c105" />
      </head>
      <body>
        <CartProvider>
          <Nav />
          <main>{children}</main>
          <StickyButtons />
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
