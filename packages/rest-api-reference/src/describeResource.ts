import { collapseDetails } from './collapseDetails.js';
import {
  findHyperschemaEntity,
  findResourcesEntityByNamespace,
} from './finders.js';
import { code, h1, li, p, render, ul } from './markdown.js';
import type { Hyperschema, ResourcesSchema } from './types.js';

/**
 * Returns a Markdown description of a single resource and its available
 * actions.
 *
 * @param namespace - The resource namespace (e.g. "items", "uploads").
 * @param expandDetails - Optional list of `<details>` summary texts to expand.
 * @returns Markdown string, or `undefined` if the resource was not found.
 */
export function describeResource(
  hyperschema: Hyperschema,
  resourcesSchema: ResourcesSchema,
  namespace: string,
  expandDetails?: string[],
): string | undefined {
  const resourcesEntity = findResourcesEntityByNamespace(
    resourcesSchema,
    namespace,
  );
  if (!resourcesEntity) {
    return undefined;
  }

  const hyperschemaEntity = findHyperschemaEntity(
    hyperschema,
    resourcesEntity.jsonApiType,
  );
  if (!hyperschemaEntity) {
    return undefined;
  }

  const processedDescription = hyperschemaEntity.description
    ? collapseDetails(hyperschemaEntity.description, expandDetails)
    : '';

  const hasFilter = expandDetails && expandDetails.length > 0;

  if (hasFilter) {
    return processedDescription;
  }

  return render(
    processedDescription ? `${processedDescription}\n\n` : '',
    h1('Available actions'),
    ul(
      ...resourcesEntity.endpoints.map((endpoint) =>
        li(endpoint.rel, ' (', endpoint.comment, ')'),
      ),
    ),
    h1('Further documentation'),
    p(
      'Pass both a resource name and an action (ie. ',
      code('items create'),
      ') to learn about a specific action and its available methods.',
    ),
  );
}
