# js-rest-api-clients

npm workspaces monorepo publishing nine `@datocms/*` packages, all released
together on the same version number.

## Layout

- `packages/*` — the published packages. `rest-client-utils` is at the bottom of
  the dependency graph, `cma-client` and `dashboard-client` sit on top of it,
  everything else on top of those.
- `generate/` — the code generator that turns the DatoCMS JSON hyperschema into
  TypeScript, plus its handlebars templates.
- `bin/publish.sh` — the release process.

## Generated code

**Anything under `packages/*/src/generated/` is written by a script — never edit
it by hand.** Change `generate/templates/*.handlebars` and re-run:

```
npm run generate
```

That command also stamps the version into the client `userAgent` and writes a
changeset describing the schema sync (see below). `npm run generate-next` does
the same against a local `site-api` on `lvh.me`.

## Build

```
npm run build
```

Turborepo derives the build order from the `package.json` dependencies, so a new
package or a new dependency between two of them needs no configuration. Each
package compiles CJS and ESM into `dist/`, which is gitignored — packages resolve
each other through `dist/types`, which is why the order matters.

## Tests

```
npm test          # biome lint + the whole jest suite
```

The suite talks to the **real** DatoCMS API and creates throwaway projects, so it
needs `DATOCMS_ACCOUNT_EMAIL` / `DATOCMS_ACCOUNT_PASSWORD` /
`DATOCMS_ORGANIZATION_ID` in `.env` (see `.env.sample`), it is slow, and it fails
without network. For a quick check of anything that doesn't need the API:

```
npx jest --globalSetup= --testPathPattern='packages/(rest-client-utils|cma-client-analysis)'
```

Linting and formatting are biome, not eslint/prettier: `npm run lint`,
`npm run format`.

## Changesets

Every change worth mentioning in a release needs a changeset — a markdown file
under `.changeset/` recording which packages changed and how big the bump is:

```
npm run changeset
```

Bump levels are a convention here, not a formality:

- `patch` — **bug fixes only**. It's the one semver signal every developer reads
  the same way, so we don't spend it on anything else.
- `minor` — new API surface, a schema sync included.
- `major` — something removed or renamed.

All `@datocms/*` packages are a `fixed` group, so they always end up on the same
version regardless of which ones a changeset lists. The bump level is what
actually matters.

## Releasing

```
npm run publish
```

The script's ordering is deliberate and worth preserving if you touch it:
everything that can fail (build, tests, npm auth, being out of sync with
`origin`) runs *before* anything is mutated, and npm is published *before* git is
tagged, so a half-finished release can never leave a tag pointing at something
that was never published.

**There is no rollback, on purpose.** If it dies halfway, run it again: it
detects the release commit, skips straight to publishing, and `changeset publish`
only pushes the packages that aren't on the registry yet. Never "clean up" a
failed release by deleting tags or force-pushing — that is exactly the bug this
process was built to eliminate.
