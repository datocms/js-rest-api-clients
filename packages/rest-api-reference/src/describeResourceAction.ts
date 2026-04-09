import { buildLinkDescription } from './buildLinkDescription';
import {
  findHyperschemaLink,
  findResourcesEndpointByRel,
  findResourcesEntityByNamespace,
} from './finders';
import { h1, render } from './markdown';
import type { Hyperschema, ResourcesSchema } from './types';

/**
 * Returns a Markdown description of a specific resource action, including
 * examples from the hyperschema.
 *
 * @param namespace - The resource namespace (e.g. "items").
 * @param rel - The action rel (e.g. "create", "instances", "self").
 * @param expandDetails - Optional list of `<details>` summary texts to expand.
 * @returns Markdown string, or `undefined` if the resource/action was not found.
 */
export function describeResourceAction(
  hyperschema: Hyperschema,
  resourcesSchema: ResourcesSchema,
  namespace: string,
  rel: string,
  expandDetails?: string[],
): string | undefined {
  const resourcesEntity = findResourcesEntityByNamespace(
    resourcesSchema,
    namespace,
  );
  if (!resourcesEntity) {
    return undefined;
  }

  const resourcesEndpoint = findResourcesEndpointByRel(resourcesEntity, rel);
  if (!resourcesEndpoint) {
    return undefined;
  }

  const hyperschemaLink = findHyperschemaLink(
    hyperschema,
    resourcesEndpoint.jsonApiType,
    resourcesEndpoint.rel,
  );
  if (!hyperschemaLink) {
    return undefined;
  }

  const hasFilter = expandDetails && expandDetails.length > 0;

  const description = hyperschemaLink.description
    ? buildLinkDescription(hyperschemaLink, expandDetails)
    : '';

  if (hasFilter) {
    return description;
  }

  return render(
    description ? `${description}\n\n` : '',
    h1(`Action: ${namespace}.${rel}`),
    `HTTP ${hyperschemaLink.method} ${hyperschemaLink.href}`,
  );
}
