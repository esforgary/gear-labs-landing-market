// Imported from esforgary/Calorie-calculator, commit d8a7761.
// Run from any directory: node <path-to-this-file>. No server or auth code is bundled.
import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const folder = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(folder, "../../../../../../public/imported/calorie-calculator");
await mkdir(output, { recursive: true });
await build({
  entryPoints: [path.join(folder, "source/main.tsx")],
  outfile: path.join(output, "app.js"),
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2022",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "linked",
});
await writeFile(path.join(output, "index.html"), `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#14171c"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'"><title>Ритм — дневник питания</title><link rel="stylesheet" href="./app.css"></head><body><div id="root"></div><script type="module" src="./app.js"></script></body></html>`);
console.log("Calorie-calculator static frontend built.");
