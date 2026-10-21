import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { projectPath } from "@/lib/slug";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${SITE_URL}${projectPath(project)}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
