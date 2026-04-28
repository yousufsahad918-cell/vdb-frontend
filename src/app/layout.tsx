import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL("https://vapedeliverybangalore.com"),
  title: {
    default: "VapeDeliveryBangalore — Buy Vape Online | 30-45 Min Delivery",
    template: "%s | VapeDeliveryBangalore",
  },
  description:
    "Buy vape in Bangalore with 30-45 min delivery. Best disposable vapes, pod devices & e-liquids delivered discreetly to BTM, HSR, Koramangala, Indiranagar, Whitefield and 20+ areas. Order on WhatsApp now.",
  keywords: [
    "vape delivery bangalore",
    "vapedeliverybangalore",
    "buy vape online bangalore",
    "vape home delivery bangalore",
    "disposable vape delivery bangalore",
    "vape in bangalore",
    "vapes in bangalore",
    "buy vape bangalore",
    "vape near me bangalore",
    "elfbar bangalore",
    "lost mary bangalore",
    "caliburn bangalore",
    "nicotine pouches bangalore",
    "vape shop bangalore",
    "order vape bangalore",
  ],
  alternates: {
    canonical: "https://vapedeliverybangalore.com",
  },
  openGraph: {
    title: "VapeDeliveryBangalore — Buy Vape Online | 30-45 Min Delivery",
    description: "Fast, discreet vape delivery across all of Bangalore. 30-45 min. 20+ areas covered. Order on WhatsApp.",
    images: [{ url: "/hero-delivery.png", width: 1200, height: 630, alt: "VapeDeliveryBangalore — Fast Delivery" }],
    type: "website",
    siteName: "VapeDeliveryBangalore",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "VapeDeliveryBangalore — Buy Vape Online | 30-45 Min Delivery",
    description: "Fast, discreet vape delivery across Bangalore. Order on WhatsApp.",
  },
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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192.png" />
        <meta name="theme-color" content="#14532d" />
      </head>
      <body>
        <CartProvider>
          <Nav />
          {children}
          <Footer />
        <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
