# Plan: expose runtime IDs/REFs alongside types, drop `wrapInGlobalNamespace`

Working dir: `/Users/stefanoverna/dato/js-rest-api-clients`. Package:
`packages/cma-schema-types-generator`. New, never published yet.

## Goal

Today the generator emits **only types** — consumers must hardcode item
type IDs:

```ts
client.items.create<Schema.Book>({
  item_type: { type: "item_type", id: "UZyfjdBES8y2W2ruMEHSoA" },
  title: "...",
});
isBlockOfType("Dy9C52o4S6eF3mqSOmeUtg");
```

We want them to write:

```ts
client.items.create<Schema.Book>({
  item_type: Schema.Book.REF,
  title: "...",
});
isBlockOfType(Schema.TestimonialBlock.ID);
if (block.__itemTypeId === Schema.HeroBlock.ID) { /* narrows */ }
```

`Schema.Book` is both a **type** (`ItemTypeDefinition<…>`) and a **value**
(an object with `ID` and `REF`). TypeScript declaration merging makes
this work — they live in different namespaces.

## Already done (don't redo)

- Prettier v3 migration via `@prettier/sync` (CJS-compatible synchronous
  wrapper around the ESM-only Prettier v3).
- README scaffolded.
- `environment` option removed from `SchemaTypesGeneratorOptions`.
- Blank-line separation between top-level declarations in
  `printTypeDeclarations` (`src/index.ts:688`), with 4 dedicated tests.
- 24/24 tests green, `tsc --noEmit` clean, `npm run build` clean.

## Decisions (settled — do not relitigate)

1. **Naming for the new value-side properties**: `ID` (the bare string)
   and `REF` (the JSON:API resource identifier object
   `{ type: "item_type", id: "…" }`). Uppercase to signal "constant" and
   avoid visual collision with record fields like `block.id`.
2. **Output shape**: per item type, emit `export type X = …` AND
   `export const X = { ID, REF } as const`. TypeScript merges the two.
3. **Drop `wrapInGlobalNamespace` entirely.** The library's only mode is
   plain module-local exports. The few consumers that need global
   `Schema.X` access (the CLI script-workspace, remote-mcp) handle it
   themselves with a tiny generic `schema-globals.ts` (see below).
4. **`generateSchemaTypes` signature stays `Promise<string>`.** No
   structured return, no enumeration of type names — `export import
   Schema = SchemaModule` inside `declare global` aliases the whole
   module without enumeration (verified manually — see the verification
   notes section below).

## Library changes (`packages/cma-schema-types-generator`)

### `src/index.ts`

1. For every item type, emit a paired `export const`:

   ```ts
   export type Book = ItemTypeDefinition<…>;
   export const Book = {
     ID: 'UZyfjdBES8y2W2ruMEHSoA',
     REF: { type: 'item_type', id: 'UZyfjdBES8y2W2ruMEHSoA' },
   } as const;
   ```

   - `as const` is **mandatory** — without it `Schema.Book.ID` would be
     typed `string` and narrowing (`block.__itemTypeId === Schema.Book.ID`)
     wouldn't work.
   - The const goes through the same printer/blank-line pipeline as the
     types (each type+const pair is one logical group; blank line between
     pairs).

2. Remove the `wrapInGlobalNamespace` option from
   `SchemaTypesGeneratorOptions` and remove the
   `wrapDeclarationsInGlobalNamespace` helper. Update the
   `printTypeDeclarations` parts struct accordingly.

3. The `Any*` union types (`AnyBlock`, `AnyModel`, `AnyBlockOrModel`)
   stay types-only — no need for runtime values for these.

### Output emission via the TS printer

`ts.factory.createVariableStatement` with `NodeFlags.Const` and a
`createObjectLiteralExpression` containing `ID` and `REF` properties.
The printer will emit it as a regular `export const X = { … } as const;`
(remember to wrap with `createAsExpression` + `createTypeReferenceNode('const')`).

### Tests (`__tests__/index.test.ts`)

Existing `wrapInGlobalNamespace` test (`__tests__/index.test.ts:398`)
must be deleted. Add new ones:

- `export const Book` exists alongside `export type Book` for every
  item type (model and block).
- `Book.ID` is the literal item type id (string match).
- `Book.REF` is `{ type: 'item_type', id: '<sameId>' }`.
- `as const` is present (assert the trailing `} as const;`).
- Blank-line separation still holds with the new const declarations
  (the existing blank-line tests probably need their regexes updated to
  match `};\n\nexport const` and `} as const;\n\nexport type`).
- The migration variant (`generateSchemaTypesForMigration`) emits the
  same `export const` blocks (it still produces the runtime side, just
  no `import` line).

### README

- Drop the `wrapInGlobalNamespace` option doc.
- Add a section showing the new `Schema.Book.ID` / `Schema.Book.REF`
  usage with a realistic snippet (the user's `LandingPage` example is
  good source material).
- Mention type+value declaration merging so users understand
  `Schema.Book` resolves both as type and as value.

## Consumer changes

