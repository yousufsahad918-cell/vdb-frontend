import re

file_path = "src/lib/blogs.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_blogs = '''
  // ─── NEW 2027 & DECEMBER GUIDES ───────────────────────────────────────────
  {
    slug: "vaping-in-2027-guide-bangalore",
    title: "The Ultimate Vaping Guide for 2027 in Bangalore",
    metaTitle: "Vaping in 2027: The Ultimate Bangalore Guide | VapeDeliveryBangalore",
    metaDescription: "Discover the latest vaping trends, device technology, and flavour innovations for 2027 in Bangalore. Stay ahead with our comprehensive guide.",
    publishedAt: "2026-12-15",
    readTime: 6,
    category: "Guides & Trends",
    excerpt: "Step into 2027 with the latest vaping trends, advanced device tech, and the most sought-after flavours dominating the Bangalore market.",
    relatedLocations: [
      { name: "Koramangala", slug: "koramangala" },
      { name: "Indiranagar", slug: "indiranagar" },
      { name: "Whitefield", slug: "whitefield" },
    ],
    content: \`
<h2>The Ultimate Vaping Guide for 2027 in Bangalore</h2>
<p>As we step into 2027, the vaping landscape in Bangalore is evolving faster than ever. From advanced mesh coil technology to high-capacity disposable designs, here is everything you need to know to stay ahead of the curve.</p>
<h3>1. The Rise of High-Puff Disposables</h3>
<p>Devices like the <strong>IGET Soul 40,000</strong> and <strong>Elfbar MoonNight 40K</strong> are dominating the market. With dual mesh coils and real-time battery displays, vapers are getting unprecedented flavour consistency and longevity.</p>
<h3>2. Flavour Innovations for 2027</h3>
<p>Bangalore vapers are moving beyond standard fruits. Complex blends like Coffee-Vanilla, Blue Razz Ice, and exotic tropical mixes are the top sellers this year, perfectly suited for the city's diverse palate.</p>
<h3>3. Authenticity is Non-Negotiable</h3>
<p>With the market growing, ensuring you buy 100% authentic products is critical. Always verify QR codes and purchase from trusted local delivery services like VapeDeliveryBangalore.com to avoid counterfeit devices.</p>
\${CTA(true)}
<p>Ready to experience the best of 2027 vaping? Browse our latest arrivals and get them delivered to your doorstep in 30-45 minutes.</p>
\${CTA()}
  },
  {
    slug: "best-vape-flavours-december-bangalore-climate",
    title: "Vaping in December: Best Flavours for Bangalore's Climate",
    metaTitle: "Best Vape Flavours for December in Bangalore | VapeDeliveryBangalore",
    metaDescription: "Looking for the perfect vape flavour this December? Discover the best cooling mints, warm desserts, and humidity-friendly vapes for Bangalore weather.",
    publishedAt: "2026-12-05",
    readTime: 5,
    category: "Flavours & Lifestyle",
    excerpt: "December in Bangalore brings pleasant, cool evenings. Discover the best vape flavours—from refreshing mints to warm desserts—that perfectly match the city's winter climate.",
    relatedLocations: [
      { name: "BTM Layout", slug: "btm-layout" },
      { name: "HSR Layout", slug: "hsr-layout" },
      { name: "Jayanagar", slug: "jayanagar" },
    ],
    content: \`
<h2>Vaping in December: Best Flavours for Bangalore's Climate</h2>
<p>December in Bangalore is magical. The scorching heat fades, replaced by pleasant, cool breezes and slightly humid mornings. This unique climate shift is the perfect time to rotate your vape flavours to match the weather.</p>
<h3>1. Refreshing Mints & Icy Blends</h3>
<p>While it's cooler, Bangalore's daytime can still be mild. Flavours like <strong>Elfbar Ice King</strong> or <strong>ZYN Cool Mint</strong> provide a crisp, refreshing exhale that cuts through the afternoon mildness without being overwhelming.</p>
<h3>2. Warm, Comforting Desserts</h3>
<p>As the evenings get chilly, nothing beats a warm, comforting flavour. The <strong>IGET Soul 40,000 in Coffee</strong> or rich Vanilla blends mimic the feeling of a warm cup of coffee on a cool Bangalore night. The dual mesh coils in these devices enhance the sweetness, making every puff feel like a dessert.</p>
<h3>3. Balanced Fruit & Tobacco</h3>
<p>For those who prefer a grounded experience, light tobacco blends like <strong>Natural American Spirit</strong> or fruity-tobacco mixes are ideal. They offer a smooth, satisfying throat hit that pairs perfectly with a cool December evening on a balcony in HSR or Jayanagar.</p>
\${CTA(true)}
<p>Don't let the cool weather catch you without your favourite flavour. Order now for 30-45 minute delivery across Bangalore.</p>
\${CTA()}
  },
  {
    slug: "beginner-to-pro-vaping-guide-2027-december",
    title: "2027 Beginner to Pro Vaping Guide: December Edition",
    metaTitle: "Beginner to Pro Vaping Guide 2027 | VapeDeliveryBangalore",
    metaDescription: "New to vaping in 2027? Our December Beginner to Pro guide walks you through everything from your first disposable to advanced pod systems in Bangalore.",
    publishedAt: "2026-12-10",
    readTime: 8,
    category: "Beginner Guides",
    excerpt: "Whether you're taking your first puff or upgrading to a pro-level pod system, our December 2027 guide covers everything you need to know about vaping in Bangalore.",
    relatedLocations: [
      { name: "Marathahalli", slug: "marathahalli" },
      { name: "Electronic City", slug: "electronic-city" },
      { name: "Hebbal", slug: "hebbal" },
    ],
    content: \`
<h2>2027 Beginner to Pro Vaping Guide: December Edition</h2>
<p>Whether you are completely new to vaping or looking to upgrade your setup this December, navigating the world of vapes can be overwhelming. This guide breaks down your journey from your very first puff to becoming a seasoned pro.</p>
<h3>Step 1: The Beginner (Your First Disposable)</h3>
<p>If you are just starting, simplicity is key. Devices like the <strong>Elfbar Raya D1</strong> or <strong>Rayya Pryme</strong> are perfect. They are draw-activated (no buttons), pre-filled, and require zero maintenance. Ideal nicotine strength for beginners is 20mg (2%).</p>
<h3>Step 2: The Intermediate (High-Puff Disposables)</h3>
<p>Once you know your favourite flavours, it's time to upgrade to high-capacity devices. The <strong>Elfbar Raya D3</strong> or <strong>IGET Soul 40,000</strong> offer 10,000 to 40,000 puffs, adjustable airflow, and Type-C rechargeable batteries. You get better flavour production and more value for your money.</p>
<h3>Step 3: The Pro (Pod Systems & Nicotine Pouches)</h3>
<p>For the ultimate control, pro vapers switch to refillable pod systems like the <strong>Caliburn G4 Mini</strong>. You choose your own e-liquid, allowing for infinite flavour customization. Alternatively, if you want nicotine without the vapour, <strong>ZYN Cool Mint</strong> or <strong>Velo</strong> nicotine pouches are the ultimate discreet, pro-level choice for the office or travel.</p>
<h3>Pro Tip for December</h3>
<p>Cold weather can slightly thicken e-liquid, leading to a weaker hit. Keep your device in your pocket for a few minutes before vaping to warm the coil and ensure thick, flavourful clouds.</p>
\${CTA(true)}
<p>Ready to find your perfect match? Browse our curated collection of beginner and pro devices, and get them delivered to your door in minutes.</p>
\${CTA()}
  },
'''

# Find the start of the blogPosts array and inject right after it
pattern = r"(export const blogPosts: BlogPost\[\] = \[)"
replacement = r"\1" + new_blogs

new_content, count = re.subn(pattern, replacement, content)

if count > 0:
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("✅ Successfully added 3 new SEO-optimized blogs to src/lib/blogs.ts")
else:
    print("⚠️ Could not find the blogPosts array. Please check the file.")
