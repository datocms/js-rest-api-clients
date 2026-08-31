#!/usr/bin/env node
//
// Releases every @datocms/* package.
//
// The order of the steps is the whole point: everything that can fail (network,
// tests, credentials) runs BEFORE anything irreversible, and the irreversible
// steps go npm first, git second. `changeset publish` does both halves in that
// order by itself — it publishes, then tags only the packages npm accepted — so
// a tag can never outlive a failed publish.
//
// There is deliberately no rollback, because every step is idempotent: the
// publish skips versions already on the registry, the tagging skips tags that
// already exist, and each GitHub release skips itself. A release that dies
// halfway through is resumed by running this again.
//
// It is JavaScript rather than bash because under `set -e` the exit status of
// whatever a loop last evaluated becomes the loop's exit status, and this script
// twice sat one non-matching last package away from dying between `npm publish`
// and `git push`.
//
// Read main() at the bottom first: it is the release, one line per step.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPackages } from '@manypkg/get-packages';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(ROOT);

// Normal releases happen here. Prereleases are routinely cut from a feature
// branch, so --tag only asks that the branch be clean and pushed.
const RELEASE_BRANCH = 'main';

// ---------------------------------------------------------------------------
// Talking to the shell, and to the human watching it
// ---------------------------------------------------------------------------

/** A refusal we wrote ourselves, as opposed to a step that failed. */
class Aborted extends Error {}

const fail = (message) => {
  throw new Aborted(message);
};
const step = (message) => console.log(`\n\x1b[1m==> ${message}\x1b[0m`);

/** Runs a step the human is watching, and throws if it fails. */
const run = (file, args, options = {}) =>
  execFileSync(file, args, { stdio: 'inherit', ...options });