These are **separate work items** — do them after the library work
lands. The library can be released v5.5.0 or similar before consumers
are migrated; consumers stay on the previous version until ready.

### `@datocms/cli` script-workspace

File: `/Users/stefanoverna/dato/cli/packages/cli/src/utils/script-workspace/workspace.ts`

1. `workspace.ts:118` — drop the `{ wrapInGlobalNamespace: true }`
   option; call as `await generateSchemaTypes(client)`.

2. In `writeScriptAndSchema`, also write a per-run `schema-globals.ts`
   with **fixed** content (does not depend on schema contents):

   ```ts
   import * as SchemaModule from './schema.js';

   declare global {
     export import Schema = SchemaModule;
   }

   (globalThis as unknown as { Schema: typeof SchemaModule }).Schema = SchemaModule;
   ```

3. Update the per-run `tsconfig.json` `include` to add
   `'./schema-globals.ts'`.

4. Update the runner (the `writeRunner` private method, currently at
   `workspace.ts:311`): before importing the user script, dynamically
   import `schema-globals.ts` so `globalThis.Schema` is populated:

   ```ts
   const runDir = path.dirname(scriptPath);
   const schemaGlobalsUrl = pathToFileURL(
     path.join(runDir, 'schema-globals.ts'),
   ).href;
   await import(schemaGlobalsUrl);
   ```

5. Empty-schema fallback (currently the type-only stub at
   `workspace.ts:119`): keep emitting an empty schema.ts that exports
   nothing meaningful, but the schema-globals.ts and runner pre-import
   still work harmlessly.

### `remote-mcp`

Files:
- `/Users/stefanoverna/dato/remote-mcp/scripts/updateSnapshot.ts`
- `/Users/stefanoverna/dato/remote-mcp/src/lib/scripts/executeInSandbox.ts`

The snapshot's `globals.d.mts` is **already correct** — it uses
`import type * as SchemaTypes from "./schema.mjs"; export import Schema =
SchemaTypes;` inside `declare global`. That covers the type side.

Two small changes needed:

1. In `updateSnapshot.ts`, modify `mainCode` (around line 145) so that
   `main.mts` also installs the runtime side before importing
   `script.mjs`:

   ```ts
   const mainCode = [
     `import { buildClient } from "@datocms/cma-client-node";`,
     `import * as Schema from "./schema.mjs";`,           // NEW
     `const client = buildClient({ … });`,
     `Object.assign(globalThis, { client, Schema });`,    // include Schema
     `await import("./script.mjs");`,
   ].join("\n");
   ```

   `Schema` here imports the runtime values (the `export const X`
   blocks). The type-side `Schema` global comes from `globals.d.mts` —
   they merge via declaration merging.

2. `executeInSandbox.ts` needs no changes. `generateSchemaTypes(client)`
   call (line 60) already works because the new function signature
   stays the same.

3. Bump `@datocms/cma-schema-types-generator` dep version once the
   library is published.

## Order of work

1. Library: emit `export const X = { ID, REF }` per item type.
2. Library: remove `wrapInGlobalNamespace` option + dead code.
3. Library: update existing tests, add new ones.
4. Library: update README.
5. Library: ship.
6. CLI script-workspace: migrate.
7. remote-mcp: migrate.

Steps 1-5 are one PR/commit. Steps 6 and 7 are independent follow-ups.

## Verification notes (for sanity-checking later)

The following has been **manually verified** (probes were in `/tmp/`,
since cleaned up):

1. `export type X` + `export const X = { … } as const` in the same
   module merge correctly. Consumers can use `Schema.X` in both type
   position (alias to ItemTypeDefinition) and value position (the
   const).

2. With `import * as Schema from "./schema.js"`, `Schema.X.ID` has the
   literal type (e.g. `'UZyfjdBES8y2W2ruMEHSoA'`), and
   `Schema.X.REF` has type `{ readonly type: 'item_type'; readonly id:
   '<lit>' }`. Narrowing on `block.__itemTypeId === Schema.X.ID` works.

3. Inside `declare global`, `export import Schema = SchemaModule` (with
   `import * as SchemaModule from './schema.js'`) aliases the **whole
   module** as a global namespace — both type-side and value-side —
   without enumerating individual types.

4. Self-referential `import('./schema.js')` inside `declare global` of
   schema.ts also works (alternative we explored — not chosen because
   the consumer-side `schema-globals.ts` is cleaner).

5. The `declare global` re-export is **type-only** at runtime —
   `globalThis.Schema = SchemaModule` must be assigned explicitly.

6. tsx + Node 22 + `module: nodenext` + top-level await all play
   nicely with this setup.

## Open questions / risks

- The empty-schema case (a project with zero item types): the generator
  must not crash and the schema-globals indirection must still
  type-check. Add a regression test.

- Whether `as const` survives prettier formatting. Verified yes — but a
  test asserting `} as const;` exact substring is cheap insurance.

- Naming of the runtime-only side-effect: there is currently no
  module-level side effect in the library output. The library remains
  effect-free; only the consumer-written `schema-globals.ts` does the
  globalThis assignment. Keep it that way.
