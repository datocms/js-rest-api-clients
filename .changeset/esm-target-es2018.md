---
'@datocms/cma-schema-types-generator': minor
'@datocms/cma-client-browser': minor
'@datocms/rest-client-utils': minor
'@datocms/cma-client-node': minor
'@datocms/dashboard-client': minor
'@datocms/rest-api-reference': minor
'@datocms/rest-api-events': minor
'@datocms/cma-client': minor
---

Build the ESM output for ES2018 instead of ES2015.

At ES2015 TypeScript had to downlevel `async`/`await`, object rest and
`for await…of` into its own `__awaiter` / `__rest` / `__asyncValues` helpers,
which it emits guarded by a top-level `this` — meaningless in an ES module, and
enough to make esbuild warn on every file that contains one. ES2018 has all
three natively, so the helpers are gone and the emitted code is the code you
wrote.

The CommonJS output and the published types are unchanged. The one consequence
is that `dist/esm` now expects an ES2018 runtime: Node 10 or later, and browsers
with `Symbol.asyncIterator`. The bundle shipped in `@datocms/cma-client-browser`
already targeted ES2018.
