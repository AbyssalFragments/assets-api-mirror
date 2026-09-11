import packageM from "../package.json" with { type: "json" };
const BASE = "https://assets.abyssalfragments.org/";

/**
 * reqwest uwu
 * @param {string} path
 * @param {RequestInit} init
 */
export function fixedFetch(path, init = {}) {
  const url = new URL(BASE);
  url.pathname = path;
  return fetch(url, {
    ...init,
    headers: {
      ...init,
      "User-Agent": `AssetsApiMirror/${packageM.version} fragmentedadmin@abyssalfragments.org`,
    },
  });
}
