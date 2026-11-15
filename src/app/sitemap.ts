import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export const revalidate = 3600;

const BASE = "https://innovadar.ru";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { services, blog } = await getContent();
  const now = new Date();
  const materials = [...blog.articles, ...blog.guides, ...blog.news].filter((m) => m.slug);
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...services.map((s) => ({ url: `${BASE}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...materials.map((m) => ({ url: `${BASE}/materials/${m.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/consent`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
