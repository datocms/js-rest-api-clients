# Changesets

This folder holds the pending release notes for the next version.

Whenever you change something worth mentioning in a release, run `npx changeset`
and answer the two prompts (which packages, and whether it's a patch/minor/major).
That writes a small markdown file here, which you commit along with your changes.

At release time `npm run publish` consumes every pending file: it computes the
resulting version, updates the `package.json`s and the `CHANGELOG.md`s, and
deletes the files.

Note that all `@datocms/*` packages are a `fixed` group: they always share the
same version and are released together, so the package list inside a changeset
matters far less than the bump level you pick.

Schema-only updates produced by `npm run generate` write their own changeset
automatically — see `generate/writeChangeset.ts`.

## Which bump level?

- `patch` — bug fixes only. It's the clearest signal in semver ("nothing new,
  just a fix"), so we don't spend it on anything else.
- `minor` — new API surface, including a schema sync. This is what the
  automatic codegen changeset uses.
- `major` — something was removed or renamed.
