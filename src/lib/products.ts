import { SHOP_URL } from "./locations";

export interface Product {
  name: string;
  slug: string;
  puffs: string;
  price: string;
  originalPrice: string;
  discount: string;
  description: string;
  longDescription: string;
  flavourNote: string;
  badge: string;
  gradient: string;
  image: string;
  flavours: string[];
  brand: string;
  category: string;
  subCategory: string;
  features: string[];
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
    price: "₹1,299",
    nicotine: "50mg",
    image: "/img-compressed/rayya-pryme.jpg",
    inStock: true,
    flavours: [
      "Grape",
      "Blueberry Ice",
      "Mango Ice",
      "Strawberry Ice",
      "Watermelon Ice",
      "Lychee",
    ],
    excerpt: "Rayya Pryme rechargeable disposable vape with 3000 puffs and mesh coil technology.",
    metaTitle: "Rayya Pryme Bangalore — Buy Online | VapeBangalore.com",
    metaDescription: "Buy Rayya Pryme in Bangalore. 3000 puffs, mesh coil, rechargeable disposable. 30-45 min delivery. Rs 1,299.",
  },
  {
    slug: "tesiyi-ak-50k",
    name: "Tesiyi AK 50K",
    brand: "Tesiyi",
    category: "Disposable",
    price: "₹3,999",
    nicotine: "50mg",
    image: "/img-compressed/tesiyi-ak-50k.jpg",
    inStock: true,
    flavours: [
      "Watermelon Ice",
      "Mango Ice",
      "Blueberry Ice",
      "Strawberry Ice",
      "Lychee Ice",
      "Grape Ice",
    ],
    excerpt: "Tesiyi AK 50K disposable vape with 50,000 puffs. Best value high-puff device available in Bangalore with 30-45 min delivery.",
    metaTitle: "Tesiyi AK 50K Bangalore — Buy Online | VapeBangalore.com",
    metaDescription: "Buy Tesiyi AK 50K in Bangalore. 50,000 puffs, Type-C charging. 30-45 min delivery. 100% original. Rs 3,999.",
  },
  {
    slug: "vpok-cool-bar",
    name: "VpoK Cool Bar",
    brand: "VpoK",
    category: "Disposable",
    price: "₹2,499",
    nicotine: "50mg",
    image: "/img-compressed/vpok-cool-bar.jpg",
    inStock: true,
    flavours: [
      "Cool Mint",
      "Watermelon Ice",
      "Mango Ice",
      "Blueberry Ice",
      "Strawberry Ice",
      "Lychee Ice",
    ],
    excerpt: "VpoK Cool Bar disposable vape with 20,000 puffs. Available in Bangalore with 30-45 min delivery.",
    metaTitle: "VpoK Cool Bar Bangalore — Buy Online | VapeBangalore.com",
    metaDescription: "Buy VpoK Cool Bar in Bangalore. 20,000 puffs, Type-C charging. 30-45 min delivery. 100% original. Rs 2,699.",
  },
  {
    slug: "funky-republic-fi3000",
    name: "Funky Republic Fi3000",
    brand: "Funky Republic",
    category: "Disposable",
    price: "₹1,199",
    nicotine: "50mg",
    image: "/img-compressed/funky-republic-fi3000.jpg",
    inStock: true,
    flavours: [
      "Apple Watermelon",
      "Blueberry Ice",
      "Mango Ice",
      "Strawberry Banana",
      "Watermelon Ice",
      "Lychee Ice",
    ],
    excerpt: "Funky Republic Fi3000 disposable vape with 3000 puffs, adjustable airflow and Type-C fast charging.",
    metaTitle: "Funky Republic Fi3000 Bangalore — Buy Online | VapeBangalore.com",
    metaDescription: "Buy Funky Republic Fi3000 in Bangalore. 3000 puffs, adjustable airflow, Type-C charging. 30-45 min delivery. Rs 1,199.",
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
