#!/usr/bin/env -S node -r ts-node/register

import { readFileSync, writeFileSync } from 'node:fs';

/**
 * Stamps the current package version into the `userAgent` the client sends.
 *
 * This is intentionally idempotent: it runs both at the end of `npm run
 * generate` (so the committed source always carries a version) and again
 * during a release, right after the version bump. Running it twice must not
 * produce `@datocms/cma-client v5.9.0 v5.8.0`.
 */
for (const dir of ['cma-client', 'dashboard-client']) {
  const { version } = JSON.parse(
    readFileSync(`./packages/${dir}/package.json`, 'utf8'),
  ) as { version: string };

  const sourceFilePath = `./packages/${dir}/src/generated/Client.ts`;
  const sourceFile = readFileSync(sourceFilePath, 'utf-8');

  const pattern = new RegExp(`userAgent: '@datocms/${dir}(?: v[^']*)?'`);

  if (!pattern.test(sourceFile)) {
    console.error(
      `Could not find the userAgent declaration in ${sourceFilePath}. Has the Client template changed?`,
    );
    process.exit(1);
  }

  writeFileSync(
    sourceFilePath,
    sourceFile.replace(pattern, `userAgent: '@datocms/${dir} v${version}'`),
    'utf-8',
  );
}
