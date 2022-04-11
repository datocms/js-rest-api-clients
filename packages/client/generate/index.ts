#!/usr/bin/env node --stack_size=800 -r ts-node/register

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import Handlebars from 'handlebars';
import rimraf from 'rimraf';
import extractInfoFromSchema, {
  ResourceInfo,
  SchemaInfo,
} from './extractInfoFromSchema';
import prettier from 'prettier';
import toSafeName from './toSafeName';

const handlebarOptions: Handlebars.RuntimeOptions = {};

function readTemplate<T>(template: string) {
  return Handlebars.compile<T>(
    readFileSync(`./generate/templates/${template}.handlebars`, {
      encoding: 'utf-8',
    }),
  );
}

async function writeTemplate<T>(
  template: string,
  data: T,
  destination: string,
) {
  console.log(`Writing ${destination}`);
  const options = await prettier.resolveConfig(destination);

  const compileTemplate = readTemplate<T>(template);

  const result = prettier.format(compileTemplate(data, handlebarOptions), {
    ...options,
    filepath: destination,
  });

  writeFileSync(destination, result, { encoding: 'utf-8' });
}

async function generate(prefix: string, hyperschemaUrl: string) {
  const isCma = prefix === 'cma';
  const schemaInfo = await extractInfoFromSchema(hyperschemaUrl, isCma);

  rimraf.sync(`./src/${prefix}`);
  mkdirSync(`./src/${prefix}`);
  mkdirSync(`./src/${prefix}/resources`);

  await writeTemplate<SchemaInfo & { baseUrl: string; isCma: boolean }>(
    'Client.ts',
    { ...schemaInfo, baseUrl: schemaInfo.baseUrl, isCma },
    `./src/${prefix}/Client.ts`,
  );

  await writeTemplate(
    'SchemaTypes.ts',
    { typings: schemaInfo.typings },
    `./src/${prefix}/SchemaTypes.ts`,
  );

  await writeTemplate(
    'SchemaTypes.ts',
    { typings: schemaInfo.simpleTypings },
    `./src/${prefix}/SimpleSchemaTypes.ts`,
  );

  await writeTemplate<null>(
    'BaseResource.ts',
    null,
    `./src/${prefix}/BaseResource.ts`,
  );

  await writeTemplate<SchemaInfo>(
    'resources/index.ts',
    schemaInfo,
    `./src/${prefix}/resources/index.ts`,
  );

  for (const resourceInfo of schemaInfo.resources) {
    await writeTemplate<ResourceInfo & { isCma: boolean }>(
      'resources/ResourceClass.ts',
      { ...resourceInfo, isCma },
      `./src/${prefix}/resources/${toSafeName(
        resourceInfo.jsonApiType,
        true,
      )}.ts`,
    );
  }
}

// const baseUrl = 'http://site-api.lvh.me:3001';
const baseUrl = 'https://site-api.datocms.com';

Promise.all([
  generate('cma', `${baseUrl}/docs/site-api-hyperschema.json`),
  generate('dashboard', `${baseUrl}/docs/account-api-hyperschema.json`),
])
  .then(() => console.log('Done'))
  .catch((e) => console.error(e));
