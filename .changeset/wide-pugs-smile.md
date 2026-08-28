---
"@datocms/cma-client": patch
---

Add the missing `poster_time` to the legacy locale-keyed upload metadata types

`UploadLocaleKeyedDefaultFieldMetadata` and
`UploadLocaleKeyedDefaultFieldMetadataInRequest` describe the shape of
`default_field_metadata` on environments where the `non_localized_focal_points`
opt-in is still inactive. Both were missing `poster_time`, which those
environments do return on read and do accept on write — so anyone using these
types to talk to a legacy environment lost the attribute, on the read side to a
type error and on the write side silently.

Like `focal_point`, `poster_time` is a single value per asset: on read the API
replicates it into every locale entry, and on write whichever entry carries it
sets the one stored value.
