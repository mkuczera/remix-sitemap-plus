import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {
  RemixSitemapPlugin,
  ChangeFreq,
  PriorityFormat,
} from "remix-sitemap-plus";

const sitemapEntries = [
  {
    url: "http://localhost:3000/",
    changeFreq: ChangeFreq.DAILY,
    priority: "1.0" as PriorityFormat,
  },
  { url: "http://localhost:3000/about", changeFreq: ChangeFreq.MONTHLY },
];

const outputPath = "./public/sitemap.xml";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    RemixSitemapPlugin({ entries: sitemapEntries, outputPath }),
  ],
});
