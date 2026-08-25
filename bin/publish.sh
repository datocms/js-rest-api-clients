#!/usr/bin/env bash
#
# Releases every @datocms/* package.
#
# The order of the steps below is the whole point: everything that can fail
# (network, tests, credentials) runs BEFORE anything irreversible happens, and
# the irreversible steps are ordered so that npm goes first and git follows.
#
# There is deliberately no rollback. `changeset publish` skips packages whose
# version is already on the registry, so if this script dies halfway through you
# recover by running it again: it detects the release commit and resumes the
# publish instead of starting a new one.

set -euo pipefail

cd "$(dirname "$0")/.."

DIST_TAG=""
while [ $# -gt 0 ]; do
  case "$1" in
    --tag|--dist-tag) DIST_TAG="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

step() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }
fail() { printf '\n\033[31mAborted: %s\033[0m\n' "$1" >&2; exit 1; }

pkg_version() { node -p "require('./packages/$1/package.json').version"; }
pending_changesets() { find .changeset -maxdepth 1 -name '*.md' ! -name 'README.md' | wc -l | tr -d ' '; }
is_published() { npm view "@datocms/cma-client@$1" version >/dev/null 2>&1; }

# Every publishable workspace package, as "name version location" triples.
#
# Read off the filesystem rather than asked of npm: `npm query` resolves
# workspace locations through node_modules, which during a release rehearsal is
# a symlink to another checkout, so it answers with paths outside the copy you
# are actually rehearsing.
packages() {
  node -e '
    const fs = require("node:fs"), path = require("node:path");
    for (const pattern of require("./package.json").workspaces) {
      const dir = path.dirname(pattern);
      for (const entry of fs.readdirSync(dir).sort()) {
        const location = path.join(dir, entry);
        let pkg;
        try { pkg = JSON.parse(fs.readFileSync(path.join(location, "package.json"), "utf8")); } catch { continue; }
        if (pkg.private) continue;
        console.log(pkg.name, pkg.version, location);
      }
    }
  '
}

# The section of a package's CHANGELOG for one version, without its "## x.y.z"
# heading — changesets has already written exactly the prose we want.
changelog_section() { # $1 = package location, $2 = version
  awk -v want="## $2" '$0 == want { found = 1; next } found && /^## / { exit } found' "$1/CHANGELOG.md"
}

# True when a changelog section says something a human wrote, as opposed to the
# dependency bookkeeping every package in a fixed group accumulates:
#
#     - Updated dependencies [1a2b3c4]
#       - @datocms/cma-client@5.9.0
#
# A bullet counts as prose unless it is exactly one of those lines.
has_prose() {
  grep -vE '^- Updated dependencies( \[[0-9a-f]+\])?$|^ *- [^ ]+@[0-9][^ ]*$' <<<"$1" | grep -qE '^- '
}

# The body of the GitHub release. All nine packages move in lockstep, so one
# release covers them all — but only the ones with something to say get a
# section, or the page fills up with each package restating that the others
# moved too. The footer keeps every published package visible.
release_notes() {
  local name ver loc section shipped=""
  while read -r name ver loc; do
    shipped="$shipped
- $name@$ver"
    section="$(changelog_section "$loc" "$VERSION")"
    has_prose "$section" || continue
    printf '## %s\n%s\n\n' "$name" "$section"
  done < <(packages)
  printf -- '---\n\nReleased in lockstep:%s\n' "$shipped"
}

# ---------------------------------------------------------------------------
# Preflight: no mutations, just refuse to start from a state we can't finish.
# ---------------------------------------------------------------------------
step "Preflight"

[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] || fail "you are not on main."
[ -z "$(git status --porcelain)" ] || fail "working tree is dirty. Commit or stash first."

git fetch --quiet origin main
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || \
  fail "main and origin/main have diverged. Pull (or push) first."

npm whoami >/dev/null 2>&1 || fail "you are not logged in to npm. Run 'npm login'."

command -v gh >/dev/null 2>&1 || fail "the GitHub CLI is not installed, so the release notes can't be published."
gh auth status >/dev/null 2>&1 || fail "you are not logged in to GitHub. Run 'gh auth login'."

