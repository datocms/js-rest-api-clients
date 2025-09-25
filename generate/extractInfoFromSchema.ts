import * as JsonRefParser from '@apidevtools/json-schema-ref-parser';
import fetch from 'cross-fetch';
import { compile as hyperschemaToTypings } from 'hyperschema-to-ts';
import { applyGenerics } from './applyGenericsToSchema';
import simplifySchema from './generateSimplifiedSchema';
import toSafeName from './toSafeName';

const identityRegexp =
  /\{\(.*?definitions%2F(.*?)%2Fdefinitions%2Fidentity\)}/g;

export type EndpointInfo = {
  rel: string;
  name: string;
  rawName: string;
  returnsCollection: boolean;
  urlTemplate: string;
  method: string;
  comment: string;
  docUrl?: string;
  urlPlaceholders: Array<{
    variableName: string;
    isEntityId: boolean;
    relType: string;
  }>;
  entityIdPlaceholder?: {
    variableName: string;
    isEntityId: boolean;
    relType: string;
  };
  returnsItem?: boolean;
  requestBodyRequiresItem?: boolean;
  offersNestedItemsOptionInQueryParams?: boolean;
  simpleMethodAvailable: boolean;
  requestBodyType?: string;
  optionalRequestBody: boolean;
  requestStructure?: {
    type: string;
    idRequired?: boolean;
    attributes: string[] | '*';
    relationships: string[] | '*';
  };
  queryParamsType?: string;
  queryParamsRequired?: boolean;
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
  hrefSchema?: JsonRefParser.JSONSchema;
  schema?: JsonRefParser.JSONSchema;
  targetSchema?: JsonRefParser.JSONSchema;
  jobSchema?: JsonRefParser.JSONSchema;
};

type JSONSchemaWithLinks = JsonRefParser.JSONSchema & {
  links: JSONHyperschemaLink[];
};

const relToMethodName: Record<string, string> = {
  instances: 'list',
  self: 'find',
  me: 'findMe',
};

function hasLinks(
  schema: JsonRefParser.JSONSchema,
): schema is JSONSchemaWithLinks {
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
    return schema.anyOf.flatMap((x) =>
      recursivelyFindSchemaKeys(x as JsonRefParser.JSONSchema),
    );
  }

  throw new Error('Ouch! 2');
}

class NoPropertiesDefinedError extends Error {}

function findPropertiesInProperty(
  schema: JsonRefParser.JSONSchema,
  property: string,
): string[] {
  if (schema.type === 'array') {
    return [];
  }

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
    return schema.anyOf.flatMap((x) =>
      findPropertiesInProperty(x as JsonRefParser.JSONSchema, property),
    );
  }

  throw new Error("Don't know how to handle!");
}

function findTypeInDataObjects(
  dataSchemas: JsonRefParser.JSONSchema[],
): string {
  const types = dataSchemas.map(
    (dataSchema) => (dataSchema.properties!.type as any).example as string,
  );

  const uniqueTypes = [...new Set(types)];

  return uniqueTypes.length === 1 ? uniqueTypes[0]! : '*';
}

function findDataObjects(schema: JsonRefParser.JSONSchema) {
  if (typeof schema.properties?.data !== 'object') {
    throw new Error('Missing data!');
  }

  function find(
    maybeDataSchema: JsonRefParser.JSONSchema,
  ): JsonRefParser.JSONSchema[] {
    if (Array.isArray(maybeDataSchema)) {
      return maybeDataSchema.flatMap((schema) =>
        find(schema as JsonRefParser.JSONSchema),
      );
    }

    if (maybeDataSchema.type === 'array') {
      if (typeof maybeDataSchema.items !== 'object') {
        return [];
      }
      return find(maybeDataSchema.items);
    }

    if (maybeDataSchema.anyOf) {
      return maybeDataSchema.anyOf.flatMap((s) =>
        find(s as JsonRefParser.JSONSchema),
      );
    }

    if (maybeDataSchema.type !== 'object') {
      throw new Error('Data not an object?');
    }

    return [maybeDataSchema];
  }

  return find(schema.properties.data);
}

function findTypeInDataProperty(schema: JsonRefParser.JSONSchema) {
  return findTypeInDataObjects(findDataObjects(schema));
}

function findIdIsRequiredInDataObject(dataSchema: JsonRefParser.JSONSchema) {
  if (dataSchema.type !== 'object') {
    throw new Error('Data not an object?');
  }

  if (typeof dataSchema.properties !== 'object') {
    throw new Error('Missing data?');
  }

  const idIsRequired =
    dataSchema.properties.id &&
    typeof dataSchema.properties.id === 'object' &&
    Array.isArray(dataSchema.required) &&
    dataSchema.required.includes('id');

  return idIsRequired || undefined;
}

