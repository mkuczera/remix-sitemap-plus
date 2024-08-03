import { findRouteFiles, findSitemapExports } from "./utils";

export async function generateSitemap(rootDir: string): Promise<any[]> {
  try {
    const routeFiles = await findRouteFiles(`${rootDir}/**/*.{js,ts}`);
    const sitemaps: any[] = []; // Replace `any` with a more specific type

    for (const file of routeFiles) {
      const fileSitemaps = findSitemapExports(file);
      sitemaps.push(...fileSitemaps);
    }

    // Combine or format sitemaps as needed
    const finalSitemap = sitemaps.map((sitemap) => ({
      filePath: sitemap.filePath,
      sitemap: sitemap.sitemap,
    }));

    return finalSitemap;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    throw error;
  }
}
