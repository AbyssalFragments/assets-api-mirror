# Assets Api Mirror

Mirrors our internal `assets-api` to github pages for a fallback

Code developed on [Forgejo](https://git.abyssalfragments.org/services/assets-api-mirror)

## LICENSE

This project, along with all of our other [open source projects](https://git.abyssalfragments.org/explore/repos), are [**MIT**](https://opensource.org/license/MIT)

## The Project

Rawdogging nodejs lmao, jsdoc instead of typescript for this

`src/index.js` is just an orchestrator. All mirrors are under `src/mirrors` and their default export is ran

Everything in `out` (or `argv[3]`) is exported to github pages under the `abyssalfragments.github.io/assets-api-mirror/` prefix

Side-note but nice for anyone wanting to use this, our `assets-api` will create a workflow deploy on a successful generate to keep this in sync