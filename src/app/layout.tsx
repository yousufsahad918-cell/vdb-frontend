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
    default: "Buy Vape in Bangalore – 20-30 Min Delivery | VapeInBangalore.in",
    template: "%s | Vape in Bangalore",
  },
  description:
    "Buy vape in Bangalore with 20-30 minute delivery. Best disposable vapes, pod systems & e-liquids delivered discreetly to BTM, HSR, Koramangala, Indiranagar, Whitefield and 20+ areas.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
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
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vapeinbangalore.in",
    siteName: "Vape in Bangalore",
    title: "Buy Vape in Bangalore – 20-30 Min Delivery",
    description: "Fast, discreet vape delivery across all of Bangalore. 20+ areas covered.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
