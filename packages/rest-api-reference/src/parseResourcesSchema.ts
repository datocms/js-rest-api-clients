import type {
  ResourcesEndpoint,
  ResourcesRawEndpoint,
  ResourcesSchema,
} from './types.js';

/**
 * Raw schema structure as stored in a resources.json file.
 */
export type RawResourcesSchema = Array<{
  jsonApiType: string;
  namespace: string;
  resourceClassName: string;
  endpoints: ResourcesRawEndpoint[];
}>;

/**
 * Parses a raw resources.json payload into a flat structure where each
 * endpoint carries its parent entity metadata.
 */
export function parseResourcesSchema(raw: RawResourcesSchema): ResourcesSchema {
  return raw.map(({ endpoints, ...rest }) => ({
    ...rest,
    endpoints: endpoints.map<ResourcesEndpoint>((rawEndpoint) => ({
      ...rawEndpoint,
      ...rest,
    })),
  }));
}
