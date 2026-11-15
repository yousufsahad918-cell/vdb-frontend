const fs = require('fs');
let content = fs.readFileSync('src/lib/blogs.ts', 'utf8');

// 1. Clean up any previously broken "NEW 2027" injections
content = content.replace(/\/\/ ─── NEW 2027 & DECEMBER GUIDES[\s\S]*?(?=  \{\n    slug: "vape-delivery-whitefield-it-corridor")/, '');

// 2. Define the new blogs with perfectly safe, native JavaScript backticks
const newBlogs = `
  // ─── NEW 2027 & DECEMBER GUIDES ───────────────────────────────────────────
  {
    slug: "vaping-in-2027-guide-bangalore",
    title: "The Ultimate Vaping Guide for 2027 in Bangalore",
    metaTitle: "Vaping in 2027: The Ultimate Bangalore Guide | VapeDeliveryBangalore",
    metaDescription: "Discover the latest vaping trends, device technology, and flavour innovations for 2027 in Bangalore.",
    publishedAt: "2026-12-15",
    readTime: 6,
    category: "Guides & Trends",
    excerpt: "Step into 2027 with the latest vaping trends and advanced device tech.",
    relatedLocations: [{ name: "Koramangala", slug: "koramangala" }, { name: "Indiranagar", slug: "indiranagar" }, { name: "Whitefield", slug: "whitefield" }],
    content: \`<h2>The Ultimate Vaping Guide for 2027 in Bangalore</h2>
<p>As we step into 2027, the vaping landscape in Bangalore is evolving. Devices like the <strong>IGET Soul 40,000</strong> and <strong>Elfbar MoonNight 40K</strong> are dominating.</p>
\${CTA(true)}
<p>Ready to experience the best of 2027 vaping? Browse our latest arrivals.</p>
\${CTA()}\`,
  },
  {
    slug: "best-vape-flavours-december-bangalore-climate",
    title: "Vaping in December: Best Flavours for Bangalore's Climate",
    metaTitle: "Best Vape Flavours for December in Bangalore | VapeDeliveryBangalore",
    metaDescription: "Discover the best cooling mints, warm desserts, and humidity-friendly vapes for Bangalore weather.",
    publishedAt: "2026-12-05",
    readTime: 5,
    category: "Flavours & Lifestyle",
    excerpt: "December in Bangalore brings pleasant, cool evenings. Discover the best vape flavours.",
    relatedLocations: [{ name: "BTM Layout", slug: "btm-layout" }, { name: "HSR Layout", slug: "hsr-layout" }, { name: "Jayanagar", slug: "jayanagar" }],
    content: \`<h2>Vaping in December: Best Flavours for Bangalore's Climate</h2>
<p>December in Bangalore is magical. The scorching heat fades, replaced by pleasant, cool breezes.</p>
<h3>1. Refreshing Mints & Icy Blends</h3>
<p>Flavours like <strong>Elfbar Ice King</strong> or <strong>ZYN Cool Mint</strong> provide a crisp, refreshing exhale.</p>
<h3>2. Warm, Comforting Desserts</h3>
<p>The <strong>IGET Soul 40,000 in Coffee</strong> mimics the feeling of a warm cup of coffee on a cool Bangalore night.</p>
\${CTA(true)}
<p>Order now for 30-45 minute delivery across Bangalore.</p>
\${CTA()}\`,
  },
  {
    slug: "beginner-to-pro-vaping-guide-2027-december",
    title: "2027 Beginner to Pro Vaping Guide: December Edition",
    metaTitle: "Beginner to Pro Vaping Guide 2027 | VapeDeliveryBangalore",
    metaDescription: "Our December Beginner to Pro guide walks you through everything from your first disposable to advanced pod systems.",
    publishedAt: "2026-12-10",
    readTime: 8,
    category: "Beginner Guides",
    excerpt: "Whether you're taking your first puff or upgrading to a pro-level pod system, our guide covers everything.",
    relatedLocations: [{ name: "Marathahalli", slug: "marathahalli" }, { name: "Electronic City", slug: "electronic-city" }, { name: "Hebbal", slug: "hebbal" }],
    content: \`<h2>2027 Beginner to Pro Vaping Guide: December Edition</h2>
<p>This guide breaks down your journey from your very first puff to becoming a seasoned pro.</p>
<h3>Step 1: The Beginner</h3>
<p>Devices like the <strong>Elfbar Raya D1</strong> or <strong>Rayya Pryme</strong> are perfect. Ideal nicotine strength is 20mg.</p>
<h3>Step 2: The Intermediate</h3>
<p>Upgrade to high-capacity devices like the <strong>Elfbar Raya D3</strong> or <strong>IGET Soul 40,000</strong>.</p>
<h3>Step 3: The Pro</h3>
<p>Switch to refillable pod systems like the <strong>Caliburn G4 Mini</strong>, or try <strong>ZYN Cool Mint</strong> nicotine pouches.</p>
\${CTA(true)}
<p>Browse our curated collection and get them delivered to your door in minutes.</p>
\${CTA()}\`,
  },
`;

// 3. Inject the new blogs right after the array declaration
content = content.replace(/(export const blogPosts: BlogPost\[\] = \[)/, '$1' + newBlogs);

// 4. Save the file
fs.writeFileSync('src/lib/blogs.ts', content);
console.log('✅ Blogs safely injected using Node.js with perfect backticks!');
