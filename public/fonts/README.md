# Quicksand

Self-hosted variable Quicksand, normal style, weights 400–700. The Latin subset includes the French accents used by the website. One 28 KB WOFF2 supplies Regular (400), Medium (500), SemiBold (600) and Bold (700).

Source: https://fonts.googleapis.com/css2?family=Quicksand:wght@400..700&display=swap

Font file: https://fonts.gstatic.com/s/quicksand/v37/6xKtdSZaM9iE8KbpRA_hK1QN.woff2

Licence: SIL Open Font License 1.1, included in `OFL.txt`, from https://github.com/google/fonts/blob/main/ofl/quicksand/OFL.txt.

The application uses `next/font/local` and a shared CSS variable with Arial / sans-serif fallbacks. Next.js preloads and fingerprints the font for the static export. The standalone offline page uses the same font file under its original name, precached by the service worker.

Browser verification is available through `scripts/mobile-check.mjs` with `TEST_TYPOGRAPHY=1`. It checks computed fonts for all displayed text and controls, actual font loading at all four weights, local WOFF2 requests and the offline fallback. `TEST_PATHS` accepts a comma-separated list of pages; `TEST_WIDTHS` selects viewport widths. The update was checked on all 13 pages at 390 and 1440 px, plus the core routes at 320 and 768 px.
