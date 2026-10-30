import type { MetadataRoute } from "next";
import { absolutePageUrl } from "@/lib/paths";
import {getArticles} from '@/lib/blog';

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
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
    "/actualites",
  ].map((path) => ({
    url: absolutePageUrl(path),
  }));
  return [...pages,...getArticles().map(article=>({url:absolutePageUrl(`/actualites/${article.slug}`),lastModified:new Date(article.date+'T12:00:00Z')}))];
}
