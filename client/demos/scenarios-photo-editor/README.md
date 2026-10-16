# Scenarios photo editor

Extracted from https://github.com/esforgary-scenarios/Scenarios/tree/fa60d86 (2026-10-16).
Only the photo editor, renderer, tools and related UI are included. The account, backend, script/video workspace and cloud storage are excluded. Images, gallery and composition are saved in a dedicated IndexedDB database on the user's device.

From `client`, run `node demos/scenarios-photo-editor/build.mjs`. The static output is served from `public/imported/scenarios-photo-editor/` inside an isolated iframe.

Background removal runs in a browser worker using the original pinned `@imgly/background-removal` 1.7.0 and `onnxruntime-web` 1.21.0. Its first use downloads model/WASM resources from IMG.LY; it does not upload the image. Optional Google Fonts are fetched when added. Image-by-URL import requires CORS permission from its source.

IMG.LY Background Removal is AGPL-3.0; its license is supplied in `node_modules/@imgly/background-removal/LICENSE.md`. ONNX Runtime is MIT. Source and rebuild instructions are retained here.
