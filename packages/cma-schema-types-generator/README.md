# `@datocms/cma-schema-types-generator`

Generate TypeScript type definitions from a DatoCMS project schema.

Produces `ItemTypeDefinition`-based types (one per model/block) plus
`AnyBlock` / `AnyModel` / `AnyBlockOrModel` union types, ready to be
used with `@datocms/cma-client` for type-safe content management and
migration scripts.

## Installation

```bash
npm install @datocms/cma-schema-types-generator
```

`@datocms/cma-client` is a peer dependency.

## Usage

```ts
import { buildClient } from '@datocms/cma-client';
import { generateSchemaTypes } from '@datocms/cma-schema-types-generator';

const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN! });
const code = await generateSchemaTypes(client);
```

`code` is a string containing prettier-formatted TypeScript, ready to
be written to disk:

```ts
import { writeFile } from 'node:fs/promises';

await writeFile('src/generated/schema.ts', code);
```

### Example output

```ts
import type { ItemTypeDefinition } from '@datocms/cma-client';

type EnvironmentSettings = {
  locales: 'en' | 'it';
};

export type BlogPost = ItemTypeDefinition<
  EnvironmentSettings,
  '12345',
  {
    title: { type: 'string'; localized: true };
    content: { type: 'rich_text'; blocks: Hero };
  }
>;

export type Hero = ItemTypeDefinition<EnvironmentSettings, '67890', { /* … */ }>;

export type AnyBlock = Hero;
export type AnyModel = BlogPost;
export type AnyBlockOrModel = AnyBlock | AnyModel;
```

### Options

Both entry points accept an optional `SchemaTypesGeneratorOptions`
object:

- **`itemTypesFilter`** — comma-separated list of model api keys to
  include. Block dependencies referenced by the kept models (through
  `rich_text`, `structured_text`, `single_block`) are pulled in
  automatically. Unknown api keys are ignored.
- **`wrapInGlobalNamespace`** — wrap the generated declarations in
  `declare global { namespace Schema { … } }`, so they can be referenced
  as `Schema.BlogPost` from any module without importing.

### Migration variant

`generateSchemaTypesForMigration` produces the same declarations
**without** the `import type { ItemTypeDefinition }` line — meant to be
inlined directly inside a migration script that already has access to
the type.

```ts
import { generateSchemaTypesForMigration } from '@datocms/cma-schema-types-generator';

const inline = await generateSchemaTypesForMigration(client, {
  itemTypesFilter: 'blog_post,author',
});
```
