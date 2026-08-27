# Changesets

This folder holds the pending release notes for the next version.

Whenever you change something worth mentioning in a release, run `npx changeset`
and answer the two prompts (which packages, and whether it's a patch/minor/major).
That writes a small markdown file here, which you commit along with your changes.

At release time `npm run publish` consumes every pending file: it computes the
resulting version, updates the `package.json`s and the `CHANGELOG.md`s, and
deletes the files.

Note that all `@datocms/*` packages are a `linked` group: whatever is released
together lands on the same version, but a package nobody touched keeps the
version it had. This is what Lerna's `"version": "5.8.0"` did before the
migration — despite the nine packages all sitting on the same number today,
Lerna had always skipped the ones that had not changed. `@datocms/rest-api-reference`
has published 7 times against `@datocms/cma-client`'s 210.

So do list the packages whose own behaviour changed. You do **not** need to list
the ones that merely depend on them: changesets bumps a dependent by itself,
and only when the new version falls outside the range that dependent declares.

Schema-only updates produced by `npm run generate` write their own changeset
automatically — see `toolchain/generate/writeChangeset.ts`.

## Which bump level?

- `patch` — bug fixes only. It's the clearest signal in semver ("nothing new,
  just a fix"), so we don't spend it on anything else.
- `minor` — new API surface, including a schema sync. This is what the
  automatic codegen changeset uses.
- `major` — something was removed or renamed.
