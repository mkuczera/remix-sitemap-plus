import { Plugin } from "vite";
import { writeFile } from "fs/promises";
import * as path from "path";
import { promises as fs } from "fs";
import { vitePlugin } from "@remix-run/dev";
import {
  generateSitemap,
  SitemapEntry,
  ChangeFreq,
  PriorityFormat,
} from "./sitemap.js";

interface SitemapPluginOptions {
  outputPath: string;
}

async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const routeFiles = await getRouteFiles();
  const entries: SitemapEntry[] = [];

  for (const file of routeFiles) {
    const { sitemap } = await import(file);
    if (typeof sitemap === "function") {
      const result = await sitemap({ config: {}, request: {} });
      entries.push(...result);
    }
  }

  return entries;
}

async function getRouteFiles(): Promise<string[]> {
  // Adjust this implementation to match the actual paths of your project
  const routesDir = path.join(__dirname, "..", "routes");
  const files = await walkDir(routesDir);

  return files.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
}

async function walkDir(dir: string): Promise<string[]> {
  let files: string[] = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(await walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function RemixSitemapPlusPlugin(options: SitemapPluginOptions): Plugin {
  return {
    name: "remix-sitemap-plus",

    configResolved(config) {
      console.log("config", config.__remixPluginContext?.remixConfig);
      console.log("Vite mode:", config.command);
    },

    configureServer(server) {
      // Only apply during development (serve phase)
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/sitemap.xml") {
          const entries = await getSitemapEntries();
          const sitemap = await generateSitemap(entries);
          res.setHeader("Content-Type", "application/xml");
          res.end(sitemap);
        } else {
          next();
        }
      });
    },

    async writeBundle() {
      const entries = await getSitemapEntries();
      const sitemap = await generateSitemap(entries);
      await writeFile(options.outputPath, sitemap, "utf8")
        .then(() => {
          console.log(`Sitemap generated at ${options.outputPath}`);
        })
        .catch((err) => {
          console.error("Error writing sitemap:", err);
        });
    },
  };
}

export { RemixSitemapPlusPlugin, SitemapEntry, ChangeFreq, PriorityFormat };