/** Runs a command for its output, and throws if it fails. */
const capture = (file, args) =>
  execFileSync(file, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();

/**
 * Exit status as a question, for the commands whose failure is an answer rather
 * than an error: "am I logged in?", "does this release already exist?".
 */
const succeeds = (file, args) => {
  try {
    execFileSync(file, args, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------------------
// Questions about the repo. No mutations, no output.
// ---------------------------------------------------------------------------

const hasPendingChangesets = () =>
  readdirSync('.changeset').some(
    (entry) => entry.endsWith('.md') && entry !== 'README.md',
  );

/** Where each package lives, by package name. */
const packageDirs = async () => {
  const { packages } = await getPackages(ROOT);
  return new Map(
    packages.map((pkg) => [pkg.packageJson.name, pkg.relativeDir]),
  );
};

/**
 * The section of a package's CHANGELOG for one version, without its "## x.y.z"
 * heading — changesets has already written exactly the prose we want.
 */
const changelogSection = (dir, version) => {
  const file = path.join(dir, 'CHANGELOG.md');
  // A package released for the first time has no CHANGELOG.md yet.
  if (!existsSync(file)) return '';
  const [, section = ''] = readFileSync(file, 'utf8').split(
    `\n## ${version}\n`,
  );
  return section.split('\n## ')[0].trim();
};

/**
 * A `linked` group shares one version across whatever it releases together, so
 * `release: v5.9.0` is right when the whole set moves — but a release can carry
 * one package alone, and calling that "v5.8.1" would claim the other eight moved
 * too. Name it instead when it is the only one.
 */
const releaseSubject = (plan) => {
  const tags = plan.map((entry) => `${entry.name}@${entry.version}`);
  const versions = new Set(plan.map((entry) => entry.version));
  if (tags.length === 1) return `release: ${tags[0]}`;
  if (versions.size === 1) return `release: v${[...versions][0]}`;
  return `release: ${tags.join(', ')}`;
};

// ---------------------------------------------------------------------------
// The steps. One per thing that can go wrong.
// ---------------------------------------------------------------------------

/**
 * The only flag: `--tag next` publishes under that npm dist-tag instead of
 * `latest`, and marks the GitHub releases as prereleases.
 */
const parseOptions = (argv) => {
  const [flag, distTag = ''] = argv;
  if (flag && flag !== '--tag') fail(`unknown option: ${flag}`);
  if (flag && !distTag) fail('--tag needs a value.');
  return { distTag };
};

/** Refuses to start from a state we could not finish. Returns the branch. */
const preflight = (distTag) => {
  step('Preflight');

  const branch = capture('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

  if (!distTag) {
    if (branch !== RELEASE_BRANCH) {
      fail(
        `you are not on ${RELEASE_BRANCH}. Use --tag to publish a prerelease from a branch.`,
      );
    }
    if (existsSync('.changeset/pre.json')) {
      fail(
        'the repo is in changesets pre mode (.changeset/pre.json).\n' +
          "  Run 'npx changeset pre exit' before cutting a real release.",
      );
    }
  }

  if (capture('git', ['status', '--porcelain'])) {
    fail('working tree is dirty. Commit or stash first.');
  }

  run('git', ['fetch', '--quiet', 'origin', branch]);
  if (
    capture('git', ['rev-parse', 'HEAD']) !==
    capture('git', ['rev-parse', `origin/${branch}`])
  ) {
    fail(`${branch} and origin/${branch} have diverged. Pull (or push) first.`);
  }

  if (!succeeds('npm', ['whoami']))
    fail("you are not logged in to npm. Run 'npm login'.");
  if (!succeeds('gh', ['auth', 'status'])) {
    fail(
      "the GitHub CLI is missing or logged out, so the release notes can't be published.",
    );
  }

  const npmUser = capture('npm', ['whoami']);
  console.log(`on ${branch}, in sync with origin, npm user: ${npmUser}`);

  return branch;
};

/**
 * Everything that can fail. Nothing has been mutated yet, so a network timeout
 * here costs nothing but the rerun.
 */
const buildAndTest = () => {
  step('Building');
  run('npm', ['run', 'build']);

  step('Testing');
  run('npm', ['test']);
};

/** Mutations, local only. Still nothing pushed, still nothing published. */
const applyPendingChangesets = () => {
  step('Applying pending changesets');
  run('npx', ['changeset', 'version']);

  // The clients send their own version in a User-Agent header, so the number has
  // to be stamped into the source *after* the bump — and the build that ships
  // has to be the one made from the stamped source, hence the second build
  // rather than reusing the one that gated the release.
  step('Stamping the client version and refreshing the lockfile');
  run('./toolchain/generate/setClientVersion.ts', []);
  run('npm', ['install', '--package-lock-only']);

  step('Rebuilding with the stamped version');
  run('npm', ['run', 'build']);
};

/**
 * What this release covers, as `{ kind, name, version }` entries: `publish` for
 * a version not yet on the registry, `tag-only` for one that got there before a
 * previous run died. Asked of changesets rather than reconstructed here — it is
 * the same plan `changeset publish` is about to execute, registry lookups
 * included, so the two cannot disagree about what is being released.
 */
const readPublishPlan = () => {
  step('Reading the publish plan');

  const file = path.join(tmpdir(), `publish-plan-${process.pid}.json`);
  let plan;
  try {
    // Captured, not shown: `changeset publish` prints the same registry summary
    // again a moment later.
    capture('npx', ['changeset', 'publish-plan', '--output', file]);
    plan = JSON.parse(readFileSync(file, 'utf8')).plan.flat();
  } finally {
    rmSync(file, { force: true });
  }

  for (const { kind, name, version } of plan) {
    console.log(
      `  ${name}@${version}${kind === 'tag-only' ? ' (already on npm)' : ''}`,
    );
  }
  if (plan.length === 0) {
    fail(
      'there is nothing to release: every package is already published and tagged.\n' +
        "  Describe your changes with 'npx changeset' first.",
    );
  }

  return plan;
};

const commitRelease = (plan) => {
  step('Committing the release');
  run('git', ['add', '-A']);
  run('git', ['commit', '-m', releaseSubject(plan)]);
};

/**
 * The irreversible step: npm, then one annotated `name@version` tag for each
 * package npm accepted.
 */
const publishAndTag = (distTag) => {
  step('Publishing to npm and tagging');
  run('npx', ['changeset', 'publish', ...(distTag ? ['--tag', distTag] : [])]);
};

const push = (branch) => {
  step('Pushing to GitHub');
  run('git', ['push', '--follow-tags', 'origin', branch]);
};

/**
 * One GitHub release per tag, its body the CHANGELOG section changesets just
 * wrote. Last, because it's the only step a human can redo by hand from the
 * changelog if it goes wrong.
 */
const publishReleaseNotes = async (plan, distTag) => {
  step('Publishing the release notes');
  const dirOf = await packageDirs();

  for (const { name, version } of plan) {
    const tag = `${name}@${version}`;
    if (succeeds('gh', ['release', 'view', tag])) {
      console.log(`${tag}: the release already exists, leaving it alone`);
      continue;
    }
    // A prerelease must not become the repo's "Latest release": that's reserved
    // for whatever is on the `latest` dist-tag. Decided per package, not once
    // for the run, so one prerelease version can't mark the others.
    const prerelease = distTag || version.includes('-') ? ['--prerelease'] : [];
    const notes =
      changelogSection(dirOf.get(name), version) || `Released \`${tag}\`.`;
    // --verify-tag: refuse to invent a release for a tag the push didn't carry.
    const args = ['--title', tag, '--verify-tag', '--notes-file', '-'];
    run('gh', ['release', 'create', tag, ...args, ...prerelease], {
      input: notes,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
  }
};

// ---------------------------------------------------------------------------
// The release
// ---------------------------------------------------------------------------

/** Bumps, builds and commits a new release, and returns what it will publish. */
const prepareRelease = () => {
  buildAndTest();
  applyPendingChangesets();
  const plan = readPublishPlan();
  commitRelease(plan);
  return plan;
};

const main = async () => {
  const { distTag } = parseOptions(process.argv.slice(2));
  const branch = preflight(distTag);

  // Pending changesets mean a release to cut. None means one already bumped and
  // committed by a run that died later: the plan alone says what it left over.
  const plan = hasPendingChangesets() ? prepareRelease() : readPublishPlan();

  publishAndTag(distTag);
  push(branch);
  await publishReleaseNotes(plan, distTag);

  console.log('\n\x1b[32mReleased\x1b[0m');
};

try {
  await main();
} catch (error) {
  // A step that failed has already said what it had to say on stderr; all we
  // add is which one, and the fact that nothing after it ran.
  const summary = [String(error.message).split('\n')[0], error.stderr]
    .filter(Boolean)
    .join('\n');
  const detail =
    error instanceof Aborted
      ? error.message
      : `${summary}\n  The step above printed the details.`;
  console.error(`\n\x1b[31mAborted: ${detail}\x1b[0m`);
  process.exit(1);
}
