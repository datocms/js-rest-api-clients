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
 * - `expandDetails` undefined/empty → details collapsed; full output (description
 *   + actions list) returned.
 * - `expandDetails` contains `'*'` → all details expanded inline; full output
 *   returned.
 * - `expandDetails` contains specific summary texts → returns ONLY the matching
 *   details from the description, without the actions list or surrounding prose.
 *
 * `autoExpandIfBelow`, when set and no `expandDetails` filter is active,
 * triggers `'*'`-style expansion if the collapsed result is shorter than the
 * given character count.
 *
 * @returns Markdown string, or `undefined` if the resource was not found.
 */
export function describeResource(
  hyperschema: Hyperschema,
  resourcesSchema: ResourcesSchema,
  namespace: string,
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

  const hyperschemaEntity = findHyperschemaEntity(
    hyperschema,
    resourcesEntity.jsonApiType,
  );
  if (!hyperschemaEntity) {
    return undefined;
  }

  const expandAll = expandDetails?.includes('*') ?? false;
  const hasFilter =
    !expandAll && expandDetails !== undefined && expandDetails.length > 0;

  if (hasFilter) {
    return hyperschemaEntity.description
      ? collapseDetails(hyperschemaEntity.description, expandDetails)
      : '';
  }

  const renderFull = (effectiveExpand: string[] | undefined): string => {
    const processedDescription = hyperschemaEntity.description
      ? collapseDetails(hyperschemaEntity.description, effectiveExpand)
      : '';

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
