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
    template: "%s | VapeDeliveryBangalore",
  },
  description:
    "Buy vape in Bangalore with 30-45 min delivery. Best disposable vapes, pod devices & e-liquids delivered discreetly to BTM, HSR, Koramangala, Indiranagar, Whitefield and 50+ areas. Order on WhatsApp now.",
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
    title: "Vape Delivery Bangalore — 30-45 Min | VapeDeliveryBangalore.com",
    description: "Fast, discreet vape delivery across all of Bangalore. 30-45 min. 50+ areas covered. Order on WhatsApp.",
    images: [{ url: "/hero-delivery.png", width: 1200, height: 630, alt: "VapeDeliveryBangalore — Fast Delivery" }],
    type: "website",
    siteName: "VapeDeliveryBangalore.com",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vape Delivery Bangalore — 30-45 Min | VapeDeliveryBangalore.com",
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
        <meta name="geo.region" content="IN-KA" />
        <meta name="geo.placename" content="Bangalore" />
        <meta name="geo.position" content="12.9716;77.5946" />
        <meta name="ICBM" content="12.9716, 77.5946" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"LocalBusiness","name":"VapeDeliveryBangalore.com","url":"https://vapedeliverybangalore.com","telephone":"+916282878843","address":{"@type":"PostalAddress","addressLocality":"Bangalore","addressRegion":"Karnataka","addressCountry":"IN"},"geo":{"@type":"GeoCoordinates","latitude":12.9716,"longitude":77.5946},"openingHours":"Mo-Su 10:00-22:00","priceRange":"₹₹","aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"320","bestRating":"5"},"review":[{"@type":"Review","author":{"@type":"Person","name":"Rahul S."},"reviewRating":{"@type":"Rating","ratingValue":"5"},"reviewBody":"Ordered Elfbar Raya D1 to Koramangala and it arrived in 38 minutes. 100% original product."},{"@type":"Review","author":{"@type":"Person","name":"Priya K."},"reviewRating":{"@type":"Rating","ratingValue":"5"},"reviewBody":"Best vape delivery in Bangalore. Delivered to Indiranagar in 40 mins. Original products."},{"@type":"Review","author":{"@type":"Person","name":"Arjun M."},"reviewRating":{"@type":"Rating","ratingValue":"5"},"reviewBody":"Got Caliburn G4 delivered to Whitefield in 42 mins. Sealed and original. Highly recommend."}]}` }} />
      </head>
      <body suppressHydrationWarning>
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
