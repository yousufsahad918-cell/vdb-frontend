import { SHOP_URL } from "./locations";

export interface Product {
  name: string;
  slug: string;
  puffs: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  description?: string;
  longDescription?: string;
  flavourNote?: string;
  badge?: string;
  gradient?: string;
  image: string;
  flavours: string[];
  brand: string;
  category: string;
  subCategory?: string;
  features?: string[];
  metaTitle: string;
  metaDescription: string;
  nicotine: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    slug: "rayya-pryme",
    name: "Rayya Pryme",
    brand: "Rayya",
    category: "Disposable",
    puffs: "3,000",
    price: "₹1,299",
    originalPrice: "₹1,499",
    discount: "13%",
    nicotine: "50mg",
    image: "/img-compressed/rayya-pryme.jpg",
    inStock: true,
    flavours: ["Grape", "Blueberry Ice", "Mango Ice", "Strawberry Ice", "Watermelon Ice", "Lychee"],
    description: "Rayya Pryme rechargeable disposable vape with 3000 puffs and mesh coil technology.",
    longDescription: "The Rayya Pryme is a rechargeable disposable vape featuring mesh coil technology for superior flavour. 3000 puffs with consistent performance from first to last.",
    badge: "NEW",
    gradient: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
    metaTitle: "Rayya Pryme Bangalore — Buy Online | VapeDeliveryBangalore.com",
    metaDescription: "Buy Rayya Pryme in Bangalore. 3000 puffs, mesh coil, rechargeable disposable. 30-45 min delivery. 100% original.",
  },
  {
    slug: "tesiyi-ak-50k",
    name: "Tesiyi AK 50K",
    brand: "Tesiyi",
    category: "Disposable",
    puffs: "50,000",
    price: "₹3,999",
    originalPrice: "₹4,499",
    discount: "11%",
    nicotine: "50mg",
    image: "/img-compressed/tesiyi-ak-50k.jpg",
    inStock: true,
    flavours: ["Watermelon Ice", "Mango Ice", "Blueberry Ice", "Strawberry Ice", "Lychee Ice", "Grape Ice"],
    description: "Tesiyi AK 50K disposable vape with 50,000 puffs and Type-C charging.",
    longDescription: "The Tesiyi AK 50K delivers 50,000 puffs — one of the highest puff count devices available in Bangalore. Consistent flavour from first to last puff.",
    badge: "50K PUFFS",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    metaTitle: "Tesiyi AK 50K Bangalore — Buy Online | VapeDeliveryBangalore.com",
    metaDescription: "Buy Tesiyi AK 50K in Bangalore. 50,000 puffs, Type-C charging. 30-45 min delivery. 100% original.",
  },
  {
    slug: "vpok-cool-bar",
    name: "VpoK Cool Bar",
    brand: "VpoK",
    category: "Disposable",
    puffs: "20,000",
    price: "₹2,499",
    originalPrice: "₹2,699",
    discount: "7%",
    nicotine: "50mg",
    image: "/img-compressed/vpok-cool-bar.jpg",
    inStock: true,
    flavours: ["Cool Mint", "Watermelon Ice", "Mango Ice", "Blueberry Ice", "Strawberry Ice", "Lychee Ice"],
    description: "VpoK Cool Bar rechargeable disposable vape with 20,000 puffs.",
    longDescription: "The VpoK Cool Bar delivers 20,000 puffs with a refreshing cool flavour profile and Type-C fast charging.",
    badge: "20K PUFFS",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    metaTitle: "VpoK Cool Bar Bangalore — Buy Online | VapeDeliveryBangalore.com",
    metaDescription: "Buy VpoK Cool Bar in Bangalore. 20,000 puffs, Type-C charging. 30-45 min delivery. 100% original.",
  },
  {
    slug: "funky-republic-fi3000",
    name: "Funky Republic Fi3000",
    brand: "Funky Republic",
    category: "Disposable",
    puffs: "3,000",
    price: "₹1,199",
    originalPrice: "₹1,499",
    discount: "20%",
    nicotine: "50mg",
    image: "/img-compressed/funky-republic-fi3000.jpg",
    inStock: true,
    flavours: ["Apple Watermelon", "Blueberry Ice", "Mango Ice", "Strawberry Banana", "Watermelon Ice", "Lychee Ice"],
    description: "Funky Republic Fi3000 disposable vape with 3000 puffs and adjustable airflow.",
    longDescription: "The Funky Republic Fi3000 features adjustable airflow and Type-C fast charging. 3000 puffs of smooth consistent flavour.",
    badge: "NEW",
    gradient: "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)",
    metaTitle: "Funky Republic Fi3000 Bangalore — Buy Online | VapeDeliveryBangalore.com",
    metaDescription: "Buy Funky Republic Fi3000 in Bangalore. 3000 puffs, adjustable airflow, Type-C charging. 30-45 min delivery.",
  },

];

export const shopUrl = SHOP_URL;

// ── Helpers ──────────────────────────────────────────────────────────────────
export const getProductsByBrand = (brand: string) =>
  products.filter(p => p.brand === brand);

export const getProductsByCategory = (category: string) =>
  products.filter(p => p.category === category);

export const getProductsBySubCategory = (sub: string) =>
  products.filter(p => p.subCategory === sub);

export const getRelatedProducts = (slug: string, limit = 3) =>
  products.filter(p => p.slug !== slug).slice(0, limit);
