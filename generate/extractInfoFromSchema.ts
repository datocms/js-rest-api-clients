import fetch from 'cross-fetch';
import JsonRefParser, { JSONSchema } from '@apidevtools/json-schema-ref-parser';
import { compile as hyperschemaToTypings } from 'hyperschema-to-ts';
import toSafeName from './toSafeName';
import simplifySchema from './generateSimplifiedSchema';

const identityRegexp =
  /\{\(.*?definitions%2F(.*?)%2Fdefinitions%2Fidentity\)}/g;

export type EndpointInfo = {
  name: string;
  rawName: string;
  returnsCollection: boolean;
  urlTemplate: string;
  method: string;
  comment: string;
  docUrl?: string;
  urlPlaceholder?: {
    variableName: string;
    isEntityId: boolean;
    relType: string;
  };
  simpleMethodAvailable: boolean;
  requestBodyType?: string;
  requestStructure?: {
    attributes: string[] | '*';
    relationships: string[] | '*';
  };
  queryParamsType?: string;
  responseType?: string;
  deprecated?: string;
  paginatedResponse?: {
    defaultLimit: number;
    maxLimit: number;
  };
};

export type ResourceInfo = {
  jsonApiType: string;
  namespace: string;
  resourceClassName: string;
  endpoints: EndpointInfo[];
};

export type SchemaInfo = {
  baseUrl: string;
  resources: ResourceInfo[];
  typings: string;
  simpleTypings: string;
};

type JSONHyperschemaLink = {
  method: string;
  rel: string;
  title: string;
  href: string;
  private?: boolean;
  hrefSchema?: JSONSchema;
  schema?: JSONSchema;
  targetSchema?: JSONSchema;
  jobSchema?: JSONSchema;
};

type JSONSchemaWithLinks = JSONSchema & { links: JSONHyperschemaLink[] };

const relToMethodName = {
  instances: 'list',
  self: 'find',
};

function hasLinks(schema: JSONSchema): schema is JSONSchemaWithLinks {
  return 'links' in schema;
}

async function downloadHyperschema(url: string) {
  const response = await fetch(url);
  return await response.json();
}

function recursivelyFindSchemaKeys(schema: JsonRefParser.JSONSchema): string[] {
  if (schema.type === 'object') {
    if (!schema.properties || typeof schema.properties !== 'object') {
      throw new NoPropertiesDefinedError('Missing properties!');
    }
    return Object.keys(schema.properties);
  }

  if (schema.anyOf) {
    return schema.anyOf.map((x) => recursivelyFindSchemaKeys(x)).flat();
  }

  throw new Error('Ouch! 2');
}

class NoPropertiesDefinedError extends Error {}

function findPropertiesInProperty(
  schema: JsonRefParser.JSONSchema,
  property: string,
): string[] {
  if (schema.type === 'object') {
    if (!schema.properties || typeof schema.properties !== 'object') {
      throw new Error('Ouch');
    }

    const propertySchema = schema.properties[property];

    if (!propertySchema) {
      return [];
    }

    if (typeof propertySchema !== 'object') {
      throw new Error('Ouch');
    }

    return recursivelyFindSchemaKeys(propertySchema);
  }

  if (schema.anyOf) {
    return schema.anyOf
      .map((x) => findPropertiesInProperty(x, property))
      .flat();
  }

  throw new Error("Don't know how to handle!");
}

function findPropertiesInDataProperty(
  schema: JsonRefParser.JSONSchema,
  property: string,
): string[] | '*' {
  if (typeof schema.properties?.data !== 'object') {
    return [];
  }

  try {
    return findPropertiesInProperty(schema.properties.data, property);
  } catch (e) {
    if (e instanceof NoPropertiesDefinedError) {
      return '*';
    }
    throw e;
  }
}

