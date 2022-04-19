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

  rimraf.sync(`./packages/${prefix}-client/src/generated`);
  mkdirSync(`./packages/${prefix}-client/src/generated`);
  mkdirSync(`./packages/${prefix}-client/src/generated/resources`);

  await writeTemplate<
    SchemaInfo & { baseUrl: string; isCma: boolean; prefix: string }
  >(
    'Client.ts',
    { ...schemaInfo, baseUrl: schemaInfo.baseUrl, isCma, prefix },
    `./packages/${prefix}-client/src/generated/Client.ts`,
  );

  await writeTemplate(
    'SchemaTypes.ts',
    { typings: schemaInfo.typings },
    `./packages/${prefix}-client/src/generated/SchemaTypes.ts`,
  );

  await writeTemplate(
    'SchemaTypes.ts',
    { typings: schemaInfo.simpleTypings },
    `./packages/${prefix}-client/src/generated/SimpleSchemaTypes.ts`,
  );

  await writeTemplate<SchemaInfo>(
    'resources/index.ts',
    schemaInfo,
    `./packages/${prefix}-client/src/generated/resources/index.ts`,
  );

  for (const resourceInfo of schemaInfo.resources) {
    await writeTemplate<ResourceInfo & { isCma: boolean }>(
      'resources/ResourceClass.ts',
      { ...resourceInfo, isCma },
      `./packages/${prefix}-client/src/generated/resources/${toSafeName(
        resourceInfo.jsonApiType,
        true,
      )}.ts`,
    );
  }
}

const baseUrl = 'https://site-api.datocms.com';

Promise.all([
  generate('cma', `${baseUrl}/docs/site-api-hyperschema.json`),
  generate('dashboard', `${baseUrl}/docs/account-api-hyperschema.json`),
])
  .then(() => console.log('Done'))
  .catch((e) => console.error(e));
