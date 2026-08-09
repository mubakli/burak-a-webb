import type { MetadataRoute } from "next";
import { caseStudies, siteConfig } from "@/data/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/experience", "/projects", "/about", "/contact", "/cv"];

  return [
    ...routes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("monthly" as const) : ("yearly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...caseStudies.map(({ slug }) => ({
      url: `${siteConfig.url}/work/${slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
