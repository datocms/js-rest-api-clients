export { fetchHyperschema } from './fetchHyperschema.js';
export { parseResourcesSchema } from './parseResourcesSchema.js';
export type { RawResourcesSchema } from './parseResourcesSchema.js';

export { listResources } from './listResources.js';
export { describeResource } from './describeResource.js';
export { describeResourceAction } from './describeResourceAction.js';

export {
  findHyperschemaEntity,
  findHyperschemaLink,
  findResourcesEntityByJsonApiType,
  findResourcesEntityByNamespace,
  findResourcesEndpointByRel,
} from './finders.js';

export { buildLinkDescription } from './buildLinkDescription.js';
export { collapseDetails } from './collapseDetails.js';
export { renderExample } from './renderExample.js';

export {
  render,
  h1,
  h2,
  h3,
  p,
  strong,
  em,
  code,
  pre,
  a,
  ul,
  ol,
  li,
  blockquote,
  hr,
  br,
} from './markdown.js';

export type {
  Hyperschema,
  HyperschemaEntity,
  HyperschemaLink,
  HyperschemaLinkJsExample,
  HyperschemaLinkHttpExample,
  JSONSchema,
  ResourcesSchema,
  ResourcesEntity,
  ResourcesEndpoint,
  ResourcesRawEndpoint,
} from './types.js';
