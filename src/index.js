import { join } from "node:path";
import packageM from "../package.json" with { type: "json" };
import { fixedFetch } from "./fetch.js";
import { readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { OUT_DIR } from "./constants.js";

(async () => {
  console.info(`Assets API Mirror ${packageM.version}`);
  console.log(`Out Dir: ${OUT_DIR}`);
  if (existsSync(OUT_DIR)) await rm(OUT_DIR, { recursive: true });
  for (const fileName of await readdir(join(import.meta.dirname, "mirrors"))) {
    if (!fileName.endsWith(".js")) continue;
    const mirrorName = fileName.slice(0, -3);
    console.log(`Processing mirror ${mirrorName}...`);
    const file = join(import.meta.dirname, "mirrors", fileName);
    try {
      const { default: run } = await import(file);
      try {
        await run();
      } catch (e) {
        console.error("Mirror Failed!", e);
      }
    } catch (e) {
      console.error("Failed to load mirror!", e);
    }
  }
  // console.log(await fixedFetch("/family/lillith").then((i) => i.text()));
})();
