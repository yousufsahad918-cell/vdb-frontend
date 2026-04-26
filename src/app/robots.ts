import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/",
          "/sitemap.xml",
        ],
      },
    ],
    sitemap: "https://vapeinbangalore.in/sitemap.xml",
    host: "https://vapeinbangalore.in",
  };
}