function findIdIsRequired(schema: JsonRefParser.JSONSchema) {
  if (typeof schema.properties?.data !== 'object') {
    throw new Error('Missing data!');
  }

  const dataSchema = schema.properties.data;

  if (dataSchema.type === 'array') {
    return true;
  }

  if (dataSchema.anyOf) {
    const types = [
      ...new Set(
        dataSchema.anyOf.map((s) =>
          findIdIsRequiredInDataObject(s as JsonRefParser.JSONSchema),
        ),
      ),
    ];
    if (types.length !== 1) {
      throw new Error('Too complex, dont know how to handle the case!');
    }
    return types[0];
  }

  return findIdIsRequiredInDataObject(dataSchema);
}

function findPropertiesInDataProperty(
  schema: JsonRefParser.JSONSchema,
  property: string,
): string[] | '*' {
  if (typeof schema.properties?.data !== 'object') {
    return [];
  }

  const datas = findDataObjects(schema);

  if (datas.length > 1) {
    return '*';
  }

  const data = datas[0]!;

  try {
    return findPropertiesInProperty(data, property);
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
  schema: JsonRefParser.JSONSchema,
): ResourceInfo {
  if (!hasLinks(schema)) {
    throw new Error('Missing links!');
  }

  const endpoints = schema.links.map<EndpointInfo>((link) => {
    const urlPlaceholders: EndpointInfo['urlPlaceholders'] = [];

    const urlTemplate = link.href.replace(
      identityRegexp,
      (match, placeholder) => {
        const variableName = toSafeName(`${placeholder}_id`, false);
        urlPlaceholders.push({
          variableName,
          isEntityId: placeholder === jsonApiType,
          relType: toSafeName(`${placeholder}_data`, true),
        });
        return `\${${variableName}}`;
      },
    );

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

    if (!normalizedRel) {
      throw new Error('Should not happen!');
    }

    const paginationLimitProperty =
      link.hrefSchema?.properties &&
      'page' in link.hrefSchema.properties &&
      typeof link.hrefSchema.properties.page === 'object' &&
      link.hrefSchema.properties.page.properties &&
      'offset' in link.hrefSchema.properties.page.properties &&
      'limit' in link.hrefSchema.properties.page.properties &&
      typeof link.hrefSchema.properties.page.properties.limit === 'object' &&
      link.hrefSchema.properties.page.properties.limit;

    const queryParamsRequired = Boolean(
      link.hrefSchema?.required &&
        Array.isArray(link.hrefSchema.required) &&
        link.hrefSchema.required.length > 0,
    );

    const pagination = paginationLimitProperty
      ? {
          defaultLimit: paginationLimitProperty.default as number,
          maxLimit: paginationLimitProperty.maximum as number,
        }
      : undefined;

    const requestBodyType = link.schema
      ? `${toSafeName(baseTypeName, true)}${toSafeName(link.rel, true)}Schema`
      : undefined;

    const returnSchema = link.jobSchema || link.targetSchema;
    const returnsItem = Boolean(
      returnSchema ? findTypeInDataProperty(returnSchema) === 'item' : false,
    );

    const requestBodyRequiresItem = link.schema
      ? findTypeInDataProperty(link.schema) === 'item'
      : false;

    const endpointInfo: EndpointInfo = {
      returnsCollection: ['query', 'instances'].some((x) =>
        link.rel.includes(x),
      ),
      returnsItem,
      requestBodyRequiresItem,
      offersNestedItemsOptionInQueryParams:
        returnsItem &&
        Boolean(
          link.hrefSchema?.properties && 'nested' in link.hrefSchema.properties,
        ),
      docUrl: isCma
        ? `https://www.datocms.com/docs/content-management-api/resources/${jsonApiType.replace(
            '_',
            '-',
          )}/${link.rel}`
        : undefined,
      rel: link.rel,
      name: toSafeName(normalizedRel, false),
      rawName: toSafeName(`raw_${normalizedRel}`, false),
      urlTemplate,
      method: link.method,
      comment: link.title,
      urlPlaceholders,
      entityIdPlaceholder:
        urlPlaceholders.find((p) => p.isEntityId) || undefined,
      requestBodyType,
      optionalRequestBody: Boolean(link.schema?.type?.includes('null')),
      simpleMethodAvailable: true,
      requestStructure: link.schema
        ? {
            type: findTypeInDataProperty(link.schema),
            idRequired: findIdIsRequired(link.schema),
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
      queryParamsRequired,
      responseType,
      paginatedResponse: pagination,
      deprecated: link.private
        ? 'This API call is to be considered private and might change without notice'
        : undefined,
    };

    if (
      endpointInfo.requestStructure &&
      (endpointInfo.requestStructure.type === '*' ||
        (endpointInfo.requestStructure.attributes === '*' &&
          endpointInfo.requestStructure.relationships === '*') ||
        (Array.isArray(endpointInfo.requestStructure.attributes) &&
          Array.isArray(endpointInfo.requestStructure.relationships) &&
          endpointInfo.requestStructure.attributes.some((x) =>
            endpointInfo.requestStructure!.relationships.includes(x),
          )))
    ) {
      endpointInfo.simpleMethodAvailable = false;
      console.log(
        `Too much ambiguity to generate the simple version: ${jsonApiType}.${link.rel}`,
      );
    }

    return endpointInfo;
  });

  return {
    jsonApiType,
    endpoints,
    namespace: toSafeName(
      endpoints.some(
        (e) =>
          e.returnsCollection ||
          (e.name === 'find' && e.urlPlaceholders.length === 1),
      )
        ? `${jsonApiType}s`
        : jsonApiType,
      false,
    ),
    resourceClassName: toSafeName(jsonApiType, true),
  };
}

async function schemaToTs(schema: any) {
  const result = await hyperschemaToTypings(schema, 'SiteApiTypes', {});
  return result.replace(/export interface ([^ ]+) {/g, 'export type $1 = {');
}

// function applyGenerics(typings: string) {
//   return typings
//     .replace('export type Item ', 'export type ItemStableShell ')
//     .replace(/\bItem\b/g, 'Item<D>')
//     .replace(/included(.*)Item<D>/g, 'included$1Item')
//     .replace('item?: Item<D>', 'item?: Item')

//     // ITEM REQUESTS
//     .replace(
//       'export type ItemValidateExistingSchema ',
//       'export type ItemValidateExistingSchemaStableShell ',
//     )
//     .replace(
//       'export type ItemValidateNewSchema ',
//       'export type ItemValidateNewSchemaStableShell ',
//     )
//     .replace(
//       'export type ItemCreateSchema ',
//       'export type ItemCreateSchemaStableShell ',
//     )
//     .replace(
//       'export type ItemUpdateSchema ',
//       'export type ItemUpdateSchemaStableShell ',
//     )

//     // ITEM RESPONSES
// .replace(
//   'export type ItemInstancesTargetSchema ',
//   'export type ItemInstancesTargetSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type UploadReferencesTargetSchema ',
//   'export type UploadReferencesTargetSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type ItemSelfTargetSchema ',
//   'export type ItemSelfTargetSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type ItemCreateTargetSchema ',
//   'export type ItemCreateTargetSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type ItemDuplicateJobSchema ',
//   'export type ItemDuplicateJobSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type ItemUpdateTargetSchema ',
//   'export type ItemUpdateTargetSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type ItemDestroyJobSchema ',
//   'export type ItemDestroyJobSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type ItemPublishTargetSchema ',
//   'export type ItemPublishTargetSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type ItemUnpublishTargetSchema ',
//   'export type ItemUnpublishTargetSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type ItemReferencesTargetSchema ',
//   'export type ItemReferencesTargetSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type ItemVersionRestoreJobSchema ',
//   'export type ItemVersionRestoreJobSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type ScheduledPublicationDestroyTargetSchema ',
//   'export type ScheduledPublicationDestroyTargetSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )
// .replace(
//   'export type ScheduledUnpublishingDestroyTargetSchema ',
//   'export type ScheduledUnpublishingDestroyTargetSchema<D extends ItemTypeDefinition | undefined = undefined> ',
// )

//     // FIELDS
// .replace('export type Field ', 'export type FieldStableShell ')
// .replace('export type FieldAttributes ', 'export type FieldAttributesStableShell ')
// .replace(
//   'export type FieldCreateSchema ',
//   'export type FieldCreateSchemaStableShell ',
// )
// .replace(
//   'export type FieldUpdateSchema ',
//   'export type FieldUpdateSchemaStableShell ',
// );
// }

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export default async function extractInfoFromSchema(
  hyperschemaUrl: string,
  isCma: boolean,
): Promise<SchemaInfo> {
  const rawSchema = await downloadHyperschema(hyperschemaUrl);

  const rawSchemaToGenerateTypings = clone(rawSchema);
  const typings = applyGenerics(await schemaToTs(rawSchemaToGenerateTypings));

  const rawSchemaToGenerateSimpleTypings = clone(rawSchema);
  simplifySchema(rawSchemaToGenerateSimpleTypings);
  const simpleTypings = applyGenerics(
    await schemaToTs(rawSchemaToGenerateSimpleTypings),
  );

  const schema = await JsonRefParser.dereference(rawSchema);

  if (!schema.properties) {
    throw new Error('Missing resources!');
  }

  return {
    baseUrl: (schema as any).links[0].href as string,
    resources: Object.entries(schema.properties)
      .map<ResourceInfo>(([resource, schema]) =>
        generateResourceInfo(isCma, resource, schema),
      )
      .filter((resourceInfo) => resourceInfo.endpoints.length > 0),
    simpleTypings,
    typings,
  };
}
