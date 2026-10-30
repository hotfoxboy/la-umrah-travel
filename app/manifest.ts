import type { MetadataRoute } from "next";

import { assetPath } from "@/lib/paths";
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: assetPath("/"),
    name: "L.A Umrah Travel",
    short_name: "L.A Umrah",
    description:
      "Votre Omra au départ de Paris. Préparez votre voyage avec nos conseillers.",
    lang: "fr",
    start_url: assetPath("/"),
    scope: assetPath("/"),
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#041D40",
    icons: [
      {
        src: assetPath("/icons/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: assetPath("/icons/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: assetPath("/icons/maskable-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
