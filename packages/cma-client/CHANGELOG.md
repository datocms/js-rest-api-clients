# @datocms/cma-client

## 6.0.0

### Major Changes

- 39025ca: The `uploads` simple methods now speak one `default_field_metadata` shape, whatever the environment does

  `default_field_metadata` travels in two shapes: field-keyed
  (`{ alt: { en } }`) on environments where the
  [non-localized focal points](https://www.datocms.com/product-updates/non-localized-focal-points)
  opt-in is active, locale-keyed (`{ en: { alt } }`) where it isn't. Which one
  applies is a per-environment setting, not a version — projects created before
  the opt-in keep the legacy shape until their owner activates it, and each
  environment rejects the other shape with `422 INVALID_FORMAT`.

  The types describe the field-keyed shape only, at both layers. On a legacy
  environment that left no way through: the correctly typed call failed at
  runtime, and the call the API accepted didn't compile.

  `uploads.create`, `update`, `find`, `list` and `listPagedIterator` now convert
  in both directions, so you always read and write the field-keyed shape the
  types describe. `createFromUrl`, `createFromLocalFile`, `updateFromUrl` and
  `updateFromLocalFile` go through them and are covered too.

  **The raw methods are unchanged and still hand you what the environment sends,
  in whichever shape it sends it.** That is the point of the raw layer, and
  `UploadLocaleKeyedDefaultFieldMetadata` /
  `UploadLocaleKeyedDefaultFieldMetadataInRequest` are still exported for typing
  those payloads.

  Reads need no lookup — the two shapes are told apart structurally. Writes ask
  the environment which shape it speaks, through a `site` fetch memoized per
  client for twenty minutes and shared by concurrent callers, so a batch of ten
  thousand uploads costs one extra request rather than ten thousand. A client
  that never writes asset metadata never makes it at all.

  ### Breaking

  On an environment **without** the opt-in, the simple methods used to hand back
  the locale-keyed payload as the API sent it, and the docs on
  `UploadLocaleKeyedDefaultFieldMetadata` told you to cast the response to read
  it. They now return the field-keyed shape instead, so code doing
  `upload.default_field_metadata.en.alt` reads `undefined` — silently. Read it as
  `upload.default_field_metadata.alt.en`, which is what the types said all along,
  or move to `rawFind` / `rawList` to keep seeing the wire payload.

  Opted-in environments are unaffected: they already spoke the field-keyed shape,
  and nothing about those responses changes.

## 5.8.1

### Patch Changes

- 90ee46a: Add the missing `poster_time` to the legacy locale-keyed upload metadata types

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
