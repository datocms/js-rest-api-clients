---
'@datocms/rest-client-utils': patch
---

Add jitter to retry waits

Many concurrent requests hitting the same rate limit, transient error, or
timeout at once used to all retry on the exact same tick, immediately
re-triggering the same failure. Retries (including job polling) are now
spread out with a random extra wait on top of the required one.