function generateResourceInfo(
  isCma: boolean,
  jsonApiType: string,
  schema: JSONSchema,
): ResourceInfo {
  if (!hasLinks(schema)) {
    throw new Error('Missing links!');
  }

  const endpoints = schema.links.map<EndpointInfo>((link) => {
    const urlPlaceholders: EndpointInfo['urlPlaceholder'][] = [];

    const urlTemplate = link.href.replace(
      identityRegexp,
      (match, placeholder) => {
        const variableName = toSafeName(`${placeholder}_id`, false);
        urlPlaceholders.push({
          variableName,
          isEntityId: placeholder === jsonApiType,
          relType: toSafeName(`${placeholder}_data`, true),
        });
        return '${' + variableName + '}';
      },
    );

    if (urlPlaceholders.length > 1) {
      throw new Error(
        `More than one placeholder in ${jsonApiType}#${link.rel}`,
      );
    }

    const baseTypeName = jsonApiType;

    const responseType = link.jobSchema
      ? `${toSafeName(baseTypeName, true)}${toSafeName(
          link.rel,
          true,
        )}JobSchema`
      : link.targetSchema
      ? `${toSafeName(baseTypeName, true)}${toSafeName(
          link.rel,
          true,
        )}TargetSchema`
      : undefined;

    const normalizedRel =
      link.rel in relToMethodName
        ? relToMethodName[link.rel]
        : link.rel.includes('_instances')
        ? link.rel.replace('_instances', '_list')
        : link.rel;

    const paginationLimitProperty =
      link.hrefSchema &&
      link.hrefSchema.properties &&
      'page' in link.hrefSchema.properties &&
      typeof link.hrefSchema.properties.page === 'object' &&
      link.hrefSchema.properties.page.properties &&
      'offset' in link.hrefSchema.properties.page.properties &&
      'limit' in link.hrefSchema.properties.page.properties &&
      typeof link.hrefSchema.properties.page.properties.limit === 'object' &&
      link.hrefSchema.properties.page.properties.limit;

    const pagination = paginationLimitProperty
      ? {
          defaultLimit: paginationLimitProperty.default as number,
          maxLimit: paginationLimitProperty.maximum as number,
        }
      : undefined;

    const endpointInfo: EndpointInfo = {
      returnsCollection: ['query', 'instances'].some((x) =>
        link.rel.includes(x),
      ),
      docUrl: isCma
        ? `https://www.datocms.com/docs/content-management-api/resources/${jsonApiType.replace(
            '_',
            '-',
          )}/${link.rel}`
        : undefined,
      name: toSafeName(normalizedRel, false),
      rawName: toSafeName(`raw_${normalizedRel}`, false),
      urlTemplate,
      method: link.method,
      comment: link.title,
      urlPlaceholder: urlPlaceholders[0] || undefined,
      requestBodyType: link.schema
        ? `${toSafeName(baseTypeName, true)}${toSafeName(link.rel, true)}Schema`
        : undefined,
      simpleMethodAvailable: true,
      requestStructure: link.schema
        ? {
            attributes: findPropertiesInDataProperty(link.schema, 'attributes'),
            relationships: findPropertiesInDataProperty(
              link.schema,
              'relationships',
            ),
          }
        : undefined,
      queryParamsType: link.hrefSchema
        ? `${toSafeName(baseTypeName, true)}${toSafeName(
            link.rel,
            true,
          )}HrefSchema`
        : undefined,
      responseType,
      paginatedResponse: pagination,
      deprecated: link.private
        ? 'This API call is to be considered private and might change without notice'
        : undefined,
    };

    if (
      endpointInfo.requestStructure &&
      ((endpointInfo.requestStructure.attributes === '*' &&
        endpointInfo.requestStructure.relationships === '*') ||
        (Array.isArray(endpointInfo.requestStructure.attributes) &&
          Array.isArray(endpointInfo.requestStructure.relationships) &&
          endpointInfo.requestStructure.attributes.some((x) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            endpointInfo.requestStructure!.relationships.includes(x),
          )))
    ) {
      endpointInfo.simpleMethodAvailable = false;
      console.log(`Too much ambiguity! ${jsonApiType}.${link.rel}`);
    }

    return endpointInfo;
  });

  return {
    jsonApiType,
    endpoints,
    namespace: toSafeName(
      endpoints.some(
        (e) => e.returnsCollection || (e.name === 'find' && e.urlPlaceholder),
      )
        ? `${jsonApiType}s`
        : jsonApiType,
      false,
    ),
    resourceClassName: toSafeName(jsonApiType, true),
  };
}

export default async function extractInfoFromSchema(
  hyperschemaUrl: string,
  isCma: boolean,
): Promise<SchemaInfo> {
  const rawSchema = await downloadHyperschema(hyperschemaUrl);

  const simplifiedRawSchema = await downloadHyperschema(hyperschemaUrl);
  simplifySchema(simplifiedRawSchema);

  const typings = await hyperschemaToTypings(rawSchema, 'SiteApiSchema', {});
  const schema = await JsonRefParser.dereference(rawSchema);

  if (!schema.properties) {
    throw new Error('Missing resources!');
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    baseUrl: (schema as any).links[0].href as string,
    resources: Object.entries(schema.properties)
      .map<ResourceInfo>(([resource, schema]) =>
        generateResourceInfo(isCma, resource, schema),
      )
      .filter((resourceInfo) => resourceInfo.endpoints.length > 0),
    simpleTypings: await hyperschemaToTypings(
      simplifiedRawSchema,
      'SiteApiSchema',
      {},
    ),
    typings,
  };
}