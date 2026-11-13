import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Only block internal Next.js and API routes to save crawl budget
      disallow: ["/api/", "/_next/", "/admin/"], 
    },
    sitemap: "https://vapedeliverybangalore.com/sitemap.xml",
    host: "https://vapedeliverybangalore.com",
  };
}
