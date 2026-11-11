import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  return ["", "/explore", ...projects.map((p) => `/projects/${p.slug}`)].map(
    (path) => ({
      url: `${base.replace(/\/$/, "")}${path}`,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
    }),
  );
}
