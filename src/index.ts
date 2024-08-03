import { Plugin } from "vite";
import { writeFile } from "fs/promises";
import {
  generateSitemap,
  SitemapEntry,
  ChangeFreq,
  PriorityFormat,
} from "./sitemap.js";

interface SitemapPluginOptions {
  entries: SitemapEntry[];
  outputPath: string;
}

function RemixSitemapPlugin(options: SitemapPluginOptions): Plugin {
  return {
    name: "remix-sitemap-plugin",

    configResolved(config) {
      console.log("Vite mode:", config.command);
    },

    configureServer(server) {
      // Only apply during development (serve phase)
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/sitemap.xml") {
          const sitemap = await generateSitemap(options.entries);
          res.setHeader("Content-Type", "application/xml");
          res.end(sitemap);
        } else {
          next();
        }
      });
    },

    writeBundle() {
      // Only apply during build phase
      generateSitemap(options.entries).then((sitemap) => {
        writeFile(options.outputPath, sitemap, "utf8")
          .then(() => {
            console.log(`Sitemap generated at ${options.outputPath}`);
          })
          .catch((err) => {
            console.error("Error writing sitemap:", err);
          });
      });
    },
  };
}

export { RemixSitemapPlugin, SitemapEntry, ChangeFreq, PriorityFormat };
