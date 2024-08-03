// Enum for Change Frequency options in a sitemap
export enum ChangeFreq {
  ALWAYS = "always",
  HOURLY = "hourly",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
  NEVER = "never",
}

// TODO: Date Format - YYYY-MM-DD
export type DateFormat =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

// TODO: Priority Format - a number between 0.0 and 1.0, but could also be a single number
export type PriorityFormat = `${number}.${number}` | `${number}`;

export interface SitemapEntry {
  url: string; // URL of the page
  lastModified?: DateFormat;
  changeFreq?: ChangeFreq; // Change frequency
  priority?: PriorityFormat;
}

export interface Sitemap {
  entries: SitemapEntry[];
}

export async function generateSitemap(
  entries: SitemapEntry[]
): Promise<string> {
  const urls = entries
    .map(
      (entry) => `
      <url>
        <loc>${entry.url}</loc>
        ${entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : ""}
        ${
          entry.changeFreq ? `<changefreq>${entry.changeFreq}</changefreq>` : ""
        }
        ${entry.priority ? `<priority>${entry.priority}</priority>` : ""}
      </url>
    `
    )
    .join("");

  return `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>
    `;
}
