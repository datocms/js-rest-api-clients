# @datocms/rest-api-events

## 6.6.0

### Patch Changes

- 5a8d7c0: Update the default Pusher app key. The old one no longer exists, so any `withEventsSubscription()` call that didn't pass its own `appKey` hung instead of connecting.

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
