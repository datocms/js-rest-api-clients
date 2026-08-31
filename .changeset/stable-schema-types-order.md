---
'@datocms/cma-schema-types-generator': patch
---

Emit the generated schema types in a stable order. The API returns item types in
no particular order, so regenerating a file for an unchanged project could
reshuffle the declarations and show up as a diff. Item types are now sorted by
the type name they produce, and fields by position with `api_key` breaking ties.
