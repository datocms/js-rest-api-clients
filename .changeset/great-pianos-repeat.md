---
'@datocms/rest-client-utils': patch
---

Stop `ApiError` and `TimeoutError` from carrying the API token

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
