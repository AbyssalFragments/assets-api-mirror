import { mkdir, writeFile } from "node:fs/promises";
import { fixedFetch } from "../fetch.js";
import { join } from "node:path";
import { OUT_DIR } from "../constants.js";

/**
 * @typedef FamilyMember
 * @property {string} slug
 * @property {string} name
 * @property {string} role
 * @property {bool} hasCard
 * @property {bool} hasPoster
 * @property {bool} hasCutout
 */

/**
 * @typedef AtlasReturn
 * @property {number} rows
 * @property {number} cols
 * @property {number} atlasCount
 * @property {number} imageCount
 * @property {string[]} slugs
 */

const FAMILY_DIR = join(OUT_DIR, "family");
const ATLASES_DIR = join(FAMILY_DIR, "atlases");

/**
 *
 * @param {string} slug
 * @param {string} type
 */
async function downloadMemberImage(slug, type) {
  console.log(`Downloading family member ${slug} image ${type}`);
  await writeFile(
    join(FAMILY_DIR, slug, `${type}.png`),
    await fixedFetch(`/family/${slug}/${type}`)
      .then((i) => i.arrayBuffer())
      .then(Buffer.from),
  );
}

export default async function mirror() {
  console.log("Mirroring Family...");

  await mkdir(FAMILY_DIR, { recursive: true });
  /**
   * @type {FamilyMember[]}
   */
  const family = await fixedFetch("/family").then((i) => i.json());
  await writeFile(join(FAMILY_DIR, "index.json"), JSON.stringify(family));

  for (const familyMember of family) {
    console.log(`Processing family member ${familyMember.slug}`);
    await mkdir(join(FAMILY_DIR, familyMember.slug), { recursive: true });
    await writeFile(
      join(FAMILY_DIR, familyMember.slug, "index.json"),
      JSON.stringify(familyMember),
    );

    await Promise.all(
      [
        familyMember.hasCard ? "card" : null,
        familyMember.hasPoster ? "poster" : null,
        familyMember.hasCutout ? "cutout" : null,
      ]
        .filter((i) => i !== null)
        .map((type) => downloadMemberImage(familyMember.slug, type)),
    );
  }

  await mkdir(ATLASES_DIR, { recursive: true });
  /**
   * @type {Record<string, AtlasReturn>}
   */
  const atlases = await fixedFetch("/family/atlases").then((i) => i.json());
  await writeFile(join(ATLASES_DIR, "index.json"), JSON.stringify(atlases));

  for (const [slug, atlas] of Object.entries(atlases)) {
    console.log(`Processing atlas ${slug}`);
    await mkdir(join(ATLASES_DIR, slug), { recursive: true });
    await writeFile(
      join(ATLASES_DIR, slug, "index.json"),
      JSON.stringify(atlas),
    );

    for (let i = 1; i <= atlas.atlasCount; i++) {
      console.log(`Downloading atlas ${slug} #${i}`);
      await writeFile(
        join(ATLASES_DIR, slug, `${i}.png`),
        await fixedFetch(`/family/atlases/${slug}/${i}`)
          .then((i) => i.arrayBuffer())
          .then(Buffer.from),
      );
    }
  }
}
