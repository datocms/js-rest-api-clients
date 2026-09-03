# @datocms/cma-client-node

## 6.1.3

### Patch Changes

- d160db0: Move to `datocms-structured-text-utils` 6.x, so you don't end up with two copies of it

  If your project already depends on `datocms-structured-text-utils` 6.x, you have
  been getting a second copy of it — a 5.x one — tucked under the client, because
  we asked for `^5`. Two copies mean a bigger bundle and two versions of types that
  should be one. This release asks for `^6` instead, and the duplicate goes away.

  Nothing to do on your side, and nothing changes at runtime: 6.0.0 of that package
  was a version bump and nothing else, so every type and helper is exactly what it
  was before.

- Updated dependencies [d160db0]
  - @datocms/cma-client@6.1.3

## 6.1.0

### Minor Changes

- 5c69784: Build the ESM output for ES2018 instead of ES2015.

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

### Patch Changes

- Updated dependencies [5c69784]
  - @datocms/rest-client-utils@6.1.0
  - @datocms/cma-client@6.1.0

## 6.0.0

### Patch Changes

- Updated dependencies [39025ca]
  - @datocms/cma-client@6.0.0
