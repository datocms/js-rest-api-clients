---
'@datocms/cma-schema-types-generator': minor
---

Add a `format` option to `generateSchemaTypes()` and
`generateSchemaTypesForMigration()`, defaulting to `true`.

Pass `format: false` to skip Prettier. On large schemas this cuts the peak
memory use considerably, and the output is the same code: only the quote style
and the line breaks are different.
