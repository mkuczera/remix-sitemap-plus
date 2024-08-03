import glob from "glob";
import { promisify } from "util";
import fs from "fs";
import parser from "@babel/parser";

const globPromise = promisify(glob);

interface SitemapExport {
  filePath: string;
  sitemap: any; // Define a more specific type based on expected sitemap structure
}

export async function findRouteFiles(pattern: string): Promise<string[]> {
  return await globPromise(pattern, { absolute: true });
}

export function findSitemapExports(filePath: string): SitemapExport[] {
  const code = fs.readFileSync(filePath, "utf-8");
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript"],
  });

  const sitemaps: SitemapExport[] = [];

  ast.program.body.forEach((node) => {
    if (
      node.type === "ExportNamedDeclaration" &&
      node.declaration &&
      node.declaration.declarations
    ) {
      node.declaration.declarations.forEach((declaration) => {
        if (declaration.id.name === "sitemap") {
          sitemaps.push({
            filePath,
            sitemap: (declaration.init as any).value, // Type cast based on expected value type
          });
        }
      });
    }
  });

  return sitemaps;
}
