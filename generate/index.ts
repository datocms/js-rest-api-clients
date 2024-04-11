#!/usr/bin/env node --stack_size=800 -r ts-node/register

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import Handlebars from 'handlebars';
import rimraf from 'rimraf';
import extractInfoFromSchema, {
  type ResourceInfo,
  type SchemaInfo,
} from './extractInfoFromSchema';
import toSafeName from './toSafeName';

const handlebarOptions: Handlebars.RuntimeOptions = {
  helpers: {
    stringify: (x: unknown) => JSON.stringify(x, null, 2),
  },
};

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

  const compileTemplate = readTemplate<T>(template);

  writeFileSync(destination, compileTemplate(data, handlebarOptions), {
    encoding: 'utf-8',
  });
}

async function generate(prefix: string, hyperschemaUrl: string) {
  const isCma = prefix === 'cma';
  const schemaInfo = await extractInfoFromSchema(hyperschemaUrl, isCma);

  rimraf.sync(`./packages/${prefix}-client/src/generated`);
  mkdirSync(`./packages/${prefix}-client/src/generated`);
  mkdirSync(`./packages/${prefix}-client/src/generated/resources`);

  const { typings, simpleTypings, ...other } = schemaInfo;

  writeFileSync(
    `./packages/${prefix}-client/resources.json`,
    `${JSON.stringify(
      other.resources.map((r) => ({
        ...r,
        endpoints: r.endpoints.map(
          ({ name, rawName, simpleMethodAvailable, ...other }) => ({
            ...other,
            ...(simpleMethodAvailable ? { name, rawName } : { rawName }),
          }),
        ),
      })),
      null,
      2,
    )}\n`,
    { encoding: 'utf-8' },
  );

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

  const resources = schemaInfo.resources.map((resource) => ({
    resourceClassName: resource.resourceClassName,
    path: existsSync(
      `./packages/${prefix}-client/src/resources/${resource.resourceClassName}.ts`,
    )
      ? `../../resources/${resource.resourceClassName}`
      : `./${resource.resourceClassName}`,
  }));

  await writeTemplate<{
    resources: Array<{ resourceClassName: string; path: string }>;
  }>(
    'resources/index.ts',
    { resources },
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

  if (prefix === 'cma') {
    for (const suffix of ['browser', 'node']) {
      rimraf.sync(`./packages/${prefix}-client-${suffix}/src/generated`);
      mkdirSync(`./packages/${prefix}-client-${suffix}/src/generated`);

      const resources = schemaInfo.resources.map((resource) => ({
        resourceClassName: resource.resourceClassName,
        override: existsSync(
          `./packages/${prefix}-client-${suffix}/src/resources/${resource.resourceClassName}.ts`,
        ),
      }));

      await writeTemplate<{
        resources: Array<{ resourceClassName: string; override: boolean }>;
      }>(
        'resources.ts',
        { resources },
        `./packages/${prefix}-client-${suffix}/src/generated/resources.ts`,
      );
    }
  }
}

const baseUrl = process.env.GENERATE_FROM_DEV
  ? 'http://site-api.lvh.me:3001'
  : 'https://site-api.datocms.com';

Promise.all([
  generate('cma', `${baseUrl}/docs/site-api-hyperschema.json`),
  generate('dashboard', `${baseUrl}/docs/account-api-hyperschema.json`),
])
  .then(() => console.log('Done'))
  .catch((e) => console.error(e));
