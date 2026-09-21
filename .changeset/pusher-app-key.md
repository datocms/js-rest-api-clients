---
"@datocms/rest-api-events": patch
---

Update the default Pusher app key. The old one no longer exists, so any `withEventsSubscription()` call that didn't pass its own `appKey` hung instead of connecting.