echo "on main, in sync with origin, npm user: $(npm whoami)"

# ---------------------------------------------------------------------------
# Decide between a fresh release and resuming an interrupted one.
# ---------------------------------------------------------------------------
CURRENT="$(pkg_version cma-client)"

if [ "$(pending_changesets)" -eq 0 ]; then
  if is_published "$CURRENT"; then
    fail "no pending changesets: there is nothing to release.
  Describe your changes with 'npx changeset' first."
  fi
  step "Resuming the interrupted release of v$CURRENT"
  RESUMING=1
else
  RESUMING=0
fi

if [ "$RESUMING" -eq 0 ]; then
  # -------------------------------------------------------------------------
  # Everything that can fail. Nothing has been mutated yet, so a network
  # timeout here costs you nothing but the rerun.
  # -------------------------------------------------------------------------
  step "Building"
  npm run build

  step "Testing"
  npm test

  # -------------------------------------------------------------------------
  # Mutations, local only: bump, stamp, relock, rebuild, commit.
  # Still nothing pushed, still nothing published.
  # -------------------------------------------------------------------------
  step "Applying pending changesets"
  npx changeset version

  NEXT="$(pkg_version cma-client)"
  [ "$NEXT" != "$CURRENT" ] || fail "changeset version did not bump anything."
  echo "$CURRENT -> $NEXT"

  is_published "$NEXT" && fail "version $NEXT is already on npm. Aborting before overwriting anything."

  step "Stamping the client version and refreshing the lockfile"
  ./generate/setClientVersion.ts
  npm install --package-lock-only

  step "Rebuilding with the stamped version"
  npm run build

  step "Committing v$NEXT"
  git add -A
  git commit -m "v$NEXT"
fi

VERSION="$(pkg_version cma-client)"

# ---------------------------------------------------------------------------
# The irreversible step, npm first.
#
# --no-git-tag: changesets would tag all nine packages separately
# (@datocms/cma-client@5.9.0, @datocms/dashboard-client@5.9.0, ...). They move in
# lockstep, so those tags all point at the same commit and say the same thing,
# and this repo has tagged `vX.Y.Z` for its whole history. We tag once, below.
# Tagging after the publish keeps the property that matters: a tag can only
# exist for a version that is actually on the registry.
# ---------------------------------------------------------------------------
step "Publishing v$VERSION to npm"
if [ -n "$DIST_TAG" ]; then
  npx changeset publish --no-git-tag --tag "$DIST_TAG"
else
  npx changeset publish --no-git-tag
fi

# ---------------------------------------------------------------------------
# git follows npm.
# ---------------------------------------------------------------------------
step "Tagging v$VERSION"
if git rev-parse -q --verify "refs/tags/v$VERSION" >/dev/null; then
  echo "v$VERSION already tagged"
else
  git tag -a "v$VERSION" -m "v$VERSION"
fi

step "Pushing to GitHub"
git push --follow-tags origin main

# ---------------------------------------------------------------------------
# The release notes. Last, because it's the only step a human can redo by hand
# from the changelog if it goes wrong.
# ---------------------------------------------------------------------------
step "Publishing the release notes"
if gh release view "v$VERSION" >/dev/null 2>&1; then
  echo "the v$VERSION release already exists, leaving it alone"
else
  # A prerelease must not become the repo's "Latest release": that's reserved
  # for whatever is on the `latest` dist-tag.
  PRERELEASE=""
  case "$VERSION" in *-*) PRERELEASE="--prerelease" ;; esac
  [ -z "$DIST_TAG" ] || PRERELEASE="--prerelease"

  release_notes | gh release create "v$VERSION" --title "v$VERSION" --notes-file - $PRERELEASE
fi

# Asked for rather than parsed out of `gh release create`, so the link is the
# same whether we just created the release or found one already there.
RELEASE_URL="$(gh release view "v$VERSION" --json url --jq .url 2>/dev/null || true)"

printf '\n\033[32mReleased v%s\033[0m\n' "$VERSION"
[ -z "$RELEASE_URL" ] || printf '%s\n' "$RELEASE_URL"
