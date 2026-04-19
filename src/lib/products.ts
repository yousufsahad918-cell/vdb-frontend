import { SHOP_URL } from "./locations";

export interface Product {
  name: string;
  puffs: string;
  price: string;
  originalPrice: string;
  discount: string;
  description: string;
  flavourNote: string;
  badge: string;
  gradient: string;
  image: string;
  flavours: string[];
}

export const products: Product[] = [
  {
    name: "Elfbar Raya D1",
    puffs: "13,000 Puffs",
    price: "₹2,199",
    originalPrice: "₹2,599",
    discount: "15% OFF",
    description: "Watermelon Ice · Mesh Coil · Rechargeable",
    flavourNote: "Juicy watermelon with icy menthol finish",
    badge: "FAST SELLING",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
    image: "/products/raya-d1.jpg",
    flavours: ["Watermelon Ice", "Strawberry Kiwi", "Blueberry Ice", "Mango Peach", "Passion Fruit", "Lychee Ice", "Mixed Berries"],
  },
  {
    name: "Elfbar Raya D3",
    puffs: "25,000 Puffs",
    price: "₹2,799",
    originalPrice: "₹3,300",
    discount: "15% OFF",
    description: "Triple Mesh Coil · Smart Display · 3 Power Modes",
    flavourNote: "Rich fruity blends, massive puff count",
    badge: "FAST SELLING",
    gradient: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
    image: "/products/raya-d3.jpg",
    flavours: ["Watermelon Ice", "Blueberry Raspberry", "Peach Mango Watermelon", "Strawberry Ice", "Kiwi Passion Fruit", "Grape Ice", "Lemon Mint"],
  },
  {
    name: "Elfbar D3 Pro",
    puffs: "30,000 Puffs",
    price: "₹2,799",
    originalPrice: "₹3,399",
    discount: "18% OFF",
    description: "Turbo Mode · Adjustable Airflow · Smart Display",
    flavourNote: "Premium bold flavour, adjustable power",
    badge: "FAST SELLING",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    image: "/products/d3-pro.jpg",
    flavours: ["Blackcurrant Ice", "Watermelon Ice", "Blueberry Ice", "Mango Ice", "Strawberry Banana", "Grape Honeydew", "Cool Mint"],
  },
  {
    name: "Elfbar Ice King",
    puffs: "30,000 Puffs",
    price: "₹2,499",
    originalPrice: "₹3,500",
    discount: "29% OFF",
    description: "Watermelon Ice · 5-Level Coolness · 850mAh",
    flavourNote: "Ultra-icy watermelon, customisable chill",
    badge: "ONLY FEW LEFT",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    image: "/products/ice-king.jpg",
    flavours: ["Watermelon Ice", "Blueberry Ice", "Strawberry Ice", "Mango Ice", "Grape Ice", "Lychee Ice"],
  },
  {
    name: "Elfbar 600",
    puffs: "600 Puffs",
    price: "₹999",
    originalPrice: "₹1,300",
    discount: "23% OFF",
    description: "Pink Grapefruit · 2ml · 20mg Nicotine Salt",
    flavourNote: "Sweet citrus hit, perfect for beginners",
    badge: "BEGINNER PICK",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    image: "/products/elfbar-600.jpg",
    flavours: ["Pink Grapefruit", "Watermelon", "Blueberry", "Strawberry Ice", "Mango", "Peach Ice", "Grape"],
  },
  {
    name: "Elfbar BC 10000",
    puffs: "10,000 Puffs",
    price: "₹2,199",
    originalPrice: "₹2,599",
    discount: "15% OFF",
    description: "Blueberry Mint · Mesh Coil · Type-C Rechargeable",
    flavourNote: "Fruity & icy blends, daily use favourite",
    badge: "FAST SELLING",
    gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
    image: "/products/bc10000.png",
    flavours: ["Blueberry Mint", "Watermelon Ice", "Strawberry Mango", "Kiwi Passion Fruit", "Peach Mango", "Grape Ice", "Cool Mint", "Lychee Watermelon"],
  },
];

export const shopUrl = SHOP_URL;
