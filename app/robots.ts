import type { MetadataRoute } from "next";
import { siteOrigin, assetPath } from "@/lib/paths";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: assetPath("/"),
    },
    sitemap: new URL(assetPath("/sitemap.xml"), siteOrigin).toString(),
  };
}
