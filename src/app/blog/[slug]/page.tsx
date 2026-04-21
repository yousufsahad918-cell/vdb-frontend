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
