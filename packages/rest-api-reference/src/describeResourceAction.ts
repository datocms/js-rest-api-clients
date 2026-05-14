import { buildLinkDescription } from './buildLinkDescription.js';
import {
  findHyperschemaLink,
  findResourcesEndpointByRel,
  findResourcesEntityByNamespace,
} from './finders.js';
import { h1, render } from './markdown.js';
import type { Hyperschema, ResourcesSchema } from './types.js';

/**
 * Returns a Markdown description of a specific resource action, including
 * examples from the hyperschema.
 *
 * - `expandDetails` undefined/empty → details collapsed; full output
 *   (description + action header + HTTP line) returned.
 * - `expandDetails` contains `'*'` → all details expanded inline; full output
 *   returned.
 * - `expandDetails` contains specific summary texts → returns ONLY the matching
 *   details from the description, without the action header or surrounding prose.
 *
 * `autoExpandIfBelow`, when set and no `expandDetails` filter is active,
 * triggers `'*'`-style expansion if the collapsed result is shorter than the
 * given character count.
 *
 * @returns Markdown string, or `undefined` if the resource/action was not found.
 */
export function describeResourceAction(
  hyperschema: Hyperschema,
  resourcesSchema: ResourcesSchema,
  namespace: string,
  rel: string,
  expandDetails?: string[],
  autoExpandIfBelow?: number,
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

  const expandAll = expandDetails?.includes('*') ?? false;
  const hasFilter =
    !expandAll && expandDetails !== undefined && expandDetails.length > 0;

  if (hasFilter) {
    return buildLinkDescription(hyperschemaLink, expandDetails);
  }

  const renderFull = (effectiveExpand: string[] | undefined): string => {
    const description = buildLinkDescription(hyperschemaLink, effectiveExpand);

    return render(
      description ? `${description}\n\n` : '',
      h1(`Action: ${namespace}.${rel}`),
      `HTTP ${hyperschemaLink.method} ${hyperschemaLink.href}`,
    );
  };

  const collapsed = renderFull(expandAll ? ['*'] : expandDetails);

  if (
    !expandAll &&
    autoExpandIfBelow !== undefined &&
    collapsed.length < autoExpandIfBelow
  ) {
    return renderFull(['*']);
  }

  return collapsed;
}
