import type { MetadataRoute } from "next";
import { absolutePageUrl } from "@/lib/paths";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/forfaits",
    "/forfaits/confort",
    "/departs",
    "/notre-approche",
    "/informations",
    "/agence",
    "/contact",
    "/mentions-legales",
    "/confidentialite",
    "/cookies",
    "/conditions",
  ].map((path) => ({
    url: absolutePageUrl(path),
  }));
}
