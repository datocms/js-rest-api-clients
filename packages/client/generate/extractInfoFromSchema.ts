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
  urlPlaceholder?: string;
  urlPlaceholderIsEntityId?: boolean;
  requestBodyType?: string;
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
  entityRelType: string;
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

function generateResourceInfo(
  isCma: boolean,
  jsonApiType: string,
  schema: JSONSchema,
): ResourceInfo {
  if (!hasLinks(schema)) {
    throw new Error('Missing links!');
  }

  const endpoints = schema.links.map<EndpointInfo>((link) => {
    const urlPlaceholders: string[] = [];
    let urlPlaceholderIsEntityId = false;

    const urlTemplate = link.href.replace(
      identityRegexp,
      (match, placeholder) => {
        const variableName = toSafeName(`${placeholder}_id`, false);
        urlPlaceholders.push(variableName);
        if (placeholder === jsonApiType) {
          urlPlaceholderIsEntityId = true;
        }
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

    return {
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
      urlPlaceholderIsEntityId,
      requestBodyType: link.schema
        ? `${toSafeName(baseTypeName, true)}${toSafeName(link.rel, true)}Schema`
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
    entityRelType: toSafeName(`${jsonApiType}_data`, true),
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
