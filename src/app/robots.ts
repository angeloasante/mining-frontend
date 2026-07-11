import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Detection reports are unlisted, requester-specific, and expire
        // after 7 days — they should never be indexed.
        disallow: ["/report/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
