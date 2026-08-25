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
# The irreversible step. npm first; changeset creates the git tags only for the
# packages it actually managed to publish.
# ---------------------------------------------------------------------------
step "Publishing v$VERSION to npm"
if [ -n "$DIST_TAG" ]; then
  npx changeset publish --tag "$DIST_TAG"
else
  npx changeset publish
fi

# ---------------------------------------------------------------------------
# git follows npm.
# ---------------------------------------------------------------------------
step "Pushing to GitHub"
git push --follow-tags origin main

printf '\n\033[32mReleased v%s\033[0m\n' "$VERSION"
