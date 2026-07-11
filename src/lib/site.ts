// Central site constants for the detection map application.
// NEXT_PUBLIC_SITE_URL overrides in each environment (Vercel: set to the
// production origin). Sitemap, robots, canonicals and Open Graph derive
// from these values.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://app.ecohealthgh.com";

export const SITE_NAME = "EcoHealth Detection Map";

export const SITE_DESCRIPTION =
  "Live satellite monitoring of illegal mining (galamsey) in Ghana. Weekly automated Sentinel-2 scans, AI detection with ~90% accuracy, year-by-year imagery comparison, and custom detection reports for any town in Ghana.";

export const ORG = {
  name: "EcoHealth",
  url: "https://ecohealthgh.com",
};

export const AUTHOR = {
  name: "Angelo Asante",
  url: "https://angeloasante.com",
};
