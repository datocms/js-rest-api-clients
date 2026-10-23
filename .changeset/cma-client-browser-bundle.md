---
"@datocms/cma-client-browser": patch
---

Rebuild the prebuilt bundle in `dist/browser`, which inlines its dependencies and had not been republished since 6.1.0. It now sends request bodies as compact JSON, and picks up the earlier `@datocms/rest-client-utils` fixes it was missing: the API token redacted from `ApiError` and `TimeoutError`, the request timeout timer cleared on failure, and jitter on retry waits. It also picks up everything `@datocms/cma-client` released since 6.1.0, including the resources its schema syncs added. The `import` and `require` entry points are unchanged: they already resolve the current `@datocms/rest-client-utils`.
