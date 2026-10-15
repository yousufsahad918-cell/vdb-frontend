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

export const products: Product[
  {
    slug: "rayya-pryme",
    name: "Rayya Pryme",
    brand: "Rayya",
    category: "Disposable",
    price: "₹1,299",
    puffCount: 3000,
    nicotine: "50mg",
    charging: "Type-C",
    image: "/img-compressed/rayya-pryme.jpg",
    isBestseller: false,
    isNew: true,
    inStock: true,
    flavours: [
      { name: "Grape", color: "#a855f7" },
      { name: "Blueberry Ice", color: "#818cf8" },
      { name: "Mango Ice", color: "#fb923c" },
      { name: "Strawberry Ice", color: "#f472b6" },
      { name: "Watermelon Ice", color: "#34d399" },
      { name: "Lychee", color: "#f9a8d4" },
    ],
    longDescription: "The Rayya Pryme is a rechargeable disposable vape featuring mesh coil technology for superior flavour. 3000 puffs with consistent performance from first to last.",
    specs: { "Puff Count": "3,000", "Nicotine": "50mg Salt", "Coil": "Mesh", "Charging": "USB-C" },
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
    puffCount: 50000,
    nicotine: "50mg",
    charging: "Type-C",
    image: "/img-compressed/tesiyi-ak-50k.jpg",
    isBestseller: false,
    isNew: true,
    inStock: true,
    flavours: [
      { name: "Watermelon Ice", color: "#34d399" },
      { name: "Mango Ice", color: "#fb923c" },
      { name: "Blueberry Ice", color: "#818cf8" },
      { name: "Strawberry Ice", color: "#f472b6" },
      { name: "Lychee Ice", color: "#f9a8d4" },
      { name: "Grape Ice", color: "#a855f7" },
    ],
    longDescription: "The Tesiyi AK 50K is a premium high-puff disposable vape delivering 50,000 puffs with consistent flavour from first to last. One of the highest puff count devices available in Bangalore with 30-45 minute delivery.",
    specs: { "Puff Count": "50,000", "Nicotine": "50mg Salt", "Charging": "USB-C", "Activation": "Draw Activated" },
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
    puffCount: 20000,
    nicotine: "50mg",
    charging: "Type-C",
    image: "/img-compressed/vpok-cool-bar.jpg",
    isBestseller: false,
    isNew: true,
    inStock: true,
    flavours: [
      { name: "Cool Mint", color: "#34d399" },
      { name: "Watermelon Ice", color: "#86efac" },
      { name: "Mango Ice", color: "#fb923c" },
      { name: "Blueberry Ice", color: "#818cf8" },
      { name: "Strawberry Ice", color: "#f472b6" },
      { name: "Lychee Ice", color: "#f9a8d4" },
    ],
    longDescription: "The VpoK Cool Bar is a rechargeable disposable vape with 20,000 puffs and a refreshing cool flavour profile. Consistent performance with Type-C fast charging. Available in Bangalore with 30-45 minute delivery.",
    specs: { "Puff Count": "20,000", "Nicotine": "50mg Salt", "Charging": "USB-C", "Activation": "Draw Activated" },
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
    puffCount: 3000,
    nicotine: "50mg",
    charging: "Type-C",
    image: "/img-compressed/funky-republic-fi3000.jpg",
    isBestseller: false,
    isNew: true,
    inStock: true,
    flavours: [
      { name: "Apple Watermelon", color: "#4ade80" },
      { name: "Blueberry Ice", color: "#818cf8" },
      { name: "Mango Ice", color: "#fb923c" },
      { name: "Strawberry Banana", color: "#f472b6" },
      { name: "Watermelon Ice", color: "#34d399" },
      { name: "Lychee Ice", color: "#f9a8d4" },
    ],
    longDescription: "The Funky Republic Fi3000 is a premium disposable vape with adjustable airflow and Type-C fast charging. 3000 puffs of smooth consistent flavour in a sleek ergonomic design.",
    specs: { "Puff Count": "3,000", "Nicotine": "50mg Salt", "Charging": "USB-C", "Airflow": "Adjustable" },
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
