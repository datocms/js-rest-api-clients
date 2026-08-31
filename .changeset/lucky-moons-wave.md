---
'@datocms/rest-client-utils': patch
---

Clear the request timeout timer when a request fails

The timer that cancels a hanging request was only cleared once a response came
back. When `fetch()` rejected instead, it stayed pending for its full duration
(30 seconds by default), keeping Node's event loop alive and delaying the exit
of short-lived scripts.
