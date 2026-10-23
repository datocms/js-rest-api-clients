---
"@datocms/rest-client-utils": patch
---

Request logs (`LogLevel.BODY` and above) now print the request body exactly as sent, as compact JSON. Before, they printed an indented copy, which could be several times larger than the body the API received. Response bodies are still printed indented.
