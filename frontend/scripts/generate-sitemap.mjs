// Generates public/sitemap.xml from the site's known static routes plus the
// dynamic /experiences/$slug pages. Re-run this (npm run sitemap) whenever a
// route is added, removed or renamed — it is not generated at build time.
//
// NOTE: site.url in src/config/site.ts is currently a placeholder domain.
// Re-run this script after that value is updated to a real production
// domain so the sitemap ships with correct absolute URLs.

import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(root, "..");

// Kept in sync with src/config/site.ts by hand (this script runs outside the
// Vite/TS toolchain, so it re-reads the value rather than importing it).
const siteTsSource = readFileSync(
  path.join(repoRoot, "src/config/site.ts"),
  "utf8",
);
const urlMatch = siteTsSource.match(/url:\s*"([^"]+)"/);
const SITE_URL = (urlMatch?.[1] ?? "https://www.shrigrandfarmstay.example").replace(/\/$/, "");

// Extract experience CATEGORY slugs the same low-tech way (the old individual
// experience pages now redirect into these), so this script has no
// build-time dependency on the app.
const experienceCategoriesSource = readFileSync(
  path.join(repoRoot, "src/data/experience-categories.ts"),
  "utf8",
);
const experienceSlugs = [...experienceCategoriesSource.matchAll(/slug:\s*"([^"]+)"/g)].map(
  (m) => m[1],
);

/** path, changefreq, priority */
const staticRoutes = [
  ["/", "weekly", "1.0"],
  ["/about", "monthly", "0.8"],
  ["/facilities", "monthly", "0.8"],
  ["/experiences", "monthly", "0.8"],
  ["/explore", "monthly", "0.6"],
  ["/gallery", "weekly", "0.7"],
  ["/packages", "monthly", "0.8"],
  ["/booking", "monthly", "0.9"],
  ["/blog", "weekly", "0.6"],
  ["/contact", "monthly", "0.7"],
  ["/privacy", "yearly", "0.2"],
  ["/terms", "yearly", "0.2"],
  ["/cancellation-policy", "yearly", "0.3"],
];

const experienceRoutes = experienceSlugs.map((slug) => [
  `/experiences/${slug}`,
  "monthly",
  "0.7",
]);

const routes = [...staticRoutes, ...experienceRoutes];

const today = new Date().toISOString().slice(0, 10);

const body = routes
  .map(
    ([loc, changefreq, priority]) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(path.join(repoRoot, "public/sitemap.xml"), xml);
console.log(`Wrote public/sitemap.xml with ${routes.length} URLs (base: ${SITE_URL})`);

// Keep robots.txt's Sitemap: line in sync with the same base URL.
const robotsPath = path.join(repoRoot, "public/robots.txt");
const robotsSource = readFileSync(robotsPath, "utf8");
const sitemapLine = `Sitemap: ${SITE_URL}/sitemap.xml`;
const updatedRobots = /^Sitemap:.*$/m.test(robotsSource)
  ? robotsSource.replace(/^Sitemap:.*$/m, sitemapLine)
  : `${robotsSource.trimEnd()}\n\n${sitemapLine}\n`;
writeFileSync(robotsPath, updatedRobots);
console.log(`Synced ${robotsPath} with ${sitemapLine}`);
