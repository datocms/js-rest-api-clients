#!/usr/bin/env node -r ts-node/register

import { readFileSync, writeFileSync } from 'fs';

['cma-client', 'dashboard-client'].forEach((dir) => {
  const version: string = JSON.parse(
    readFileSync(`./packages/${dir}/package.json`, 'utf8'),
  ).version;

  const sourceFilePath = `./packages/${dir}/src/generated/Client.ts`;

  const sourceFile = readFileSync(sourceFilePath, 'utf-8');

  writeFileSync(
    sourceFilePath,
    sourceFile.replace(`@datocms/${dir}`, `@datocms/${dir} v${version}`),
    'utf-8',
  );
});
