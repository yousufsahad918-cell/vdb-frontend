import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/lib/blogs";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `https://vapeinbangalore.in/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://vapeinbangalore.in/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "IT Areas": "#3b82f6",
  "Residential Areas": "#10b981",
  "Student Guide": "#f59e0b",
  "Bangalore Guide": "#8b5cf6",
  "Product Guide": "#ff6a00",
};

export default function BlogPost({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const catColor = CATEGORY_COLORS[post.category] || "#ff6a00";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 20px 0" }}>
        <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
          {" · "}
          <Link href="/blog" style={{ color: "var(--muted)", textDecoration: "none" }}>Blog</Link>
          {" · "}
          <span style={{ color: "var(--white)" }}>{post.title.slice(0, 40)}...</span>
        </p>
      </div>

      {/* Article header */}
      <header style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{
            background: catColor + "22", color: catColor,
            border: `1px solid ${catColor}44`,
            borderRadius: 20, padding: "3px 10px",
            fontSize: "0.72rem", fontWeight: 700, fontFamily: "var(--font-display)",
          }}>
            {post.category}
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
            {post.readTime} min read · {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 4vw, 2rem)",
          fontWeight: 900, lineHeight: 1.25, marginBottom: 14,
        }}>
          {post.title}
        </h1>

        <p style={{
          color: "var(--muted)", fontSize: "1rem", lineHeight: 1.65,
          marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 24,
        }}>
          {post.excerpt}
        </p>
      </header>

      {/* Article body */}
      <article
        style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px" }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Location links */}
      {post.relatedLocations.length > 0 && (
        <div style={{ maxWidth: 760, margin: "40px auto 0", padding: "0 20px" }}>
          <p style={{
            fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-display)",
            fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10,
          }}>
            Delivery Pages
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {post.relatedLocations.map((loc) => (
              <Link
                key={loc.slug}
                href={`/vape-delivery/${loc.slug}`}
                style={{
                  background: "var(--bg-2)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "7px 14px", fontSize: "0.82rem",
                  color: "var(--white)", textDecoration: "none",
                  fontFamily: "var(--font-display)", fontWeight: 600,
                }}
              >
                Vape Delivery in {loc.name} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related posts */}
      {related.length > 0 && (
        <div style={{ maxWidth: 760, margin: "48px auto 0", padding: "0 20px" }}>
          <p style={{
            fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-display)",
            fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
          }}>
            Related Posts
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{
                  background: "var(--bg-2)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "14px 16px",
                }}>
                  <p style={{
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    fontSize: "0.88rem", marginBottom: 4,
                  }}>
                    {p.title}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                    {p.readTime} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Floating action buttons */}
      <div style={{
        position: "fixed", bottom: 24, right: 20,
        display: "flex", flexDirection: "column", gap: 10, zIndex: 500,
      }}>
        <a href="/#products"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, background: "var(--green)", borderRadius: "50%", boxShadow: "0 4px 16px rgba(22,163,74,0.4)", textDecoration: "none" }}
          title="Shop Now"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2"/><path d="M16 10a4 4 0 01-8 0" fill="none" stroke="white" strokeWidth="2"/></svg>
        </a>
        <a href="https://wa.me/916282878843?text=Hi%2C%20I%20want%20to%20order%20a%20vape"
          target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, background: "#25d366", borderRadius: "50%", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", textDecoration: "none" }}
          title="Order on WhatsApp"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/></svg>
        </a>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.metaDescription,
            datePublished: post.publishedAt,
            publisher: {
              "@type": "Organization",
              name: "VapeInBangalore.in",
              url: "https://vapeinbangalore.in",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://vapeinbangalore.in/blog/${post.slug}`,
            },
          }),
        }}
      />
    </main>
  );
}
