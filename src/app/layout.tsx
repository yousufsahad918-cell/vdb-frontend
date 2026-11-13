import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL("https://vapedeliverybangalore.com"),
  title: {
    default: "Vape Delivery Bangalore — 30-45 Min | VapeDeliveryBangalore.com",
    template: "%s | Vape Delivery Bangalore",
  },
  description:
    "Bangalore's #1 Vape Delivery Service. Get original disposable vapes, pod devices, and nicotine pouches delivered in 30-45 mins to BTM, HSR, Koramangala, Whitefield & 100+ areas. 100% Authentic. Order on WhatsApp now!",
  keywords: [
    "vape delivery bangalore",
    "vapedeliverybangalore",
    "buy vape online bangalore",
    "vape home delivery bangalore",
    "disposable vape delivery bangalore",
    "elfbar bangalore",
    "lost mary bangalore",
    "caliburn bangalore",
    "zyn bangalore",
    "nicotine pouches bangalore",
    "vape shop near me bangalore",
    "same day vape delivery bangalore",
  ],
  alternates: {
    canonical: "https://vapedeliverybangalore.com",
  },
  openGraph: {
    title: "Vape Delivery Bangalore — 30-45 Min | VapeDeliveryBangalore.com",
    description: "Bangalore's #1 Vape Delivery Service. 100% Authentic vapes delivered in 30-45 mins to 100+ areas.",
    url: "https://vapedeliverybangalore.com",
    siteName: "Vape Delivery Bangalore",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://vapedeliverybangalore.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vape Delivery Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vape Delivery Bangalore — 30-45 Min",
    description: "Bangalore's #1 Vape Delivery Service. 100% Authentic vapes delivered in 30-45 mins.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD Structured Data for Local Business SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Vape Delivery Bangalore",
    "image": "https://vapedeliverybangalore.com/og-image.jpg",
    "url": "https://vapedeliverybangalore.com",
    "telephone": "+916282878843",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "City",
      "name": "Bangalore"
    },
    "sameAs": [
      "https://wa.me/916282878843"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <CartProvider>
          <Nav />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
