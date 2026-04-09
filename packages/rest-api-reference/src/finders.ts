import type {
  Hyperschema,
  HyperschemaEntity,
  HyperschemaLink,
  ResourcesEndpoint,
  ResourcesEntity,
  ResourcesSchema,
} from './types';

// ---------------------------------------------------------------------------
// Hyperschema finders
// ---------------------------------------------------------------------------

/** Finds an entity in the hyperschema by its JSON API type. */
export function findHyperschemaEntity(
  schema: Hyperschema,
  jsonApiType: string,
): HyperschemaEntity | undefined {
  if (!schema.properties) {
    return undefined;
  }
  return schema.properties[jsonApiType] as HyperschemaEntity | undefined;
}

/** Finds a specific link (API action) for an entity in the hyperschema. */
export function findHyperschemaLink(
  schema: Hyperschema,
  jsonApiType: string,
  rel: string,
): HyperschemaLink | undefined {
  const entity = findHyperschemaEntity(schema, jsonApiType);
  return entity?.links?.find((link) => link.rel === rel);
}

// ---------------------------------------------------------------------------
// Resources schema finders
// ---------------------------------------------------------------------------

/** Finds a resource entity by its JSON API type (e.g. "upload", "item"). */
export function findResourcesEntityByJsonApiType(
  schema: ResourcesSchema,
  jsonApiType: string,
): ResourcesEntity | undefined {
  return schema.find((r) => r.jsonApiType === jsonApiType);
}

/** Finds a resource entity by its namespace (e.g. "uploads", "items"). */
export function findResourcesEntityByNamespace(
  schema: ResourcesSchema,
  namespace: string,
): ResourcesEntity | undefined {
  return schema.find((r) => r.namespace === namespace);
}

/** Finds an endpoint within a resource entity by its rel value. */
export function findResourcesEndpointByRel(
  entity: ResourcesEntity,
  rel: string,
): ResourcesEndpoint | undefined {
  return entity.endpoints.find((e) => e.rel === rel);
}
