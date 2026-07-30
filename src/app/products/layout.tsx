import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Vapes Online in Bangalore | Elfbar, Lost Mary, Caliburn, ZYN | VapeDeliveryBangalore.com",
  description: "Shop vapes online in Bangalore — Elfbar Raya D1, Lost Mary, Caliburn G4, ZYN Nicotine Pouches, IGET, Nasty, Yuoto and more. Fast 30-45 min delivery across 100+ areas. Order on WhatsApp.",
  alternates: {
    canonical: "https://vapedeliverybangalore.com/products",
  },
  openGraph: {
    title: "Buy Vapes Online in Bangalore | VapeDeliveryBangalore.com",
    description: "Elfbar, Lost Mary, Caliburn, ZYN and more — 30-45 min delivery across Bangalore. 100% original products.",
    url: "https://vapedeliverybangalore.com/products",
    type: "website",
  },
  keywords: [
    "buy vape online bangalore",
    "vape shop bangalore",
    "vape store bangalore",
    "elfbar bangalore",
    "lost mary bangalore",
    "caliburn bangalore",
    "zyn bangalore",
    "disposable vape bangalore",
    "nicotine pouches bangalore",
    "vape delivery bangalore",
    "vapes in bangalore",
    "vape in bangalore",
    "pod device bangalore",
    "e-liquid bangalore",
    "buy vape bangalore",
  ],
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
