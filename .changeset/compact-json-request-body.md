---
"@datocms/rest-client-utils": patch
---

Send request bodies as compact JSON instead of indented JSON. The indentation grew with the nesting depth of blocks, so saving a record with many nested blocks sent a body several times larger than its data, and large records could exceed the API's request size limit. Request logs (`LogLevel.BODY` and above) now print the request body exactly as sent; response bodies are still printed indented.
