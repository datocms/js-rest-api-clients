#!/usr/bin/env -S node -r ts-node/register

import { readFileSync, writeFileSync } from 'node:fs';

for (const dir of ['cma-client', 'dashboard-client']) {
  const version: string = (
    JSON.parse(readFileSync(`./packages/${dir}/package.json`, 'utf8')) as any
  ).version;

  const sourceFilePath = `./packages/${dir}/src/generated/Client.ts`;

  const sourceFile = readFileSync(sourceFilePath, 'utf-8');

  writeFileSync(
    sourceFilePath,
    sourceFile.replace(`@datocms/${dir}`, `@datocms/${dir} v${version}`),
    'utf-8',
  );
}
