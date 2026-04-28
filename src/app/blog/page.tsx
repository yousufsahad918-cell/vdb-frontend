import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Vape Blog — Bangalore Delivery Guide | VapeInBangalore.in",
  description: "Guides, area coverage, product reviews and delivery info for vape delivery across Bangalore. Koramangala, Whitefield, BTM, HSR, Electronic City and more.",
  alternates: { canonical: "https://vapeinbangalore.in/blog" },
};

const CATEGORY_COLORS: Record<string, string> = {
  "IT Areas": "#3b82f6",
  "Residential Areas": "#10b981",
  "Student Guide": "#f59e0b",
  "Bangalore Guide": "#8b5cf6",
  "Product Guide": "#ff6a00",
};

export default function BlogIndex() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>
      <style>{`
        .blog-card { transition: border-color 0.2s; }
        .blog-card:hover { border-color: var(--green) !important; }
      `}</style>

      {/* Hero */}
      <section style={{ padding: "60px 20px 40px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <p style={{
          fontSize: "0.78rem", color: "var(--green)", fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
          fontFamily: "var(--font-display)", marginBottom: 12,
        }}>
          Vape Delivery Guides
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
          fontWeight: 900, lineHeight: 1.2, marginBottom: 16,
        }}>
          Everything About Vaping in Bangalore
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: 560, margin: "0 auto" }}>
          Area guides, product reviews, and delivery info across 20+ neighbourhoods in Bangalore.
        </p>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="blog-card" style={{
            background: "var(--bg-2)", border: "1px solid var(--border)",
            borderRadius: 16, padding: "28px", marginBottom: 32,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{
                background: (CATEGORY_COLORS[featured.category] || "#ff6a00") + "22",
                color: CATEGORY_COLORS[featured.category] || "#ff6a00",
                border: `1px solid ${(CATEGORY_COLORS[featured.category] || "#ff6a00")}44`,
                borderRadius: 20, padding: "3px 10px",
                fontSize: "0.72rem", fontWeight: 700, fontFamily: "var(--font-display)",
              }}>
                {featured.category}
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                Featured · {featured.readTime} min read
              </span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
              fontWeight: 800, lineHeight: 1.3, marginBottom: 10,
            }}>
              {featured.title}
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 16 }}>
              {featured.excerpt}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {featured.relatedLocations.map((loc) => (
                <span key={loc.slug} style={{
                  background: "var(--bg-3)", border: "1px solid var(--border)",
                  borderRadius: 20, padding: "3px 10px",
                  fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-display)",
                }}>
                  {loc.name}
                </span>
              ))}
            </div>
          </div>
        </Link>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="blog-card" style={{
                background: "var(--bg-2)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "20px", height: "100%", boxSizing: "border-box",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{
                    background: (CATEGORY_COLORS[post.category] || "#ff6a00") + "22",
                    color: CATEGORY_COLORS[post.category] || "#ff6a00",
                    border: `1px solid ${(CATEGORY_COLORS[post.category] || "#ff6a00")}44`,
                    borderRadius: 20, padding: "2px 8px",
                    fontSize: "0.68rem", fontWeight: 700, fontFamily: "var(--font-display)",
                  }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>{post.readTime} min</span>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontSize: "0.92rem",
                  fontWeight: 800, lineHeight: 1.35, marginBottom: 8,
                }}>
                  {post.title}
                </h3>
                <p style={{
                  color: "var(--muted)", fontSize: "0.8rem", lineHeight: 1.5,
                  display: "-webkit-box", WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
