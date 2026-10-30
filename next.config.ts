import type { NextConfig } from "next";

import { basePath } from "./lib/paths";

const config: NextConfig = {
  output: "export",

  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  // Avoid retaining a large, regenerable filesystem cache during export.
  experimental: { turbopackFileSystemCacheForBuild: false },
  env: { NEXT_PUBLIC_BUILD_YEAR: String(new Date().getUTCFullYear()) },

  images: {
    unoptimized: true,
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default config;
