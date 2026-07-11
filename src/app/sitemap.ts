import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Report pages (/report/[id]) are excluded deliberately: they are unlisted,
// expire after 7 days, and belong to the requester.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
