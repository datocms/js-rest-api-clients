#!/usr/bin/env -S node -r ts-node/register

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

/**
 * Writes a changeset describing what `npm run generate` just changed.
 *
 * Schema updates are produced by a script, not by a person, so nobody is going
 * to remember to run `npx changeset` for them. Since a changeset is just a
 * markdown file, the codegen can write its own: the release notes stay honest
 * without adding a manual step.
 *
 * The bump level is `minor`, not `patch`: a schema sync adds surface to the
 * public API, and `patch` is the one semver signal that every developer reads
 * the same way — "nothing new, just a fix". We don't want to squat it. Reserve
 * `patch` for bug fixes; edit this file up to `major` if the schema ever drops
 * or renames something.
 */

const CHANGESET_PATH = '.changeset/schema-update.md';

const changedFiles = execFileSync(
  'git',
  ['status', '--porcelain', '--untracked-files=all', '--', 'packages'],
  { encoding: 'utf8' },
)
  .split('\n')
  .filter(Boolean)
  .map((line) => line.slice(3).trim())
  .filter(
    (path) =>
      path.includes('/src/generated/') || path.endsWith('/resources.json'),
  );

if (changedFiles.length === 0) {
  console.log('Schema unchanged, no changeset needed.');
  process.exit(0);
}

const packageNames = [
  ...new Set(
    changedFiles.map((path) => {
      const dir = path.split('/')[1];
      return (
        JSON.parse(readFileSync(`packages/${dir}/package.json`, 'utf8')) as {
          name: string;
        }
      ).name;
    }),
  ),
].sort();

const touched = [
  ...new Set(
    changedFiles.map((path) =>
      path
        .split('/')
        .pop()!
        .replace(/\.(ts|json)$/, ''),
    ),
  ),
].sort();

const summary =
  touched.length > 8
    ? `${touched.slice(0, 8).join(', ')} and ${touched.length - 8} more`
    : touched.join(', ');

writeFileSync(
  CHANGESET_PATH,
  `---\n${packageNames.map((name) => `"${name}": minor`).join('\n')}\n---\n\n` +
    `Sync generated code with the latest DatoCMS API schema (${summary})\n`,
  'utf-8',
);

console.log(`Wrote ${CHANGESET_PATH} for: ${packageNames.join(', ')}`);
console.log(
  'Review it before committing — raise it to `major` if the schema dropped or renamed anything.',
);
