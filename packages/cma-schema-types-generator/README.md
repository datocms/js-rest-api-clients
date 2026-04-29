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
export const BlogPost = {
  ID: '12345',
  REF: { type: 'item_type', id: '12345' },
} as const;

export type Hero = ItemTypeDefinition<EnvironmentSettings, '67890', { /* … */ }>;
export const Hero = {
  ID: '67890',
  REF: { type: 'item_type', id: '67890' },
} as const;

export type AnyBlock = Hero;
export type AnyModel = BlogPost;
export type AnyBlockOrModel = AnyBlock | AnyModel;
```

### Type-and-value declaration merging

Each item type is emitted **twice**: once as a TypeScript `type` (the
`ItemTypeDefinition<…>` alias) and once as an `export const` carrying
its runtime metadata. TypeScript merges the two — `Schema.BlogPost`
resolves both as a type and as a value, depending on the position it's
used in.

The runtime const exposes two fields:

- **`ID`** — the bare item type id (e.g. `'12345'`), typed as a string
  literal so it can be used for narrowing.
- **`REF`** — the JSON:API resource identifier object
  `{ type: 'item_type', id: '<sameId>' }`, ready to be passed wherever
  the API expects an item type reference.

This lets call sites stay free of hardcoded string ids:

```ts
import { buildClient } from '@datocms/cma-client';
import * as Schema from './generated/schema';

const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN! });

await client.items.create<Schema.LandingPage>({
  item_type: Schema.LandingPage.REF,
  title: 'Hello world',
});

if (block.__itemTypeId === Schema.HeroBlock.ID) {
  // narrowed to Schema.HeroBlock
}
```

### Options

Both entry points accept an optional `SchemaTypesGeneratorOptions`
object:

- **`itemTypesFilter`** — comma-separated list of model api keys to
  include. Block dependencies referenced by the kept models (through
  `rich_text`, `structured_text`, `single_block`) are pulled in
  automatically. Unknown api keys are ignored.

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
