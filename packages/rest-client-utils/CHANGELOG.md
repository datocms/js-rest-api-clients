# @datocms/rest-client-utils

## 6.1.1

### Patch Changes

- fadc5af: Stop `ApiError` and `TimeoutError` from carrying the API token

  The `authorization` header used for a failed call was stored verbatim in
  `error.request.headers`, so anything that read or serialized the error — a
  `console.error()` shipped to a log aggregator, an error tracker, an HTTP
  handler echoing the error back — got the token with it. It is now replaced by
  `[REDACTED, ending in abcd]`, which still tells two tokens apart while
  debugging. The real header is only ever handed to `fetch()`.

  For the same reason, `request`, `response` and `preCallStack` are now
  non-enumerable: reading `error.request` explicitly works exactly as before, but
  the payload of the failed call no longer travels through `console.error()`,
  `JSON.stringify()`, object spread or `serialize-error` by accident.

- fadc5af: Clear the request timeout timer when a request fails

  The timer that cancels a hanging request was only cleared once a response came
  back. When `fetch()` rejected instead, it stayed pending for its full duration
  (30 seconds by default), keeping Node's event loop alive and delaying the exit
  of short-lived scripts.

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
