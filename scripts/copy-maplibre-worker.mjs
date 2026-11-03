// MapLibre starts its worker from a URL. Bundlers rewrite the default one and it fails to load
// ("Worker failed to load"), so the worker files are served as static files from /maplibre/.
import { cpSync, mkdirSync } from "node:fs";

const from = new URL("../node_modules/maplibre-gl/dist/", import.meta.url);
const to = new URL("../public/maplibre/", import.meta.url);
mkdirSync(to, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  cpSync(new URL(file, from), new URL(file, to));
}
