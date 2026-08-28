# js-rest-api-clients

npm workspaces monorepo publishing nine `@datocms/*` packages. Packages released
together share a version number; ones nobody touched keep theirs.

## Layout

- `packages/*` — the published packages. `rest-client-utils` is at the bottom of
  the dependency graph, `cma-client` and `dashboard-client` sit on top of it,
  everything else on top of those.
- `toolchain/` — everything that acts on the repo rather than shipping to a user:
  the codegen under `toolchain/generate/`, and `toolchain/publish.mjs`, the
  release process. Nothing in here is published. See `toolchain/README.md`.

## Generated code

**Anything under `packages/*/src/generated/` is written by a script — never edit
it by hand.** Change `toolchain/generate/templates/*.handlebars` and re-run:

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

All `@datocms/*` packages are a `linked` group: the ones a release touches land
on the same version, and the rest stay where they are. So the package list in a
changeset matters — name every package whose own behaviour changed, and leave
out the ones that merely depend on them, which changesets bumps by itself when a
declared range actually breaks.

## Releasing

```
npm run publish
```

The script's ordering is deliberate and worth preserving if you touch it:
everything that can fail (build, tests, npm auth, being out of sync with
`origin`) runs *before* anything is mutated, and npm is published *before* git is
tagged, so a half-finished release can never leave a tag pointing at something
that was never published.

**There is no rollback, on purpose.** If it dies halfway, run it again. Every
step is idempotent — `changeset publish` skips versions already on the registry,
tagging skips tags that exist, a GitHub release skips itself — so the rerun finds
no pending changesets, skips build, tests, bump and commit, and picks up exactly
what the previous run didn't finish. Never "clean up" a failed release by
deleting tags or force-pushing: that is the bug this process was built to
eliminate.

**One tag and one GitHub release per package** (`@datocms/cma-client@5.9.0`),
written by `changeset publish` itself — it publishes first and tags only the
packages npm accepted, which is the ordering that matters. Each release's body is
that package's own `CHANGELOG.md` section; when a package moved only because a
sibling did, that section says exactly that, which is the honest note for it. What the release covers is read from
`changeset publish-plan --output`, not reconstructed. Releases up to v5.8.0 used
a single `vX.Y.Z` tag; those stay where they are.
